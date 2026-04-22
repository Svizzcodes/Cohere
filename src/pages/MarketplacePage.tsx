import { useState } from 'react';
import { motion } from 'framer-motion';
import { Utensils, Shirt, DollarSign, Heart, MapPin, Search, Package } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAppStore, ResourceCategory } from '@/lib/store';
import { toast } from 'sonner';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const categoryIcons: Record<ResourceCategory, typeof Utensils> = {
  food: Utensils, clothes: Shirt, funds: DollarSign, essentials: Heart,
};
const categoryColors: Record<ResourceCategory, string> = {
  food: 'bg-success/10 text-success', clothes: 'bg-info/10 text-info',
  funds: 'bg-warning/10 text-warning', essentials: 'bg-accent/10 text-accent',
};

export default function MarketplacePage() {
  const { resources, claimResource, addResource, currentUser, ngos } = useAppStore();
  const [filter, setFilter] = useState<ResourceCategory | 'all'>('all');
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [newRes, setNewRes] = useState({ title: '', description: '', category: 'food' as ResourceCategory, quantity: 1, unit: 'items', location: '' });

  const filtered = resources.filter(r => {
    if (filter !== 'all' && r.category !== filter) return false;
    if (search && !r.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const userNGO = currentUser?.role === 'ngo' ? ngos.find(n => n.userId === currentUser.id && n.status === 'verified') : null;

  const handleClaim = (resourceId: string) => {
    if (!userNGO) { toast.error('Only verified NGOs can claim resources'); return; }
    claimResource(resourceId, userNGO.id, userNGO.name);
    toast.success('Resource claimed!');
  };

  const handleAdd = () => {
    if (!currentUser) { toast.error('Please login first'); return; }
    addResource({
      ...newRes,
      donorId: currentUser.id,
      donorName: currentUser.name,
      lat: 19 + Math.random() * 10,
      lng: 73 + Math.random() * 7,
    });
    toast.success('Resource posted!');
    setShowAdd(false);
    setNewRes({ title: '', description: '', category: 'food', quantity: 1, unit: 'items', location: '' });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold">Resource Marketplace</h1>
            <p className="text-muted-foreground mt-1">Browse and claim available resources</p>
          </div>
          {currentUser && (currentUser.role === 'donor' || currentUser.role === 'ngo') && (
            <Dialog open={showAdd} onOpenChange={setShowAdd}>
              <DialogTrigger asChild>
                <Button variant="hero"><Package className="w-4 h-4 mr-2" /> Post Resource</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Post a Resource</DialogTitle></DialogHeader>
                <div className="space-y-4 mt-4">
                  <div><Label>Title</Label><Input value={newRes.title} onChange={e => setNewRes(p => ({ ...p, title: e.target.value }))} /></div>
                  <div><Label>Description</Label><Textarea value={newRes.description} onChange={e => setNewRes(p => ({ ...p, description: e.target.value }))} /></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Category</Label>
                      <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={newRes.category} onChange={e => setNewRes(p => ({ ...p, category: e.target.value as ResourceCategory }))}>
                        <option value="food">Food</option>
                        <option value="clothes">Clothes</option>
                        <option value="essentials">Essentials</option>
                        <option value="funds">Funds</option>
                      </select>
                    </div>
                    <div><Label>Quantity</Label><Input type="number" value={newRes.quantity} onChange={e => setNewRes(p => ({ ...p, quantity: +e.target.value }))} /></div>
                  </div>
                  <div><Label>Location</Label><Input value={newRes.location} onChange={e => setNewRes(p => ({ ...p, location: e.target.value }))} /></div>
                  <Button variant="hero" className="w-full" onClick={handleAdd}>Post Resource</Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search resources..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {(['all', 'food', 'clothes', 'essentials', 'funds'] as const).map(cat => (
              <Button key={cat} variant={filter === cat ? 'default' : 'outline'} size="sm" onClick={() => setFilter(cat)}>
                {cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((res, i) => {
            const Icon = categoryIcons[res.category];
            return (
              <motion.div
                key={res.id}
                className="glass-card p-6"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-10 h-10 rounded-lg ${categoryColors[res.category]} flex items-center justify-center`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    res.status === 'available' ? 'bg-success/10 text-success' :
                    res.status === 'claimed' ? 'bg-warning/10 text-warning' : 'bg-muted text-muted-foreground'
                  }`}>
                    {res.status.charAt(0).toUpperCase() + res.status.slice(1)}
                  </span>
                </div>
                <h3 className="font-display font-semibold mb-1">{res.title}</h3>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{res.description}</p>
                <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2"><MapPin className="w-3 h-3" />{res.location}</div>
                <div className="text-sm font-medium mb-4">{res.quantity} {res.unit}</div>
                {res.status === 'available' && userNGO && (
                  <Button variant="hero" size="sm" className="w-full" onClick={() => handleClaim(res.id)}>Claim Resource</Button>
                )}
                {res.status === 'claimed' && (
                  <p className="text-xs text-muted-foreground">Claimed by {res.claimedByName}</p>
                )}
              </motion.div>
            );
          })}
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">No resources found.</div>
        )}
      </div>
    </div>
  );
}
