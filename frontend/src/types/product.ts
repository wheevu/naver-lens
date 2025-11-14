export interface ProductOption {
  name: string;
  values: string[];
}

export interface Product {
  productId: string;
  title: string;
  brand: string;
  maker: string;
  images: string[];
  price: number;
  originalPrice: number;
  mallName: string;
  shipping: string;
  rating: number;
  reviewCount: number;
  options: ProductOption[];
  description: string;
  category1: string;
  category2: string;
  category3: string;
  category4: string;
}
