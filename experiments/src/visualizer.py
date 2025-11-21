"""
Visualization and reporting module for evaluation results.
"""

import json
import logging
from pathlib import Path
from typing import Dict, List, Optional

import matplotlib.pyplot as plt
import numpy as np
import seaborn as sns
from scipy.stats import pearsonr, spearmanr

logger = logging.getLogger(__name__)

# Set style
sns.set_style('whitegrid')
plt.rcParams['figure.figsize'] = (10, 6)
plt.rcParams['font.size'] = 10


class Visualizer:
    """Create visualizations and reports for evaluation results."""
    
    def __init__(self, output_dir: str = 'results'):
        """
        Initialize visualizer.
        
        Args:
            output_dir: Directory to save visualizations
        """
        self.output_dir = Path(output_dir)
        self.viz_dir = self.output_dir / 'visualizations'
        self.viz_dir.mkdir(parents=True, exist_ok=True)
    
    def create_all_visualizations(
        self,
        metrics_results: List[Dict],
        judge_results: List[Dict]
    ):
        """
        Create all visualizations for evaluation results.
        
        Args:
            metrics_results: List of automatic metrics results
            judge_results: List of LLM judge results
        """
        logger.info("Creating visualizations...")
        
        # 1. Metrics distribution plots
        if metrics_results:
            self.plot_metrics_distributions(metrics_results)
            logger.info("✓ Created metrics distribution plots")
        
        # 2. LLM judge scores plots
        if judge_results:
            self.plot_judge_scores(judge_results)
            logger.info("✓ Created LLM judge score plots")
        
        # 3. Correlation plots
        if metrics_results and judge_results:
            self.plot_correlations(metrics_results, judge_results)
            logger.info("✓ Created correlation plots")
        
        # 4. Summary statistics table
        self.create_summary_table(metrics_results, judge_results)
        logger.info("✓ Created summary table")
        
        logger.info(f"All visualizations saved to {self.viz_dir}")
    
    def plot_metrics_distributions(self, metrics_results: List[Dict]):
        """
        Plot distributions of automatic metrics.
        
        Args:
            metrics_results: List of metrics dictionaries
        """
        # Extract metric values
        rouge1_f1 = [m['rouge1_f1'] for m in metrics_results if 'rouge1_f1' in m]
        rouge2_f1 = [m['rouge2_f1'] for m in metrics_results if 'rouge2_f1' in m]
        rougeL_f1 = [m['rougeL_f1'] for m in metrics_results if 'rougeL_f1' in m]
        bert_f1 = [m['bertscore_f1'] for m in metrics_results if 'bertscore_f1' in m]
        
        # Create subplots
        fig, axes = plt.subplots(2, 2, figsize=(14, 10))
        fig.suptitle('Automatic Metrics Distributions', fontsize=16, fontweight='bold')
        
        # ROUGE-1 histogram
        if rouge1_f1:
            axes[0, 0].hist(rouge1_f1, bins=20, color='skyblue', edgecolor='black', alpha=0.7)
            axes[0, 0].axvline(np.mean(rouge1_f1), color='red', linestyle='--', 
                             label=f'Mean: {np.mean(rouge1_f1):.3f}')
            axes[0, 0].set_xlabel('ROUGE-1 F1 Score')
            axes[0, 0].set_ylabel('Frequency')
            axes[0, 0].set_title('ROUGE-1 Distribution')
            axes[0, 0].legend()
            axes[0, 0].grid(axis='y', alpha=0.3)
        
        # ROUGE-2 histogram
        if rouge2_f1:
            axes[0, 1].hist(rouge2_f1, bins=20, color='lightgreen', edgecolor='black', alpha=0.7)
            axes[0, 1].axvline(np.mean(rouge2_f1), color='red', linestyle='--',
                             label=f'Mean: {np.mean(rouge2_f1):.3f}')
            axes[0, 1].set_xlabel('ROUGE-2 F1 Score')
            axes[0, 1].set_ylabel('Frequency')
            axes[0, 1].set_title('ROUGE-2 Distribution')
            axes[0, 1].legend()
            axes[0, 1].grid(axis='y', alpha=0.3)
        
        # ROUGE-L histogram
        if rougeL_f1:
            axes[1, 0].hist(rougeL_f1, bins=20, color='salmon', edgecolor='black', alpha=0.7)
            axes[1, 0].axvline(np.mean(rougeL_f1), color='red', linestyle='--',
                             label=f'Mean: {np.mean(rougeL_f1):.3f}')
            axes[1, 0].set_xlabel('ROUGE-L F1 Score')
            axes[1, 0].set_ylabel('Frequency')
            axes[1, 0].set_title('ROUGE-L Distribution')
            axes[1, 0].legend()
            axes[1, 0].grid(axis='y', alpha=0.3)
        
        # BERTScore histogram
        if bert_f1:
            axes[1, 1].hist(bert_f1, bins=20, color='plum', edgecolor='black', alpha=0.7)
            axes[1, 1].axvline(np.mean(bert_f1), color='red', linestyle='--',
                             label=f'Mean: {np.mean(bert_f1):.3f}')
            axes[1, 1].set_xlabel('BERTScore F1')
            axes[1, 1].set_ylabel('Frequency')
            axes[1, 1].set_title('BERTScore Distribution')
            axes[1, 1].legend()
            axes[1, 1].grid(axis='y', alpha=0.3)
        
        plt.tight_layout()
        plt.savefig(self.viz_dir / 'metrics_distributions.png', dpi=300, bbox_inches='tight')
        plt.close()
    
    def plot_judge_scores(self, judge_results: List[Dict]):
        """
        Plot LLM judge scores by criterion.
        
        Args:
            judge_results: List of judge result dictionaries
        """
        # Extract valid results
        valid_results = [j for j in judge_results if 'scores' in j and 'error' not in j]
        if not valid_results:
            logger.warning("No valid judge results to plot")
            return
        
        # Extract scores by criterion
        criteria = ['factuality', 'coverage', 'proscons_accuracy', 'readability', 'conciseness', 'overall']
        criterion_labels = ['Factuality', 'Coverage', 'Pros/Cons\nAccuracy', 'Readability', 'Conciseness', 'Overall']
        
        scores_by_criterion = {}
        for criterion in criteria:
            scores = [j['scores'][criterion] for j in valid_results if criterion in j['scores']]
            if scores:
                scores_by_criterion[criterion] = scores
        
        # Create box plot
        fig, ax = plt.subplots(figsize=(12, 7))
        
        data_to_plot = [scores_by_criterion[c] for c in criteria if c in scores_by_criterion]
        labels_to_plot = [criterion_labels[i] for i, c in enumerate(criteria) if c in scores_by_criterion]
        
        bp = ax.boxplot(data_to_plot, labels=labels_to_plot, patch_artist=True,
                       showmeans=True, meanline=True)
        
        # Color boxes
        colors = ['skyblue', 'lightgreen', 'salmon', 'plum', 'gold', 'lightcoral']
        for patch, color in zip(bp['boxes'], colors[:len(bp['boxes'])]):
            patch.set_facecolor(color)
            patch.set_alpha(0.7)
        
        ax.set_ylabel('Score (1-5)', fontsize=12)
        ax.set_title('LLM Judge Scores by Criterion', fontsize=16, fontweight='bold')
        ax.set_ylim(0, 6)
        ax.grid(axis='y', alpha=0.3)
        
        # Add mean values as text
        for i, (criterion, scores) in enumerate([(c, scores_by_criterion[c]) for c in criteria if c in scores_by_criterion], 1):
            mean_val = np.mean(scores)
            ax.text(i, mean_val + 0.2, f'{mean_val:.2f}', ha='center', fontweight='bold')
        
        plt.tight_layout()
        plt.savefig(self.viz_dir / 'judge_scores_boxplot.png', dpi=300, bbox_inches='tight')
        plt.close()
        
        # Create bar plot of mean scores
        fig, ax = plt.subplots(figsize=(10, 6))
        
        means = [np.mean(scores_by_criterion[c]) for c in criteria if c in scores_by_criterion]
        stds = [np.std(scores_by_criterion[c]) for c in criteria if c in scores_by_criterion]
        
        x_pos = np.arange(len(labels_to_plot))
        bars = ax.bar(x_pos, means, yerr=stds, capsize=5, alpha=0.7,
                     color=colors[:len(means)], edgecolor='black')
        
        ax.set_xticks(x_pos)
        ax.set_xticklabels(labels_to_plot)
        ax.set_ylabel('Mean Score (1-5)', fontsize=12)
        ax.set_title('Mean LLM Judge Scores with Standard Deviation', fontsize=16, fontweight='bold')
        ax.set_ylim(0, 6)
        ax.grid(axis='y', alpha=0.3)
        
        # Add value labels on bars
        for bar, mean_val in zip(bars, means):
            height = bar.get_height()
            ax.text(bar.get_x() + bar.get_width()/2., height + 0.1,
                   f'{mean_val:.2f}', ha='center', va='bottom', fontweight='bold')
        
        plt.tight_layout()
        plt.savefig(self.viz_dir / 'judge_scores_means.png', dpi=300, bbox_inches='tight')
        plt.close()
    
    def plot_correlations(self, metrics_results: List[Dict], judge_results: List[Dict]):
        """
        Plot correlations between automatic metrics and LLM judge scores.
        
        Args:
            metrics_results: List of metrics dictionaries
            judge_results: List of judge dictionaries
        """
        # Ensure same length and valid data
        valid_indices = []
        for i, (m, j) in enumerate(zip(metrics_results, judge_results)):
            if 'rougeL_f1' in m and 'scores' in j and 'overall' in j['scores']:
                valid_indices.append(i)
        
        if len(valid_indices) < 3:
            logger.warning("Not enough valid data for correlation analysis")
            return
        
        # Extract aligned data
        rougeL = [metrics_results[i]['rougeL_f1'] for i in valid_indices]
        rouge1 = [metrics_results[i]['rouge1_f1'] for i in valid_indices]
        rouge2 = [metrics_results[i]['rouge2_f1'] for i in valid_indices]
        bert = [metrics_results[i]['bertscore_f1'] for i in valid_indices]
        overall_judge = [judge_results[i]['scores']['overall'] for i in valid_indices]
        
        # Create correlation matrix
        fig, axes = plt.subplots(2, 2, figsize=(14, 12))
        fig.suptitle('Correlation: Automatic Metrics vs LLM Judge Overall Score', 
                    fontsize=16, fontweight='bold')
        
        # ROUGE-1 vs Overall
        axes[0, 0].scatter(rouge1, overall_judge, alpha=0.6, s=50, color='skyblue', edgecolor='black')
        axes[0, 0].set_xlabel('ROUGE-1 F1')
        axes[0, 0].set_ylabel('LLM Judge Overall Score')
        axes[0, 0].set_title('ROUGE-1 vs LLM Judge')
        if len(rouge1) >= 3:
            r, p = pearsonr(rouge1, overall_judge)
            axes[0, 0].text(0.05, 0.95, f'Pearson r = {r:.3f}\np-value = {p:.3f}',
                          transform=axes[0, 0].transAxes, va='top', 
                          bbox=dict(boxstyle='round', facecolor='white', alpha=0.8))
            # Add trendline
            z = np.polyfit(rouge1, overall_judge, 1)
            p_line = np.poly1d(z)
            axes[0, 0].plot(rouge1, p_line(rouge1), "r--", alpha=0.8)
        axes[0, 0].grid(alpha=0.3)
        
        # ROUGE-2 vs Overall
        axes[0, 1].scatter(rouge2, overall_judge, alpha=0.6, s=50, color='lightgreen', edgecolor='black')
        axes[0, 1].set_xlabel('ROUGE-2 F1')
        axes[0, 1].set_ylabel('LLM Judge Overall Score')
        axes[0, 1].set_title('ROUGE-2 vs LLM Judge')
        if len(rouge2) >= 3:
            r, p = pearsonr(rouge2, overall_judge)
            axes[0, 1].text(0.05, 0.95, f'Pearson r = {r:.3f}\np-value = {p:.3f}',
                          transform=axes[0, 1].transAxes, va='top',
                          bbox=dict(boxstyle='round', facecolor='white', alpha=0.8))
            z = np.polyfit(rouge2, overall_judge, 1)
            p_line = np.poly1d(z)
            axes[0, 1].plot(rouge2, p_line(rouge2), "r--", alpha=0.8)
        axes[0, 1].grid(alpha=0.3)
        
        # ROUGE-L vs Overall
        axes[1, 0].scatter(rougeL, overall_judge, alpha=0.6, s=50, color='salmon', edgecolor='black')
        axes[1, 0].set_xlabel('ROUGE-L F1')
        axes[1, 0].set_ylabel('LLM Judge Overall Score')
        axes[1, 0].set_title('ROUGE-L vs LLM Judge')
        if len(rougeL) >= 3:
            r, p = pearsonr(rougeL, overall_judge)
            axes[1, 0].text(0.05, 0.95, f'Pearson r = {r:.3f}\np-value = {p:.3f}',
                          transform=axes[1, 0].transAxes, va='top',
                          bbox=dict(boxstyle='round', facecolor='white', alpha=0.8))
            z = np.polyfit(rougeL, overall_judge, 1)
            p_line = np.poly1d(z)
            axes[1, 0].plot(rougeL, p_line(rougeL), "r--", alpha=0.8)
        axes[1, 0].grid(alpha=0.3)
        
        # BERTScore vs Overall
        axes[1, 1].scatter(bert, overall_judge, alpha=0.6, s=50, color='plum', edgecolor='black')
        axes[1, 1].set_xlabel('BERTScore F1')
        axes[1, 1].set_ylabel('LLM Judge Overall Score')
        axes[1, 1].set_title('BERTScore vs LLM Judge')
        if len(bert) >= 3:
            r, p = pearsonr(bert, overall_judge)
            axes[1, 1].text(0.05, 0.95, f'Pearson r = {r:.3f}\np-value = {p:.3f}',
                          transform=axes[1, 1].transAxes, va='top',
                          bbox=dict(boxstyle='round', facecolor='white', alpha=0.8))
            z = np.polyfit(bert, overall_judge, 1)
            p_line = np.poly1d(z)
            axes[1, 1].plot(bert, p_line(bert), "r--", alpha=0.8)
        axes[1, 1].grid(alpha=0.3)
        
        plt.tight_layout()
        plt.savefig(self.viz_dir / 'metrics_judge_correlation.png', dpi=300, bbox_inches='tight')
        plt.close()
    
    def create_summary_table(self, metrics_results: List[Dict], judge_results: List[Dict]):
        """
        Create a summary statistics table.
        
        Args:
            metrics_results: List of metrics dictionaries
            judge_results: List of judge dictionaries
        """
        summary = []
        
        summary.append("=" * 80)
        summary.append("EVALUATION SUMMARY REPORT")
        summary.append("=" * 80)
        summary.append("")
        
        # Automatic Metrics Summary
        if metrics_results:
            summary.append("AUTOMATIC METRICS")
            summary.append("-" * 80)
            
            metrics_to_report = [
                ('ROUGE-1 F1', 'rouge1_f1'),
                ('ROUGE-2 F1', 'rouge2_f1'),
                ('ROUGE-L F1', 'rougeL_f1'),
                ('BERTScore F1', 'bertscore_f1')
            ]
            
            for label, key in metrics_to_report:
                values = [m[key] for m in metrics_results if key in m]
                if values:
                    summary.append(f"{label:20s}: Mean={np.mean(values):.4f}, "
                                 f"Std={np.std(values):.4f}, "
                                 f"Min={np.min(values):.4f}, "
                                 f"Max={np.max(values):.4f}")
            summary.append("")
        
        # LLM Judge Summary
        if judge_results:
            valid_results = [j for j in judge_results if 'scores' in j]
            if valid_results:
                summary.append("LLM JUDGE SCORES")
                summary.append("-" * 80)
                
                criteria = [
                    ('Factuality', 'factuality'),
                    ('Coverage', 'coverage'),
                    ('Pros/Cons Accuracy', 'proscons_accuracy'),
                    ('Readability', 'readability'),
                    ('Conciseness', 'conciseness'),
                    ('Overall', 'overall')
                ]
                
                for label, key in criteria:
                    values = [j['scores'][key] for j in valid_results if key in j['scores']]
                    if values:
                        summary.append(f"{label:20s}: Mean={np.mean(values):.4f}, "
                                     f"Std={np.std(values):.4f}, "
                                     f"Min={np.min(values):.4f}, "
                                     f"Max={np.max(values):.4f}")
                summary.append("")
        
        # Correlation Summary
        if metrics_results and judge_results and len(metrics_results) == len(judge_results):
            summary.append("CORRELATION ANALYSIS")
            summary.append("-" * 80)
            
            valid_indices = []
            for i, (m, j) in enumerate(zip(metrics_results, judge_results)):
                if 'rougeL_f1' in m and 'scores' in j and 'overall' in j['scores']:
                    valid_indices.append(i)
            
            if len(valid_indices) >= 3:
                rougeL = [metrics_results[i]['rougeL_f1'] for i in valid_indices]
                bert = [metrics_results[i]['bertscore_f1'] for i in valid_indices]
                overall = [judge_results[i]['scores']['overall'] for i in valid_indices]
                
                r_rougeL, p_rougeL = pearsonr(rougeL, overall)
                r_bert, p_bert = pearsonr(bert, overall)
                
                summary.append(f"ROUGE-L vs Overall:  Pearson r = {r_rougeL:.4f}, p-value = {p_rougeL:.4f}")
                summary.append(f"BERTScore vs Overall: Pearson r = {r_bert:.4f}, p-value = {p_bert:.4f}")
                summary.append("")
        
        summary.append("=" * 80)
        
        # Save to file
        summary_text = '\n'.join(summary)
        summary_file = self.output_dir / 'summary_report.txt'
        with open(summary_file, 'w', encoding='utf-8') as f:
            f.write(summary_text)
        
        logger.info(f"Summary report saved to {summary_file}")
        
        # Print to console
        print("\n" + summary_text)
