import { useProducts } from "@/hooks/use-products";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Loader2 } from "lucide-react";

const CATEGORIES = [
  { id: "all", label: "All Products" },
  { id: "wallets", label: "Wallets" },
  { id: "bags", label: "Bags & Totes" },
  { id: "accessories", label: "Accessories" },
  { id: "jackets", label: "Jackets" },
];

export default function Shop() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { data: products, isLoading } = useProducts(
    selectedCategory === "all" ? undefined : selectedCategory
  );

  return (
    <div className="container px-4 md:px-6 py-12">
      <div className="flex flex-col md:flex-row items-baseline justify-between mb-12 gap-6">
        <div>
          <h1 className="font-serif text-4xl font-bold mb-4">Shop Collection</h1>
          <p className="text-muted-foreground max-w-xl">
            Explore our range of handcrafted leather goods. Each piece is made to order and built to last.
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <Button
              key={cat.id}
              variant={selectedCategory === cat.id ? "default" : "outline"}
              onClick={() => setSelectedCategory(cat.id)}
              className="rounded-full"
            >
              {cat.label}
            </Button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      ) : products?.length === 0 ? (
        <div className="text-center py-20 border rounded-lg bg-muted/20">
          <p className="text-xl text-muted-foreground">No products found in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products?.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
