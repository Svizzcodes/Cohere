// In-memory store for the platform (will be replaced with Supabase later)
import { create } from 'zustand';

export type UserRole = 'admin' | 'donor' | 'volunteer' | 'ngo';
export type ResourceCategory = 'food' | 'clothes' | 'essentials' | 'funds';
export type VolunteerStatus = 'applied' | 'accepted' | 'completed';
export type ProofStatus = 'pending' | 'verified';
export type NGOStatus = 'pending' | 'verified' | 'rejected';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  skills?: string[];
  bio?: string;
  location?: string;
  createdAt: Date;
}

export interface NGO {
  id: string;
  name: string;
  description: string;
  category: string;
  status: NGOStatus;
  userId: string;
  location: string;
  lat: number;
  lng: number;
  logo?: string;
  impactScore: number;
  mealsServed: number;
  donationsReceived: number;
  volunteersEngaged: number;
  createdAt: Date;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  category: ResourceCategory;
  quantity: number;
  unit: string;
  donorId: string;
  donorName: string;
  claimedById?: string;
  claimedByName?: string;
  location: string;
  lat: number;
  lng: number;
  status: 'available' | 'claimed' | 'delivered';
  createdAt: Date;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: Date;
}

export interface EventPost {
  id: string;
  ngoId: string;
  ngoName: string;
  title: string;
  content: string;
  imageUrl?: string;
  location: string;
  date: Date;
  status: 'upcoming' | 'past';
  likes: number;
  likedBy: string[];
  comments: Comment[];
  flags: string[];
  applicants: string[];
  donations: number;
  collaborators: string[];
  /** Admin-side verification of an event post (used to unlock NGO certificate) */
  adminVerified: boolean;
  createdAt: Date;
}

export interface RequestPost {
  id: string;
  authorId: string;
  authorName: string;
  title: string;
  content: string;
  location: string;
  type: 'volunteer' | 'resource';
  applicants: string[];
  status: 'open' | 'closed';
  createdAt: Date;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  createdAt: Date;
}

export interface Collaboration {
  id: string;
  requestorId: string;
  requestorName: string;
  targetId: string;
  targetName: string;
  eventId: string;
  status: 'pending' | 'accepted' | 'declined';
  messages: ChatMessage[];
  createdAt: Date;
}

export interface VolunteerApplication {
  id: string;
  volunteerId: string;
  volunteerName: string;
  ngoId: string;
  ngoName: string;
  role: string;
  skills: string[];
  status: VolunteerStatus;
  /** Optional event this application is tied to (used for per-event certs) */
  eventId?: string;
  eventTitle?: string;
  createdAt: Date;
}

export interface Proof {
  id: string;
  ngoId: string;
  ngoName: string;
  imageUrl: string;
  location: string;
  timestamp: Date;
  description: string;
  status: ProofStatus;
}

export interface Certificate {
  id: string;
  userId: string;
  userName: string;
  type: 'donation' | 'volunteer' | 'ngo';
  /** Title of the related event (if any) */
  eventTitle?: string;
  /** Related event ID (if any) */
  eventId?: string;
  description: string;
  issuedAt: Date;
  ngoName: string;
}

// Demo seed data
const seedNGOs: NGO[] = [
  { id: 'ngo-1', name: 'FeedForward Foundation', description: 'Redistributing surplus food to communities in need across urban areas.', category: 'Food', status: 'verified', userId: 'user-ngo-1', location: 'Mumbai, India', lat: 19.076, lng: 72.8777, impactScore: 92, mealsServed: 12450, donationsReceived: 340, volunteersEngaged: 89, createdAt: new Date('2024-01-15') },
  { id: 'ngo-2', name: 'WarmThreads Initiative', description: 'Providing clean clothing and essentials to underprivileged families.', category: 'Clothes', status: 'verified', userId: 'user-ngo-2', location: 'Delhi, India', lat: 28.6139, lng: 77.209, impactScore: 87, mealsServed: 0, donationsReceived: 560, volunteersEngaged: 124, createdAt: new Date('2024-02-20') },
  { id: 'ngo-3', name: 'HopeRise Collective', description: 'Empowering communities through micro-grants and skill development.', category: 'Funds', status: 'verified', userId: 'user-ngo-3', location: 'Bangalore, India', lat: 12.9716, lng: 77.5946, impactScore: 95, mealsServed: 8200, donationsReceived: 780, volunteersEngaged: 210, createdAt: new Date('2024-03-10') },
  { id: 'ngo-4', name: 'GreenPlate Network', description: 'Connecting restaurants with shelters to minimize food waste.', category: 'Food', status: 'pending', userId: 'user-ngo-4', location: 'Chennai, India', lat: 13.0827, lng: 80.2707, impactScore: 0, mealsServed: 0, donationsReceived: 0, volunteersEngaged: 0, createdAt: new Date('2024-06-01') },
];

