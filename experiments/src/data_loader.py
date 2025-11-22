"""
Data loader and preprocessor for Amazon product dataset.
"""

import csv
import json
import logging
import re
from pathlib import Path
from typing import Dict, List, Optional

logger = logging.getLogger(__name__)


class DataLoader:
    """Load and preprocess product data from Amazon dataset CSV."""
    
    def __init__(self):
        """Initialize data loader."""
        pass
    
    def load_from_csv(
        self,
        file_path: str,
        num_samples: Optional[int] = None
    ) -> List[Dict]:
        """
        Load product data from CSV file and group reviews by product ID.
        
        Args:
            file_path: Path to CSV file
            num_samples: Number of PRODUCTS to load (None = all)
            
        Returns:
            List of product dictionaries with all reviews aggregated
        """
        file_path = Path(file_path)
        if not file_path.exists():
            raise FileNotFoundError(f"Data file not found: {file_path}")
        
        # Dictionary to group rows by product ID
        products_dict = {}
        
        with open(file_path, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            
            for row in reader:
                try:
                    product_id = row.get('id', '')
                    if not product_id:
                        continue
                    
                    # If we haven't seen this product before, create it
                    if product_id not in products_dict:
                        products_dict[product_id] = self._create_product_base(row)
                    
                    # Add this review to the product
                    self._add_review_to_product(products_dict[product_id], row)
                    
                except Exception as e:
                    logger.warning(f"Failed to process row: {e}")
                    continue
        
        # Convert dictionary to list
        products = list(products_dict.values())
        
        # Limit to num_samples if specified
        if num_samples:
            products = products[:num_samples]
        
        logger.info(f"Successfully loaded {len(products)} unique products from {file_path}")
        return products
    
    def _create_product_base(self, row: Dict) -> Dict:
        """
        Create base product structure from first row.
        
        Args:
            row: Raw CSV row dictionary
            
        Returns:
            Base product dictionary
        """
        # Extract basic information
        product_id = row.get('id', '')
        name = self._clean_text(row.get('name', 'Unknown Product'))
        brand = self._clean_text(row.get('brand', 'Unknown'))
        manufacturer = self._clean_text(row.get('manufacturer', brand))
        
        # Parse categories
        categories = self._parse_categories(row.get('categories', ''))
        
        # Parse prices
        prices = self._parse_prices(row.get('prices', ''))
        
        # Parse dimensions and weight
        dimension = self._clean_text(row.get('dimension', ''))
        weight = self._clean_text(row.get('weight', ''))
        
        # Structure product data
        product = {
            'id': product_id,
            'name': name,
            'brand': brand,
            'manufacturer': manufacturer,
            'categories': categories,
            'dimension': dimension,
            'weight': weight,
            'prices': prices,
            'reviews': [],  # Will be populated by _add_review_to_product
            'rating': 0.0,  # Will be computed after all reviews added
            'asins': row.get('asins', ''),
            'colors': self._clean_text(row.get('colors', '')),
            'sizes': self._clean_text(row.get('sizes', ''))
        }
        
        return product
    
    def _add_review_to_product(self, product: Dict, row: Dict):
        """
        Extract review from row and add to product.
        
        Args:
            product: Product dictionary to add review to
            row: CSV row with review data
        """
        review_text = self._clean_text(row.get('reviews.text', ''))
        
        # Only add if review has text
        if review_text:
            review = {
                'text': review_text,
                'title': self._clean_text(row.get('reviews.title', '')),
                'rating': self._parse_rating(row.get('reviews.rating', '')),
                'date': row.get('reviews.date', ''),
                'do_recommend': row.get('reviews.doRecommend', ''),
                'num_helpful': row.get('reviews.numHelpful', ''),
                'username': row.get('reviews.username', '')
            }
            product['reviews'].append(review)
            
            # Recompute rating after adding review
            product['rating'] = self._compute_average_rating(product['reviews'])
        
        # Update reference summary after adding reviews
        product['reference_summary'] = self._create_reference_summary(
            product['name'],
            product['brand'],
            product['prices'],
            product['rating'],
            product['reviews']
        )
    
    def _clean_text(self, text: str) -> str:
        """Clean and normalize text."""
        if not text:
            return ''
        # Remove extra whitespace
        text = re.sub(r'\s+', ' ', text).strip()
        # Remove control characters
        text = ''.join(char for char in text if ord(char) >= 32 or char == '\n')
        return text
    
    def _parse_categories(self, categories_str: str) -> List[str]:
        """Parse categories string into list."""
        if not categories_str:
            return []
        # Categories are comma-separated
        categories = [cat.strip() for cat in categories_str.split(',') if cat.strip()]
        return categories
    
    def _parse_prices(self, prices_str: str) -> Dict:
        """
        Parse prices JSON string.
        
        Returns:
            Dictionary with current_price, currency, and price_range
        """
        if not prices_str:
            return {'current_price': 0.0, 'currency': 'USD', 'price_range': ''}
        
        try:
            prices_list = json.loads(prices_str)
            if not prices_list:
                return {'current_price': 0.0, 'currency': 'USD', 'price_range': ''}
            
            # Get the most recent price (first in list)
            latest_price = prices_list[0]
            current_price = latest_price.get('amountMax', 0.0)
            currency = latest_price.get('currency', 'USD')
            
            # Compute price range across all listings
            all_prices = [p.get('amountMax', 0) for p in prices_list if p.get('amountMax')]
            if all_prices:
                min_price = min(all_prices)
                max_price = max(all_prices)
                if min_price == max_price:
                    price_range = f"{currency} {current_price}"
                else:
                    price_range = f"{currency} {min_price} - {max_price}"
            else:
                price_range = f"{currency} {current_price}"
            
            return {
                'current_price': current_price,
                'currency': currency,
                'price_range': price_range
            }
        except json.JSONDecodeError:
            logger.warning(f"Failed to parse prices JSON: {prices_str[:100]}")
            return {'current_price': 0.0, 'currency': 'USD', 'price_range': ''}
    
    def _parse_rating(self, rating_str: str) -> float:
        """Parse rating string to float."""
        try:
            return float(rating_str) if rating_str else 0.0
        except ValueError:
            return 0.0
    
    def _compute_average_rating(self, reviews: List[Dict]) -> float:
        """Compute average rating from reviews."""
        if not reviews:
            return 0.0
        
        ratings = [r['rating'] for r in reviews if r.get('rating', 0) > 0]
        if not ratings:
            return 0.0
        
        return sum(ratings) / len(ratings)
    
    def _create_reference_summary(
        self,
        name: str,
        brand: str,
        prices: Dict,
        rating: float,
        reviews: List[Dict]
    ) -> str:
        """
        Create a reference summary from product data for evaluation.
        This is a simple heuristic-based summary for comparison.
        
        Args:
            name: Product name
            brand: Brand name
            prices: Price information
            rating: Average rating
            reviews: List of reviews
            
        Returns:
            Reference summary string
        """
        summary_parts = []
        
        # Product title
        summary_parts.append(f"{name} by {brand}")
        
        # Price
        if prices['current_price'] > 0:
            summary_parts.append(f"Price: {prices['price_range']}")
        
        # Rating
        if rating > 0:
            summary_parts.append(f"Rating: {rating:.1f}/5.0")
        
        # Extract key points from reviews
        if reviews:
            # Get positive and negative sentiments
            positive_points = []
            negative_points = []
            
            for review in reviews[:3]:  # Look at top 3 reviews
                text = review.get('text', '').lower()
                rating_val = review.get('rating', 0)
                
                if rating_val >= 4:
                    # Positive review
                    if len(text) > 20:
                        snippet = text[:100] + '...' if len(text) > 100 else text
                        positive_points.append(snippet)
                elif rating_val <= 2:
                    # Negative review
                    if len(text) > 20:
                        snippet = text[:100] + '...' if len(text) > 100 else text
                        negative_points.append(snippet)
            
            if positive_points:
                summary_parts.append(f"\nPositive highlights: {' '.join(positive_points[:2])}")
            if negative_points:
                summary_parts.append(f"\nConcerns: {' '.join(negative_points[:2])}")
        
        return ' '.join(summary_parts)
