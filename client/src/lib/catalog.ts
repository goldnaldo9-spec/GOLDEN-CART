export type ProductVariant = {
  name: string;
  options: string[];
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: string;
  categoryLabel: string;
  brand: string;
  price: number;
  compareAt?: number;
  rating: number;
  reviews: number;
  image: string;
  gallery: string[];
  description: string;
  specs: string[];
  stock: number;
  shipping: string;
  badge?: string;
  variants?: ProductVariant[];
  colors?: string[];
  tags: string[];
};

export const categories = [
  { slug: "electronics", label: "Electronics", icon: "✦", color: "from-[#e8c36a] to-[#f8ead0]" },
  { slug: "fashion", label: "Fashion", icon: "✳", color: "from-[#d9b6a1] to-[#f2e2d9]" },
  { slug: "home-kitchen", label: "Home & Kitchen", icon: "⌂", color: "from-[#bdd0bf] to-[#edf2e8]" },
  { slug: "beauty", label: "Beauty", icon: "✺", color: "from-[#ead0d8] to-[#f9edf0]" },
  { slug: "toys", label: "Toys", icon: "◌", color: "from-[#c6d8e7] to-[#eaf2f7]" },
  { slug: "sports", label: "Sports", icon: "↗", color: "from-[#d2c9b4] to-[#f1eee6]" },
  { slug: "groceries", label: "Groceries", icon: "⌁", color: "from-[#c3d9bb] to-[#edf5e9]" },
  { slug: "phones", label: "Phones & Accessories", icon: "▣", color: "from-[#c8c7de] to-[#ededf6]" },
];

const camera = "/catalog/camera.jpg";
const mixer = "/catalog/mixer.jpg";
const beauty = "/catalog/beauty.jpg";
const tableware = "/catalog/tableware.jpg";

