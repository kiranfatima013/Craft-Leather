import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { type Product } from "@shared/schema";
import { motion } from "framer-motion";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative bg-white rounded-sm overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-border/50"
    >
      <div className="aspect-[4/5] overflow-hidden bg-secondary/10 relative">
        <img 
          src={product.imageUrl} 
          alt={product.name}
          className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <p className="text-xs font-bold tracking-wider text-primary/60 uppercase">
            {product.category}
          </p>
          <p className="font-serif font-medium text-lg text-primary">
            ${Number(product.price).toFixed(2)}
          </p>
        </div>
        
        <h3 className="font-serif text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        
        <p className="text-muted-foreground text-sm line-clamp-2 mb-6">
          {product.description}
        </p>

        <Link 
          href={`/contact?subject=${encodeURIComponent(product.name)}`}
          className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-primary/80 transition-colors uppercase tracking-wide group/btn"
        >
          Inquire Now
          <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
        </Link>
      </div>
    </motion.div>
  );
}
