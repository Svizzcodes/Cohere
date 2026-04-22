import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageSquare, Flag, DollarSign, UserPlus, Handshake, MapPin, Calendar, CheckCircle, Search, Settings, Home, Bell, Bookmark, Image as ImageIcon } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useAppStore } from '@/lib/store';
import { toast } from 'sonner';

export default function FeedPage() {
  const { 
    events, requests, currentUser, 
    addEvent, likeEvent, commentEvent, flagEvent, applyToEvent, donateToEvent,
    addRequest, applyToRequest, requestCollaboration, ngos 
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<'events' | 'requests'>('events');
  const [searchQuery, setSearchQuery] = useState('');
  const [newEventImage, setNewEventImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Event Posting State
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventContent, setNewEventContent] = useState('');
  const [newEventLoc, setNewEventLoc] = useState('');
  const [newEventType, setNewEventType] = useState<'upcoming' | 'past'>('upcoming');
  const [commentText, setCommentText] = useState<Record<string, string>>({});
  const [showComments, setShowComments] = useState<Record<string, boolean>>({});

  // Request Posting State
  const [newReqTitle, setNewReqTitle] = useState('');
  const [newReqContent, setNewReqContent] = useState('');
  const [newReqLoc, setNewReqLoc] = useState('');
  const [newReqType, setNewReqType] = useState<'volunteer' | 'resource'>('volunteer');

  // Donation State
  const [showDonateId, setShowDonateId] = useState<string | null>(null);
  const [donateDetails, setDonateDetails] = useState({ category: 'money' as string, amount: 1 });

  const userNGO = currentUser?.role === 'ngo' ? ngos.find(n => n.userId === currentUser.id && n.status === 'verified') : null;

  const handlePostEvent = () => {
    if (!userNGO) { toast.error('Only verified NGOs can post events here.'); return; }
    if (!newEventTitle || !newEventContent) { toast.error('Fill required fields'); return; }
    addEvent({
      ngoId: userNGO.id,
      ngoName: userNGO.name,
      title: newEventTitle,
      content: newEventContent,
      location: newEventLoc || userNGO.location,
      date: new Date(Date.now() + (newEventType === 'upcoming' ? 86400000 * 7 : -86400000)),
      status: newEventType,
      imageUrl: newEventImage || undefined
    });
    setNewEventTitle(''); setNewEventContent(''); setNewEventLoc(''); setNewEventImage(null);
    toast.success('Event published!');
  };

  const handlePostRequest = () => {
    if (!currentUser) { toast.error('Login required.'); return; }
    if (!newReqTitle || !newReqContent) { toast.error('Fill required fields'); return; }
    const isNGO = userNGO != null;
    addRequest({
      authorId: isNGO ? userNGO.id : currentUser.id,
      authorName: isNGO ? userNGO.name : currentUser.name,
      title: newReqTitle,
      content: newReqContent,
      location: newReqLoc || currentUser.location || '',
      type: newReqType
    });
    setNewReqTitle(''); setNewReqContent(''); setNewReqLoc('');
    toast.success('Request published!');
  };

  const handleComment = (eventId: string) => {
    if (!currentUser) { toast.error('Login to comment'); return; }
    const txt = commentText[eventId];
    if (!txt?.trim()) return;
    commentEvent(eventId, currentUser.id, currentUser.name, txt);
    setCommentText(prev => ({ ...prev, [eventId]: '' }));
  };

  const handleCollaborate = (event: typeof events[0]) => {
    if (!userNGO) return;
    requestCollaboration(userNGO.id, userNGO.name, event.ngoId, event.ngoName, event.id);
    toast.success(`Collaboration request sent to ${event.ngoName}!`);
  };

  const toggleComments = (eventId: string) => {
    setShowComments(prev => ({ ...prev, [eventId]: !prev[eventId] }));
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50">
      <Navbar />
      <div className="container mx-auto px-4 pt-16 pb-12 max-w-7xl flex gap-6 justify-center">
        
        {/* LEFT SIDEBAR NAVIGATION */}
        <div className="hidden md:block w-64 shrink-0 top-24 sticky h-fit">
          <div className="flex flex-col gap-2">
            <button onClick={() => setActiveTab('events')} className={`flex items-center gap-4 px-4 py-3 rounded-full text-xl font-bold transition-all ${activeTab === 'events' ? 'font-black bg-slate-200 dark:bg-slate-800' : 'hover:bg-slate-200/50 dark:hover:bg-slate-800/50'}`}>
              <Home className="w-7 h-7" /> Home (Events)
            </button>
            <button onClick={() => setActiveTab('requests')} className={`flex items-center gap-4 px-4 py-3 rounded-full text-xl font-bold transition-all ${activeTab === 'requests' ? 'font-black bg-slate-200 dark:bg-slate-800' : 'hover:bg-slate-200/50 dark:hover:bg-slate-800/50'}`}>
              <MessageSquare className="w-7 h-7" /> Resource Requests
            </button>
            <Button variant="hero" className="mt-4 rounded-full py-6 text-lg font-bold w-full shadow-md" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
              Post
            </Button>
          </div>
        </div>

        {/* CENTER FEED */}
        <div className="w-full max-w-2xl bg-white dark:bg-slate-900 border-x border-slate-200 dark:border-slate-800 min-h-screen pb-20 rounded-none sm:rounded-xl sm:border shadow-sm">
          {/* Header */}
          <div className="sticky top-[64px] z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 p-4 flex items-center justify-between cursor-pointer">
            <h1 className="text-xl font-bold">{activeTab === 'events' ? 'Home' : 'Resource Requests'}</h1>
            <Settings className="w-5 h-5 text-slate-500" />
          </div>

          {/* Post Input Component */}
          <AnimatePresence mode="wait">
            {activeTab === 'events' && userNGO && (
              <motion.div className="border-b border-slate-200 dark:border-slate-800 p-4 flex gap-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="w-12 h-12 rounded-full hero-gradient flex-none flex items-center justify-center text-white font-bold text-lg">{userNGO.name[0]}</div>
                <div className="flex-1">
                  <Input className="text-xl font-bold border-none px-0 focus-visible:ring-0 placeholder:text-slate-500 bg-transparent" value={newEventTitle} onChange={e => setNewEventTitle(e.target.value)} placeholder="What's happening?" />
                  <Textarea className="w-full text-lg border-none px-0 resize-none focus-visible:ring-0 placeholder:text-slate-500 min-h-[80px]" value={newEventContent} onChange={e => setNewEventContent(e.target.value)} placeholder="Add details..." />
                  {newEventImage && (
                    <div className="relative mt-2 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800">
                      <img src={newEventImage} alt="Preview" className="max-h-48 object-cover w-full" />
                      <Button variant="ghost" size="icon" className="absolute top-2 right-2 bg-black/50 text-white hover:bg-black/70 rounded-full h-8 w-8" onClick={() => setNewEventImage(null)}>✕</Button>
                    </div>
                  )}
                  <div className="border-t border-slate-100 dark:border-slate-800 pt-3 mt-2 flex items-center justify-between">
                    <div className="flex items-center gap-1 text-slate-500">
                       <Input value={newEventLoc} onChange={e => setNewEventLoc(e.target.value)} placeholder="Location..." className="h-8 text-sm w-32 border-slate-200" />
                       <input type="file" accept="image/*" ref={fileInputRef} className="hidden" onChange={e => { if (e.target.files?.[0]) setNewEventImage(URL.createObjectURL(e.target.files[0])); }} />
                       <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full text-primary hover:bg-primary/10" onClick={() => fileInputRef.current?.click()}><ImageIcon className="w-4 h-4" /></Button>
                       <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full text-primary hover:bg-primary/10"><Calendar className="w-4 h-4" /></Button>
                    </div>
                    <div className="flex items-center gap-2">
                      <select className="text-sm border-none bg-transparent text-primary outline-none cursor-pointer" value={newEventType} onChange={e => setNewEventType(e.target.value as 'upcoming' | 'past')}>
                        <option value="upcoming">Upcoming</option>
                        <option value="past">Past Event</option>
                      </select>
                      <Button variant="hero" className="rounded-full px-5 font-bold" onClick={handlePostEvent}>Post</Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'requests' && currentUser && (
              <motion.div className="border-b border-slate-200 dark:border-slate-800 p-4 flex gap-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="w-12 h-12 rounded-full bg-slate-200 text-slate-800 flex-none flex items-center justify-center font-bold text-lg">{currentUser.name[0]}</div>
                <div className="flex-1">
                  <Input className="text-xl font-bold border-none px-0 focus-visible:ring-0 placeholder:text-slate-500 bg-transparent" value={newReqTitle} onChange={e => setNewReqTitle(e.target.value)} placeholder="Need something?" />
                  <Textarea className="w-full text-lg border-none px-0 resize-none focus-visible:ring-0 placeholder:text-slate-500 min-h-[80px]" value={newReqContent} onChange={e => setNewReqContent(e.target.value)} placeholder="Describe requirement..." />
                  <div className="border-t border-slate-100 dark:border-slate-800 pt-3 mt-2 flex items-center justify-between">
                    <div className="flex items-center gap-1 text-slate-500">
                       <Input value={newReqLoc} onChange={e => setNewReqLoc(e.target.value)} placeholder="Location..." className="h-8 text-sm w-32 border-slate-200" />
                    </div>
                    <div className="flex items-center gap-2">
                       <select className="text-sm border-none bg-transparent text-primary outline-none cursor-pointer" value={newReqType} onChange={e => setNewReqType(e.target.value as 'volunteer' | 'resource')}>
                          <option value="volunteer">Need Volunteers</option>
                          <option value="resource">Need Resources</option>
                        </select>
                      <Button variant="hero" className="rounded-full px-5 font-bold" onClick={handlePostRequest}>Request</Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* POSTS LIST */}
          <div className="divide-y divide-slate-200 dark:divide-slate-800">
            {activeTab === 'events' && events.filter(e => !searchQuery || e.title.toLowerCase().includes(searchQuery.toLowerCase()) || e.content.toLowerCase().includes(searchQuery.toLowerCase()) || e.ngoName.toLowerCase().includes(searchQuery.toLowerCase())).map((event, i) => {
              const isLiked = currentUser && event.likedBy.includes(currentUser.id);
              const isFlagged = currentUser && event.flags.includes(currentUser.id);
              const hasApplied = currentUser && event.applicants.includes(currentUser.id);
              const isMyEvent = userNGO && event.ngoId === userNGO.id;
              const isLinked = event.collaborators.length > 0;
              const pseudoHandle = "@" + event.ngoName.replace(/\s+/g, '').toLowerCase();

              return (
                <motion.div key={event.id} className="p-4 flex gap-3 hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors cursor-pointer" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}>
                  <div className="w-12 h-12 rounded-full hero-gradient flex-none flex items-center justify-center text-white font-bold text-lg shadow-sm">{event.ngoName[0]}</div>
                  <div className="flex-1 min-w-0">
                    {/* Header */}
                    <div className="flex flex-wrap items-center justify-between gap-1 mb-1 relative">
                      <div className="flex items-center gap-1.5 overflow-hidden">
                        <span className="font-bold text-[15px] truncate hover:underline">{event.ngoName}</span>
                        {isLinked && <CheckCircle className="w-4 h-4 text-primary shrink-0" />}
                        <span className="text-slate-500 text-[15px] truncate">{pseudoHandle}</span>
                        <span className="text-slate-500">·</span>
                        <span className="text-slate-500 text-[15px] shrink-0">{event.date.toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}</span>
                      </div>
                    </div>
                    
                    {/* Title & Content */}
                    <h2 className="text-[15px] font-bold mt-1 text-slate-900 dark:text-white leading-tight">{event.title}</h2>
                    <p className="text-[15px] leading-relaxed text-slate-800 dark:text-slate-200 mt-1 whitespace-pre-wrap">{event.content}</p>

                    {event.imageUrl && (
                      <div className="mt-3 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800">
                        <img src={event.imageUrl} alt="Event attachment" className="w-full h-auto object-cover max-h-96" />
                      </div>
                    )}

                    {/* Metadata line */}
                    <div className="flex gap-4 text-[13px] text-slate-500 mt-3 font-medium">
                      <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5"/> {event.location}</span>
                      <span className={`px-2 py-0.5 rounded-full ${event.status === 'upcoming' ? 'bg-primary/10 text-primary' : 'bg-slate-100 text-slate-500'}`}>
                        {event.status.toUpperCase()}
                      </span>
                    </div>

                    {/* Twitter-style Action Bar */}
                    <div className="flex items-center justify-between text-slate-500 mt-3 max-w-md">
                      <button className="flex items-center gap-1.5 hover:text-blue-500 group" onClick={(e) => { e.stopPropagation(); toggleComments(event.id); }}>
                        <div className="p-2 rounded-full group-hover:bg-blue-500/10 transition-colors"><MessageSquare className="w-4 h-4" /></div>
                        <span className="text-[13px]">{event.comments.length}</span>
                      </button>
                      
                      <div className="flex items-center gap-4">
                        <button className={`flex items-center gap-1.5 group ${isLiked ? 'text-pink-500' : 'hover:text-pink-500'}`} onClick={(e) => { e.stopPropagation(); currentUser ? likeEvent(event.id, currentUser.id) : toast.error('Login required'); }}>
                          <div className="p-2 rounded-full group-hover:bg-pink-500/10 transition-colors"><Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} /></div>
                          <span className="text-[13px]">{event.likes}</span>
                        </button>

                        <button className={`flex items-center gap-1.5 group ${isFlagged ? 'text-orange-500' : 'hover:text-orange-500'}`} onClick={(e) => { 
                          e.stopPropagation(); 
                          if (!currentUser) { toast.error('Login required'); return; }
                          flagEvent(event.id, currentUser.id);
                          if (!isFlagged) toast.success('Event flagged for review');
                        }}>
                          <div className="p-2 rounded-full group-hover:bg-orange-500/10 transition-colors"><Flag className={`w-4 h-4 ${isFlagged ? 'fill-current' : ''}`} /></div>
                          <span className="text-[13px]">{event.flags.length}</span>
                        </button>
                      </div>
                    </div>

                    {/* Prominent Action Buttons */}
                    <div className="mt-4 flex flex-wrap gap-2" onClick={e => e.stopPropagation()}>
                      {event.status === 'upcoming' && (
                           <Button variant={hasApplied ? "outline" : "default"} size="sm" className="rounded-full px-5 font-bold shadow-sm" onClick={() => {
                              if (!currentUser) { toast.error('Login required'); return; }
                              if (hasApplied) { toast.info('Already applied'); return; }
                              applyToEvent(event.id, currentUser.id); toast.success('Applied to volunteer!');
                            }}>
                              {hasApplied ? <span className="flex items-center"><CheckCircle className="w-4 h-4 mr-2"/> Applied ({event.applicants.length})</span> : <span className="flex items-center"><UserPlus className="w-4 h-4 mr-2"/> Volunteer</span>}
                            </Button>
                      )}
                      
                      <Dialog open={showDonateId === event.id} onOpenChange={(open) => setShowDonateId(open ? event.id : null)}>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="rounded-full px-5 font-bold shadow-sm text-emerald-600 border-emerald-600 hover:bg-emerald-50 dark:text-emerald-400 dark:border-emerald-400 dark:hover:bg-emerald-950/30" onClick={(e) => { e.stopPropagation(); if (!currentUser) { toast.error('Login required'); e.preventDefault(); return; } }}>
                            <DollarSign className="w-4 h-4 mr-2" /> Donate
                          </Button>
                        </DialogTrigger>
                        <DialogContent onClick={e => e.stopPropagation()}>
                          <DialogHeader><DialogTitle>Make a Donation</DialogTitle></DialogHeader>
                          <div className="space-y-4 mt-4">
                            <div>
                              <Label>What would you like to donate?</Label>
                              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1" 
                                value={donateDetails.category} onChange={e => setDonateDetails(p => ({ ...p, category: e.target.value }))}>
                                <option value="money">Money (Funds)</option><option value="food">Food</option><option value="clothes">Clothes</option><option value="essentials">Essentials</option>
                              </select>
                            </div>
                            <div>
                              <Label>{donateDetails.category === 'money' ? 'Amount (₹)' : 'Quantity / Items'}</Label>
                              <Input type="number" min="1" value={donateDetails.amount} onChange={e => setDonateDetails(p => ({ ...p, amount: +e.target.value }))} />
                            </div>
                            <Button variant="hero" className="w-full rounded-full" onClick={() => {
                              donateToEvent(event.id); toast.success(`Donated ${donateDetails.amount}!`); setShowDonateId(null);
                            }}>Confirm Donation</Button>
                          </div>
                        </DialogContent>
                      </Dialog>

                      {userNGO && userNGO.id !== event.ngoId && (
                        <Button variant="outline" size="sm" className="rounded-full px-5 font-bold shadow-sm text-blue-600 border-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-400 dark:hover:bg-blue-950/30" onClick={(e) => { e.stopPropagation(); handleCollaborate(event); }}>
                          <Handshake className="w-4 h-4 mr-2" /> Collaborate
                        </Button>
                      )}
                    </div>

                    {/* Expanded Comments */}
                    {showComments[event.id] && (
                       <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800" onClick={e => e.stopPropagation()}>
                         <div className="space-y-3 mb-3">
                           {event.comments.map(cmt => (
                             <div key={cmt.id} className="flex gap-2">
                               <div className="w-6 h-6 rounded-full bg-slate-200 text-[10px] flex items-center justify-center font-bold">{cmt.userName[0]}</div>
                               <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl rounded-tl-none px-3 py-2 text-[14px]">
                                 <span className="font-bold mr-1">{cmt.userName}</span>
                                 <span>{cmt.content}</span>
                               </div>
                             </div>
                           ))}
                           {event.comments.length === 0 && <p className="text-[13px] text-slate-500">No comments yet. Be the first to reply!</p>}
                         </div>
                         <div className="flex gap-2 items-center">
                           <div className="w-6 h-6 rounded-full bg-slate-200 text-[10px] flex items-center justify-center font-bold">
                              {currentUser ? currentUser.name[0] : '?'}
                           </div>
                           <Input placeholder="Post your reply..." className="h-9 rounded-full text-[14px] bg-slate-100 dark:bg-slate-800 border-none px-4" value={commentText[event.id] || ''} onChange={e => setCommentText(p => ({ ...p, [event.id]: e.target.value }))} onKeyDown={e => e.key === 'Enter' && handleComment(event.id)} />
                           <Button size="sm" className="rounded-full font-bold px-4 h-9" onClick={() => handleComment(event.id)}>Reply</Button>
                         </div>
                       </div>
                    )}

                  </div>
                </motion.div>
              );
            })}

            {/* Requests Tab Render */}
            {activeTab === 'requests' && requests.filter(r => !searchQuery || r.title.toLowerCase().includes(searchQuery.toLowerCase()) || r.content.toLowerCase().includes(searchQuery.toLowerCase()) || r.authorName.toLowerCase().includes(searchQuery.toLowerCase())).map((req, i) => {
              const hasApplied = currentUser && req.applicants.includes(currentUser.id);
              const pseudoHandle = "@" + req.authorName.replace(/\s+/g, '').toLowerCase();

              return (
                <motion.div key={req.id} className="p-4 flex gap-3 hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors border-b border-slate-200 dark:border-slate-800 cursor-pointer" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}>
                  <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-700 flex-none flex items-center justify-center text-slate-800 dark:text-white font-bold text-lg">{req.authorName[0]}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 overflow-hidden mb-1">
                      <span className="font-bold text-[15px] truncate hover:underline">{req.authorName}</span>
                      <span className="text-slate-500 text-[15px] truncate">{pseudoHandle}</span>
                    </div>
                    <h2 className="text-[15px] font-bold text-slate-900 dark:text-white mb-1 leading-tight">{req.title}</h2>
                    <p className="text-[15px] leading-relaxed text-slate-800 dark:text-slate-200 mb-2">{req.content}</p>
                    
                    <div className="flex gap-4 text-[13px] text-slate-500 mb-3 font-medium">
                      <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5"/> {req.location}</span>
                      <span className={`px-2 py-0.5 rounded-full ${req.type === 'volunteer' ? 'bg-primary/10 text-primary' : 'bg-pink-500/10 text-pink-500'}`}>
                        {req.type.toUpperCase()} NEEDED
                      </span>
                    </div>
                    
                    {req.status === 'open' && (
                      <div className="mt-2" onClick={e => e.stopPropagation()}>
                        <Button variant={hasApplied ? "outline" : "default"} size="sm" className="rounded-full px-5 font-bold shadow-sm" onClick={() => {
                          if (!currentUser) { toast.error('Login required'); return; }
                          if (hasApplied) { toast.info('Already applied'); return; }
                          applyToRequest(req.id, currentUser.id); toast.success('Application sent!');
                        }}>
                          {hasApplied ? <span className="flex items-center"><CheckCircle className="w-4 h-4 mr-2"/> Responded</span> : <span className="flex items-center"><Handshake className="w-4 h-4 mr-2"/> Respond & Help</span>}
                        </Button>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* RIGHT SIDEBAR - TRENDS/SUGGESTED */}
        <div className="hidden lg:block w-80 shrink-0 top-24 sticky h-fit">
          {/* Search bar */}
          <div className="relative mb-4">
             <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 focus-within:text-primary" />
             <Input placeholder="Search impact..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="bg-slate-200 dark:bg-slate-800 border-none rounded-full pl-11 h-12 text-[15px] focus-visible:ring-1 focus-visible:ring-primary focus-visible:bg-white dark:focus-visible:bg-slate-900 transition-colors shadow-sm" />
          </div>

          <div className="bg-slate-100 dark:bg-slate-900 rounded-2xl pt-4 pb-2 mb-4 border border-slate-200/50 dark:border-slate-800">
            <h3 className="font-black text-xl px-4 mb-4">Trending Impacts</h3>
            <div className="hover:bg-slate-200/50 dark:hover:bg-slate-800/50 px-4 py-2 cursor-pointer transition-colors" onClick={() => setSearchQuery('TeachForIndia')}>
              <p className="text-[13px] text-slate-500 font-medium">Education · Trending</p>
              <p className="font-bold text-[15px] mt-0.5">#TeachForIndia</p>
              <p className="text-[13px] text-slate-500 mt-0.5">2,504 Posts</p>
            </div>
            <div className="hover:bg-slate-200/50 dark:hover:bg-slate-800/50 px-4 py-2 cursor-pointer transition-colors" onClick={() => setSearchQuery('Cyclone Recovery Efforts')}>
              <p className="text-[13px] text-slate-500 font-medium">Disaster Relief · Live</p>
              <p className="font-bold text-[15px] mt-0.5">Cyclone Recovery Efforts</p>
              <p className="text-[13px] text-slate-500 mt-0.5">Verified updates only</p>
            </div>
            <div className="hover:bg-slate-200/50 dark:hover:bg-slate-800/50 px-4 py-2 cursor-pointer transition-colors" onClick={() => setSearchQuery('Beach Cleanup')}>
              <p className="text-[13px] text-slate-500 font-medium">Sustainability · Trending</p>
              <p className="font-bold text-[15px] mt-0.5">Beach Cleanup Drive 🌊</p>
              <p className="text-[13px] text-slate-500 mt-0.5">1,245 Posts</p>
            </div>
            <div className="px-4 py-3 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 rounded-b-2xl cursor-pointer">
              <span className="text-primary text-[15px] hover:underline">Show more</span>
            </div>
          </div>

          <div className="bg-slate-100 dark:bg-slate-900 rounded-2xl pt-4 pb-2 border border-slate-200/50 dark:border-slate-800">
            <h3 className="font-black text-xl px-4 mb-4">Who to collaborate with</h3>
            {ngos.slice(0, 3).map(n => (
               <div key={n.id} className="flex items-center justify-between hover:bg-slate-200/50 dark:hover:bg-slate-800/50 px-4 py-3 cursor-pointer transition-colors">
                 <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full bg-slate-300 dark:bg-slate-700 flex items-center justify-center font-bold">{n.name[0]}</div>
                   <div>
                     <p className="font-bold text-[15px] hover:underline leading-tight truncate w-32">{n.name}</p>
                     <p className="text-[13px] text-slate-500 truncate w-32">@{n.name.replace(/\s+/g, '').toLowerCase()}</p>
                   </div>
                 </div>
                 <Button variant="outline" size="sm" className="rounded-full font-bold h-8 border-slate-300 dark:border-slate-700">Follow</Button>
               </div>
            ))}
            <div className="px-4 py-3 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 rounded-b-2xl cursor-pointer">
              <span className="text-primary text-[15px] hover:underline">Show more</span>
            </div>
          </div>
          
          <div className="px-4 mt-4 flex flex-wrap gap-x-3 gap-y-1 text-[13px] text-slate-500">
             <span className="hover:underline cursor-pointer">Terms of Service</span>
             <span className="hover:underline cursor-pointer">Privacy Policy</span>
             <span className="hover:underline cursor-pointer">Cookie Policy</span>
             <span className="hover:underline cursor-pointer">Accessibility</span>
             <span className="hover:underline cursor-pointer">Ads info</span>
             <span className="hover:underline cursor-pointer">More ...</span>
             <span>© 2026 Cohere Corp.</span>
          </div>
        </div>

      </div>
    </div>
  );
}
