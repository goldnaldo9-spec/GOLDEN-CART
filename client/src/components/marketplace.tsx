import { Heart, Menu, Search, ShoppingBag, Sparkles, UserRound, X } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useCart } from "@/contexts/CartContext";
import { categories, formatPrice, type Product } from "@/lib/catalog";
import { cn } from "@/lib/utils";

export function BrandMark() {
  return <Link href="/" className="group inline-flex items-center gap-2" aria-label="Golden Cat home"><span className="brand-mark">GC</span><span className="text-lg font-extrabold tracking-[-0.04em] text-[#29261f]">Golden Cat</span></Link>;
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const { itemCount } = useCart();
  const [query, setQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  const submitSearch = (event: React.FormEvent) => {
    event.preventDefault();
    const value = query.trim();
    setMobileOpen(false);
    setLocation(value ? `/shop?q=${encodeURIComponent(value)}` : "/shop");
  };

  return <div className="min-h-screen bg-[#fbfaf7] text-[#29261f]">
    <div className="bg-[#29261f] px-4 py-2 text-center text-[11px] font-semibold tracking-[0.18em] text-[#f8e9bd] uppercase">Free delivery on orders over $75 · Easy returns within 30 days</div>
    <header className="sticky top-0 z-30 border-b border-[#e8e1d4] bg-[#fbfaf7]/95 backdrop-blur">
      <div className="container flex min-h-[76px] items-center gap-4">
        <button className="icon-button lg:hidden" onClick={() => setMobileOpen(open => !open)} aria-label={mobileOpen ? "Close menu" : "Open menu"}>{mobileOpen ? <X size={21} /> : <Menu size={21} />}</button>
        <BrandMark />
        <form onSubmit={submitSearch} className="relative hidden max-w-[420px] flex-1 lg:block">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8f8a80]" size={18} aria-hidden="true" />
          <Input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search good finds…" className="h-11 rounded-full border-[#ddd4c4] bg-white pl-11 pr-4 text-sm shadow-none focus-visible:ring-[#c99331]" aria-label="Search products" />
        </form>
        <nav className="ml-auto hidden items-center gap-1 lg:flex" aria-label="Main navigation">
          <Link href="/shop" className={cn("nav-link", location.startsWith("/shop") && "nav-link-active")}>Shop</Link>
          <Link href="/support" className="nav-link">Help</Link>
          <Link href="/account" className="icon-button" aria-label="Account"><UserRound size={19} /></Link>
          <Link href="/cart" className="icon-button relative" aria-label={`Cart with ${itemCount} items`}><ShoppingBag size={19} />{itemCount > 0 && <span className="cart-count">{itemCount}</span>}</Link>
        </nav>
      </div>
      {mobileOpen && <div className="border-t border-[#e8e1d4] bg-[#fbfaf7] px-4 py-4 lg:hidden"><form onSubmit={submitSearch} className="relative mb-4"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8f8a80]" size={18} /><Input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search good finds…" className="h-11 rounded-full bg-white pl-11" aria-label="Search products" /></form><div className="grid grid-cols-2 gap-2"><Link href="/shop" className="mobile-nav-link" onClick={() => setMobileOpen(false)}>Shop all</Link><Link href="/account" className="mobile-nav-link" onClick={() => setMobileOpen(false)}>My account</Link><Link href="/cart" className="mobile-nav-link" onClick={() => setMobileOpen(false)}>Cart ({itemCount})</Link><Link href="/support" className="mobile-nav-link" onClick={() => setMobileOpen(false)}>Help centre</Link></div></div>}
    </header>
    <main>{children}</main>
    <Footer />
  </div>;
}

export function Footer() {
  return <footer className="mt-20 border-t border-[#e8e1d4] bg-[#f2eee6]"><div className="container grid gap-10 py-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]"><div><BrandMark /><p className="mt-4 max-w-xs text-sm leading-6 text-[#70695e]">Good finds, clearly chosen. Golden Cat makes everyday shopping feel calm, useful, and a little more considered.</p><p className="mt-5 text-sm font-semibold text-[#29261f]">goldnado9@gmail.com<br />+421 952 635 086</p></div><div><p className="eyebrow">Shop</p><div className="mt-4 grid gap-3 text-sm text-[#70695e]"><Link href="/shop">All products</Link><Link href="/category/electronics">Electronics</Link><Link href="/category/home-kitchen">Home & Kitchen</Link><Link href="/category/beauty">Beauty</Link></div></div><div><p className="eyebrow">Help</p><div className="mt-4 grid gap-3 text-sm text-[#70695e]"><Link href="/support">Help centre</Link><Link href="/contact">Contact us</Link><Link href="/shipping">Shipping policy</Link><Link href="/returns">Returns & refunds</Link></div></div><div><p className="eyebrow">About</p><div className="mt-4 grid gap-3 text-sm text-[#70695e]"><Link href="/about">About Golden Cat</Link><Link href="/privacy">Privacy policy</Link><Link href="/terms">Terms & conditions</Link><span className="text-[#aaa398]">Business address coming soon</span></div></div></div><div className="container border-t border-[#ddd5c7] py-5 text-xs text-[#8f8a80]">© 2026 Golden Cat. Server-validated orders · Buyer support · Easy returns.</div></footer>;
}

export function CategoryStrip() {
  return <section className="container py-7"><div className="flex items-end justify-between gap-4"><div><p className="eyebrow">Shop by mood</p><h2 className="section-title mt-2">Find your next good thing.</h2></div><Link href="/shop" className="hidden text-sm font-bold text-[#a66c17] sm:block">Browse everything →</Link></div><div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">{categories.map(category => <Link key={category.slug} href={`/category/${category.slug}`} className={cn("category-tile bg-gradient-to-br", category.color)}><span className="category-icon">{category.icon}</span><span>{category.label}</span></Link>)}</div></section>;
}

