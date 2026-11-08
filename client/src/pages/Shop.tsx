import { Filter, Search, SlidersHorizontal, X } from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProductCard } from "@/components/marketplace";
import { categories, products } from "@/lib/catalog";

export default function Shop({ categorySlug }: { categorySlug?: string }) {
  const [location, setLocation] = useLocation();
  const params = new URLSearchParams(location.split("?")[1] ?? "");
  const initialQuery = params.get("q") ?? "";
  const [query, setQuery] = useState(initialQuery);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(categorySlug ? [categorySlug] : []);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [ratingOnly, setRatingOnly] = useState(false);
  const [sort, setSort] = useState(params.get("sort") ?? "featured");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    const min = Number(minPrice) || 0;
    const max = Number(maxPrice) || Infinity;
    const filtered = products.filter(product => {
      const matchesTerm = !term || [product.name, product.brand, product.categoryLabel, ...product.tags].join(" ").toLowerCase().includes(term);
      const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(product.category);
      const matchesPrice = product.price >= min && product.price <= max;
      const matchesRating = !ratingOnly || product.rating >= 4.7;
      return matchesTerm && matchesCategory && matchesPrice && matchesRating;
    });
    return [...filtered].sort((a, b) => sort === "price-low" ? a.price - b.price : sort === "price-high" ? b.price - a.price : sort === "rating" ? b.rating - a.rating : sort === "new" ? Number(b.tags.includes("new")) - Number(a.tags.includes("new")) : Number(b.tags.includes("trending")) - Number(a.tags.includes("trending")));
  }, [maxPrice, minPrice, query, ratingOnly, selectedCategories, sort]);

  const updateQuery = (event: React.FormEvent) => {
    event.preventDefault();
    setLocation(query.trim() ? `/shop?q=${encodeURIComponent(query.trim())}` : "/shop");
  };
  const toggleCategory = (slug: string) => setSelectedCategories(current => current.includes(slug) ? current.filter(item => item !== slug) : [...current, slug]);
  const clearFilters = () => { setSelectedCategories(categorySlug ? [categorySlug] : []); setMinPrice(""); setMaxPrice(""); setRatingOnly(false); setQuery(""); };
  const title = categorySlug ? categories.find(item => item.slug === categorySlug)?.label ?? "Shop" : query ? `Results for “${query}”` : "Shop all good finds";

  return <div className="container py-8 sm:py-12"><div className="flex flex-col justify-between gap-5 border-b border-[#e8e1d4] pb-8 md:flex-row md:items-end"><div><p className="eyebrow">Golden Cat catalog</p><h1 className="page-title mt-3">{title}</h1><p className="mt-3 max-w-xl text-sm leading-6 text-[#777064]">Useful things, small joys, and considered everyday pieces. Search, filter, and take your time.</p></div><form onSubmit={updateQuery} className="relative flex w-full max-w-sm gap-2"><Search className="absolute left-3 top-3 text-[#8e877d]" size={17} /><Input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search the catalog" className="h-10 rounded-full bg-white pl-10" aria-label="Search the catalog" /><Button type="submit" className="rounded-full bg-[#29261f] px-4">Search</Button></form></div><div className="mt-7 flex items-center justify-between gap-3"><button onClick={() => setFiltersOpen(open => !open)} className="inline-flex items-center gap-2 rounded-full border border-[#dcd2c2] bg-white px-4 py-2 text-sm font-bold lg:hidden"><SlidersHorizontal size={16} /> Filters</button><p className="text-sm text-[#777064]"><strong className="text-[#29261f]">{results.length}</strong> pieces to explore</p><select value={sort} onChange={event => setSort(event.target.value)} className="h-10 rounded-full border border-[#dcd2c2] bg-white px-4 text-sm font-semibold outline-none focus:ring-2 focus:ring-[#c9953a]" aria-label="Sort products"><option value="featured">Featured</option><option value="new">Newest</option><option value="rating">Top rated</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option></select></div><div className="mt-7 grid gap-8 lg:grid-cols-[220px_1fr]"><aside className={filtersOpen ? "filter-panel-open" : "filter-panel"}><div className="flex items-center justify-between"><div className="flex items-center gap-2"><Filter size={16} /><p className="font-extrabold">Refine</p></div><button className="text-xs font-bold text-[#a66c17]" onClick={clearFilters}>Clear</button></div><div className="mt-7"><p className="filter-label">Category</p><div className="mt-3 grid gap-3">{categories.map(category => <label key={category.slug} className="flex items-center gap-3 text-sm text-[#6f695e]"><Checkbox checked={selectedCategories.includes(category.slug)} onCheckedChange={() => toggleCategory(category.slug)} />{category.label}</label>)}</div></div><div className="mt-7"><p className="filter-label">Price range</p><div className="mt-3 grid grid-cols-2 gap-2"><Input value={minPrice} onChange={event => setMinPrice(event.target.value)} type="number" min="0" placeholder="Min" aria-label="Minimum price" /><Input value={maxPrice} onChange={event => setMaxPrice(event.target.value)} type="number" min="0" placeholder="Max" aria-label="Maximum price" /></div></div><div className="mt-7"><p className="filter-label">Quality</p><label className="mt-3 flex items-center gap-3 text-sm text-[#6f695e]"><Checkbox checked={ratingOnly} onCheckedChange={value => setRatingOnly(Boolean(value))} />Top rated only</label></div>{filtersOpen && <button className="mt-8 w-full rounded-full bg-[#29261f] px-4 py-3 text-sm font-bold text-white lg:hidden" onClick={() => setFiltersOpen(false)}>Show {results.length} results</button>}</aside><div>{results.length > 0 ? <div className="grid grid-cols-2 gap-x-4 gap-y-9 md:grid-cols-3">{results.map(product => <ProductCard key={product.id} product={product} />)}</div> : <div className="rounded-[26px] border border-dashed border-[#d9cfbf] bg-white px-6 py-16 text-center"><X className="mx-auto text-[#c9953a]" /><h2 className="mt-4 text-xl font-extrabold">No exact match yet.</h2><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#777064]">Try clearing a filter or searching for a broader category. There are plenty of good finds nearby.</p><button onClick={clearFilters} className="mt-6 rounded-full bg-[#29261f] px-5 py-3 text-sm font-bold text-white">Clear filters</button></div>}</div></div></div>;
}
