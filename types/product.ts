export type Product = {
  slug: string;
  name: string;
  images: string[];
  sizeChart?: string;

  sizes: {
    size: string;
    price: number;
  }[];

  links: {
    platform: string;
    url: string;
    rating: number;
    seller: string;
  }[];

  details?: string[];
};
