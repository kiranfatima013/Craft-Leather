import { motion } from "framer-motion";

export default function About() {
  return (
    <div className="pt-32 pb-24 min-h-screen bg-background">
      <div className="container-wide">
        
        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-primary/60 font-bold tracking-widest uppercase text-sm block mb-4">Our Heritage</span>
            <h1 className="font-serif text-5xl md:text-6xl font-bold mb-8 text-primary leading-tight">
              Crafting Legacy <br /> One Stitch at a Time
            </h1>
            <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
              <p>
                H&K Leather Craft was born from a simple desire: to create items that don't just last, but get better with time. In a world of fast fashion and disposable goods, we stand for permanence.
              </p>
              <p>
                Founded by two friends with a shared passion for traditional craftsmanship, our workshop is a place where slow manufacturing is celebrated. We don't rush. We don't cut corners. We simply make the best leather goods we possibly can.
              </p>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="absolute -inset-4 border-2 border-secondary/50 rounded-sm -z-10 translate-x-4 translate-y-4" />
            {/* Unsplash image: Leather craftsman working */}
            <img 
              src="https://images.unsplash.com/photo-1550505193-429631b1db38?q=80&w=2070&auto=format&fit=crop"
              alt="Craftsman working on leather" 
              className="w-full h-auto rounded-sm shadow-2xl"
            />
          </motion.div>
        </div>

        {/* Process Section */}
        <div className="max-w-4xl mx-auto text-center mb-24">
          <h2 className="font-serif text-4xl font-bold mb-16 text-primary">Our Process</h2>
          
          <div className="space-y-24">
            <div className="flex flex-col md:flex-row items-center gap-12 text-left">
              <div className="flex-1">
                <span className="text-6xl font-serif text-secondary/30 font-bold block mb-4">01</span>
                <h3 className="text-2xl font-bold mb-4">Sourcing</h3>
                <p className="text-muted-foreground">We use exclusively full-grain vegetable-tanned leather from the Consorzio Vera Pelle Italiana. This leather is tanned using natural tannins from tree bark, a process that takes months but yields a material of unmatched character.</p>
              </div>
              <div className="flex-1 h-64 bg-gray-100 rounded-sm overflow-hidden">
                <img 
                  src="https://pixabay.com/get/g583308f3c5ea9aaa0dfc1d863d93fd14e73ccfc06671d229cda98c10fb1db1488c0ed48ab34b6d8c4e4fcb507234340051927d5d2aeb5589ba64f78f717d268d_1280.jpg" 
                  alt="Leather hides"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="flex flex-col md:flex-row-reverse items-center gap-12 text-left">
              <div className="flex-1">
                <span className="text-6xl font-serif text-secondary/30 font-bold block mb-4">02</span>
                <h3 className="text-2xl font-bold mb-4">Cutting & Stitching</h3>
                <p className="text-muted-foreground">Every piece is cut by hand to avoid imperfections in the hide. We use the traditional saddle stitch technique with waxed linen thread—stronger and more durable than any machine lockstitch.</p>
              </div>
              <div className="flex-1 h-64 bg-gray-100 rounded-sm overflow-hidden">
                 <img 
                  src="https://pixabay.com/get/g583308f3c5ea9aaa0dfc1d863d93fd14e73ccfc06671d229cda98c10fb1db1488c0ed48ab34b6d8c4e4fcb507234340051927d5d2aeb5589ba64f78f717d268d_1280.jpg" 
                  alt="Stitching leather"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-12 text-left">
              <div className="flex-1">
                <span className="text-6xl font-serif text-secondary/30 font-bold block mb-4">03</span>
                <h3 className="text-2xl font-bold mb-4">Finishing</h3>
                <p className="text-muted-foreground">Edges are burnished to a glass-like finish using beeswax and canvas. The final product is conditioned with natural oils, ready to begin its journey with you.</p>
              </div>
              <div className="flex-1 h-64 bg-gray-100 rounded-sm overflow-hidden">
                 <img 
                  src="https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?q=80&w=1000&auto=format&fit=crop" 
                  alt="Finished wallet"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
