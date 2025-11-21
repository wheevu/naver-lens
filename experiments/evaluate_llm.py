"""
1. Automatic metrics (ROUGE, BERTScore)
2. LLM-as-a-judge (NAVER CLOVA HCX-007)

Requirements:
    pip install -r requirements.txt

Usage:
    python evaluate_llm.py --input 7817_1.csv --output results/ --num_samples 50
"""

import argparse
import json
import logging
import os
import sys
from pathlib import Path
from typing import Dict, List, Optional

from dotenv import load_dotenv

from src.config import Config
from src.data_loader import DataLoader
from src.naver_api import NaverClovaClient
from src.metrics_evaluator import MetricsEvaluator
from src.llm_judge import LLMJudge
from src.visualizer import Visualizer

# Load environment variables from .env file
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('evaluation.log'),
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger(__name__)


class EvaluationPipeline:
    """Main evaluation pipeline orchestrator."""
    
    def __init__(self, config: Config):
        """
        Initialize the evaluation pipeli ne.
        
        Args:
            config: Configuration object with API keys and settings
        """
        self.config = config
        self.data_loader = DataLoader()
        self.naver_client = NaverClovaClient(
            api_key=config.api_key,
            base_url=config.base_url,
            model=config.model
        )
        self.metrics_evaluator = MetricsEvaluator()
        self.llm_judge = LLMJudge(
            api_key=config.api_key,
            base_url=config.base_url,
            judge_model=config.judge_model
        )
        self.visualizer = Visualizer(output_dir=config.output_dir)
        
    def run(self, input_file: str, num_samples: Optional[int] = None) -> Dict:
        """
        Run the complete evaluation pipeline.
        
        Args:
            input_file: Path to input CSV file
            num_samples: Number of samples to evaluate (None = all)
            
        Returns:
            Dictionary with evaluation results
        """
        logger.info("=" * 80)
        logger.info("Starting LLM Product Summarization Evaluation Pipeline")
        logger.info("=" * 80)
        
        # Step 1: Load and preprocess data
        logger.info("\n[Step 1/5] Loading and preprocessing data...")
        products = self.data_loader.load_from_csv(input_file, num_samples)
        logger.info(f"Loaded {len(products)} products")
        
        # Step 2: Generate summaries using NAVER CLOVA
        logger.info("\n[Step 2/5] Generating summaries with NAVER CLOVA...")
        summaries = []
        for i, product in enumerate(products, 1):
            logger.info(f"Processing product {i}/{len(products)}: {product.get('name', 'Unknown')[:50]}...")
            try:
                summary = self.naver_client.generate_summary(product)
                summaries.append({
                    'product_id': product.get('id', f'product_{i}'),
                    'product_name': product.get('name', 'Unknown'),
                    'generated_summary': summary,
                    'reference_summary': product.get('reference_summary', ''),
                    'product_data': product
                })
            except Exception as e:
                logger.error(f"Failed to generate summary for product {i}: {e}")
                summaries.append({
                    'product_id': product.get('id', f'product_{i}'),
                    'product_name': product.get('name', 'Unknown'),
                    'generated_summary': '',
                    'reference_summary': product.get('reference_summary', ''),
                    'product_data': product,
                    'error': str(e)
                })
        
        # Save generated summaries
        summaries_file = Path(self.config.output_dir) / 'generated_summaries.json'
        with open(summaries_file, 'w', encoding='utf-8') as f:
            json.dump(summaries, f, indent=2, ensure_ascii=False)
        logger.info(f"Saved generated summaries to {summaries_file}")
        
        # Step 3: Evaluate with automatic metrics
        logger.info("\n[Step 3/5] Computing automatic metrics (ROUGE, BERTScore)...")
        metrics_results = []
        for i, item in enumerate(summaries, 1):
            if item.get('error'):
                logger.warning(f"Skipping metrics for product {i} due to generation error")
                continue
                
            logger.info(f"Computing metrics for product {i}/{len(summaries)}...")
            metrics = self.metrics_evaluator.evaluate(
                generated=item['generated_summary'],
                reference=item['reference_summary']
            )
            metrics_results.append({
                'product_id': item['product_id'],
                'product_name': item['product_name'],
                **metrics
            })
        
        # Save metrics results
        metrics_file = Path(self.config.output_dir) / 'metrics_results.json'
        with open(metrics_file, 'w', encoding='utf-8') as f:
            json.dump(metrics_results, f, indent=2, ensure_ascii=False)
        logger.info(f"Saved metrics results to {metrics_file}")
        
        # Step 4: Evaluate with LLM-as-judge
        logger.info("\n[Step 4/5] Evaluating with LLM-as-judge (HCX-007)...")
        judge_results = []
        for i, item in enumerate(summaries, 1):
            if item.get('error'):
                logger.warning(f"Skipping LLM judge for product {i} due to generation error")
                continue
                
            logger.info(f"LLM judging product {i}/{len(summaries)}...")
            try:
                judgment = self.llm_judge.judge_summary(
                    product_data=item['product_data'],
                    generated_summary=item['generated_summary']
                )
                judge_results.append({
                    'product_id': item['product_id'],
                    'product_name': item['product_name'],
                    **judgment
                })
            except Exception as e:
                logger.error(f"Failed to judge product {i}: {e}")
                judge_results.append({
                    'product_id': item['product_id'],
                    'product_name': item['product_name'],
                    'error': str(e)
                })
        
        # Save judge results
        judge_file = Path(self.config.output_dir) / 'llm_judge_results.json'
        with open(judge_file, 'w', encoding='utf-8') as f:
            json.dump(judge_results, f, indent=2, ensure_ascii=False)
        logger.info(f"Saved LLM judge results to {judge_file}")
        
        # Step 5: Generate visualizations and reports
        logger.info("\n[Step 5/5] Generating visualizations and reports...")
        self.visualizer.create_all_visualizations(
            metrics_results=metrics_results,
            judge_results=judge_results
        )
        
        # Compute aggregate statistics
        aggregate_stats = self._compute_aggregate_stats(metrics_results, judge_results)
        
        # Save final report
        report = {
            'config': {
                'input_file': input_file,
                'num_samples': len(products),
                'model': self.config.model,
                'judge_model': self.config.judge_model
            },
            'aggregate_statistics': aggregate_stats,
            'summaries': summaries,
            'metrics_results': metrics_results,
            'judge_results': judge_results
        }
        
        report_file = Path(self.config.output_dir) / 'final_report.json'
        with open(report_file, 'w', encoding='utf-8') as f:
            json.dump(report, f, indent=2, ensure_ascii=False)
        logger.info(f"Saved final report to {report_file}")
        
        logger.info("\n" + "=" * 80)
        logger.info("Evaluation Pipeline Completed Successfully!")
        logger.info("=" * 80)
        logger.info(f"\nResults saved to: {self.config.output_dir}")
        logger.info(f"- Generated summaries: {summaries_file}")
        logger.info(f"- Metrics results: {metrics_file}")
        logger.info(f"- LLM judge results: {judge_file}")
        logger.info(f"- Final report: {report_file}")
        logger.info(f"- Visualizations: {self.config.output_dir}/visualizations/")
        
        return report
    
    def _compute_aggregate_stats(self, metrics_results: List[Dict], judge_results: List[Dict]) -> Dict:
        """Compute aggregate statistics across all evaluations."""
        import numpy as np
        
        stats = {}
        
        # Automatic metrics statistics
        if metrics_results:
            rouge_1_scores = [m['rouge1_f1'] for m in metrics_results if 'rouge1_f1' in m]
            rouge_2_scores = [m['rouge2_f1'] for m in metrics_results if 'rouge2_f1' in m]
            rouge_l_scores = [m['rougeL_f1'] for m in metrics_results if 'rougeL_f1' in m]
            bert_scores = [m['bertscore_f1'] for m in metrics_results if 'bertscore_f1' in m]
            
            stats['metrics'] = {
                'rouge1': {
                    'mean': float(np.mean(rouge_1_scores)) if rouge_1_scores else 0,
                    'std': float(np.std(rouge_1_scores)) if rouge_1_scores else 0,
                    'min': float(np.min(rouge_1_scores)) if rouge_1_scores else 0,
                    'max': float(np.max(rouge_1_scores)) if rouge_1_scores else 0
                },
                'rouge2': {
                    'mean': float(np.mean(rouge_2_scores)) if rouge_2_scores else 0,
                    'std': float(np.std(rouge_2_scores)) if rouge_2_scores else 0,
                    'min': float(np.min(rouge_2_scores)) if rouge_2_scores else 0,
                    'max': float(np.max(rouge_2_scores)) if rouge_2_scores else 0
                },
                'rougeL': {
                    'mean': float(np.mean(rouge_l_scores)) if rouge_l_scores else 0,
                    'std': float(np.std(rouge_l_scores)) if rouge_l_scores else 0,
                    'min': float(np.min(rouge_l_scores)) if rouge_l_scores else 0,
                    'max': float(np.max(rouge_l_scores)) if rouge_l_scores else 0
                },
                'bertscore': {
                    'mean': float(np.mean(bert_scores)) if bert_scores else 0,
                    'std': float(np.std(bert_scores)) if bert_scores else 0,
                    'min': float(np.min(bert_scores)) if bert_scores else 0,
                    'max': float(np.max(bert_scores)) if bert_scores else 0
                }
            }
        
        # LLM judge statistics
        if judge_results:
            valid_results = [j for j in judge_results if 'error' not in j and 'scores' in j]
            if valid_results:
                factuality_scores = [j['scores']['factuality'] for j in valid_results]
                coverage_scores = [j['scores']['coverage'] for j in valid_results]
                proscons_scores = [j['scores']['proscons_accuracy'] for j in valid_results]
                readability_scores = [j['scores']['readability'] for j in valid_results]
                conciseness_scores = [j['scores']['conciseness'] for j in valid_results]
                overall_scores = [j['scores']['overall'] for j in valid_results]
                
                stats['llm_judge'] = {
                    'factuality': {
                        'mean': float(np.mean(factuality_scores)),
                        'std': float(np.std(factuality_scores)),
                        'min': float(np.min(factuality_scores)),
                        'max': float(np.max(factuality_scores))
                    },
                    'coverage': {
                        'mean': float(np.mean(coverage_scores)),
                        'std': float(np.std(coverage_scores)),
                        'min': float(np.min(coverage_scores)),
                        'max': float(np.max(coverage_scores))
                    },
                    'proscons_accuracy': {
                        'mean': float(np.mean(proscons_scores)),
                        'std': float(np.std(proscons_scores)),
                        'min': float(np.min(proscons_scores)),
                        'max': float(np.max(proscons_scores))
                    },
                    'readability': {
                        'mean': float(np.mean(readability_scores)),
                        'std': float(np.std(readability_scores)),
                        'min': float(np.min(readability_scores)),
                        'max': float(np.max(readability_scores))
                    },
                    'conciseness': {
                        'mean': float(np.mean(conciseness_scores)),
                        'std': float(np.std(conciseness_scores)),
                        'min': float(np.min(conciseness_scores)),
                        'max': float(np.max(conciseness_scores))
                    },
                    'overall': {
                        'mean': float(np.mean(overall_scores)),
                        'std': float(np.std(overall_scores)),
                        'min': float(np.min(overall_scores)),
                        'max': float(np.max(overall_scores))
                    }
                }
                
                # Correlation between automatic metrics and LLM judge
                if metrics_results and len(metrics_results) == len(valid_results) and len(valid_results) >= 2:
                    from scipy.stats import pearsonr, spearmanr
                    
                    rouge_l = [m['rougeL_f1'] for m in metrics_results if 'rougeL_f1' in m]
                    bert = [m['bertscore_f1'] for m in metrics_results if 'bertscore_f1' in m]
                    
                    if len(rouge_l) == len(overall_scores) and len(rouge_l) >= 2:
                        pearson_rouge, _ = pearsonr(rouge_l, overall_scores)
                        spearman_rouge, _ = spearmanr(rouge_l, overall_scores)
                        
                        stats['correlation'] = {
                            'rougeL_vs_overall': {
                                'pearson': float(pearson_rouge),
                                'spearman': float(spearman_rouge)
                            }
                        }
                    
                    if len(bert) == len(overall_scores) and len(bert) >= 2:
                        pearson_bert, _ = pearsonr(bert, overall_scores)
                        spearman_bert, _ = spearmanr(bert, overall_scores)
                        
                        if 'correlation' not in stats:
                            stats['correlation'] = {}
                        stats['correlation']['bertscore_vs_overall'] = {
                            'pearson': float(pearson_bert),
                            'spearman': float(spearman_bert)
                        }
        
        return stats


