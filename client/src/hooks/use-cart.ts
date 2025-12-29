import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "./use-auth";

export function useCart() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: cartItems = [], isLoading } = useQuery({
    queryKey: [api.cart.get.path],
    queryFn: async () => {
      const res = await fetch(api.cart.get.path, { credentials: "include" });
      if (!res.ok) {
        if (res.status === 401) return []; // Guest user empty cart
        throw new Error("Failed to fetch cart");
      }
      return api.cart.get.responses[200].parse(await res.json());
    },
    enabled: !!user, // Only fetch if logged in
  });

  const addToCart = useMutation({
    mutationFn: async ({ productId, quantity }: { productId: number; quantity: number }) => {
      const res = await fetch(api.cart.addItem.path, {
        method: api.cart.addItem.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity }),
        credentials: "include",
      });
      
      if (res.status === 401) throw new Error("Please login to shop");
      if (!res.ok) throw new Error("Failed to add to cart");
      
      return api.cart.addItem.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.cart.get.path] });
      toast({ title: "Added to cart", description: "Item added successfully" });
    },
    onError: (err: Error) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const updateQuantity = useMutation({
    mutationFn: async ({ id, quantity }: { id: number; quantity: number }) => {
      const url = buildUrl(api.cart.updateItem.path, { id });
      const res = await fetch(url, {
        method: api.cart.updateItem.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity }),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to update cart");
      return api.cart.updateItem.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.cart.get.path] });
    },
  });

  const removeItem = useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.cart.removeItem.path, { id });
      const res = await fetch(url, { 
        method: api.cart.removeItem.method,
        credentials: "include"
      });
      if (!res.ok) throw new Error("Failed to remove item");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.cart.get.path] });
      toast({ title: "Removed", description: "Item removed from cart" });
    },
  });

  const checkout = useMutation({
    mutationFn: async () => {
      const res = await fetch(api.orders.create.path, {
        method: api.orders.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Checkout failed");
      return api.orders.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.cart.get.path] });
      queryClient.invalidateQueries({ queryKey: [api.orders.list.path] });
      toast({ title: "Order placed!", description: "Thank you for your purchase." });
    },
    onError: (err: Error) => {
      toast({ title: "Checkout Error", description: err.message, variant: "destructive" });
    },
  });

  // Calculate totals client-side for immediate feedback
  const total = cartItems.reduce((sum, item) => {
    return sum + (Number(item.product?.price || 0) * item.quantity);
  }, 0);

  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return {
    cartItems,
    isLoading,
    addToCart,
    updateQuantity,
    removeItem,
    checkout,
    total,
    itemCount
  };
}