export const products: Product[] = [
  {
    id: "p-001",
    slug: "pocket-snap-camera",
    name: "Pocket Snap Camera",
    category: "electronics",
    categoryLabel: "Electronics",
    brand: "Luma",
    price: 89.9,
    compareAt: 119.9,
    rating: 4.8,
    reviews: 286,
    image: camera,
    gallery: [camera, camera, camera],
    description: "A compact everyday camera for bright memories, quick clips, and weekend detours.",
    specs: ["24MP sensor", "4K video", "USB-C charging", "12-month warranty"],
    stock: 18,
    shipping: "Free delivery by Friday",
    badge: "Best seller",
    variants: [{ name: "Finish", options: ["Graphite", "Cloud white"] }],
    tags: ["trending", "best-seller", "new"],
  },
  {
    id: "p-002",
    slug: "olive-countertop-mixer",
    name: "Olive Countertop Mixer",
    category: "home-kitchen",
    categoryLabel: "Home & Kitchen",
    brand: "Morrow",
    price: 149.0,
    compareAt: 189.0,
    rating: 4.9,
    reviews: 174,
    image: mixer,
    gallery: [mixer, tableware, mixer],
    description: "A sturdy stand mixer with a quiet motor and enough room for everyday bakes.",
    specs: ["4.8L stainless bowl", "8 speed settings", "Metal whisk included", "2-year warranty"],
    stock: 9,
    shipping: "Free delivery by Thursday",
    badge: "Top rated",
    variants: [{ name: "Color", options: ["Olive", "Cream", "Ink"] }],
    tags: ["best-seller", "home"],
  },
  {
    id: "p-003",
    slug: "daily-glow-mist",
    name: "Daily Glow Face Mist",
    category: "beauty",
    categoryLabel: "Beauty",
    brand: "Serein",
    price: 24.5,
    compareAt: 32.0,
    rating: 4.7,
    reviews: 98,
    image: beauty,
    gallery: [beauty, beauty, beauty],
    description: "A light botanical mist for a fresh, comfortable finish throughout the day.",
    specs: ["100ml glass bottle", "Vegan formula", "Rosewater + niacinamide", "Dermatologist tested"],
    stock: 42,
    shipping: "Delivery by Saturday",
    badge: "New arrival",
    tags: ["new", "beauty"],
  },
  {
    id: "p-004",
    slug: "terracotta-table-set",
    name: "Terracotta Table Set",
    category: "home-kitchen",
    categoryLabel: "Home & Kitchen",
    brand: "Hearthline",
    price: 48.0,
    compareAt: 64.0,
    rating: 4.6,
    reviews: 63,
    image: tableware,
    gallery: [tableware, tableware, mixer],
    description: "A warm, durable table setting for slow breakfasts and generous dinners.",
    specs: ["Stoneware", "Microwave safe", "Set of 4", "Dishwasher safe"],
    stock: 21,
    shipping: "Delivery by Friday",
    tags: ["trending", "home"],
  },
  {
    id: "p-005",
    slug: "linen-overshirt",
    name: "Everyday Linen Overshirt",
    category: "fashion",
    categoryLabel: "Fashion",
    brand: "Northline",
    price: 58.0,
    compareAt: 78.0,
    rating: 4.5,
    reviews: 41,
    image: beauty,
    gallery: [beauty, beauty, beauty],
    description: "A relaxed linen layer that works over tees, knits, and summer dresses.",
    specs: ["55% linen blend", "Relaxed fit", "Two front pockets", "Machine washable"],
    stock: 14,
    shipping: "Delivery by Monday",
    variants: [{ name: "Size", options: ["S", "M", "L", "XL"] }],
    colors: ["Sand", "Ink", "Soft olive"],
    tags: ["new", "fashion"],
  },
  {
    id: "p-006",
    slug: "desk-light-mini",
    name: "Desk Light Mini",
    category: "electronics",
    categoryLabel: "Electronics",
    brand: "Luma",
    price: 36.0,
    rating: 4.4,
    reviews: 112,
    image: camera,
    gallery: [camera, camera, camera],
    description: "A small, warm desk light with three brightness levels and a soft touch switch.",
    specs: ["USB-C powered", "3 brightness levels", "Warm LED", "Fold-flat base"],
    stock: 33,
    shipping: "Free delivery by Friday",
    tags: ["trending", "electronics"],
  },
  {
    id: "p-007",
    slug: "soft-start-journal",
    name: "Soft Start Journal",
    category: "toys",
    categoryLabel: "Toys",
    brand: "Little North",
    price: 18.0,
    rating: 4.8,
    reviews: 57,
    image: tableware,
    gallery: [tableware, tableware, beauty],
    description: "A thoughtful paper journal for ideas, lists, sketches, and small plans.",
    specs: ["192 pages", "Recycled paper", "Lay-flat binding", "A5 format"],
    stock: 64,
    shipping: "Delivery by Saturday",
    tags: ["new", "gift"],
  },
  {
    id: "p-008",
    slug: "woven-market-tote",
    name: "Woven Market Tote",
    category: "fashion",
    categoryLabel: "Fashion",
    brand: "Hearthline",
    price: 31.5,
    compareAt: 39.0,
    rating: 4.6,
    reviews: 86,
    image: mixer,
    gallery: [mixer, tableware, beauty],
    description: "A roomy everyday tote that folds flat and carries the day with ease.",
    specs: ["Recycled cotton", "Interior pocket", "Magnetic closure", "Hand wash"],
    stock: 27,
    shipping: "Delivery by Monday",
    tags: ["trending", "fashion"],
  },
];

export const productBySlug = (slug: string) => products.find(product => product.slug === slug);
export const productsByCategory = (slug: string) => products.filter(product => product.category === slug);
export const featuredProducts = products.filter(product => product.tags.includes("trending"));
export const bestSellers = products.filter(product => product.tags.includes("best-seller"));
export const newArrivals = products.filter(product => product.tags.includes("new"));
export const formatPrice = (value: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
