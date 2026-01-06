'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  FileText,
  ExternalLink,
  Filter,
  Eye,
  ShoppingBag
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
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function PostsPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/posts');
      const data = await res.json();
      setPosts(data);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this post?')) {
      try {
        const res = await fetch(`/api/posts/${id}`, { method: 'DELETE' });
        if (res.ok) fetchPosts();
      } catch (error) {
        console.error('Failed to delete post:', error);
      }
    }
  };

  const filteredPosts = posts.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Content Hub</h1>
          <p className="text-slate-500 mt-1 font-medium italic">Your scientific narratives for a healthier world.</p>
        </div>
        
        <Link href="/admin/editor">
          <Button className="bg-[#13eca4] text-[#111816] font-bold hover:bg-[#0fd693] shadow-lg shadow-[#13eca4]/20 gap-2 h-12 px-6 rounded-xl">
            <Plus size={20} strokeWidth={3} />
            Draft New Post
          </Button>
        </Link>
      </div>

      <Card className="bg-white border-slate-200 overflow-hidden shadow-sm border-t-2 border-t-lime-700">
        <CardHeader className="bg-slate-50 border-b border-slate-200 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <Input 
                placeholder="Search by title or category..." 
                className="pl-10 bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:ring-lime-700/50"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
                <Button variant="outline" className="border-slate-200 bg-transparent text-slate-500 hover:bg-lime-700/10 hover:text-lime-700 gap-2 h-10 font-bold px-4">
                  <Filter size={16} /> Status: All
                </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/50 text-slate-400">
              <TableRow className="border-slate-100 hover:bg-transparent">
                <TableHead className="w-[80px] font-black uppercase text-[10px] tracking-widest px-6 py-4">Preview</TableHead>
                <TableHead className="font-black uppercase text-[10px] tracking-widest px-6 py-4">Post Info</TableHead>
                <TableHead className="font-black uppercase text-[10px] tracking-widest px-6 py-4 text-center">Status</TableHead>
                <TableHead className="font-black uppercase text-[10px] tracking-widest px-6 py-4">Created</TableHead>
                <TableHead className="font-black uppercase text-[10px] tracking-widest px-6 py-4 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-48 text-center text-slate-400 font-medium italic">
                    Loading your library...
                  </TableCell>
                </TableRow>
              ) : filteredPosts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-48 text-center text-slate-400 font-medium italic">
                    Zero results. Time to write something new?
                  </TableCell>
                </TableRow>
              ) : (
                filteredPosts.map((post) => (
                  <TableRow key={post.id} className="border-slate-100 group hover:bg-slate-50 transition-colors">
                    <TableCell className="px-6 py-4">
                      <div className="h-12 w-12 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden group-hover:scale-110 transition-transform duration-500">
                        {post.imageUrl ? (
                          <img src={post.imageUrl} alt="" className="object-cover w-full h-full" />
                        ) : (
                          <FileText size={18} className="text-slate-400 m-auto mt-3" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className="font-black text-slate-900 text-sm group-hover:text-lime-700 transition-colors line-clamp-1">{post.title}</span>
                        <div className="flex items-center gap-2">
                           <Badge className="bg-lime-700/10 text-lime-700 border-none font-black text-[8px] uppercase tracking-wider px-1.5 py-0 rounded-sm">
                             {post.category || 'Opinion'}
                           </Badge>
                           {post.productId && (
                             <Badge className="bg-blue-400/10 text-blue-400 border-none font-black text-[8px] uppercase tracking-wider px-1.5 py-0 rounded-sm flex items-center gap-1">
                               <ShoppingBag size={8} /> Affiliate
                             </Badge>
                           )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                       <div className="flex items-center justify-center">
                          <span className="flex items-center gap-2 text-[10px] font-black uppercase text-emerald-600">
                            <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                            Live
                          </span>
                       </div>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-slate-500 text-xs font-bold">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-right">
                       <div className="flex items-center justify-end gap-2">
                           <Link href={`/admin/editor/${post.id}`}>
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-lime-700 hover:bg-lime-700/10 rounded-lg transition-all">
                               <Edit2 size={16} />
                            </Button>
                          </Link>
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            onClick={() => handleDelete(post.id)}
                          >
                             <Trash2 size={16} />
                          </Button>
                          <Link href={`/post/${post.slug}`} target="_blank">
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-lime-700 hover:bg-lime-700/10 rounded-lg transition-all">
                               <Eye size={16} />
                            </Button>
                          </Link>
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
