import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct } from "@/hooks/use-products";
import { Loader2, Plus, Edit, Trash2, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { type Product, type InsertProduct } from "@shared/schema";

// Login Component (Internal to Admin page)
function AdminLogin() {
  const { login, isLoggingIn } = useAuth();
  const [creds, setCreds] = useState({ username: "", password: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(creds);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-sm shadow-xl border border-border">
        <h1 className="text-2xl font-serif font-bold text-center mb-8">Admin Access</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Username</label>
            <input 
              type="text" 
              className="w-full p-3 border rounded-sm"
              value={creds.username}
              onChange={e => setCreds({...creds, username: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <input 
              type="password" 
              className="w-full p-3 border rounded-sm"
              value={creds.password}
              onChange={e => setCreds({...creds, password: e.target.value})}
            />
          </div>
          <button type="submit" className="w-full btn-primary" disabled={isLoggingIn}>
            {isLoggingIn ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

// Product Form Component
function ProductForm({ 
  product, 
  onClose 
}: { 
  product?: Product, 
  onClose: () => void 
}) {
  const create = useCreateProduct();
  const update = useUpdateProduct();
  
  const [formData, setFormData] = useState<InsertProduct>({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price ? Number(product.price).toFixed(2) : "0.00",
    category: product?.category || "accessories",
    imageUrl: product?.imageUrl || "",
  });

  const isEditing = !!product;
  const isPending = create.isPending || update.isPending;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing && product) {
      update.mutate({ id: product.id, ...formData }, { onSuccess: onClose });
    } else {
      create.mutate(formData, { onSuccess: onClose });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Name</label>
        <input 
          className="w-full p-2 border rounded-sm"
          value={formData.name}
          onChange={e => setFormData({...formData, name: e.target.value})}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea 
          className="w-full p-2 border rounded-sm"
          value={formData.description}
          onChange={e => setFormData({...formData, description: e.target.value})}
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Price</label>
          <input 
            type="number" step="0.01"
            className="w-full p-2 border rounded-sm"
            value={formData.price}
            onChange={e => setFormData({...formData, price: e.target.value})}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <select 
            className="w-full p-2 border rounded-sm bg-white"
            value={formData.category}
            onChange={e => setFormData({...formData, category: e.target.value})}
          >
            <option value="jackets">Jackets</option>
            <option value="wallets">Wallets</option>
            <option value="accessories">Accessories</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Image URL</label>
        <input 
          className="w-full p-2 border rounded-sm"
          value={formData.imageUrl}
          onChange={e => setFormData({...formData, imageUrl: e.target.value})}
          required
          placeholder="https://..."
        />
      </div>
      <div className="flex justify-end gap-3 pt-4">
        <button type="button" onClick={onClose} className="btn-outline py-2">Cancel</button>
        <button type="submit" className="btn-primary py-2" disabled={isPending}>
          {isPending ? "Saving..." : (isEditing ? "Update Product" : "Create Product")}
        </button>
      </div>
    </form>
  );
}

export default function Admin() {
  const { user, isLoading: authLoading } = useAuth();
  const { data: products, isLoading: productsLoading } = useProducts();
  const deleteProduct = useDeleteProduct();
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  if (authLoading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;
  if (!user || user.role !== "admin") return <AdminLogin />;

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this product?")) {
      deleteProduct.mutate(id);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsDialogOpen(true);
  };

  const handleCreate = () => {
    setEditingProduct(null);
    setIsDialogOpen(true);
  };

  return (
    <div className="pt-32 pb-24 min-h-screen bg-gray-50">
      <div className="container-wide">
        <div className="flex justify-between items-center mb-12">
          <h1 className="font-serif text-3xl font-bold text-primary">Product Management</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <button onClick={handleCreate} className="btn-primary flex items-center gap-2">
                <Plus className="w-4 h-4" /> Add Product
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-lg bg-white p-6 rounded-sm">
              <DialogHeader>
                <DialogTitle className="font-serif text-xl mb-4">
                  {editingProduct ? "Edit Product" : "New Product"}
                </DialogTitle>
              </DialogHeader>
              <ProductForm 
                product={editingProduct || undefined} 
                onClose={() => setIsDialogOpen(false)} 
              />
            </DialogContent>
          </Dialog>
        </div>

        {productsLoading ? (
          <div className="text-center py-12"><Loader2 className="animate-spin mx-auto" /></div>
        ) : (
          <div className="bg-white rounded-sm shadow-sm border overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="p-4 font-medium text-sm text-muted-foreground uppercase tracking-wider w-20">Image</th>
                  <th className="p-4 font-medium text-sm text-muted-foreground uppercase tracking-wider">Name</th>
                  <th className="p-4 font-medium text-sm text-muted-foreground uppercase tracking-wider">Category</th>
                  <th className="p-4 font-medium text-sm text-muted-foreground uppercase tracking-wider">Price</th>
                  <th className="p-4 font-medium text-sm text-muted-foreground uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {products?.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50/50">
                    <td className="p-4">
                      <img src={product.imageUrl} alt="" className="w-12 h-12 object-cover rounded-sm bg-gray-100" />
                    </td>
                    <td className="p-4 font-medium">{product.name}</td>
                    <td className="p-4">
                      <span className="inline-block px-2 py-1 rounded-full bg-secondary/20 text-xs font-bold uppercase text-primary">
                        {product.category}
                      </span>
                    </td>
                    <td className="p-4 font-serif">${Number(product.price).toFixed(2)}</td>
                    <td className="p-4 text-right space-x-2">
                      <button 
                        onClick={() => handleEdit(product)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(product.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {products?.length === 0 && (
              <div className="p-12 text-center text-muted-foreground">No products found. Add one to get started.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
