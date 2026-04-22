import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Package, Users, Camera, MessageSquare, Lightbulb, CheckCircle, Award, Download, Plus, FileText, Building2 } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAppStore } from '@/lib/store';
import { toast } from 'sonner';
import { downloadCertificate } from '@/lib/certificate';

const QUOTES = [
  "Alone we can do so little; together we can do so much. – Helen Keller",
  "Great things are done by a series of small things brought together. – Vincent Van Gogh",
  "There is no power for change greater than a community discovering what it cares about. – Margaret J. Wheatley",
];

export default function NGODashboard() {
  const {
    currentUser, ngos, resources, volunteerApps, updateVolunteerStatus,
    addProof, proofs, claimResource, events, addEvent, certificates,
    collaborations, acceptCollaboration, declineCollaboration, sendChatMessage,
  } = useAppStore();

  const [showProof, setShowProof] = useState(false);
  const [proof, setProof] = useState({ description: '', location: '', imageUrl: '' });
  const [showPost, setShowPost] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '', location: '' });
  const [chatMessage, setChatMessage] = useState('');
  const [claimDialog, setClaimDialog] = useState<string | null>(null);
  const [claimPledge, setClaimPledge] = useState('');
  const [quote] = useState(() => QUOTES[Math.floor(Math.random() * QUOTES.length)]);

  if (!currentUser) return null;

  const myNGO = ngos.find(n => n.userId === currentUser.id);
  if (!myNGO) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 pt-32 text-center">
          <p className="text-muted-foreground">NGO profile not found.</p>
        </div>
      </div>
    );
  }

  const isVerified = myNGO.status === 'verified';
  const myApplicants = volunteerApps.filter(a => a.ngoId === myNGO.id);
  const claimedResources = resources.filter(r => r.claimedById === myNGO.id);
  const availableResources = resources.filter(r => r.status === 'available');
  const myProofs = proofs.filter(p => p.ngoId === myNGO.id);
  const myPosts = events.filter(p => p.ngoId === myNGO.id);
  const myCollabs = collaborations.filter(c => c.requestorId === myNGO.id || c.targetId === myNGO.id);
  const myCerts = certificates.filter(c => c.userId === myNGO.id && c.type === 'ngo');

  const handleClaim = (resource: typeof resources[0]) => {
    if (!isVerified) { toast.error('Only verified NGOs can claim'); return; }
    if (!claimPledge.trim()) { toast.error('Please specify where this will be donated'); return; }
    const pickupId = 'TRK-' + Math.floor(100000 + Math.random() * 900000);
    claimResource(resource.id, myNGO.id, myNGO.name);
    toast.success(`Claimed! Pickup ID: ${pickupId}`);
    setClaimDialog(null);
    setClaimPledge('');
  };

  const handleProof = () => {
    if (!proof.description) { toast.error('Description required'); return; }
    if (!navigator.geolocation) { toast.error('GPS not supported'); return; }
    toast.info('Capturing GPS coordinates...', { id: 'gps' });
    navigator.geolocation.getCurrentPosition(pos => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;
      addProof({
        ngoId: myNGO.id,
        ngoName: myNGO.name,
        imageUrl: proof.imageUrl || 'https://via.placeholder.com/400',
        location: `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
        timestamp: new Date(),
        description: proof.description,
      });
      toast.success('Proof submitted with GPS metadata!', { id: 'gps' });
      setShowProof(false);
      setProof({ description: '', location: '', imageUrl: '' });
    }, err => toast.error(`GPS error: ${err.message}`, { id: 'gps' }));
  };

  const handlePost = () => {
    if (!isVerified) { toast.error('Only verified NGOs can post'); return; }
    if (!newPost.title.trim() || !newPost.content.trim()) { toast.error('Title and details are required'); return; }
    addEvent({
      ngoId: myNGO.id,
      ngoName: myNGO.name,
      title: newPost.title.trim(),
      content: newPost.content.trim(),
      location: newPost.location.trim() || myNGO.location,
      date: new Date(Date.now() + 86400000 * 7),
      status: 'upcoming',
    });
    toast.success('Event published! Awaiting admin verification for your certificate.');
    setShowPost(false);
    setNewPost({ title: '', content: '', location: '' });
  };

  const handleVerifyVolunteer = (appId: string, name: string) => {
    updateVolunteerStatus(appId, 'completed');
    toast.success(`${name}'s participation verified — certificate issued.`);
  };

  const handleDownloadCert = (certId: string) => {
    const cert = myCerts.find(c => c.id === certId);
    if (!cert) return;
    downloadCertificate({
      recipientName: cert.userName,
      recipientRole: 'Partner Organization',
      eventTitle: cert.eventTitle,
      ngoName: 'Cohere Platform',
      description: cert.description,
      certificateId: cert.id.toUpperCase(),
      issuedAt: cert.issuedAt,
    });
    toast.success('Certificate downloaded!');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      {/* NGO signature: institutional primary wash + grid hint */}
      <div className="absolute inset-x-0 top-0 h-[420px] bg-gradient-to-br from-primary/20 via-primary/5 to-background -z-10" />
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/40 to-transparent -z-10" />
      <div className="absolute top-32 right-1/4 w-96 h-96 rounded-full bg-primary/10 blur-3xl -z-10 pointer-events-none" />

      <div className="container mx-auto px-4 pt-24 pb-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl hero-gradient flex items-center justify-center text-primary-foreground font-display font-bold text-2xl shadow-lg ring-4 ring-primary/10">
              {myNGO.name[0]}
            </div>
            <div>
              <div className="inline-flex items-center gap-2 mb-1">
                <Building2 className="w-3.5 h-3.5 text-primary" />
                <p className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">NGO Dashboard</p>
              </div>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground flex items-center gap-3 flex-wrap">
                {myNGO.name}
                {isVerified ? (
                  <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-success/10 text-success border border-success/20">
                    <Shield className="w-3 h-3" /> Verified
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-warning/10 text-warning border border-warning/20">
                    Pending verification
                  </span>
                )}
              </h1>
              <p className="text-muted-foreground text-sm mt-1">{myNGO.location}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Dialog open={showPost} onOpenChange={setShowPost}>
              <DialogTrigger asChild>
                <Button variant="outline" disabled={!isVerified}>
                  <MessageSquare className="w-4 h-4 mr-2" /> Post Event
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Create Event Post</DialogTitle></DialogHeader>
                <div className="space-y-4 mt-4">
                  <div>
                    <Label>Event Title</Label>
                    <Input value={newPost.title} onChange={e => setNewPost(p => ({ ...p, title: e.target.value }))} placeholder="e.g. Community Food Drive" />
                  </div>
                  <div>
                    <Label>Details</Label>
                    <Textarea value={newPost.content} onChange={e => setNewPost(p => ({ ...p, content: e.target.value }))} placeholder="What are you organising?" rows={4} />
                  </div>
                  <div>
                    <Label>Location</Label>
                    <Input value={newPost.location} onChange={e => setNewPost(p => ({ ...p, location: e.target.value }))} placeholder={myNGO.location} />
                  </div>
                  <p className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg border border-border">
                    Once published, an admin reviews this event. After verification, a certificate of recognition will be issued to your organization automatically.
                  </p>
                  <Button variant="hero" className="w-full" onClick={handlePost}>Publish Event</Button>
                </div>
              </DialogContent>
            </Dialog>
            <Dialog open={showProof} onOpenChange={setShowProof}>
              <DialogTrigger asChild>
                <Button variant="hero">
                  <Camera className="w-4 h-4 mr-2" /> Upload Proof
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Upload Impact Proof</DialogTitle></DialogHeader>
                <div className="space-y-4 mt-4 text-sm">
                  <p className="bg-warning/10 text-warning p-3 rounded-lg text-xs border border-warning/20">
                    <Shield className="w-3 h-3 inline mr-1" /> GPS will be auto-captured. Manual location entry is disabled.
                  </p>
                  <div><Label>Description</Label><Input value={proof.description} onChange={e => setProof(p => ({ ...p, description: e.target.value }))} placeholder="Distributed 50 meal boxes at..." /></div>
                  <div><Label>Image URL (optional)</Label><Input value={proof.imageUrl} onChange={e => setProof(p => ({ ...p, imageUrl: e.target.value }))} placeholder="https://..." /></div>
                  <Button variant="hero" className="w-full" onClick={handleProof}>Capture GPS & Submit</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </motion.div>

        {!isVerified && (
          <div className="glass-card p-4 mb-6 border-l-4 border-l-warning">
            <p className="text-sm text-foreground font-medium">⏳ Your NGO is pending admin verification. Posting and claiming features unlock once approved.</p>
          </div>
        )}

        {/* Quote */}
        <div className="glass-card p-5 mb-8 text-center">
          <p className="font-display italic text-base text-foreground/80">"{quote}"</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Resources Claimed', value: claimedResources.length, icon: Package },
            { label: 'Volunteers', value: myApplicants.length, icon: Users },
            { label: 'Proofs Logged', value: myProofs.length, icon: Camera },
            { label: 'Event Posts', value: myPosts.length, icon: MessageSquare },
          ].map(s => (
            <div key={s.label} className="glass-card p-5">
              <s.icon className="w-5 h-5 text-primary mb-3" />
              <div className="text-3xl font-display font-bold text-foreground">{s.value}</div>
              <p className="text-xs font-semibold text-muted-foreground mt-1 uppercase tracking-wider">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Certificates section — marquee */}
        <div className="glass-card-elevated p-6 md:p-8 mb-8 relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
          <div className="flex items-center justify-between mb-6 relative">
            <div>
              <h2 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
                <Award className="w-6 h-6 text-primary" /> Organization Certificates
              </h2>
              <p className="text-sm text-muted-foreground mt-1">Issued by Cohere Admin upon verification of an event you posted.</p>
            </div>
            <span className="hidden sm:inline-flex text-xs px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-medium">
              {myCerts.length} earned
            </span>
          </div>
          {myCerts.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-border rounded-xl">
              <FileText className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-50" />
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                Post an event from your dashboard. Once a Cohere Admin verifies it, your formal organization certificate will appear here.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4 relative">
              {myCerts.map(c => (
                <div key={c.id} className="p-5 rounded-xl border-2 border-border bg-gradient-to-br from-card to-muted/30 hover:border-primary/40 transition-all">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold tracking-[0.2em] text-primary uppercase mb-2">Certificate of Recognition</p>
                      <h3 className="font-display text-lg font-bold text-foreground leading-tight">{c.eventTitle}</h3>
                      <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{c.description}</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-none">
                      <Award className="w-5 h-5 text-primary" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/60">
                    <p className="text-xs text-muted-foreground">{c.issuedAt.toLocaleDateString()}</p>
                    <Button size="sm" variant="hero" onClick={() => handleDownloadCert(c.id)}>
                      <Download className="w-3.5 h-3.5 mr-1" /> Download
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Available Resources */}
          <div className="glass-card p-6">
            <h2 className="font-display text-lg font-bold text-foreground mb-4">Available Resources ({availableResources.length})</h2>
            <div className="space-y-3 max-h-[440px] overflow-y-auto pr-1">
              {availableResources.map(r => (
                <div key={r.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/40 border border-border/60">
                  <div className="min-w-0">
                    <p className="font-semibold text-sm text-foreground truncate">{r.title}</p>
                    <p className="text-xs text-muted-foreground">{r.quantity} {r.unit} · {r.location}</p>
                  </div>
                  <Dialog open={claimDialog === r.id} onOpenChange={open => setClaimDialog(open ? r.id : null)}>
                    <DialogTrigger asChild>
                      <Button size="sm" disabled={!isVerified}>Claim</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader><DialogTitle>Claim Resource: {r.title}</DialogTitle></DialogHeader>
                      <div className="space-y-4 mt-4">
                        <div className="bg-muted p-3 rounded-lg text-sm text-muted-foreground">
                          <p><strong>Quantity:</strong> {r.quantity} {r.unit}</p>
                          <p><strong>Location:</strong> {r.location}</p>
                        </div>
                        <div>
                          <Label>Donation Pledge</Label>
                          <p className="text-xs text-muted-foreground mb-2">Where will this be distributed? Proof required within 24h.</p>
                          <Input value={claimPledge} onChange={e => setClaimPledge(e.target.value)} placeholder="e.g. Andheri East shelter" />
                        </div>
                        <Button variant="hero" className="w-full" onClick={() => handleClaim(r)}>Confirm Claim</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              ))}
              {availableResources.length === 0 && <p className="text-sm text-muted-foreground">No resources available right now.</p>}
            </div>
          </div>

          {/* Volunteer Verification */}
          <div className="glass-card p-6">
            <h2 className="font-display text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" /> Participation Verification
            </h2>
            <p className="text-xs text-muted-foreground mb-4">Verifying a volunteer issues them a downloadable Certificate of Recognition for the event.</p>
            <div className="space-y-3 max-h-[440px] overflow-y-auto pr-1">
              {myApplicants.map(a => (
                <div key={a.id} className="p-4 rounded-lg bg-muted/40 border border-border/60">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold text-sm text-foreground">{a.volunteerName}</p>
                    <span className={`text-xs px-2 py-1 rounded-full capitalize ${
                      a.status === 'completed' ? 'bg-accent/10 text-accent' :
                      a.status === 'accepted' ? 'bg-success/10 text-success' :
                      'bg-info/10 text-info'
                    }`}>{a.status}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">
                    {a.eventTitle ? <><span className="font-medium text-foreground/70">Event:</span> {a.eventTitle} · </> : null}
                    {a.role}{a.skills.length > 0 && ` · ${a.skills.join(', ')}`}
                  </p>
                  <div className="flex gap-2">
                    {a.status === 'applied' && (
                      <Button size="sm" onClick={() => { updateVolunteerStatus(a.id, 'accepted'); toast.success('Accepted!'); }}>
                        <CheckCircle className="w-3 h-3 mr-1" /> Accept
                      </Button>
                    )}
                    {a.status === 'accepted' && (
                      <Button size="sm" variant="hero" onClick={() => handleVerifyVolunteer(a.id, a.volunteerName)}>
                        <Shield className="w-3 h-3 mr-1" /> Verify Participation
                      </Button>
                    )}
                    {a.status === 'completed' && (
                      <span className="text-xs text-accent flex items-center gap-1">
                        <Award className="w-3 h-3" /> Certificate issued
                      </span>
                    )}
                  </div>
                </div>
              ))}
              {myApplicants.length === 0 && <p className="text-sm text-muted-foreground">No volunteer applications yet.</p>}
            </div>
          </div>

          {/* Proofs */}
          <div className="glass-card p-6">
            <h2 className="font-display text-lg font-bold text-foreground mb-4">Impact Proofs</h2>
            {myProofs.length === 0 ? (
              <p className="text-sm text-muted-foreground">No proofs uploaded yet.</p>
            ) : (
              <div className="space-y-3">
                {myProofs.map(p => (
                  <div key={p.id} className="p-3 rounded-lg bg-muted/40 border border-border/60">
                    <p className="font-medium text-sm text-foreground">{p.description}</p>
                    <p className="text-xs text-muted-foreground">{p.location} · {p.timestamp.toLocaleDateString()}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full mt-2 inline-block ${p.status === 'verified' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}`}>{p.status}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Suggestions */}
          <div className="glass-card p-6">
            <h2 className="font-display text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-warning" /> Suggestions
            </h2>
            <div className="space-y-3">
              {[
                { t: 'Partner with local restaurants', d: 'Connect with nearby food donors' },
                { t: 'Launch a clothing drive', d: 'Winter is approaching — start collecting' },
                { t: 'Recruit tech volunteers', d: 'Skill-based volunteers available' },
              ].map(s => (
                <div key={s.t} className="p-3 rounded-lg bg-muted/40 border border-border/60">
                  <p className="text-sm font-semibold text-foreground">{s.t}</p>
                  <p className="text-xs text-muted-foreground">{s.d}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Collaborations */}
          {myCollabs.length > 0 && (
            <div className="glass-card p-6 lg:col-span-2">
              <h2 className="font-display text-lg font-bold text-foreground mb-4">Collaborations ({myCollabs.length})</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {myCollabs.map(collab => {
                  const isTarget = collab.targetId === myNGO.id;
                  const partnerName = isTarget ? collab.requestorName : collab.targetName;
                  return (
                    <div key={collab.id} className="p-4 rounded-xl border border-border bg-card">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold text-sm text-foreground">Partner: {partnerName}</h3>
                          <p className="text-xs text-muted-foreground">Event: {collab.eventId}</p>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full uppercase ${
                          collab.status === 'accepted' ? 'bg-success/10 text-success' :
                          collab.status === 'pending' ? 'bg-warning/10 text-warning' : 'bg-destructive/10 text-destructive'
                        }`}>{collab.status}</span>
                      </div>
                      {collab.status === 'pending' && isTarget && (
                        <div className="flex gap-2 mt-3 pt-3 border-t border-border">
                          <Button size="sm" onClick={() => { acceptCollaboration(collab.id); toast.success('Accepted'); }}>Accept</Button>
                          <Button size="sm" variant="destructive" onClick={() => { declineCollaboration(collab.id); toast.error('Declined'); }}>Decline</Button>
                        </div>
                      )}
                      {collab.status === 'accepted' && (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline" className="w-full mt-3"><MessageSquare className="w-4 h-4 mr-2" /> Open Chat</Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-xl h-[600px] flex flex-col">
                            <DialogHeader><DialogTitle>Chat with {partnerName}</DialogTitle></DialogHeader>
                            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-muted/20 rounded-md border border-border/50">
                              {collab.messages.map(msg => (
                                <div key={msg.id} className={`flex ${msg.senderId === myNGO.id ? 'justify-end' : 'justify-start'}`}>
                                  <div className={`max-w-[80%] rounded-lg p-3 ${msg.senderId === myNGO.id ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                                    <p className="text-xs font-semibold mb-1 opacity-75">{msg.senderName}</p>
                                    <p className="text-sm">{msg.content}</p>
                                  </div>
                                </div>
                              ))}
                              {collab.messages.length === 0 && <p className="text-center text-muted-foreground text-sm my-10">No messages yet.</p>}
                            </div>
                            <div className="flex gap-2 pt-2">
                              <Input
                                placeholder="Type your message..."
                                value={chatMessage}
                                onChange={e => setChatMessage(e.target.value)}
                                onKeyDown={e => {
                                  if (e.key === 'Enter' && chatMessage.trim()) {
                                    sendChatMessage(collab.id, myNGO.id, myNGO.name, chatMessage.trim());
                                    setChatMessage('');
                                  }
                                }}
                              />
                              <Button onClick={() => {
                                if (chatMessage.trim()) {
                                  sendChatMessage(collab.id, myNGO.id, myNGO.name, chatMessage.trim());
                                  setChatMessage('');
                                }
                              }}>Send</Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
