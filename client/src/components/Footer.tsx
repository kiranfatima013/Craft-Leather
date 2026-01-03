import { Hammer, Instagram, Facebook, Mail } from "lucide-react";
import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground pt-16 pb-8">
      <div className="container-wide grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-2 mb-6">
            <Hammer className="w-6 h-6" />
            <span className="font-serif text-2xl font-bold">H&K Leather Craft</span>
          </div>
          <p className="text-primary-foreground/80 max-w-sm mb-6 leading-relaxed">
            Handcrafted leather goods made with passion, precision, and the finest materials. 
            Built to last a lifetime and age beautifully with you.
          </p>
          <div className="flex gap-4">
            <a href="#" className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="#" className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
              <Facebook className="w-5 h-5" />
            </a>
            <a href="#" className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
              <Mail className="w-5 h-5" />
            </a>
          </div>
        </div>

        <div>
          <h3 className="font-serif text-lg font-semibold mb-6 text-white">Explore</h3>
          <ul className="space-y-3">
            <li><Link href="/" className="text-primary-foreground/70 hover:text-white transition-colors">Home</Link></li>
            <li><Link href="/catalog" className="text-primary-foreground/70 hover:text-white transition-colors">Catalog</Link></li>
            <li><Link href="/about" className="text-primary-foreground/70 hover:text-white transition-colors">Our Story</Link></li>
            <li><Link href="/contact" className="text-primary-foreground/70 hover:text-white transition-colors">Contact Us</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-serif text-lg font-semibold mb-6 text-white">Contact</h3>
          <address className="not-italic text-primary-foreground/70 space-y-3">
            <p>Karachi Garden East</p>
            <p className="pt-2">H&K@gmail.com</p>
            <p>03061234567</p>
          </address>
        </div>
      </div>

      <div className="container-wide pt-8 border-t border-white/10 text-center text-sm text-primary-foreground/50">
        <p>&copy; {new Date().getFullYear()} H&K Leather Craft. All rights reserved.</p>
      </div>
    </footer>
  );
}
