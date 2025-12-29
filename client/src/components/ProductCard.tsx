import { type Product } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const { isPending } = addToCart;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart.mutate({ productId: product.id, quantity: 1 });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group relative flex flex-col overflow-hidden rounded-lg border bg-card transition-shadow hover:shadow-lg"
    >
      <Link href={`/shop/${product.id}`} className="block overflow-hidden bg-muted aspect-[4/5]">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
        />
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-lg font-bold text-foreground font-serif">
          <Link href={`/shop/${product.id}`}>{product.name}</Link>
        </h3>
        <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{product.description}</p>
        <div className="mt-4 flex flex-1 items-end justify-between gap-4">
          <p className="text-lg font-medium text-primary">${Number(product.price).toFixed(2)}</p>
          <Button 
            onClick={handleAddToCart} 
            disabled={isPending}
            size="sm"
            className="w-full sm:w-auto"
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Add to Cart"
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
