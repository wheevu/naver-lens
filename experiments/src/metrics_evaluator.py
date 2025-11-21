"""
Automatic metrics evaluator for summarization quality.
Computes ROUGE and BERTScore metrics.
"""

import logging
from typing import Dict

logger = logging.getLogger(__name__)


class MetricsEvaluator:
    """Evaluate summaries using automatic metrics (ROUGE, BERTScore)."""
    
    def __init__(self):
        """Initialize metrics evaluator with required libraries."""
        try:
            from rouge_score import rouge_scorer
            self.rouge_scorer = rouge_scorer.RougeScorer(
                ['rouge1', 'rouge2', 'rougeL'],
                use_stemmer=True
            )
            logger.info("ROUGE scorer initialized")
        except ImportError:
            logger.error("rouge_score not installed. Install with: pip install rouge-score")
            self.rouge_scorer = None
        
        try:
            import bert_score
            self.bert_score = bert_score
            logger.info("BERTScore initialized")
        except ImportError:
            logger.error("bert_score not installed. Install with: pip install bert-score")
            self.bert_score = None
    
    def evaluate(self, generated: str, reference: str) -> Dict:
        """
        Evaluate a generated summary against a reference summary.
        
        Args:
            generated: Generated summary text
            reference: Reference (gold) summary text
            
        Returns:
            Dictionary with all computed metrics
        """
        metrics = {}
        
        # Compute ROUGE scores
        if self.rouge_scorer and generated and reference:
            rouge_scores = self._compute_rouge(generated, reference)
            metrics.update(rouge_scores)
        else:
            logger.warning("Skipping ROUGE: scorer not available or empty texts")
            metrics.update({
                'rouge1_precision': 0.0,
                'rouge1_recall': 0.0,
                'rouge1_f1': 0.0,
                'rouge2_precision': 0.0,
                'rouge2_recall': 0.0,
                'rouge2_f1': 0.0,
                'rougeL_precision': 0.0,
                'rougeL_recall': 0.0,
                'rougeL_f1': 0.0
            })
        
        # Compute BERTScore
        if self.bert_score and generated and reference:
            bert_scores = self._compute_bertscore(generated, reference)
            metrics.update(bert_scores)
        else:
            logger.warning("Skipping BERTScore: scorer not available or empty texts")
            metrics.update({
                'bertscore_precision': 0.0,
                'bertscore_recall': 0.0,
                'bertscore_f1': 0.0
            })
        
        # Additional metrics
        metrics['generated_length'] = len(generated.split())
        metrics['reference_length'] = len(reference.split())
        metrics['length_ratio'] = (
            metrics['generated_length'] / metrics['reference_length']
            if metrics['reference_length'] > 0 else 0.0
        )
        
        return metrics
    
    def _compute_rouge(self, generated: str, reference: str) -> Dict:
        """
        Compute ROUGE scores.
        
        Args:
            generated: Generated text
            reference: Reference text
            
        Returns:
            Dictionary with ROUGE-1, ROUGE-2, ROUGE-L scores
        """
        try:
            scores = self.rouge_scorer.score(reference, generated)
            
            return {
                'rouge1_precision': scores['rouge1'].precision,
                'rouge1_recall': scores['rouge1'].recall,
                'rouge1_f1': scores['rouge1'].fmeasure,
                'rouge2_precision': scores['rouge2'].precision,
                'rouge2_recall': scores['rouge2'].recall,
                'rouge2_f1': scores['rouge2'].fmeasure,
                'rougeL_precision': scores['rougeL'].precision,
                'rougeL_recall': scores['rougeL'].recall,
                'rougeL_f1': scores['rougeL'].fmeasure
            }
        except Exception as e:
            logger.error(f"Failed to compute ROUGE: {e}")
            return {
                'rouge1_precision': 0.0,
                'rouge1_recall': 0.0,
                'rouge1_f1': 0.0,
                'rouge2_precision': 0.0,
                'rouge2_recall': 0.0,
                'rouge2_f1': 0.0,
                'rougeL_precision': 0.0,
                'rougeL_recall': 0.0,
                'rougeL_f1': 0.0
            }
    
    def _compute_bertscore(self, generated: str, reference: str) -> Dict:
        """
        Compute BERTScore.
        
        Args:
            generated: Generated text
            reference: Reference text
            
        Returns:
            Dictionary with BERTScore precision, recall, F1
        """
        try:
            # Compute BERTScore
            # Using model_type='microsoft/deberta-xlarge-mnli' for best results
            # Can use smaller models like 'bert-base-uncased' for speed
            P, R, F1 = self.bert_score.score(
                [generated],
                [reference],
                lang='en',
                model_type='bert-base-uncased',  # Use smaller model for speed
                verbose=False
            )
            
            return {
                'bertscore_precision': float(P[0]),
                'bertscore_recall': float(R[0]),
                'bertscore_f1': float(F1[0])
            }
        except Exception as e:
            logger.error(f"Failed to compute BERTScore: {e}")
            return {
                'bertscore_precision': 0.0,
                'bertscore_recall': 0.0,
                'bertscore_f1': 0.0
            }
    
    def evaluate_batch(self, generated_list: list, reference_list: list) -> list:
        """
        Evaluate a batch of summaries.
        
        Args:
            generated_list: List of generated summaries
            reference_list: List of reference summaries
            
        Returns:
            List of metric dictionaries
        """
        if len(generated_list) != len(reference_list):
            raise ValueError("Generated and reference lists must have same length")
        
        results = []
        for gen, ref in zip(generated_list, reference_list):
            metrics = self.evaluate(gen, ref)
            results.append(metrics)
        
        return results
    
    def compute_aggregate_metrics(self, metrics_list: list) -> Dict:
        """
        Compute aggregate statistics over a list of metrics.
        
        Args:
            metrics_list: List of metric dictionaries
            
        Returns:
            Dictionary with mean, std, min, max for each metric
        """
        import numpy as np
        
        if not metrics_list:
            return {}
        
        # Collect all metric keys
        metric_keys = set()
        for m in metrics_list:
            metric_keys.update(m.keys())
        
        aggregate = {}
        for key in metric_keys:
            values = [m.get(key, 0) for m in metrics_list if key in m]
            if values:
                aggregate[key] = {
                    'mean': float(np.mean(values)),
                    'std': float(np.std(values)),
                    'min': float(np.min(values)),
                    'max': float(np.max(values))
                }
        
        return aggregate
