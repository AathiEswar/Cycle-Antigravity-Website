export interface Bike {
  id: number;
  name: string;
  category: string;
  price: string;
  image: string;
  tagline: string;
}

export interface Feature {
  title: string;
  description: string;
  icon: React.ReactNode;
}

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  quote: string;
  image: string;
}
