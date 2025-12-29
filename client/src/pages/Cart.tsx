import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Loader2 } from "lucide-react";
import { Link } from "wouter";
import { Separator } from "@/components/ui/separator";

export default function Cart() {
  const { cartItems, updateQuantity, removeItem, checkout, total, isLoading } = useCart();

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container max-w-2xl py-24 text-center">
        <div className="bg-muted/30 rounded-full h-24 w-24 flex items-center justify-center mx-auto mb-6">
          <ShoppingBag className="h-10 w-10 text-muted-foreground" />
        </div>
        <h1 className="font-serif text-3xl font-bold mb-4">Your cart is empty</h1>
        <p className="text-muted-foreground mb-8">
          Looks like you haven't added anything to your cart yet.
        </p>
        <Link href="/shop">
          <Button size="lg">Start Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl py-12 px-4 md:px-6">
      <h1 className="font-serif text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid lg:grid-cols-3 gap-12">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-6">
          {cartItems.map((item) => (
            <div key={item.id} className="flex gap-4 sm:gap-6 p-4 rounded-lg border bg-card">
              <div className="h-24 w-24 sm:h-32 sm:w-32 flex-shrink-0 overflow-hidden rounded-md border">
                <img
                  src={item.product?.imageUrl}
                  alt={item.product?.name}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="flex flex-1 flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-serif text-lg font-bold">{item.product?.name}</h3>
                    <p className="text-sm text-muted-foreground">{item.product?.category}</p>
                  </div>
                  <p className="font-bold text-lg">
                    ${(Number(item.product?.price) * item.quantity).toFixed(2)}
                  </p>
                </div>

                <div className="flex justify-between items-end mt-4">
                  <div className="flex items-center gap-2 border rounded-md">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-none"
                      disabled={item.quantity <= 1}
                      onClick={() => updateQuantity.mutate({ id: item.id, quantity: item.quantity - 1 })}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-none"
                      onClick={() => updateQuantity.mutate({ id: item.id, quantity: item.quantity + 1 })}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-destructive"
                    onClick={() => removeItem.mutate(item.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" /> Remove
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="rounded-lg border bg-stone-50 p-6 sticky top-24">
            <h2 className="font-serif text-xl font-bold mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span>Free</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <Button 
              className="w-full" 
              size="lg"
              disabled={checkout.isPending}
              onClick={() => checkout.mutate()}
            >
              {checkout.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <span className="flex items-center">
                  Checkout <ArrowRight className="ml-2 h-4 w-4" />
                </span>
              )}
            </Button>

            <p className="mt-4 text-xs text-center text-muted-foreground">
              Secure checkout. Lifetime warranty included on all items.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
