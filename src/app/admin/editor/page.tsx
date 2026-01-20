'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  ArrowLeft, 
  Save, 
  Send, 
  Image as ImageIcon, 
  Type, 
  Link as LinkIcon,
  Layout,
  ShoppingBag,
  Eye,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default function AdminEditor() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  const [post, setPost] = useState<any>({
    title: '',
    slug: '',
    category: '',
    content: '',
    imageUrl: '',
    productId: '',
    published: false,
    isFeatured: false
  });

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<any>(null);

  useEffect(() => {
    fetchProducts();
    if (id) {
      fetchPost(id as string);
    }
  }, [id]);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  };

  const fetchPost = async (postId: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/posts/${postId}`);
      const data = await res.json();
      setPost(data);
    } catch (error) {
      console.error('Failed to fetch post:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (published: boolean = false) => {
    setSaving(true);
    setMessage(null);
    try {
      const method = id ? 'PATCH' : 'POST';
      const url = id ? `/api/posts/${id}` : '/api/posts';
      
      // Auto-generate slug if empty
      const postData = { 
        ...post, 
        published,
        slug: post.slug || post.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData)
      });

      if (res.ok) {
        setMessage({ type: 'success', text: published ? 'Post published successfully!' : 'Draft saved successfully!' });
        if (!id) {
          const newPost = await res.json();
          router.push(`/admin/editor/${newPost.id}`);
        }
      } else {
        setMessage({ type: 'error', text: 'Error saving post' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error occurred' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-white">
       <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 border-4 border-lime-700 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Calibrating Editor...</p>
       </div>
    </div>
  );

  return (
    <div className="bg-slate-50 min-h-screen text-slate-900 pb-20">
      {/* Top Bar */}
      <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200 h-20 px-8 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-6">
          <Button 
            variant="ghost" 
            onClick={() => router.push('/admin/posts')}
            className="text-slate-400 hover:text-slate-900 hover:bg-slate-100 p-2 rounded-xl"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <div className="h-8 w-px bg-slate-200"></div>
          <div>
            <h1 className="text-xl font-black uppercase tracking-tight truncate max-w-[400px]">
              {post.title || 'Untitled Post'}
            </h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
              {id ? 'Editing Insight' : 'New Strategic Draft'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {message && (
            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold animate-in fade-in slide-in-from-right-4 ${
              message.type === 'success' ? 'bg-lime-700/10 text-lime-700' : 'bg-red-500/10 text-red-500'
            }`}>
              {message.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
              {message.text}
            </div>
          )}
          <Button 
            variant="ghost" 
            className="text-slate-400 hover:text-lime-700 hover:bg-lime-700/5 h-11 px-4 font-bold rounded-xl gap-2"
            onClick={() => {
              const slug = post.slug || post.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
              window.open(`/post/${slug}?preview=true`, '_blank');
            }}
          >
            <Eye size={18} /> Preview
          </Button>
          <Button 
            variant="outline" 
            className="border-slate-200 bg-transparent text-slate-500 hover:bg-slate-50 px-6 h-11 font-bold rounded-xl gap-2"
            disabled={saving}
            onClick={() => handleSave(false)}
          >
            <Save size={18} /> Save Draft
          </Button>
          <Button 
            className="bg-lime-700 text-white hover:bg-lime-800 px-8 h-11 font-black uppercase tracking-wider rounded-xl shadow-lg gap-2"
            disabled={saving}
            onClick={() => handleSave(true)}
          >
            {saving ? 'Processing...' : 'Publish'} <Send size={18} />
          </Button>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Editor */}
        <div className="lg:col-span-8 space-y-6">
          <Card className="bg-white border-slate-200 shadow-xl overflow-hidden rounded-3xl">
            <CardContent className="p-10 space-y-8">
              <div className="space-y-4">
                <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Headline Content</Label>
                <Input 
                  value={post.title}
                  onChange={(e) => setPost({...post, title: e.target.value})}
                  placeholder="The Science of Mitochondrial Recovery..."
                  className="bg-transparent border-none text-4xl md:text-5xl font-black p-0 h-auto placeholder:text-slate-200 focus-visible:ring-0 focus-visible:ring-offset-0 text-slate-900"
                />
              </div>

              <div className="space-y-4">
                <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Narrative Body</Label>
                <Textarea 
                  value={post.content}
                  onChange={(e) => setPost({...post, content: e.target.value})}
                  placeholder="Start your scientific exploration here..."
                  className="min-h-[600px] bg-slate-50/50 border-slate-200 rounded-2xl p-8 text-lg leading-relaxed font-serif text-slate-900 focus:ring-lime-700/20 focus:border-lime-700/30 shadow-inner"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Controls */}
        <aside className="lg:col-span-4 space-y-6 sticky top-28">
          <Card className="bg-white border-slate-200 rounded-3xl shadow-xl overflow-hidden">
            <div className="p-6 bg-slate-50 border-b border-slate-200">
              <h3 className="text-sm font-black uppercase tracking-wider flex items-center gap-2">
                <Layout size={18} className="text-lime-700" /> Metadata & Setup
              </h3>
            </div>
            <CardContent className="p-8 space-y-6">
              <div className="space-y-4">
                <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <LinkIcon size={12} /> URL Slug
                </Label>
                <Input 
                  value={post.slug}
                  onChange={(e) => setPost({...post, slug: e.target.value})}
                  placeholder="mitochondrial-recovery-guide"
                  className="bg-slate-50 border-slate-200 rounded-xl text-xs font-bold text-lime-700 focus:ring-lime-700/30"
                />
              </div>

              <div className="space-y-4">
                <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <ImageIcon size={12} /> Cover Asset URL
                </Label>
                <Input 
                  value={post.imageUrl}
                  onChange={(e) => setPost({...post, imageUrl: e.target.value})}
                  placeholder="https://images.unsplash.com/..."
                  className="bg-slate-50 border-slate-200 rounded-xl text-xs"
                />
                {post.imageUrl && (
                  <div className="mt-2 aspect-video rounded-xl border border-slate-200 overflow-hidden shadow-inner">
                    <img src={post.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Type size={12} /> Taxonomy
                </Label>
                <Select 
                  value={post.category} 
                  onValueChange={(val) => setPost({...post, category: val})}
                >
                  <SelectTrigger className="bg-slate-50 border-slate-200 rounded-xl h-11">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-slate-200 text-slate-900">
                    <SelectItem value="Metabolism">Metabolism</SelectItem>
                    <SelectItem value="Nutrition">Nutrition</SelectItem>
                    <SelectItem value="Beauty">Beauty</SelectItem>
                    <SelectItem value="Fitness">Fitness</SelectItem>
                    <SelectItem value="Longevity">Longevity</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <div className="space-y-0.5">
                    <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Featured Insight</Label>
                    <p className="text-[10px] text-slate-400 pl-1">Display at hero section</p>
                  </div>
                  <input 
                    type="checkbox"
                    checked={post.isFeatured}
                    onChange={(e) => setPost({...post, isFeatured: e.target.checked})}
                    className="w-5 h-5 accent-lime-700 rounded-md"
                  />
                </div>
              </div>
            </CardContent>
          </Card>


          <Card className="bg-gradient-to-br from-slate-50 to-white border-2 border-lime-700/30 rounded-3xl shadow-xl overflow-hidden relative group">
            <div className="absolute -right-8 -top-8 bg-lime-700/5 h-24 w-24 rounded-full blur-2xl group-hover:scale-150 transition-all duration-700"></div>
            <div className="p-6 bg-lime-700/5 border-b border-lime-700/20 flex items-center justify-between">
              <h3 className="text-sm font-black uppercase tracking-wider flex items-center gap-2 text-lime-700">
                <ShoppingBag size={18} /> Monetization
              </h3>
            </div>
            <CardContent className="p-8 space-y-6 relative z-10">
              <p className="text-[10px] font-bold text-lime-700 uppercase tracking-widest opacity-80 mb-2">Linked Solution</p>
              <Select 
                value={post.productId || 'none'} 
                onValueChange={(val) => setPost({...post, productId: val === 'none' ? null : val})}
              >
                <SelectTrigger className="bg-white border-lime-700/20 rounded-xl h-12 font-bold text-sm">
                  <SelectValue placeholder="Detach Product" />
                </SelectTrigger>
                <SelectContent className="bg-white border-slate-200 text-slate-900">
                  <SelectItem value="none">No Associated Product</SelectItem>
                  {products.map((prod) => (
                    <SelectItem key={prod.id} value={prod.id}>{prod.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {post.productId && (
                 <div className="p-4 bg-lime-700/10 rounded-2xl border border-lime-700/20 flex items-center justify-between group/prod">
                    <div className="flex items-center gap-3">
                       <ShoppingBag size={14} className="text-lime-700" />
                       <span className="text-xs font-bold text-lime-700 uppercase">Live Integration Active</span>
                    </div>
                    <Eye size={14} className="text-slate-400 group-hover/prod:text-lime-700 cursor-help" />
                 </div>
              )}
            </CardContent>
          </Card>

          <div className="p-6 bg-lime-700/10 rounded-3xl border border-lime-700/20 flex flex-col items-center text-center gap-4">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-relaxed">
                 Remember to use <strong className="text-lime-700">SEO-optimized</strong> headlines to maximize mitochondrial visibility.
              </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