const seedResources: Resource[] = [
  { id: 'res-1', title: '200 Meal Boxes', description: 'Freshly prepared vegetarian meal boxes, best consumed within 4 hours.', category: 'food', quantity: 200, unit: 'meals', donorId: 'user-donor-1', donorName: 'Sunrise Restaurant', location: 'Mumbai, India', lat: 19.076, lng: 72.8777, status: 'available', createdAt: new Date() },
  { id: 'res-2', title: 'Winter Clothing Bundle', description: '50 sets of warm jackets and blankets in good condition.', category: 'clothes', quantity: 50, unit: 'sets', donorId: 'user-donor-2', donorName: 'GoodWill Donors', location: 'Delhi, India', lat: 28.6139, lng: 77.209, status: 'available', createdAt: new Date() },
  { id: 'res-3', title: 'Hygiene Kits', description: 'Essential hygiene kits including soap, sanitizer, and masks.', category: 'essentials', quantity: 100, unit: 'kits', donorId: 'user-donor-1', donorName: 'Sunrise Restaurant', location: 'Bangalore, India', lat: 12.9716, lng: 77.5946, status: 'claimed', claimedById: 'ngo-3', claimedByName: 'HopeRise Collective', createdAt: new Date() },
];

const seedEvents: EventPost[] = [
  { id: 'evt-1', ngoId: 'ngo-1', ngoName: 'FeedForward Foundation', title: 'Mega Food Drive', content: 'Join us to distribute surplus food to over 500 families.', location: 'Mumbai, India', date: new Date(Date.now() + 86400000 * 3), status: 'upcoming', likes: 42, likedBy: [], comments: [], flags: [], applicants: [], donations: 15, collaborators: [], adminVerified: true, createdAt: new Date() },
  { id: 'evt-2', ngoId: 'ngo-2', ngoName: 'WarmThreads Initiative', title: 'Winter Blanket Distribution', content: 'We are organizing a blanket distribution drive before the peak winter.', location: 'Delhi, India', date: new Date(Date.now() + 86400000 * 5), status: 'upcoming', likes: 28, likedBy: [], comments: [], flags: [], applicants: [], donations: 8, collaborators: [], adminVerified: false, createdAt: new Date() },
];

const seedRequests: RequestPost[] = [
  { id: 'req-1', authorId: 'ngo-3', authorName: 'HopeRise Collective', title: 'Looking for Tech Mentors', content: 'Need volunteers skilled in programming for our weekend bootcamps.', location: 'Bangalore, India', type: 'volunteer', applicants: [], status: 'open', createdAt: new Date() },
];

const seedVolunteerApps: VolunteerApplication[] = [
  { id: 'va-1', volunteerId: 'user-vol-1', volunteerName: 'Priya Sharma', ngoId: 'ngo-1', ngoName: 'FeedForward Foundation', role: 'Food Distribution Coordinator', skills: ['logistics', 'driving'], status: 'accepted', createdAt: new Date() },
  { id: 'va-2', volunteerId: 'user-vol-2', volunteerName: 'Rahul Mehta', ngoId: 'ngo-3', ngoName: 'HopeRise Collective', role: 'Tech Mentor', skills: ['programming', 'teaching'], status: 'applied', createdAt: new Date() },
];

