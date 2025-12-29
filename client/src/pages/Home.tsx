import { Link } from "wouter";
import { ArrowRight, ShieldCheck, PenTool, Gem } from "lucide-react";
import { useProducts } from "@/hooks/use-products";
import { ProductCard } from "@/components/ProductCard";
import { motion } from "framer-motion";

export default function Home() {
  const { data: products, isLoading } = useProducts();
  const featuredProducts = products?.slice(0, 3) || [];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden bg-primary/90 text-white">
        {/* Unsplash image of leather crafting workshop */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1473187983305-f615310e7daa?q=80&w=2070&auto=format&fit=crop"
            alt="Leather Workshop Background" 
            className="w-full h-full object-cover opacity-40 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/50 to-transparent" />
        </div>

        <div className="relative z-10 container-wide text-center">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-block text-sm md:text-base font-bold tracking-[0.2em] text-secondary mb-4 uppercase"
          >
            Est. 2024
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold mb-8 text-white leading-tight"
          >
            Timeless Leather <br /> 
            <span className="text-secondary">Masterpieces</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="max-w-2xl mx-auto text-lg md:text-xl text-white/80 mb-10 font-light leading-relaxed"
          >
            Handcrafted with precision, designed for longevity. Discover our collection of premium leather goods that tell your story.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/catalog" className="btn-primary bg-white text-primary hover:bg-white/90 border-transparent shadow-xl">
              View Collection
            </Link>
            <Link href="/about" className="btn-outline border-white text-white hover:bg-white hover:text-primary">
              Our Story
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-background">
        <div className="container-wide grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { 
              icon: PenTool, 
              title: "Handcrafted", 
              desc: "Each stitch is placed by hand, ensuring superior durability and finish." 
            },
            { 
              icon: Gem, 
              title: "Premium Materials", 
              desc: "We source only full-grain vegetable-tanned leather from Italian tanneries." 
            },
            { 
              icon: ShieldCheck, 
              title: "Lifetime Guarantee", 
              desc: "We stand behind our work. Any defects in craftsmanship are covered forever." 
            }
          ].map((feature, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="text-center p-8 bg-white rounded-lg shadow-sm border border-border/50 hover:shadow-md transition-shadow"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/5 text-primary mb-6">
                <feature.icon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 bg-white">
        <div className="container-wide">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div>
              <span className="text-primary/60 font-bold tracking-widest uppercase text-sm">Curated Selection</span>
              <h2 className="text-4xl md:text-5xl mt-2">Featured Goods</h2>
            </div>
            <Link href="/catalog" className="group flex items-center gap-2 text-primary font-bold hover:text-primary/80 transition-colors">
              Browse Full Catalog 
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-[500px] bg-gray-100 animate-pulse rounded-sm" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredProducts.map((product, idx) => (
                <ProductCard key={product.id} product={product} index={idx} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative overflow-hidden">
        {/* Abstract leather texture background */}
        <div className="absolute inset-0 bg-primary">
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/leather.png')] mix-blend-overlay" />
        </div>
        
        <div className="container-wide relative z-10 text-center">
          <h2 className="font-serif text-4xl md:text-6xl font-bold text-white mb-6">
            Custom Commissions
          </h2>
          <p className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Looking for something unique? We accept a limited number of bespoke commissions each month.
            Let's create something special together.
          </p>
          <Link href="/contact" className="btn-primary bg-secondary text-primary hover:bg-white hover:scale-105 transition-all shadow-xl">
            Start a Conversation
          </Link>
        </div>
      </section>
    </div>
  );
}
