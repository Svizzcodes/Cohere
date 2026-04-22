import { useState } from 'react';
import { useNavigate, useParams, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, ArrowLeft, Heart, Hand, Building2, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAppStore, UserRole } from '@/lib/store';
import { toast } from 'sonner';

const ROLE_THEME: Record<UserRole, {
  label: string;
  tagline: string;
  description: string;
  icon: typeof Heart;
  gradient: string;
  accent: string;
  badge: string;
  demo: { email: string; pw: string };
  highlights: string[];
  // Visual distinction properties
  cardStyle: string;
  iconBg: string;
  iconRing: string;
  buttonVariant: 'default' | 'hero' | 'warm' | 'outline';
  bgPattern: string;
}> = {
  donor: {
    label: 'Donor',
    tagline: 'Generosity, organised.',
    description: 'Sign in to post resources and watch verified NGOs collect them within hours.',
    icon: Heart,
    gradient: 'from-rose-500/20 via-rose-400/10 to-transparent',
    accent: 'text-rose-500',
    badge: 'bg-rose-500/10 text-rose-600 border-rose-200/50',
    demo: { email: 'donor@cohere.org', pw: 'donor123' },
    highlights: ['Post surplus in seconds', 'Real-time pickup tracking', 'Downloadable contribution certificates'],
    // Distinct visual style: Warm, caring, heart-centered
    cardStyle: 'border-rose-200/30 bg-gradient-to-br from-rose-50/50 to-white/80 backdrop-blur-sm',
    iconBg: 'bg-rose-500',
    iconRing: 'ring-2 ring-rose-400/30 ring-offset-2 ring-offset-rose-50',
    buttonVariant: 'hero' as const,
    bgPattern: 'radial-gradient(circle at 20% 80%, rgba(244,63,94,0.08) 0%, transparent 50%)',
  },
  volunteer: {
    label: 'Volunteer',
    tagline: 'Show up. Make it count.',
    description: 'Sign in to apply for events near you and earn formal recognition for every shift.',
    icon: Hand,
    gradient: 'from-emerald-500/20 via-emerald-400/10 to-transparent',
    accent: 'text-emerald-600',
    badge: 'bg-emerald-500/10 text-emerald-600 border-emerald-200/50',
    demo: { email: 'volunteer@cohere.org', pw: 'volunteer123' },
    highlights: ['Discover nearby drives', 'Verified by host NGO', 'Per-event downloadable certificates'],
    // Distinct visual style: Fresh, energetic, growth-oriented
    cardStyle: 'border-emerald-200/30 bg-gradient-to-br from-emerald-50/50 to-white/80 backdrop-blur-sm',
    iconBg: 'bg-emerald-500',
    iconRing: 'ring-2 ring-emerald-400/30 ring-offset-2 ring-offset-emerald-50',
    buttonVariant: 'warm' as const,
    bgPattern: 'radial-gradient(circle at 80% 20%, rgba(16,185,129,0.08) 0%, transparent 50%)',
  },
  ngo: {
    label: 'NGO',
    tagline: 'Mobilize the network.',
    description: 'Sign in to claim resources, post events, and verify the volunteers powering your mission.',
    icon: Building2,
    gradient: 'from-violet-500/20 via-violet-400/10 to-transparent',
    accent: 'text-violet-600',
    badge: 'bg-violet-500/10 text-violet-600 border-violet-200/50',
    demo: { email: 'ngo@cohere.org', pw: 'ngo123' },
    highlights: ['Coordinate live events', 'GPS-stamped impact proofs', 'Organization recognition certificates'],
    // Distinct visual style: Professional, trustworthy, institutional
    cardStyle: 'border-violet-200/30 bg-gradient-to-br from-violet-50/50 to-white/80 backdrop-blur-sm',
    iconBg: 'bg-violet-500',
    iconRing: 'ring-2 ring-violet-400/30 ring-offset-2 ring-offset-violet-50',
    buttonVariant: 'hero' as const,
    bgPattern: 'radial-gradient(circle at 50% 50%, rgba(139,92,246,0.06) 0%, transparent 60%)',
  },
  admin: {
    label: 'Admin',
    tagline: 'Stewards of the platform.',
    description: 'Sign in to verify NGOs, validate proofs, and approve event posts.',
    icon: Shield,
    gradient: 'from-amber-500/20 via-amber-400/10 to-transparent',
    accent: 'text-amber-600',
    badge: 'bg-amber-500/10 text-amber-600 border-amber-200/50',
    demo: { email: 'admin@cohere.org', pw: 'admin123' },
    highlights: ['NGO verification queue', 'Proof validation', 'Event certification authority'],
    // Distinct visual style: Authoritative, premium, exclusive
    cardStyle: 'border-amber-200/40 bg-gradient-to-br from-amber-50/60 via-white/80 to-amber-50/40 backdrop-blur-sm shadow-amber-500/5',
    iconBg: 'bg-amber-500',
    iconRing: 'ring-2 ring-amber-400/40 ring-offset-2 ring-offset-amber-50',
    buttonVariant: 'outline' as const,
    bgPattern: 'radial-gradient(ellipse at 30% 70%, rgba(245,158,11,0.1) 0%, transparent 50%), radial-gradient(ellipse at 70% 30%, rgba(245,158,11,0.08) 0%, transparent 40%)',
  },
};

