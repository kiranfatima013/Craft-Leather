import { useState } from "react";
import { useProducts } from "@/hooks/use-products";
import { ProductCard } from "@/components/ProductCard";
import { motion } from "framer-motion";

export default function Catalog() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const { data: products, isLoading } = useProducts();

  const categories = [
    { id: "all", label: "All Products" },
    { id: "jackets", label: "Jackets" },
    { id: "wallets", label: "Wallets" },
    { id: "accessories", label: "Accessories" },
  ];

  const filteredProducts = activeCategory === "all" 
    ? products 
    : products?.filter(p => p.category === activeCategory);

  return (
    <div className="pt-32 pb-24 min-h-screen bg-background">
      <div className="container-wide">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="font-serif text-5xl md:text-6xl font-bold mb-6 text-primary">Catalog</h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Explore our collection of handcrafted leather goods. Each piece is made to order with meticulous attention to detail.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-6 py-2 rounded-full text-sm font-bold tracking-wide transition-all ${
                activeCategory === cat.id
                  ? "bg-primary text-white shadow-lg scale-105"
                  : "bg-white text-muted-foreground hover:bg-gray-50 border border-border"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="h-[450px] bg-gray-100 animate-pulse rounded-sm" />
            ))}
          </div>
        ) : filteredProducts?.length === 0 ? (
          <div className="text-center py-24">
            <h3 className="text-2xl font-serif text-primary mb-2">No products found</h3>
            <p className="text-muted-foreground">Try selecting a different category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts?.map((product, idx) => (
              <ProductCard key={product.id} product={product} index={idx} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
