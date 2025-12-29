import { Separator } from "@/components/ui/separator";

export default function About() {
  return (
    <div className="container max-w-4xl py-12 px-4 md:px-6">
      <div className="text-center mb-16 space-y-4">
        <h1 className="font-serif text-5xl font-bold">Our Craft</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Dedicated to preserving the art of traditional leatherworking in a modern world.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
        <div className="aspect-square rounded-lg bg-muted overflow-hidden">
           {/* Artisan working */}
           <img 
            src="https://pixabay.com/get/gd2349275774b819078324a655a35bd8d85e717b0fac9a809add99bbef49438a60d519fec3eeda3367fea3ba72b0aee909bb362cd41de622e570a303ad612453c_1280.jpg" 
            alt="Artisan working on leather"
            className="w-full h-full object-cover"
           />
        </div>
        <div className="space-y-6">
          <h2 className="font-serif text-3xl font-bold">The H&K Story</h2>
          <p className="text-muted-foreground leading-relaxed">
            Founded in 2020, H&K Leather Craft began with a simple mission: to create products that stand the test of time. 
            In an era of fast fashion and disposable goods, we choose to slow down.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Every wallet, bag, and belt is cut, stitched, and finished by hand in our workshop. We use only full-grain 
            vegetable-tanned leather sourced from ethical tanneries. This material doesn't just endure wear—it improves with it, 
            developing a unique patina that tells your story.
          </p>
        </div>
      </div>

      <Separator className="my-16" />

      <div className="space-y-8 text-center">
        <h2 className="font-serif text-3xl font-bold">Our Philosophy</h2>
        <div className="grid md:grid-cols-3 gap-8 text-left">
          <div className="p-6 bg-stone-50 rounded-lg">
            <h3 className="font-serif text-xl font-bold mb-2">Materials First</h3>
            <p className="text-sm text-muted-foreground">
              We never compromise on materials. Full-grain leather, solid brass hardware, and waxed linen thread.
            </p>
          </div>
          <div className="p-6 bg-stone-50 rounded-lg">
            <h3 className="font-serif text-xl font-bold mb-2">Slow Fashion</h3>
            <p className="text-sm text-muted-foreground">
              We don't follow trends. We design classics that look as good in ten years as they do today.
            </p>
          </div>
          <div className="p-6 bg-stone-50 rounded-lg">
            <h3 className="font-serif text-xl font-bold mb-2">Transparency</h3>
            <p className="text-sm text-muted-foreground">
              We believe you should know where your goods come from and who made them.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