interface AppState {
  // Auth
  currentUser: User | null;
  users: User[];
  login: (email: string, password: string) => boolean;
  signup: (user: Omit<User, 'id' | 'createdAt'>, password: string) => boolean;
  logout: () => void;

  // NGOs
  ngos: NGO[];
  approveNGO: (id: string) => void;
  rejectNGO: (id: string) => void;

  // Resources
  resources: Resource[];
  addResource: (resource: Omit<Resource, 'id' | 'createdAt' | 'status'>) => void;
  claimResource: (resourceId: string, ngoId: string, ngoName: string) => void;

  // Events
  events: EventPost[];
  addEvent: (post: Omit<EventPost, 'id' | 'likes' | 'likedBy' | 'comments' | 'flags' | 'applicants' | 'donations' | 'collaborators' | 'createdAt' | 'adminVerified'>) => void;
  /** Admin verifies an NGO event post → also issues a certificate to the NGO */
  verifyEventPost: (eventId: string) => void;
  likeEvent: (eventId: string, userId: string) => void;
  commentEvent: (eventId: string, userId: string, userName: string, content: string) => void;
  flagEvent: (eventId: string, userId: string) => void;
  applyToEvent: (eventId: string, userId: string) => void;
  donateToEvent: (eventId: string) => void;

  // Requests
  requests: RequestPost[];
  addRequest: (post: Omit<RequestPost, 'id' | 'applicants' | 'status' | 'createdAt'>) => void;
  applyToRequest: (requestId: string, userId: string) => void;

  // Collaborations
  collaborations: Collaboration[];
  requestCollaboration: (requestorId: string, requestorName: string, targetId: string, targetName: string, eventId: string) => void;
  acceptCollaboration: (collabId: string) => void;
  declineCollaboration: (collabId: string) => void;
  sendChatMessage: (collabId: string, senderId: string, senderName: string, content: string) => void;

  // Volunteers
  volunteerApps: VolunteerApplication[];
  applyVolunteer: (app: Omit<VolunteerApplication, 'id' | 'status' | 'createdAt'>) => void;
  updateVolunteerStatus: (appId: string, status: VolunteerStatus) => void;

  // Proofs
  proofs: Proof[];
  addProof: (proof: Omit<Proof, 'id' | 'status'>) => void;
  verifyProof: (proofId: string) => void;

  // Certificates
  certificates: Certificate[];
  issueCertificate: (cert: Omit<Certificate, 'id' | 'issuedAt'>) => void;

  // Stats
  getStats: () => { mealsServed: number; donationsCompleted: number; volunteersEngaged: number; ngosActive: number };
}

const genId = () => Math.random().toString(36).substring(2, 10);

// Simple password store
const passwords: Record<string, string> = {
  'admin@cohere.org': 'admin123',
  'donor@cohere.org': 'donor123',
  'volunteer@cohere.org': 'volunteer123',
  'ngo@cohere.org': 'ngo123',
};

const seedUsers: User[] = [
  { id: 'user-admin', name: 'Admin', email: 'admin@cohere.org', role: 'admin', createdAt: new Date() },
  { id: 'user-donor-1', name: 'Sunrise Restaurant', email: 'donor@cohere.org', role: 'donor', location: 'Mumbai, India', createdAt: new Date() },
  { id: 'user-vol-1', name: 'Priya Sharma', email: 'volunteer@cohere.org', role: 'volunteer', skills: ['logistics', 'driving', 'cooking'], createdAt: new Date() },
  { id: 'user-ngo-1', name: 'FeedForward Foundation', email: 'ngo@cohere.org', role: 'ngo', createdAt: new Date() },
];

