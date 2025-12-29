import { useProducts } from "@/hooks/use-products";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, Star } from "lucide-react";

export default function Home() {
  const { data: products, isLoading } = useProducts();
  const featuredProducts = products?.slice(0, 3);

  return (
    <div className="flex flex-col gap-16 pb-16">
      {/* Hero Section */}
      <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden bg-stone-900 text-white">
        {/* Abstract/Dark overlay background */}
        <div className="absolute inset-0 z-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1473188588951-666fce8e7e68?q=80&w=2000')] bg-cover bg-center" />
        
        {/* HTML Comment for Image Replacement */}
        {/* Leather craft workshop or texture background */}
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-0" />

        <div className="container relative z-10 px-4 text-center">
          <h1 className="font-serif text-5xl md:text-7xl font-bold tracking-tight mb-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
            Timeless Leather Goods
          </h1>
          <p className="text-lg md:text-xl text-stone-200 max-w-2xl mx-auto mb-10 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
            Handcrafted with precision and passion. Designed to age beautifully with you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
            <Link href="/shop">
              <Button size="lg" className="bg-white text-stone-900 hover:bg-stone-100 min-w-[160px]">
                Shop Collection
              </Button>
            </Link>
            <Link href="/about">
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10 min-w-[160px]">
                Our Story
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="container px-4 md:px-6">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-serif text-3xl font-bold">Featured Products</h2>
          <Link href="/shop">
            <Button variant="ghost" className="gap-2">
              View All <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-[400px] rounded-lg bg-muted animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts?.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Values Section */}
      <section className="bg-stone-100 py-20">
        <div className="container px-4 md:px-6">
          <div className="grid md:grid-cols-3 gap-12 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Star className="h-6 w-6" />
              </div>
              <h3 className="font-serif text-xl font-bold">Premium Quality</h3>
              <p className="text-muted-foreground">
                We source only the finest full-grain leather that develops a rich patina over time.
              </p>
            </div>
            <div className="flex flex-col items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Package className="h-6 w-6" /> {/* Imported lucid-react Package icon in Layout, assume here too */}
              </div>
              <h3 className="font-serif text-xl font-bold">Handcrafted</h3>
              <p className="text-muted-foreground">
                Every stitch is placed by hand, ensuring durability that machines cannot match.
              </p>
            </div>
            <div className="flex flex-col items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <ArrowRight className="h-6 w-6 rotate-[-45deg]" />
              </div>
              <h3 className="font-serif text-xl font-bold">Lifetime Warranty</h3>
              <p className="text-muted-foreground">
                We stand behind our work. If it breaks due to craftsmanship, we fix it.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