export function ProductCard({ product }: { product: Product }) {
  const { addToCart, toggleWishlist, isWishlisted } = useCart();
  return <article className="product-card group"><div className="relative overflow-hidden rounded-[22px] bg-[#f0ece4]"><Link href={`/product/${product.slug}`} aria-label={`View ${product.name}`}><img src={product.image} alt={product.name} loading="lazy" className="aspect-[4/3] w-full object-cover mix-blend-multiply transition duration-500 group-hover:scale-105" /></Link>{product.badge && <span className="absolute left-3 top-3 rounded-full bg-[#fff9ea] px-3 py-1 text-[10px] font-extrabold tracking-[0.12em] text-[#936014] uppercase">{product.badge}</span>}<button className="icon-button absolute right-3 top-3 bg-white/90 shadow-sm" aria-label={isWishlisted(product.id) ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`} onClick={() => toggleWishlist(product.id)}><Heart size={17} fill={isWishlisted(product.id) ? "#b97922" : "none"} className={isWishlisted(product.id) ? "text-[#b97922]" : ""} /></button></div><div className="pt-4"><div className="flex items-center justify-between gap-3"><p className="text-[11px] font-bold tracking-[0.14em] text-[#9a9388] uppercase">{product.categoryLabel}</p><span className="text-xs font-semibold text-[#9a9388]">★ {product.rating}</span></div><Link href={`/product/${product.slug}`} className="mt-2 block text-base font-bold leading-5 tracking-[-0.02em] hover:text-[#a66c17]">{product.name}</Link><div className="mt-2 flex items-center gap-2"><span className="font-extrabold">{formatPrice(product.price)}</span>{product.compareAt && <span className="text-xs text-[#a8a094] line-through">{formatPrice(product.compareAt)}</span>}</div><button onClick={() => addToCart(product)} className="mt-3 w-full rounded-full border border-[#d8c7aa] px-4 py-2.5 text-sm font-bold text-[#8c5b14] transition hover:border-[#b77921] hover:bg-[#fff9ea]">Add to cart</button></div></article>;
}

export function SectionHeading({ eyebrow, title, href, linkLabel = "See all" }: { eyebrow: string; title: string; href?: string; linkLabel?: string }) {
  return <div className="flex items-end justify-between gap-5"><div><p className="eyebrow">{eyebrow}</p><h2 className="section-title mt-2">{title}</h2></div>{href && <Link href={href} className="shrink-0 text-sm font-bold text-[#a66c17]">{linkLabel} →</Link>}</div>;
}

export function ProductShelf({ products, eyebrow, title, href }: { products: Product[]; eyebrow: string; title: string; href?: string }) {
  return <section className="container py-8"><SectionHeading eyebrow={eyebrow} title={title} href={href} /><div className="mt-7 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4">{products.map(product => <ProductCard key={product.id} product={product} />)}</div></section>;
}

export function TrustStrip() {
  return <section className="container py-7"><div className="grid gap-3 rounded-[26px] border border-[#e6ddcf] bg-white p-5 sm:grid-cols-3 sm:p-7"><div className="flex gap-3"><span className="trust-icon">✦</span><div><p className="font-bold">Server-validated orders</p><p className="mt-1 text-sm text-[#777064]">Totals checked before an order is saved.</p></div></div><div className="flex gap-3"><span className="trust-icon">↺</span><div><p className="font-bold">Easy returns</p><p className="mt-1 text-sm text-[#777064]">30 days to change your mind.</p></div></div><div className="flex gap-3"><span className="trust-icon">♡</span><div><p className="font-bold">Buyer protection</p><p className="mt-1 text-sm text-[#777064]">We’re here if something feels off.</p></div></div></div></section>;
}

export function PriceBreakdown({ subtotal, coupon = 0 }: { subtotal: number; coupon?: number }) {
  const shipping = subtotal >= 75 ? 0 : 6.95;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax - coupon;
  return <div className="grid gap-3 text-sm"><div className="flex justify-between"><span className="text-[#777064]">Subtotal</span><span>{formatPrice(subtotal)}</span></div><div className="flex justify-between"><span className="text-[#777064]">Shipping</span><span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span></div><div className="flex justify-between"><span className="text-[#777064]">Estimated tax</span><span>{formatPrice(tax)}</span></div>{coupon > 0 && <div className="flex justify-between text-[#9a6518]"><span>Golden Cat offer</span><span>-{formatPrice(coupon)}</span></div>}<div className="mt-2 flex justify-between border-t border-[#e8e1d4] pt-4 text-base font-extrabold"><span>Total</span><span>{formatPrice(total)}</span></div></div>;
}

export function EmptyState({ title, body, actionHref = "/shop", actionLabel = "Browse products" }: { title: string; body: string; actionHref?: string; actionLabel?: string }) {
  return <div className="rounded-[26px] border border-dashed border-[#d9cfbf] bg-[#fffdf9] px-6 py-14 text-center"><Sparkles className="mx-auto text-[#c9953a]" size={25} /><h2 className="mt-4 text-xl font-extrabold">{title}</h2><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#777064]">{body}</p><Link href={actionHref} className="mt-6 inline-flex rounded-full bg-[#29261f] px-5 py-3 text-sm font-bold text-white">{actionLabel}</Link></div>;
}