export const useAppStore = create<AppState>((set, get) => ({
  currentUser: null,
  users: seedUsers,
  ngos: seedNGOs,
  resources: seedResources,
  events: seedEvents,
  requests: seedRequests,
  collaborations: [],
  volunteerApps: seedVolunteerApps,
  proofs: [],
  certificates: [],

  login: (email, _password) => {
    const user = get().users.find(u => u.email === email);
    if (user && passwords[email] === _password) {
      set({ currentUser: user });
      return true;
    }
    return false;
  },

  signup: (userData, password) => {
    const exists = get().users.find(u => u.email === userData.email);
    if (exists) return false;
    const newUser: User = { ...userData, id: `user-${genId()}`, createdAt: new Date() };
    passwords[userData.email] = password;
    set(s => ({ users: [...s.users, newUser], currentUser: newUser }));
    if (userData.role === 'ngo') {
      const ngo: NGO = {
        id: `ngo-${genId()}`, name: userData.name, description: userData.bio || '',
        category: 'General', status: 'pending', userId: newUser.id,
        location: userData.location || '', lat: 19 + Math.random() * 10, lng: 73 + Math.random() * 7,
        impactScore: 0, mealsServed: 0, donationsReceived: 0, volunteersEngaged: 0, createdAt: new Date(),
      };
      set(s => ({ ngos: [...s.ngos, ngo] }));
    }
    return true;
  },

  logout: () => set({ currentUser: null }),

  approveNGO: (id) => set(s => ({ ngos: s.ngos.map(n => n.id === id ? { ...n, status: 'verified' as NGOStatus } : n) })),
  rejectNGO: (id) => set(s => ({ ngos: s.ngos.map(n => n.id === id ? { ...n, status: 'rejected' as NGOStatus } : n) })),

  addResource: (resource) => set(s => ({
    resources: [...s.resources, { ...resource, id: `res-${genId()}`, createdAt: new Date(), status: 'available' as const }]
  })),

  claimResource: (resourceId, ngoId, ngoName) => set(s => ({
    resources: s.resources.map(r => r.id === resourceId ? { ...r, status: 'claimed' as const, claimedById: ngoId, claimedByName: ngoName } : r)
  })),

  addEvent: (post) => set(s => ({
    events: [{ ...post, id: `evt-${genId()}`, likes: 0, likedBy: [], comments: [], flags: [], applicants: [], donations: 0, collaborators: [], adminVerified: false, createdAt: new Date() }, ...s.events]
  })),

  verifyEventPost: (eventId) => {
    const state = get();
    const evt = state.events.find(e => e.id === eventId);
    if (!evt || evt.adminVerified) {
      set(s => ({ events: s.events.map(e => e.id === eventId ? { ...e, adminVerified: true } : e) }));
      return;
    }
    set(s => ({
      events: s.events.map(e => e.id === eventId ? { ...e, adminVerified: true } : e),
      certificates: [...s.certificates, {
        id: `cert-${genId()}`,
        userId: evt.ngoId,
        userName: evt.ngoName,
        type: 'ngo' as const,
        eventTitle: evt.title,
        eventId: evt.id,
        description: `Outstanding execution of "${evt.title}" — verified by Cohere Admin`,
        ngoName: evt.ngoName,
        issuedAt: new Date(),
      }],
    }));
  },

  likeEvent: (eventId, userId) => set(s => ({
    events: s.events.map(p => {
      if (p.id !== eventId) return p;
      if (p.likedBy.includes(userId)) return { ...p, likes: p.likes - 1, likedBy: p.likedBy.filter(id => id !== userId) };
      return { ...p, likes: p.likes + 1, likedBy: [...p.likedBy, userId] };
    })
  })),

  commentEvent: (eventId, userId, userName, content) => set(s => ({
    events: s.events.map(p => p.id === eventId ? { ...p, comments: [...p.comments, { id: `cmt-${genId()}`, userId, userName, content, createdAt: new Date() }] } : p)
  })),

  flagEvent: (eventId, userId) => set(s => ({
    events: s.events.map(p => p.id === eventId && !p.flags.includes(userId) ? { ...p, flags: [...p.flags, userId] } : p)
  })),

  applyToEvent: (eventId, userId) => set(s => ({
    events: s.events.map(p => p.id === eventId && !p.applicants.includes(userId) ? { ...p, applicants: [...p.applicants, userId] } : p)
  })),

  donateToEvent: (eventId) => set(s => ({
    events: s.events.map(p => p.id === eventId ? { ...p, donations: p.donations + 1 } : p)
  })),

  addRequest: (post) => set(s => ({
    requests: [{ ...post, id: `req-${genId()}`, applicants: [], status: 'open', createdAt: new Date() }, ...s.requests]
  })),

  applyToRequest: (requestId, userId) => set(s => ({
    requests: s.requests.map(r => r.id === requestId && !r.applicants.includes(userId) ? { ...r, applicants: [...r.applicants, userId] } : r)
  })),

  requestCollaboration: (requestorId, requestorName, targetId, targetName, eventId) => set(s => ({
    collaborations: [...s.collaborations, { id: `collab-${genId()}`, requestorId, requestorName, targetId, targetName, eventId, status: 'pending', messages: [], createdAt: new Date() }]
  })),

  acceptCollaboration: (collabId) => {
    set(s => {
      const collab = s.collaborations.find(c => c.id === collabId);
      if (!collab) return s;
      const targetNgoId = collab.targetId;
      return {
        collaborations: s.collaborations.map(c => c.id === collabId ? { ...c, status: 'accepted' } : c),
        events: s.events.map(e => e.id === collab.eventId && !e.collaborators.includes(targetNgoId) ? { ...e, collaborators: [...e.collaborators, targetNgoId] } : e)
      };
    });
  },

  declineCollaboration: (collabId) => set(s => ({
    collaborations: s.collaborations.map(c => c.id === collabId ? { ...c, status: 'declined' } : c)
  })),

  sendChatMessage: (collabId, senderId, senderName, content) => set(s => ({
    collaborations: s.collaborations.map(c => c.id === collabId ? { ...c, messages: [...c.messages, { id: `msg-${genId()}`, senderId, senderName, content, createdAt: new Date() }] } : c)
  })),

  applyVolunteer: (app) => set(s => ({
    volunteerApps: [...s.volunteerApps, { ...app, id: `va-${genId()}`, status: 'applied' as const, createdAt: new Date() }]
  })),

  updateVolunteerStatus: (appId, status) => {
    const state = get();
    const app = state.volunteerApps.find(a => a.id === appId);
    set(s => ({
      volunteerApps: s.volunteerApps.map(a => a.id === appId ? { ...a, status } : a),
    }));
    // When NGO marks volunteer as completed (verified participation) → auto-issue per-event certificate
    if (app && status === 'completed') {
      const alreadyHas = state.certificates.some(c =>
        c.userId === app.volunteerId &&
        c.type === 'volunteer' &&
        ((app.eventId && c.eventId === app.eventId) || (!app.eventId && c.eventTitle === (app.eventTitle || app.role)))
      );
      if (!alreadyHas) {
        set(s => ({
          certificates: [...s.certificates, {
            id: `cert-${genId()}`,
            userId: app.volunteerId,
            userName: app.volunteerName,
            type: 'volunteer' as const,
            eventTitle: app.eventTitle || app.role,
            eventId: app.eventId,
            description: `For dedicated service as ${app.role} with ${app.ngoName}`,
            ngoName: app.ngoName,
            issuedAt: new Date(),
          }],
        }));
      }
    }
  },

  addProof: (proof) => set(s => ({
    proofs: [...s.proofs, { ...proof, id: `proof-${genId()}`, status: 'pending' as const }]
  })),

  verifyProof: (proofId) => set(s => ({
    proofs: s.proofs.map(p => p.id === proofId ? { ...p, status: 'verified' as ProofStatus } : p)
  })),

  issueCertificate: (cert) => set(s => ({
    certificates: [...s.certificates, { ...cert, id: `cert-${genId()}`, issuedAt: new Date() }]
  })),

  getStats: () => {
    const s = get();
    return {
      mealsServed: s.ngos.reduce((a, n) => a + n.mealsServed, 0),
      donationsCompleted: s.resources.filter(r => r.status === 'claimed' || r.status === 'delivered').length + s.ngos.reduce((a, n) => a + n.donationsReceived, 0),
      volunteersEngaged: s.volunteerApps.filter(a => a.status === 'accepted' || a.status === 'completed').length + s.ngos.reduce((a, n) => a + n.volunteersEngaged, 0),
      ngosActive: s.ngos.filter(n => n.status === 'verified').length,
    };
  },
}));
