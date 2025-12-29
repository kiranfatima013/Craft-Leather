import { Link } from "wouter";
import { AlertTriangle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background text-center p-4">
      <div className="p-6 bg-white rounded-full shadow-sm mb-6">
        <AlertTriangle className="h-12 w-12 text-secondary" />
      </div>
      <h1 className="font-serif text-4xl font-bold text-primary mb-4">Page Not Found</h1>
      <p className="text-muted-foreground max-w-md mb-8">
        We couldn't find the page you were looking for. It might have been moved or doesn't exist.
      </p>
      <Link href="/" className="btn-primary">
        Return Home
      </Link>
    </div>
  );
}