def main():
    """Main entry point for the evaluation pipeline."""
    parser = argparse.ArgumentParser(description='Evaluate LLM product summarization')
    parser.add_argument(
        '--input',
        type=str,
        default='7817_1.csv',
        help='Input CSV file with product data'
    )
    parser.add_argument(
        '--output',
        type=str,
        default='results',
        help='Output directory for results'
    )
    parser.add_argument(
        '--num_samples',
        type=int,
        default=None,
        help='Number of samples to evaluate (default: all)'
    )
    parser.add_argument(
        '--api_key',
        type=str,
        default=None,
        help='NAVER CLOVA API key (overrides env var)'
    )
    parser.add_argument(
        '--base_url',
        type=str,
        default=None,
        help='NAVER CLOVA base URL (overrides env var)'
    )
    
    args = parser.parse_args()
    
    # Load configuration
    config = Config(
        api_key=args.api_key,
        base_url=args.base_url,
        output_dir=args.output
    )
    
    # Create output directory
    Path(config.output_dir).mkdir(parents=True, exist_ok=True)
    Path(config.output_dir).joinpath('visualizations').mkdir(exist_ok=True)
    
    # Run evaluation pipeline
    pipeline = EvaluationPipeline(config)
    try:
        results = pipeline.run(args.input, args.num_samples)
        logger.info("\n✓ Evaluation completed successfully!")
        return 0
    except Exception as e:
        logger.error(f"\n✗ Evaluation failed: {e}", exc_info=True)
        return 1


if __name__ == '__main__':
    sys.exit(main())
