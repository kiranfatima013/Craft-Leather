import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";
import { Mail, MapPin, Phone, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function Contact() {
  const [location] = useLocation();
  const { toast } = useToast();
  
  // Extract query param for subject
  const searchParams = new URLSearchParams(window.location.search);
  const initialSubject = searchParams.get("subject") ? `Inquiry about: ${searchParams.get("subject")}` : "";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: initialSubject ? `${initialSubject}\n\nI'm interested in this product. Can you tell me more about availability and customization options?` : ""
  });

  const mutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const res = await fetch(api.contact.submit.path, {
        method: api.contact.submit.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to send message");
      return api.contact.submit.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      toast({ title: "Message Sent", description: "We'll get back to you shortly." });
      setFormData({ name: "", email: "", message: "" });
    },
    onError: () => {
      toast({ title: "Error", description: "Something went wrong. Please try again.", variant: "destructive" });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  return (
    <div className="pt-32 pb-24 min-h-screen bg-background">
      <div className="container-wide">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <h1 className="font-serif text-5xl font-bold mb-6 text-primary">Get in Touch</h1>
          <p className="text-muted-foreground text-lg">
            Have a question about our products or interested in a custom commission? We'd love to hear from you.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
          {/* Contact Info */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-12"
          >
            <div>
              <h3 className="text-2xl font-serif font-bold mb-6">Visit Our Workshop</h3>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                While we are primarily an online studio, we welcome visitors by appointment to discuss custom projects and view our leather selection in person.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white shadow-sm rounded-sm text-primary">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground">Address</h4>
                    <p className="text-muted-foreground">123 Craftsman Lane<br/>Leather District, NY 10012</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white shadow-sm rounded-sm text-primary">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground">Email</h4>
                    <p className="text-muted-foreground">hello@hkleather.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white shadow-sm rounded-sm text-primary">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground">Phone</h4>
                    <p className="text-muted-foreground">+1 (555) 123-4567</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 bg-primary text-primary-foreground rounded-sm">
              <h4 className="font-serif text-xl font-bold mb-2">Studio Hours</h4>
              <ul className="space-y-2 opacity-90">
                <li className="flex justify-between"><span>Mon - Fri</span> <span>9:00 AM - 6:00 PM</span></li>
                <li className="flex justify-between"><span>Saturday</span> <span>10:00 AM - 4:00 PM</span></li>
                <li className="flex justify-between"><span>Sunday</span> <span>Closed</span></li>
              </ul>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white p-8 md:p-10 rounded-sm shadow-xl border border-border/50"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-bold text-foreground mb-2">Name</label>
                <input
                  id="name"
                  type="text"
                  required
                  className="w-full px-4 py-3 rounded-sm bg-gray-50 border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Your Name"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-bold text-foreground mb-2">Email</label>
                <input
                  id="email"
                  type="email"
                  required
                  className="w-full px-4 py-3 rounded-sm bg-gray-50 border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-bold text-foreground mb-2">Message</label>
                <textarea
                  id="message"
                  required
                  rows={6}
                  className="w-full px-4 py-3 rounded-sm bg-gray-50 border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="How can we help you?"
                />
              </div>

              <button
                type="submit"
                disabled={mutation.isPending}
                className="w-full btn-primary py-4 text-base"
              >
                {mutation.isPending ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="animate-spin w-4 h-4" /> Sending...
                  </span>
                ) : (
                  "Send Message"
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
