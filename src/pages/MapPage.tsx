import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { useAppStore, EventPost, NGO } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { DollarSign, UserPlus, X, Calendar, MapPin, Search } from 'lucide-react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl, useMap } from 'react-leaflet';

const eventIcon = L.divIcon({
  html: `<div style="position:relative;"><div style="background:hsl(153,40%,24%);width:34px;height:34px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-weight:600;font-size:13px;border:3px solid white;box-shadow:0 6px 16px hsla(153,40%,24%,0.45);">●</div><div style="position:absolute;inset:-6px;border-radius:50%;border:2px solid hsl(153,40%,24%);opacity:0.35;animation:pulse 2s ease-out infinite;"></div></div>`,
  className: 'event-marker bg-transparent',
  iconSize: [34, 34],
  iconAnchor: [17, 17],
  popupAnchor: [0, -17],
});

function MapController({ selectedEvent, ngos }: { selectedEvent: EventPost | null, ngos: NGO[] }) {
  const map = useMap();
  useEffect(() => {
    if (selectedEvent) {
      const ngo = ngos.find(n => n.id === selectedEvent.ngoId);
      if (ngo) map.flyTo([ngo.lat, ngo.lng], 11, { duration: 1.2 });
    }
  }, [selectedEvent, map, ngos]);
  return null;
}

export default function MapPage() {
  const { ngos, events, currentUser, applyToEvent, donateToEvent } = useAppStore();
  const [selectedEvent, setSelectedEvent] = useState<EventPost | null>(null);
  const [search, setSearch] = useState('');

  // Filter visible events
  const now = Date.now();
  const in7Days = now + 7 * 24 * 60 * 60 * 1000;
  const visibleEvents = events.filter(e => {
    const t = e.date.getTime();
    if (!(e.status === 'upcoming' && t >= now - 86400000 && t <= in7Days)) return false;
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return e.title.toLowerCase().includes(q) || e.ngoName.toLowerCase().includes(q) || e.location.toLowerCase().includes(q);
  });

  const handleVolunteer = (evt: EventPost) => {
    if (!currentUser) { toast.error('Please login first'); return; }
    if (evt.applicants.includes(currentUser.id)) { toast.info('Already applied'); return; }
    applyToEvent(evt.id, currentUser.id);
    toast.success('Successfully applied!');
    setSelectedEvent(null);
  };

  const handleDonate = (evt: EventPost) => {
    if (!currentUser) { toast.error('Please login first'); return; }
    donateToEvent(evt.id);
    toast.success('Donation initiated');
    setSelectedEvent(null);
  };

  const focusEvent = (evt: EventPost) => {
    setSelectedEvent(evt);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 pt-24 pb-8">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <p className="text-xs font-semibold tracking-[0.2em] text-primary uppercase mb-2">Live Impact Map</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground">Find what's happening near you</h1>
          <p className="text-muted-foreground mt-2 max-w-2xl">Verified events from partner NGOs over the next 7 days. Tap a pin to volunteer or donate on the spot.</p>
        </motion.div>

        <div className="grid lg:grid-cols-[340px_1fr] gap-6">
          {/* Sidebar */}
          <aside className="glass-card p-5 h-fit lg:sticky lg:top-20 max-h-[78vh] overflow-hidden flex flex-col">
            <div className="relative mb-4">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search events, NGOs, cities..."
                className="pl-9"
              />
            </div>
            <div className="flex items-center gap-2 mb-4">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" /> {visibleEvents.length} live
              </span>
              <span className="text-xs text-muted-foreground">Next 7 days</span>
            </div>
            <div className="overflow-y-auto -mr-2 pr-2 space-y-2 flex-1">
              {visibleEvents.length === 0 && (
                <div className="text-center py-10 border border-dashed border-border rounded-lg">
                  <MapPin className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-50" />
                  <p className="text-sm text-muted-foreground">No matching events.</p>
                </div>
              )}
              {visibleEvents.map(evt => (
                <button
                  key={evt.id}
                  onClick={() => focusEvent(evt)}
                  className={`w-full text-left p-3 rounded-lg border transition-all ${
                    selectedEvent?.id === evt.id
                      ? 'bg-primary/10 border-primary/40'
                      : 'bg-muted/30 border-border/60 hover:border-primary/30 hover:bg-muted/60'
                  }`}
                >
                  <p className="font-semibold text-sm text-foreground line-clamp-1">{evt.title}</p>
                  <p className="text-xs text-primary font-medium mt-0.5">{evt.ngoName}</p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-2">
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {evt.location}</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {evt.date.toLocaleDateString()}</span>
                  </div>
                </button>
              ))}
            </div>
          </aside>

          {/* Map */}
          <div className="relative rounded-2xl overflow-hidden border border-border shadow-xl h-[78vh] z-10">
            <style>{`
              @keyframes pulse { 0% { transform: scale(0.9); opacity: 0.6; } 100% { transform: scale(1.6); opacity: 0; } }
              .leaflet-popup-content { margin: 0 !important; min-width: 280px !important; }
              .leaflet-popup-content-wrapper { padding: 0 !important; overflow: hidden; border-radius: 12px; }
            `}</style>
            
            <MapContainer center={[20.5, 78.9]} zoom={5} scrollWheelZoom={true} zoomControl={false} className="w-full h-full bg-muted">
              <TileLayer
                attribution='&copy; OpenStreetMap &copy; CARTO'
                url='https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
                subdomains='abcd'
                maxZoom={19}
              />
              <ZoomControl position="bottomright" />
              <MapController selectedEvent={selectedEvent} ngos={ngos} />

              {visibleEvents.map(evt => {
                const ngo = ngos.find(n => n.id === evt.ngoId);
                if (!ngo) return null;
                return (
                  <Marker 
                    key={evt.id} 
                    position={[ngo.lat, ngo.lng]} 
                    icon={eventIcon}
                    eventHandlers={{
                      click: () => setSelectedEvent(evt)
                    }}
                  >
                    {selectedEvent?.id === evt.id && (
                      <Popup closeButton={false} autoPanPadding={[50, 50]}>
                        <div className="bg-background text-foreground p-5 relative rounded-xl border border-border">
                          <button
                            className="absolute top-3 right-3 w-7 h-7 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center text-muted-foreground transition-colors"
                            onClick={(e) => { e.stopPropagation(); setSelectedEvent(null); }}
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                          <p className="text-[10px] font-bold tracking-[0.2em] text-primary uppercase mb-1">Verified Event</p>
                          <h2 className="font-display text-xl font-bold text-foreground pr-8 leading-tight">{evt.title}</h2>
                          <p className="text-sm font-medium text-primary mt-1">{evt.ngoName}</p>

                          <div className="flex flex-wrap gap-2 text-xs text-muted-foreground mt-3">
                            <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {evt.date.toLocaleDateString()}</span>
                            <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {evt.location}</span>
                          </div>

                          <p className="text-sm text-foreground/80 leading-relaxed mt-3 line-clamp-3">{evt.content}</p>

                          <div className="flex gap-2 mt-5">
                            <Button className="flex-1 h-9 text-xs" variant="hero" onClick={(e) => { e.stopPropagation(); handleVolunteer(evt); }}>
                              <UserPlus className="w-3.5 h-3.5 mr-1" /> Volunteer
                            </Button>
                            <Button className="flex-1 h-9 text-xs" variant="outline" onClick={(e) => { e.stopPropagation(); handleDonate(evt); }}>
                              <DollarSign className="w-3.5 h-3.5 mr-1" /> Donate
                            </Button>
                          </div>
                        </div>
                      </Popup>
                    )}
                  </Marker>
                );
              })}
            </MapContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
