import { useAuth } from "@/hooks/use-auth";
import { useProducts, useProductMutations } from "@/hooks/use-products";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit, Trash, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertProductSchema } from "@shared/schema";
import { z } from "zod";

export default function Admin() {
  const { user, isLoading: authLoading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!authLoading && (!user || user.role !== "admin")) {
      setLocation("/");
    }
  }, [user, authLoading, setLocation]);

  if (authLoading || !user) return null;

  return (
    <div className="container py-12 px-4 md:px-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-serif text-3xl font-bold">Product Management</h1>
        <ProductDialog />
      </div>
      <ProductTable />
    </div>
  );
}

function ProductTable() {
  const { data: products, isLoading } = useProducts();
  const { deleteProduct } = useProductMutations();

  if (isLoading) return <Loader2 className="h-8 w-8 animate-spin mx-auto" />;

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products?.map((product) => (
            <TableRow key={product.id}>
              <TableCell>
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="h-12 w-12 rounded object-cover"
                />
              </TableCell>
              <TableCell className="font-medium">{product.name}</TableCell>
              <TableCell className="capitalize">{product.category}</TableCell>
              <TableCell>${Number(product.price).toFixed(2)}</TableCell>
              <TableCell className="text-right space-x-2">
                <ProductDialog product={product} />
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive"
                  onClick={() => {
                    if (confirm("Are you sure?")) deleteProduct.mutate(product.id);
                  }}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

// Reuse Zod schema but force price to number for API, handle string in form
const formSchema = insertProductSchema.extend({
  price: z.coerce.number().min(0.01),
});

function ProductDialog({ product }: { product?: any }) {
  const [open, setOpen] = useState(false);
  const { createProduct, updateProduct } = useProductMutations();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: product || {
      name: "",
      description: "",
      price: "",
      category: "accessories",
      imageUrl: "",
    },
  });

  const onSubmit = async (data: any) => {
    try {
      if (product) {
        await updateProduct.mutateAsync({ id: product.id, ...data });
      } else {
        await createProduct.mutateAsync(data);
      }
      setOpen(false);
      form.reset();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {product ? (
          <Button variant="ghost" size="icon">
            <Edit className="h-4 w-4" />
          </Button>
        ) : (
          <Button>
            <Plus className="h-4 w-4 mr-2" /> Add Product
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{product ? "Edit Product" : "New Product"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input {...form.register("name")} />
            {form.formState.errors.name && (
              <p className="text-sm text-destructive">{String(form.formState.errors.name.message)}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea {...form.register("description")} />
            {form.formState.errors.description && (
              <p className="text-sm text-destructive">{String(form.formState.errors.description.message)}</p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Price</Label>
              <Input type="number" step="0.01" {...form.register("price")} />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <select
                {...form.register("category")}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="wallets">Wallets</option>
                <option value="bags">Bags</option>
                <option value="jackets">Jackets</option>
                <option value="accessories">Accessories</option>
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Image URL</Label>
            <Input {...form.register("imageUrl")} placeholder="https://..." />
          </div>
          <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Saving..." : "Save Product"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
