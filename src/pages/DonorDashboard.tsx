import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Package, Award, TrendingUp, FileText, Plus, Download } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/lib/store';
import { toast } from 'sonner';
import { CountUp } from '@/components/CountUp';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { ResourceCategory } from '@/lib/store';
import { downloadCertificate } from '@/lib/certificate';

const QUOTES = [
  "No one has ever become poor by giving. – Anne Frank",
  "We make a living by what we get, but we make a life by what we give. – Winston Churchill",
  "It's not how much we give but how much love we put into giving. – Mother Teresa",
];

export default function DonorDashboard() {
  const { currentUser, resources, certificates, addResource, events, issueCertificate } = useAppStore();
  const [showAdd, setShowAdd] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'food'>('overview');
  const [newRes, setNewRes] = useState({ title: '', description: '', category: 'food' as ResourceCategory, quantity: 1, unit: 'items', location: '', expiry: '' });
  const [quote] = useState(() => QUOTES[Math.floor(Math.random() * QUOTES.length)]);

  if (!currentUser) return null;

  const myResources = resources.filter(r => r.donorId === currentUser.id);
  const myCerts = certificates.filter(c => c.userId === currentUser.id);
  const totalDonated = myResources.length;
  const claimed = myResources.filter(r => r.status === 'claimed' || r.status === 'delivered').length;

  const handleAdd = () => {
    if (!newRes.title.trim()) { toast.error('Title required'); return; }
    addResource({
      ...newRes,
      donorId: currentUser.id,
      donorName: currentUser.name,
      lat: 19 + Math.random() * 10,
      lng: 73 + Math.random() * 7,
    });
    toast.success('Resource posted!');
    setShowAdd(false);
    setNewRes({ title: '', description: '', category: 'food' as ResourceCategory, quantity: 1, unit: 'items', location: '', expiry: '' });
  };

  const generateCertificate = () => {
    if (totalDonated === 0) { toast.error('Make at least one donation first'); return; }
    const certId = `cert-${Math.random().toString(36).slice(2, 10)}`;
    const desc = `For generously donating ${totalDonated} resource${totalDonated === 1 ? '' : 's'} through the Cohere platform`;
    issueCertificate({
      userId: currentUser.id,
      userName: currentUser.name,
      type: 'donation',
      description: desc,
      ngoName: 'Cohere Platform',
    });
    downloadCertificate({
      recipientName: currentUser.name,
      recipientRole: 'Donor',
      ngoName: 'Cohere Platform',
      description: desc,
      certificateId: certId.toUpperCase(),
      issuedAt: new Date(),
    });
    toast.success('Certificate downloaded!');
  };

  const handleDownloadCert = (id: string) => {
    const c = myCerts.find(x => x.id === id);
    if (!c) return;
    downloadCertificate({
      recipientName: c.userName,
      recipientRole: 'Donor',
      eventTitle: c.eventTitle,
      ngoName: c.ngoName,
      description: c.description,
      certificateId: c.id.toUpperCase(),
      issuedAt: c.issuedAt,
    });
  };

  const suggestedCampaigns = events.filter(e => e.status === 'upcoming').slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      {/* Donor signature: cool blue wash + soft heart-shaped glow */}
      <div className="absolute inset-x-0 top-0 h-[420px] bg-gradient-to-br from-info/20 via-info/5 to-background -z-10" />
      <div className="absolute top-32 left-1/3 w-96 h-96 rounded-full bg-info/10 blur-3xl -z-10 pointer-events-none" />

      <div className="container mx-auto px-4 pt-24 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8"
        >
          <div>
            <div className="inline-flex items-center gap-2 mb-3">
              <div className="w-1.5 h-6 rounded-full bg-info" />
              <p className="text-xs font-semibold tracking-[0.2em] text-info uppercase">Donor Dashboard</p>
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground">Welcome, {currentUser.name.split(' ')[0]}</h1>
            <p className="text-muted-foreground mt-2 max-w-xl">Every contribution counts. Track your donations, follow active campaigns, and download your impact certificate.</p>
          </div>
          <Dialog open={showAdd} onOpenChange={setShowAdd}>
            <DialogTrigger asChild>
              <Button variant="hero" size="lg"><Plus className="w-4 h-4 mr-2" /> New Donation</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Post a Donation</DialogTitle></DialogHeader>
              <div className="space-y-4 mt-4">
                <div><Label>Title</Label><Input value={newRes.title} onChange={e => setNewRes(p => ({ ...p, title: e.target.value }))} /></div>
                <div><Label>Description</Label><Textarea value={newRes.description} onChange={e => setNewRes(p => ({ ...p, description: e.target.value }))} /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Category</Label>
                    <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={newRes.category} onChange={e => setNewRes(p => ({ ...p, category: e.target.value as ResourceCategory }))}>
                      <option value="food">Food</option><option value="clothes">Clothes</option><option value="essentials">Essentials</option><option value="funds">Funds</option>
                    </select>
                  </div>
                  <div><Label>Quantity</Label><Input type="number" value={newRes.quantity} onChange={e => setNewRes(p => ({ ...p, quantity: +e.target.value }))} /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>Location</Label><Input value={newRes.location} onChange={e => setNewRes(p => ({ ...p, location: e.target.value }))} /></div>
                  {newRes.category === 'food' && <div><Label>Expiry / Shelf life</Label><Input value={newRes.expiry} onChange={e => setNewRes(p => ({ ...p, expiry: e.target.value }))} placeholder="e.g. 12 hours" /></div>}
                </div>
                <Button variant="hero" className="w-full" onClick={handleAdd}>Post Donation</Button>
              </div>
            </DialogContent>
          </Dialog>
        </motion.div>

        <div className="glass-card p-5 mb-8 text-center">
          <p className="font-display italic text-base text-foreground/80">"{quote}"</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Donated', value: totalDonated, icon: Package, tint: 'text-info' },
            { label: 'Claimed', value: claimed, icon: Heart, tint: 'text-accent' },
            { label: 'Certificates', value: myCerts.length, icon: Award, tint: 'text-primary' },
            { label: 'Impact Score', value: totalDonated * 10, icon: TrendingUp, tint: 'text-success' },
          ].map(s => (
            <div key={s.label} className="glass-card p-5">
              <s.icon className={`w-5 h-5 ${s.tint} mb-3`} />
              <div className="text-3xl font-display font-bold text-foreground"><CountUp end={s.value as number} /></div>
              <p className="text-xs font-semibold text-muted-foreground mt-1 uppercase tracking-wider">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-2 mb-6 border-b border-border">
          {(['overview', 'food'] as const).map(t => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`pb-3 px-4 text-sm font-semibold transition-colors capitalize ${
                activeTab === t ? 'border-b-2 border-info text-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {t === 'food' ? 'Food Outlet' : t}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="glass-card p-6 lg:col-span-2">
              <h2 className="font-display text-lg font-bold text-foreground mb-4">My Donations</h2>
              {myResources.length === 0 ? (
                <div className="text-center py-10 border border-dashed border-border rounded-lg">
                  <Package className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-50" />
                  <p className="text-sm text-muted-foreground">No donations yet — start with the button above.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {myResources.map(r => (
                    <div key={r.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/40 border border-border/60">
                      <div>
                        <p className="font-semibold text-sm text-foreground">{r.title}</p>
                        <p className="text-xs text-muted-foreground">{r.quantity} {r.unit} · {r.location}</p>
                      </div>
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${
                        r.status === 'available' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
                      }`}>{r.status}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="glass-card p-6">
                <h2 className="font-display text-lg font-bold text-foreground mb-4">Suggested Campaigns</h2>
                <div className="space-y-2">
                  {suggestedCampaigns.map(p => (
                    <div key={p.id} className="p-3 rounded-lg bg-muted/40 border border-border/60">
                      <p className="text-sm font-semibold text-foreground">{p.title}</p>
                      <p className="text-xs text-muted-foreground line-clamp-2">{p.ngoName} · {p.content}</p>
                    </div>
                  ))}
                  {suggestedCampaigns.length === 0 && <p className="text-sm text-muted-foreground">No campaigns to show.</p>}
                </div>
              </div>

              <div className="glass-card-elevated p-6 relative overflow-hidden">
                <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-info/10 blur-3xl pointer-events-none" />
                <h2 className="font-display text-lg font-bold text-foreground mb-3 flex items-center gap-2 relative">
                  <Award className="w-5 h-5 text-info" /> Certificates
                </h2>
                <Button variant="hero" size="sm" className="w-full mb-3" onClick={generateCertificate}>
                  <Download className="w-3.5 h-3.5 mr-1" /> Generate Certificate
                </Button>
                <div className="space-y-2">
                  {myCerts.map(c => (
                    <div key={c.id} className="p-3 rounded-lg bg-muted/40 border border-border/60 flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground line-clamp-1">{c.eventTitle || c.description}</p>
                        <p className="text-xs text-muted-foreground">{c.issuedAt.toLocaleDateString()}</p>
                      </div>
                      <Button size="sm" variant="ghost" onClick={() => handleDownloadCert(c.id)}>
                        <Download className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'food' && (
          <div className="glass-card p-6 min-h-[400px]">
            <h2 className="font-display text-lg font-bold text-foreground mb-4">Food Outlet</h2>
            <div className="flex items-center justify-between bg-warning/10 text-warning px-4 py-3 rounded-lg mb-6 text-sm">
              <p>Items posted here are immediately matched with active NGOs for pickup.</p>
              <Button size="sm" onClick={() => { setShowAdd(true); setNewRes(p => ({ ...p, category: 'food' })); }}>Post Food</Button>
            </div>
            <div className="space-y-3">
              {myResources.filter(r => r.category === 'food').map(r => (
                <div key={r.id} className="p-4 rounded-lg bg-muted/40 border border-border/60 flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-base text-foreground">{r.title}</h3>
                    <p className="text-sm text-muted-foreground">{r.quantity} {r.unit} · {r.location}</p>
                    <p className="text-xs text-muted-foreground mt-1">Status: <span className="font-semibold capitalize">{r.status}</span></p>
                  </div>
                  {r.status !== 'available' && (
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Claimed by <span className="text-foreground font-semibold">{r.claimedByName}</span></p>
                      <Button variant="outline" size="sm" className="mt-2" onClick={() => toast.info('Tracking pickup...')}>Track Pickup</Button>
                    </div>
                  )}
                </div>
              ))}
              {myResources.filter(r => r.category === 'food').length === 0 && <p className="text-muted-foreground text-sm">No food resources posted yet.</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
