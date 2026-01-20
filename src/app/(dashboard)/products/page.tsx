'use client';

import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  Eye,
  ShoppingBag,
  ExternalLink,
  ChevronRight,
  Filter,
  Star
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<any>({
    id: undefined,
    name: '',
    category: '',
    description: '',
    imageUrl: '',
    affiliateLink: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSave = async () => {
    try {
      const isEditing = !!currentProduct.id;
      const url = isEditing ? `/api/products/${currentProduct.id}` : '/api/products';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentProduct)
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.details) {
            // Transform Zod errors array into object map
            const newErrors: Record<string, string> = {};
            data.details.forEach((err: any) => {
                const path = err.path[0];
                newErrors[path] = err.message;
            });
            setErrors(newErrors);
            return; // Stop execution
        }
        throw new Error(data.error || 'Failed to save');
      }

      // Success path
      setIsDialogOpen(false);
      fetchProducts();
      setCurrentProduct({ id: undefined, name: '', category: '', description: '', imageUrl: '', affiliateLink: '' });
      setErrors({}); // Clear errors
      
    } catch (error) {
      console.error('Failed to save product:', error);
      // Optional: Add a general error toast here if needed
    }
  };

  const handleEdit = (product: any) => {
    setCurrentProduct({
        id: product.id,
        name: product.name,
        category: product.category,
        description: product.description || '',
        imageUrl: product.imageUrl || '',
        affiliateLink: product.affiliateLink || ''
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
        if (res.ok) fetchProducts();
      } catch (error) {
        console.error('Failed to delete product:', error);
      }
    }
  };

  const handleToggleFeatured = async (id: string) => {
    try {
      const res = await fetch(`/api/products/${id}/feature`, { method: 'PATCH' });
      if (res.ok) fetchProducts();
    } catch (error) {
      console.error('Failed to toggle featured product:', error);
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Affiliate Products</h1>
          <p className="text-slate-500 mt-1 font-medium italic">Manage your monetization engine.</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
           setIsDialogOpen(open);
           if (!open) {
             setCurrentProduct({ id: undefined, name: '', category: '', description: '', imageUrl: '', affiliateLink: '' });
           }
        }}>
          <DialogTrigger asChild>
            <Button className="bg-lime-700 text-white font-bold hover:bg-lime-800 shadow-lg gap-2 h-12 px-6 rounded-xl">
              <Plus size={20} strokeWidth={3} />
              Add New Product
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white border-slate-200 text-slate-900 sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black uppercase tracking-tight">
                {currentProduct.id ? 'Edit Product' : 'Create Product'}
              </DialogTitle>
              <DialogDescription className="text-slate-500">
                {currentProduct.id ? 'Modify existing affiliate details.' : 'Add a new affiliate product to your library.'}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name" className="text-slate-500 font-bold text-[10px] uppercase">Product Name</Label>
                <Input 
                  id="name" 
                  value={currentProduct.name}
                  onChange={(e) => setCurrentProduct({...currentProduct, name: e.target.value})}
                  className={`bg-slate-50 border-slate-200 focus:border-lime-700 text-slate-900 ${errors.name ? 'border-red-500' : ''}`}
                />
                {errors.name && <span className="text-red-500 text-[10px] font-bold">{errors.name}</span>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="category" className="text-slate-500 font-bold text-[10px] uppercase">Category</Label>
                  <Input 
                    id="category" 
                    value={currentProduct.category}
                    onChange={(e) => setCurrentProduct({...currentProduct, category: e.target.value})}
                    className={`bg-slate-50 border-slate-200 focus:border-lime-700 text-slate-900 ${errors.category ? 'border-red-500' : ''}`}
                  />
                  {errors.category && <span className="text-red-500 text-[10px] font-bold">{errors.category}</span>}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="image" className="text-slate-500 font-bold text-[10px] uppercase">Image URL</Label>
                  <Input 
                    id="image" 
                    value={currentProduct.imageUrl}
                    onChange={(e) => setCurrentProduct({...currentProduct, imageUrl: e.target.value})}
                    className={`bg-slate-50 border-slate-200 focus:border-lime-700 text-slate-900 ${errors.imageUrl ? 'border-red-500' : ''}`}
                  />
                  {errors.imageUrl && <span className="text-red-500 text-[10px] font-bold">{errors.imageUrl}</span>}
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="link" className="text-slate-500 font-bold text-[10px] uppercase">Affiliate Link</Label>
                <Input 
                  id="link" 
                  value={currentProduct.affiliateLink}
                  onChange={(e) => setCurrentProduct({...currentProduct, affiliateLink: e.target.value})}
                  className={`bg-slate-50 border-slate-200 focus:border-lime-700 text-slate-900 ${errors.affiliateLink ? 'border-red-500' : ''}`}
                />
                {errors.affiliateLink && <span className="text-red-500 text-[10px] font-bold">{errors.affiliateLink}</span>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="desc" className="text-slate-500 font-bold text-[10px] uppercase">Description</Label>
                <textarea 
                  id="desc" 
                  value={currentProduct.description}
                  onChange={(e) => setCurrentProduct({...currentProduct, description: e.target.value})}
                  className="flex min-h-[100px] w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm ring-offset-white placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-700 disabled:cursor-not-allowed disabled:opacity-50 text-slate-900"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setIsDialogOpen(false)} className="text-slate-500 hover:text-slate-900 hover:bg-slate-100 font-bold">Cancel</Button>
              <Button onClick={handleSave} className="bg-lime-700 text-white font-bold hover:bg-lime-800">
                {currentProduct.id ? 'Save Changes' : 'Create Product'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="bg-white border-slate-200 overflow-hidden shadow-sm border-t-2 border-t-lime-700">
        <CardHeader className="bg-slate-50 border-b border-slate-200 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <Input 
                placeholder="Search products..." 
                className="pl-10 bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:ring-lime-700/50"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
                <Button variant="outline" className="border-slate-200 bg-transparent text-slate-500 hover:bg-lime-700/10 hover:text-lime-700 gap-2 h-10 font-bold px-4">
                  <Filter size={16} /> Filters
                </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="border-slate-100 hover:bg-transparent">
                <TableHead className="w-[80px] text-slate-400 font-black uppercase text-[10px] tracking-widest px-6 py-4">Image</TableHead>
                <TableHead className="text-slate-400 font-black uppercase text-[10px] tracking-widest px-6 py-4">Product</TableHead>
                <TableHead className="text-slate-400 font-black uppercase text-[10px] tracking-widest px-6 py-4">Category</TableHead>
                <TableHead className="text-slate-400 font-black uppercase text-[10px] tracking-widest px-6 py-4 text-center">Performance</TableHead>
                <TableHead className="text-slate-400 font-black uppercase text-[10px] tracking-widest px-6 py-4 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-48 text-center text-[#61897c] font-medium italic">
                    Powering up the database...
                  </TableCell>
                </TableRow>
              ) : filteredProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-48 text-center text-[#61897c] font-medium italic">
                    No products found matching your search.
                  </TableCell>
                </TableRow>
              ) : (
                filteredProducts.map((product) => (
                  <TableRow key={product.id} className="border-slate-100 group hover:bg-slate-50 transition-colors">
                    <TableCell className="px-6 py-4">
                      <div className="h-12 w-12 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden group-hover:scale-110 transition-transform duration-500">
                        {product.imageUrl ? (
                          <img src={product.imageUrl} alt="" className="object-cover w-full h-full" />
                        ) : (
                          <ShoppingBag size={18} className="text-slate-400 m-auto mt-3" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="font-black text-slate-900 text-sm group-hover:text-lime-700 transition-colors">{product.name}</span>
                          {product.isFeatured && (
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400 font-bold line-clamp-1 opacity-80 mt-0.5">{product.description || 'No description provided'}</span>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <Badge className="bg-lime-700/10 text-lime-700 border-none font-black text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-md">
                        {product.category || 'Uncategorized'}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                       <div className="flex items-center justify-center gap-4">
                          <div className="flex flex-col items-center">
                             <span className="text-[10px] text-slate-400 font-bold uppercase mb-0.5">Clicks</span>
                             <span className="text-xs font-black text-slate-900">{Math.floor(Math.random() * 1000)}</span>
                          </div>
                          <div className="h-4 w-px bg-slate-100"></div>
                          <div className="flex flex-col items-center">
                             <span className="text-[10px] text-slate-400 font-bold uppercase mb-0.5">Conv.</span>
                             <span className="text-xs font-black text-lime-700">{ (Math.random() * 5).toFixed(1) }%</span>
                          </div>
                       </div>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-right">
                       <div className="flex items-center justify-end gap-2">
                           <Button 
                             size="icon" 
                             variant="ghost" 
                             className={`h-8 w-8 rounded-lg transition-colors ${product.isFeatured ? 'text-yellow-500 bg-yellow-50' : 'text-slate-400 hover:text-yellow-500 hover:bg-yellow-50'}`}
                             onClick={() => handleToggleFeatured(product.id)}
                             title={product.isFeatured ? "Featured" : "Set as Featured"}
                           >
                              <Star size={16} className={product.isFeatured ? "fill-current" : ""} />
                           </Button>
                           <Button 
                             size="icon" 
                             variant="ghost" 
                             className="h-8 w-8 text-slate-400 hover:text-lime-700 hover:bg-lime-700/10 rounded-lg"
                             onClick={() => handleEdit(product)}
                           >
                              <Edit2 size={16} />
                           </Button>
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                            onClick={() => handleDelete(product.id)}
                          >
                             <Trash2 size={16} />
                          </Button>
                          <a 
                            href={product.affiliateLink} 
                            target="_blank" 
                            className="h-8 w-8 flex items-center justify-center text-slate-400 hover:text-lime-700 hover:bg-lime-700/10 rounded-lg transition-colors"
                          >
                             <ExternalLink size={16} />
                          </a>
                       </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
