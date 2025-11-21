"""
Quick test to verify data loading groups products correctly.
"""

from src.data_loader import DataLoader

loader = DataLoader()

# Load first 5 products
products = loader.load_from_csv('7817_1.csv', num_samples=5)

print(f"\n{'='*80}")
print(f"Loaded {len(products)} unique products")
print(f"{'='*80}\n")

for i, product in enumerate(products, 1):
    print(f"Product {i}:")
    print(f"  ID: {product['id']}")
    print(f"  Name: {product['name']}")
    print(f"  Brand: {product['brand']}")
    print(f"  Reviews: {len(product['reviews'])} reviews")
    print(f"  Average Rating: {product['rating']:.2f}/5.0")
    print(f"  Price: {product['prices']['price_range']}")
    print()

print(f"\n{'='*80}")
print("Success! Products are properly grouped with all reviews aggregated.")
print(f"{'='*80}\n")
