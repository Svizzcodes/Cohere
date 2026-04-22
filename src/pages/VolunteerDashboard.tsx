import { useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, CheckCircle, Clock, Award, FileText, Lightbulb, Download, Sparkles } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/lib/store';
import { toast } from 'sonner';
import { CountUp } from '@/components/CountUp';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { downloadCertificate } from '@/lib/certificate';

const QUOTES = [
  "Volunteers do not necessarily have the time; they just have the heart. – Elizabeth Andrew",
  "The best way to find yourself is to lose yourself in the service of others. – Mahatma Gandhi",
  "As you grow older, you will discover that you have two hands: one for helping yourself, the other for helping others. – Audrey Hepburn",
  "Volunteers are the only human beings on the face of the earth who reflect this nation's compassion. – Erma Bombeck",
];

export default function VolunteerDashboard() {
  const { currentUser, volunteerApps, events, certificates, ngos, applyVolunteer } = useAppStore();
  const [quote] = useState(() => QUOTES[Math.floor(Math.random() * QUOTES.length)]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  if (!currentUser) return null;

  const myApps = volunteerApps.filter(a => a.volunteerId === currentUser.id);
  const accepted = myApps.filter(a => a.status === 'accepted').length;
  const completed = myApps.filter(a => a.status === 'completed').length;
  const myCerts = certificates.filter(c => c.userId === currentUser.id);

  const suggested = events.filter(e => e.status === 'upcoming').slice(0, 4);

  const handleQuickApply = (post: typeof events[0]) => {
    const ngo = ngos.find(n => n.id === post.ngoId);
    if (!ngo) return;
    if (myApps.some(a => a.eventId === post.id)) {
      toast.info('You already applied to this event');
      return;
    }
    applyVolunteer({
      volunteerId: currentUser.id,
      volunteerName: currentUser.name,
      ngoId: ngo.id,
      ngoName: ngo.name,
      role: 'Event Volunteer',
      skills: currentUser.skills || [],
      eventId: post.id,
      eventTitle: post.title,
    });
    toast.success(`Applied to ${post.title}!`);
  };

  const handleDownloadCert = (certId: string) => {
    const cert = myCerts.find(c => c.id === certId);
    if (!cert) return;
    downloadCertificate({
      recipientName: cert.userName,
      recipientRole: 'Volunteer',
      eventTitle: cert.eventTitle,
      ngoName: cert.ngoName,
      description: cert.description,
      certificateId: cert.id.toUpperCase(),
      issuedAt: cert.issuedAt,
    });
    toast.success('Certificate downloaded!');
  };

  const selectedDateEvents = events.filter(e => {
    if (!selectedDate) return false;
    const ev = new Date(e.date);
    return ev.toDateString() === selectedDate.toDateString();
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      {/* Volunteer signature: warm secondary wash + accent glow */}
      <div className="absolute inset-x-0 top-0 h-[420px] bg-gradient-to-br from-accent/20 via-secondary/30 to-background -z-10" />
      <div className="absolute top-20 right-1/4 w-96 h-96 rounded-full bg-accent/10 blur-3xl -z-10 pointer-events-none" />
      <div className="absolute top-40 left-10 w-64 h-64 rounded-full bg-secondary/20 blur-3xl -z-10 pointer-events-none" />

      <div className="container mx-auto px-4 pt-24 pb-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8"
        >
          <div>
            <div className="inline-flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-accent" />
              <p className="text-xs font-semibold tracking-[0.2em] text-accent uppercase">Volunteer Dashboard</p>
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground">Welcome, {currentUser.name.split(' ')[0]}</h1>
            <p className="text-muted-foreground mt-2 max-w-xl">Track your contributions, discover new opportunities, and download certificates for the events you've helped bring to life.</p>
            {currentUser.skills && currentUser.skills.length > 0 && (
              <div className="flex gap-2 mt-4 flex-wrap">
                {currentUser.skills.map(s => (
                  <span key={s} className="text-xs px-3 py-1 rounded-full bg-card border border-accent/30 text-foreground/80 font-medium">{s}</span>
                ))}
              </div>
            )}
          </div>
          <div className="glass-card-elevated p-5 max-w-sm">
            <Sparkles className="w-5 h-5 text-accent mb-2" />
            <p className="font-display italic text-sm leading-relaxed text-foreground/80">"{quote}"</p>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Applications', value: myApps.length, icon: Briefcase, tint: 'text-info' },
            { label: 'Accepted', value: accepted, icon: CheckCircle, tint: 'text-success' },
            { label: 'Completed', value: completed, icon: Award, tint: 'text-accent' },
            { label: 'Certificates', value: myCerts.length, icon: FileText, tint: 'text-primary' },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card p-5"
            >
              <s.icon className={`w-5 h-5 ${s.tint} mb-3`} />
              <div className="text-3xl font-display font-bold text-foreground"><CountUp end={s.value} /></div>
              <p className="text-xs font-semibold text-muted-foreground mt-1 uppercase tracking-wider">{s.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* My Applications */}
          <div className="glass-card p-6 lg:col-span-2">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display text-xl font-bold text-foreground">My Applications</h2>
              <span className="text-xs text-muted-foreground">{myApps.length} total</span>
            </div>
            {myApps.length === 0 ? (
              <div className="text-center py-10 border border-dashed border-border rounded-lg">
                <Briefcase className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-50" />
                <p className="text-sm text-muted-foreground">No applications yet. Browse the suggested opportunities below.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {myApps.map(a => (
                  <div key={a.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/40 border border-border/60 hover:border-primary/40 transition-colors">
                    <div className="min-w-0">
                      <p className="font-semibold text-sm text-foreground truncate">{a.eventTitle || a.role}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{a.ngoName} · {a.role}</p>
                    </div>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize whitespace-nowrap ${
                      a.status === 'completed' ? 'bg-accent/10 text-accent' :
                      a.status === 'accepted' ? 'bg-success/10 text-success' :
                      'bg-info/10 text-info'
                    }`}>{a.status}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Suggested */}
          <div className="glass-card p-6">
            <h2 className="font-display text-xl font-bold text-foreground mb-5 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-warning" /> Suggested Events
            </h2>
            <div className="space-y-3">
              {suggested.map(p => (
                <div key={p.id} className="p-3 rounded-lg bg-muted/40 border border-border/60">
                  <p className="text-sm font-semibold text-foreground line-clamp-1">{p.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{p.ngoName}</p>
                  <Button size="sm" variant="outline" className="w-full mt-3" onClick={() => handleQuickApply(p)}>Apply</Button>
                </div>
              ))}
              {suggested.length === 0 && <p className="text-sm text-muted-foreground">No suggestions right now.</p>}
            </div>
          </div>
        </div>

        {/* Certificates Section — the marquee feature */}
        <div className="mt-8 glass-card-elevated p-6 md:p-8 relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-accent/10 blur-3xl pointer-events-none" />
          <div className="flex items-center justify-between mb-6 relative">
            <div>
              <h2 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
                <Award className="w-6 h-6 text-accent" /> Your Certificates
              </h2>
              <p className="text-sm text-muted-foreground mt-1">Issued automatically when an NGO verifies your participation.</p>
            </div>
            <span className="hidden sm:inline-flex text-xs px-3 py-1.5 rounded-full bg-accent/10 text-accent border border-accent/20 font-medium">
              {myCerts.length} earned
            </span>
          </div>

          {myCerts.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-border rounded-xl">
              <FileText className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-50" />
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                When you complete an event and the host NGO verifies your participation, a formal certificate will appear here ready to download.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4 relative">
              {myCerts.map(c => (
                <div key={c.id} className="group relative p-5 rounded-xl border-2 border-border bg-gradient-to-br from-card to-muted/30 hover:border-accent/40 transition-all">
                  <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                    <Award className="w-5 h-5 text-accent" />
                  </div>
                  <p className="text-[10px] font-bold tracking-[0.2em] text-accent uppercase mb-2">Certificate of Recognition</p>
                  <h3 className="font-display text-lg font-bold text-foreground pr-12 leading-tight">{c.eventTitle || 'Volunteer Service'}</h3>
                  <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{c.description}</p>
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/60">
                    <div className="text-xs">
                      <p className="font-semibold text-foreground">{c.ngoName}</p>
                      <p className="text-muted-foreground">{c.issuedAt.toLocaleDateString()}</p>
                    </div>
                    <Button size="sm" variant="hero" onClick={() => handleDownloadCert(c.id)}>
                      <Download className="w-3.5 h-3.5 mr-1" /> Download
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Calendar Section */}
        <div className="mt-8 glass-card p-6 md:p-8">
          <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
            <Clock className="w-6 h-6 text-primary" /> Event Schedule
          </h2>
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="flex justify-center p-4 bg-muted/30 rounded-xl border border-border">
              <style>{`.rdp { --rdp-cell-size: 48px; --rdp-accent-color: hsl(var(--primary)); } .rdp-day_selected, .rdp-day_selected:focus-visible, .rdp-day_selected:hover { background-color: var(--rdp-accent-color); color: white; } .has-event { font-weight: 800; position: relative; color: hsl(var(--primary)); } .has-event::after { content: ''; position: absolute; bottom: 8px; left: 50%; transform: translateX(-50%); width: 4px; height: 4px; background-color: hsl(var(--primary)); border-radius: 50%; }`}</style>
              <DayPicker
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                modifiers={{ hasEvent: events.map(e => e.date) }}
                modifiersClassNames={{ hasEvent: 'has-event' }}
              />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground mb-4">Events on {selectedDate?.toLocaleDateString()}</h3>
              <div className="space-y-3">
                {selectedDateEvents.length === 0 && (
                  <div className="text-center p-8 border border-dashed border-border rounded-xl">
                    <p className="text-sm text-muted-foreground">No events scheduled for this day.</p>
                  </div>
                )}
                {selectedDateEvents.map(ev => (
                  <div key={ev.id} className="p-4 rounded-xl bg-muted/30 border-l-4 border-primary hover:shadow-md transition-all">
                    <h4 className="font-bold text-base text-foreground">{ev.title}</h4>
                    <p className="text-xs font-semibold text-muted-foreground mb-2">{ev.ngoName} · {ev.location}</p>
                    <p className="text-sm line-clamp-2 text-foreground/80 mb-3">{ev.content}</p>
                    <Button size="sm" variant="hero" onClick={() => handleQuickApply(ev)}>Apply to Volunteer</Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
