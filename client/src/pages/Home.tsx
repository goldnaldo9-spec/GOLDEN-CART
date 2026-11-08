import { ArrowRight, Search, ShieldCheck, Truck } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CategoryStrip, ProductShelf, TrustStrip } from "@/components/marketplace";
import { bestSellers, featuredProducts, newArrivals, recommendedProducts } from "@/lib/catalog";

export default function Home() {
  const [, setLocation] = useLocation();
  const [query, setQuery] = useState("");
  const submitSearch = (event: React.FormEvent) => {
    event.preventDefault();
    setLocation(query.trim() ? `/shop?q=${encodeURIComponent(query.trim())}` : "/shop");
  };

  return <div>
    <section className="container pt-7 sm:pt-10"><div className="hero-panel grid overflow-hidden rounded-[32px] lg:grid-cols-[1.08fr_.92fr]"><div className="relative z-10 flex flex-col justify-center px-6 py-12 sm:px-12 sm:py-16 lg:px-16"><p className="eyebrow text-[#a66c17]">The Golden Cat edit · 01</p><h1 className="mt-5 max-w-xl text-[clamp(2.6rem,6vw,5.8rem)] font-black leading-[0.94] tracking-[-0.075em] text-[#29261f]">Good finds,<br /><em>clearly chosen.</em></h1><p className="mt-6 max-w-md text-base leading-7 text-[#6d665c] sm:text-lg">Everyday goods, small upgrades, and things worth bringing home. Shop a calmer kind of marketplace.</p><form onSubmit={submitSearch} className="mt-8 flex max-w-md gap-2 rounded-full border border-[#d5c3a4] bg-white p-1.5 shadow-sm"><Search className="ml-3 mt-3 shrink-0 text-[#a66c17]" size={18} aria-hidden="true" /><Input value={query} onChange={event => setQuery(event.target.value)} placeholder="What are you looking for?" className="h-10 min-w-0 flex-1 border-0 bg-transparent px-2 text-sm shadow-none focus-visible:ring-0" aria-label="Search the Golden Cat catalog" /><Button type="submit" className="h-10 shrink-0 rounded-full bg-[#29261f] px-5 text-sm font-bold text-white hover:bg-[#4a443b]">Search</Button></form><div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold text-[#777064]"><span className="inline-flex items-center gap-2"><Truck size={15} className="text-[#b77921]" /> Free delivery over $75</span><span className="inline-flex items-center gap-2"><ShieldCheck size={15} className="text-[#b77921]" /> Buyer protected</span></div></div><div className="hero-image relative min-h-[320px] overflow-hidden lg:min-h-[500px]"><img src="/catalog/camera.jpg" alt="A camera from the Golden Cat everyday edit" className="absolute inset-0 h-full w-full object-cover mix-blend-multiply" /><div className="absolute inset-0 bg-gradient-to-r from-[#f5e7c9] via-transparent to-transparent lg:from-[#f5e7c9]/90 lg:via-transparent" /><div className="absolute bottom-6 right-6 rounded-2xl border border-white/50 bg-white/80 p-4 shadow-lg backdrop-blur"><p className="text-[10px] font-extrabold tracking-[0.15em] text-[#9a6518] uppercase">Editor’s pick</p><p className="mt-1 text-sm font-bold">Pocket Snap Camera</p></div></div></div></section>
    <CategoryStrip />
    <ProductShelf products={featuredProducts} eyebrow="The good list" title="Little upgrades, big difference." href="/shop" />
    <section className="container py-9"><div className="deal-panel flex flex-col justify-between gap-8 rounded-[28px] p-7 sm:flex-row sm:items-end sm:p-10"><div><p className="eyebrow text-[#9b6a1e]">Weekend notes</p><h2 className="mt-3 max-w-xl text-3xl font-black tracking-[-0.055em] sm:text-5xl">A softer start to the season.</h2><p className="mt-4 max-w-md text-sm leading-6 text-[#6f675c]">Take 10% off a first order over $50. No noisy fine print, just a nicer reason to try something new.</p></div><Link href="/shop" className="inline-flex items-center gap-2 rounded-full bg-[#29261f] px-5 py-3 text-sm font-bold text-white">Shop today <ArrowRight size={16} /></Link></div></section>
    <ProductShelf products={bestSellers} eyebrow="Loved by many" title="The ones people come back for." href="/shop?sort=best" />
    <ProductShelf products={newArrivals} eyebrow="Just in" title="New things, thoughtfully picked." href="/shop?sort=new" />
    <ProductShelf products={recommendedProducts} eyebrow="Picked for you" title="Recommended for your next browse." href="/shop" />
    <TrustStrip />
  </div>;
}
