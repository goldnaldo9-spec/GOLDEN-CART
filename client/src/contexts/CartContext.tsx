import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Product } from "@/lib/catalog";
import { trpc } from "@/lib/trpc";

export type CartLine = {
  product: Product;
  variant?: Record<string, string>;
  quantity: number;
};

export type CustomerOrder = {
  id: string;
  createdAt: string | Date;
  lines: CartLine[];
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  status: "Processing" | "Shipped" | "Out for Delivery" | "Delivered";
  customerName: string;
  email: string;
  address: string;
};

type CouponResult = { valid: boolean; message: string };
type CartContextValue = {
  lines: CartLine[];
  wishlist: string[];
  orders: CustomerOrder[];
  itemCount: number;
  subtotal: number;
  couponCode: string;
  couponDiscount: number;
  addToCart: (product: Product, quantity?: number, variant?: Record<string, string>) => void;
  updateQuantity: (productId: string, quantity: number, variant?: Record<string, string>) => void;
  removeFromCart: (productId: string, variant?: Record<string, string>) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => CouponResult;
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
  createOrder: (order: Omit<CustomerOrder, "id" | "createdAt" | "lines" | "subtotal" | "shipping" | "tax" | "discount" | "total" | "status">) => Promise<CustomerOrder>;
};

const CartContext = createContext<CartContextValue | null>(null);
const cartKey = "golden-cat-cart";
const wishlistKey = "golden-cat-wishlist";
const ordersKey = "golden-cat-orders";
const couponKey = "golden-cat-coupon";

const readStorage = <T,>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) as T : fallback;
  } catch {
    return fallback;
  }
};

const variantKey = (variant?: Record<string, string>) => JSON.stringify(variant ?? {});
const sameLine = (line: CartLine, productId: string, variant?: Record<string, string>) => line.product.id === productId && variantKey(line.variant) === variantKey(variant);

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>(() => readStorage(cartKey, []));
  const [wishlist, setWishlist] = useState<string[]>(() => readStorage(wishlistKey, []));
  const [orders, setOrders] = useState<CustomerOrder[]>(() => readStorage(ordersKey, []));
  const [couponCode, setCouponCode] = useState<string>(() => readStorage(couponKey, ""));
  const createOrderMutation = trpc.orders.create.useMutation();

  useEffect(() => localStorage.setItem(cartKey, JSON.stringify(lines)), [lines]);
  useEffect(() => localStorage.setItem(wishlistKey, JSON.stringify(wishlist)), [wishlist]);
  useEffect(() => localStorage.setItem(ordersKey, JSON.stringify(orders)), [orders]);
  useEffect(() => localStorage.setItem(couponKey, JSON.stringify(couponCode)), [couponCode]);

  const addToCart = (product: Product, quantity = 1, variant?: Record<string, string>) => {
    setLines(current => {
      const existing = current.find(line => sameLine(line, product.id, variant));
      if (existing) return current.map(line => sameLine(line, product.id, variant) ? { ...line, quantity: Math.min(product.stock, line.quantity + quantity) } : line);
      return [...current, { product, quantity: Math.min(product.stock, quantity), variant }];
    });
  };

  const updateQuantity = (productId: string, quantity: number, variant?: Record<string, string>) => {
    setLines(current => current.map(line => sameLine(line, productId, variant) ? { ...line, quantity: Math.max(1, Math.min(line.product.stock, quantity)) } : line));
  };
  const removeFromCart = (productId: string, variant?: Record<string, string>) => setLines(current => current.filter(line => !sameLine(line, productId, variant)));
  const clearCart = () => { setLines([]); setCouponCode(""); };
  const applyCoupon = (rawCode: string): CouponResult => {
    const code = rawCode.trim().toUpperCase();
    if (!code) { setCouponCode(""); return { valid: false, message: "Enter a promo code first." }; }
    if (code !== "GOLDEN10") return { valid: false, message: "That code is not active right now." };
    if (subtotal < 50) return { valid: false, message: "This code works on orders over $50." };
    setCouponCode(code);
    return { valid: true, message: "Golden Cat offer applied." };
  };
  const toggleWishlist = (productId: string) => setWishlist(current => current.includes(productId) ? current.filter(id => id !== productId) : [...current, productId]);
  const isWishlisted = (productId: string) => wishlist.includes(productId);
  const subtotal = useMemo(() => lines.reduce((sum, line) => sum + line.product.price * line.quantity, 0), [lines]);
  const couponDiscount = useMemo(() => couponCode === "GOLDEN10" && subtotal >= 50 ? Math.min(10, subtotal * 0.1) : 0, [couponCode, subtotal]);
  const itemCount = useMemo(() => lines.reduce((sum, line) => sum + line.quantity, 0), [lines]);

  const createOrder = async (orderInput: Omit<CustomerOrder, "id" | "createdAt" | "lines" | "subtotal" | "shipping" | "tax" | "discount" | "total" | "status">) => {
    const created = await createOrderMutation.mutateAsync({
      customerName: orderInput.customerName,
      email: orderInput.email,
      address: orderInput.address,
      couponCode: couponCode || undefined,
      items: lines.map(line => ({ productId: line.product.id, quantity: line.quantity, variant: line.variant })),
    });
    const order: CustomerOrder = {
      id: created.id,
      createdAt: created.createdAt,
      lines,
      subtotal: created.subtotal,
      shipping: created.shipping,
      tax: created.tax,
      discount: created.discount,
      total: created.total,
      status: created.status,
      customerName: created.customerName,
      email: created.email,
      address: created.address,
    };
    setOrders(current => [order, ...current]);
    clearCart();
    return order;
  };

  return <CartContext.Provider value={{ lines, wishlist, orders, itemCount, subtotal, couponCode, couponDiscount, addToCart, updateQuantity, removeFromCart, clearCart, applyCoupon, toggleWishlist, isWishlisted, createOrder }}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
}
