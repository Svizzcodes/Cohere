import { motion } from 'framer-motion';
import { Shield, CheckCircle, XCircle, Users, Package, AlertTriangle, MessageSquare, Award, MapPin, Calendar } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/lib/store';
import { toast } from 'sonner';
import { CountUp } from '@/components/CountUp';

export default function AdminDashboard() {
  const { ngos, approveNGO, rejectNGO, getStats, resources, proofs, verifyProof, events, verifyEventPost } = useAppStore();
  const stats = getStats();
  const pendingNGOs = ngos.filter(n => n.status === 'pending');
  const pendingProofs = proofs.filter(p => p.status === 'pending');
  const pendingPosts = events.filter(e => !e.adminVerified);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      {/* Admin signature: authoritative destructive wash + premium amber accent + diagonal stripe */}
      <div className="absolute inset-x-0 top-0 h-[420px] bg-gradient-to-br from-destructive/20 via-destructive/5 to-background -z-10" />
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-destructive via-warning to-destructive -z-10" />
      <div className="absolute top-20 left-1/4 w-96 h-96 rounded-full bg-destructive/10 blur-3xl -z-10 pointer-events-none" />
      <div className="absolute top-40 right-10 w-80 h-80 rounded-full bg-warning/10 blur-3xl -z-10 pointer-events-none" />

      <div className="container mx-auto px-4 pt-24 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-destructive to-destructive/70 flex items-center justify-center text-destructive-foreground shadow-lg ring-4 ring-destructive/15">
            <Shield className="w-7 h-7" />
          </div>
          <div>
            <div className="inline-flex items-center gap-2 mb-1">
              <div className="w-1.5 h-1.5 rounded-full bg-destructive animate-pulse" />
              <p className="text-xs font-semibold tracking-[0.2em] text-destructive uppercase">Admin Console · Restricted</p>
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">Platform Oversight</h1>
            <p className="text-muted-foreground text-sm mt-1">Verify organizations, validate proofs, and approve event posts.</p>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Active NGOs', value: stats.ngosActive, icon: Users, tint: 'text-primary' },
            { label: 'Total Resources', value: resources.length, icon: Package, tint: 'text-info' },
            { label: 'Volunteers', value: stats.volunteersEngaged, icon: Users, tint: 'text-accent' },
            { label: 'Pending Approvals', value: pendingNGOs.length + pendingPosts.length + pendingProofs.length, icon: AlertTriangle, tint: 'text-warning' },
          ].map(s => (
            <div key={s.label} className="glass-card p-5">
              <s.icon className={`w-5 h-5 ${s.tint} mb-3`} />
              <div className="text-3xl font-display font-bold text-foreground"><CountUp end={s.value} /></div>
              <p className="text-xs font-semibold text-muted-foreground mt-1 uppercase tracking-wider">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Pending Event Post Verifications — NEW */}
        <div className="glass-card-elevated p-6 mb-6 relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
          <div className="flex items-center justify-between mb-5 relative">
            <h2 className="font-display text-xl font-bold text-foreground flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-primary" /> Pending Event Posts ({pendingPosts.length})
            </h2>
            <span className="text-xs text-muted-foreground hidden sm:block">Verifying issues a Certificate of Recognition to the NGO.</span>
          </div>
          {pendingPosts.length === 0 ? (
            <p className="text-sm text-muted-foreground">No event posts awaiting verification.</p>
          ) : (
            <div className="space-y-3 relative">
              {pendingPosts.map(ev => (
                <div key={ev.id} className="flex items-start justify-between gap-4 p-4 rounded-xl bg-muted/40 border border-border/60 hover:border-primary/40 transition-colors">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-display text-base font-bold text-foreground">{ev.title}</h3>
                    <p className="text-xs text-primary font-semibold mt-0.5">Hosted by {ev.ngoName}</p>
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{ev.content}</p>
                    <div className="flex gap-3 text-xs text-muted-foreground mt-3">
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {ev.location}</span>
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {ev.date.toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 flex-none">
                    <Button size="sm" variant="hero" onClick={() => { verifyEventPost(ev.id); toast.success(`${ev.title} verified — certificate issued to ${ev.ngoName}.`); }}>
                      <Award className="w-3.5 h-3.5 mr-1" /> Verify & Issue Cert
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pending NGOs */}
        <div className="glass-card p-6 mb-6">
          <h2 className="font-display text-xl font-bold text-foreground mb-4">Pending NGO Verifications ({pendingNGOs.length})</h2>
          {pendingNGOs.length === 0 ? (
            <p className="text-sm text-muted-foreground">No pending verifications.</p>
          ) : (
            <div className="space-y-3">
              {pendingNGOs.map(ngo => (
                <div key={ngo.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/40 border-l-4 border-l-warning">
                  <div>
                    <h3 className="font-bold text-base text-foreground">{ngo.name}</h3>
                    <p className="text-sm text-muted-foreground">{ngo.description || 'No description'}</p>
                    <p className="text-xs text-muted-foreground mt-1">{ngo.location}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => { approveNGO(ngo.id); toast.success(`${ngo.name} approved`); }}>
                      <CheckCircle className="w-4 h-4 mr-1" /> Approve
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => { rejectNGO(ngo.id); toast.info(`${ngo.name} rejected`); }}>
                      <XCircle className="w-4 h-4 mr-1" /> Reject
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pending Proofs */}
        <div className="glass-card p-6 mb-6">
          <h2 className="font-display text-xl font-bold text-foreground mb-4">Pending Proofs ({pendingProofs.length})</h2>
          {pendingProofs.length === 0 ? (
            <p className="text-sm text-muted-foreground">No pending proofs.</p>
          ) : (
            <div className="space-y-3">
              {pendingProofs.map(p => (
                <div key={p.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/40 border-l-4 border-l-warning">
                  <div>
                    <p className="font-bold text-base text-foreground">{p.ngoName}: {p.description}</p>
                    <p className="text-xs text-muted-foreground">{p.location} · {p.timestamp.toLocaleDateString()}</p>
                  </div>
                  <Button size="sm" onClick={() => { verifyProof(p.id); toast.success('Proof verified'); }}>Verify</Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* All NGOs */}
        <div className="glass-card p-6">
          <h2 className="font-display text-xl font-bold text-foreground mb-4">All NGOs ({ngos.length})</h2>
          <div className="space-y-2">
            {ngos.map(ngo => (
              <div key={ngo.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/40 border border-border/60">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg hero-gradient flex items-center justify-center text-primary-foreground text-sm font-bold">{ngo.name[0]}</div>
                  <div>
                    <p className="font-semibold text-sm text-foreground">{ngo.name}</p>
                    <p className="text-xs text-muted-foreground">{ngo.location}</p>
                  </div>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${
                  ngo.status === 'verified' ? 'bg-success/10 text-success' :
                  ngo.status === 'pending' ? 'bg-warning/10 text-warning' : 'bg-destructive/10 text-destructive'
                }`}>{ngo.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