export default function RoleLoginPage() {
  const { role } = useParams<{ role: string }>();
  const navigate = useNavigate();
  const { login } = useAppStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);

  if (!role || !(role in ROLE_THEME)) {
    return <Navigate to="/login" replace />;
  }
  const r = role as UserRole;
  const theme = ROLE_THEME[r];
  const Icon = theme.icon;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(email, password)) {
      const user = useAppStore.getState().currentUser;
      if (user && user.role !== r) {
        toast.error(`This account is registered as a ${user.role}. Use that login instead.`);
        useAppStore.getState().logout();
        return;
      }
      toast.success('Welcome back!');
      navigate(`/dashboard/${r}`);
    } else {
      toast.error('Invalid credentials');
    }
  };

  const useDemo = () => {
    setEmail(theme.demo.email);
    setPassword(theme.demo.pw);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Role-specific decorative background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${theme.gradient} pointer-events-none`} />
      <div className="absolute -top-40 -right-40 w-[520px] h-[520px] rounded-full bg-secondary/20 blur-3xl pointer-events-none" />
      {/* Role-specific pattern overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-60"
        style={{ background: theme.bgPattern }}
      />

      <div className="container mx-auto px-4 py-10 relative">
        <Link to="/login" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" /> Choose a different role
        </Link>

        <div className="grid lg:grid-cols-2 gap-12 items-center mt-8 max-w-6xl">
          {/* Left: pitch */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            className="hidden lg:block"
          >
            <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border ${theme.badge}`}>
              <Icon className="w-3.5 h-3.5" /> {theme.label} access
            </span>
            <h1 className="font-display text-5xl xl:text-6xl font-bold text-foreground mt-5 leading-tight">{theme.tagline}</h1>
            <p className="text-muted-foreground text-lg mt-4 max-w-md">{theme.description}</p>

            <ul className="mt-8 space-y-3">
              {theme.highlights.map(h => (
                <li key={h} className="flex items-start gap-3 text-sm text-foreground/80">
                  <span className={`mt-1 w-1.5 h-1.5 rounded-full ${theme.accent.replace('text-', 'bg-')}`} />
                  {h}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Right: form */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md mx-auto lg:ml-auto"
          >
            <div className={`p-8 rounded-2xl border shadow-xl ${theme.cardStyle}`}>
              <Link to="/" className="inline-flex items-center gap-2 mb-6">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-md ${theme.iconBg}`}>
                  <span className="font-display font-bold text-white">C</span>
                </div>
                <span className="font-display font-bold text-lg text-foreground">Cohere</span>
              </Link>

              <div className={`w-12 h-12 rounded-xl border flex items-center justify-center mb-4 ${theme.iconRing} ${theme.iconBg}`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <h2 className="font-display text-2xl font-bold text-foreground">Sign in as {theme.label}</h2>
              <p className="text-sm text-muted-foreground mt-1">{theme.description}</p>

              <form onSubmit={handleLogin} className="space-y-4 mt-6">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required className="bg-white/50" />
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input id="password" type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required className="bg-white/50" />
                    <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" onClick={() => setShowPw(!showPw)}>
                      {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <Button 
                  variant={theme.buttonVariant} 
                  className="w-full" 
                  type="submit"
                >
                  Sign in
                </Button>
              </form>

              <div className="mt-5">
                <button
                  type="button"
                  onClick={useDemo}
                  className="w-full text-xs text-center py-2 rounded-md border border-dashed border-border hover:border-primary/40 hover:bg-muted/40 transition-colors text-muted-foreground"
                >
                  Use demo {theme.label.toLowerCase()} account
                </button>
              </div>

              <p className="text-sm text-center text-muted-foreground mt-6">
                New here? <Link to="/signup" className="text-primary font-semibold hover:underline">Create an account</Link>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
