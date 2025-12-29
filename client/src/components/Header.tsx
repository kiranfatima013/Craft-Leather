import { Link, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { Menu, X, Hammer } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export function Header() {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/catalog", label: "Catalog" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  const isActive = (path: string) => location === path;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/95 backdrop-blur-md shadow-sm py-4" : "bg-transparent py-6"
      }`}
    >
      <div className="container-wide flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-2">
          <div className="relative w-10 h-10 bg-primary text-primary-foreground flex items-center justify-center rounded-sm overflow-hidden transition-transform duration-300 group-hover:scale-105">
             <Hammer className="w-5 h-5" />
          </div>
          <span className={`font-serif text-xl font-bold tracking-tight ${isScrolled ? 'text-foreground' : 'text-primary'}`}>
            H&K Leather
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.href} 
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive(link.href) ? "text-primary font-bold" : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-4">
          {user?.role === "admin" && (
            <>
              <Link href="/admin" className="text-sm font-medium text-primary hover:underline">
                Dashboard
              </Link>
              <button 
                onClick={() => logout()}
                className="text-sm font-medium text-muted-foreground hover:text-destructive transition-colors"
              >
                Sign out
              </button>
            </>
          )}
          {!user && location !== "/admin" && (
            <Link href="/catalog" className="btn-primary">
              Inquire Now
            </Link>
          )}
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden p-2 text-foreground"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-background border-t p-4 flex flex-col gap-4 shadow-lg animate-in slide-in-from-top-2">
          {navLinks.map((link) => (
            <Link 
              key={link.href} 
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`text-lg font-medium py-2 ${
                isActive(link.href) ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
          {user?.role === "admin" && (
            <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium py-2 text-primary">
              Admin Dashboard
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
