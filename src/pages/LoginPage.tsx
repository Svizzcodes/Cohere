import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Hand, Building2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ROLES = [
  {
    slug: 'donor',
    label: 'Donor',
    tagline: 'Give what you have. Change what you can.',
    description: 'Post surplus food, clothes, or funds and let verified NGOs collect them.',
    icon: Heart,
    accent: 'from-info/30 via-info/10 to-transparent',
    ring: 'ring-info/30',
    iconBg: 'bg-info/15 text-info',
    demoEmail: 'donor@cohere.org',
  },
  {
    slug: 'volunteer',
    label: 'Volunteer',
    tagline: 'Lend your time. Earn your story.',
    description: 'Find events near you, contribute hands-on, and collect formal certificates.',
    icon: Hand,
    accent: 'from-accent/30 via-accent/10 to-transparent',
    ring: 'ring-accent/30',
    iconBg: 'bg-accent/15 text-accent',
    demoEmail: 'volunteer@cohere.org',
  },
  {
    slug: 'ngo',
    label: 'NGO',
    tagline: 'Mobilize support. Amplify impact.',
    description: 'Claim resources, post events, verify volunteers, and earn recognition.',
    icon: Building2,
    accent: 'from-primary/30 via-primary/10 to-transparent',
    ring: 'ring-primary/30',
    iconBg: 'bg-primary/15 text-primary',
    demoEmail: 'ngo@cohere.org',
  },
] as const;

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Decorative warm wash */}
      <div className="absolute -top-32 -left-32 w-[480px] h-[480px] rounded-full bg-secondary/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-[480px] h-[480px] rounded-full bg-primary/15 blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 py-16 relative">
        {/* Brand */}
        <Link to="/" className="inline-flex items-center gap-2 mb-12">
          <div className="w-9 h-9 rounded-xl hero-gradient flex items-center justify-center shadow-md">
            <span className="text-primary-foreground font-display font-bold">C</span>
          </div>
          <span className="font-display font-bold text-xl text-foreground">Cohere</span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mb-12"
        >
          <p className="text-xs font-semibold tracking-[0.25em] text-primary uppercase mb-3">Sign in</p>
          <h1 className="font-display text-4xl md:text-6xl font-bold text-foreground leading-tight">Choose how you'll show up today.</h1>
          <p className="text-muted-foreground mt-4 text-lg">Three doors. Three roles. One mission — coherent collective impact.</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl">
          {ROLES.map((r, i) => (
            <motion.div
              key={r.slug}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.08 }}
            >
              <Link
                to={`/login/${r.slug}`}
                className={`group relative block h-full p-7 rounded-2xl border border-border bg-card hover:ring-2 ${r.ring} hover:-translate-y-1 transition-all overflow-hidden`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${r.accent} opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none`} />
                <div className="relative">
                  <div className={`w-12 h-12 rounded-xl ${r.iconBg} flex items-center justify-center mb-5`}>
                    <r.icon className="w-6 h-6" />
                  </div>
                  <h2 className="font-display text-2xl font-bold text-foreground">{r.label}</h2>
                  <p className="text-sm text-foreground/70 mt-1 italic">{r.tagline}</p>
                  <p className="text-sm text-muted-foreground mt-4 leading-relaxed">{r.description}</p>
                  <div className="flex items-center justify-between mt-8 pt-6 border-t border-border/60">
                    <span className="text-xs text-muted-foreground font-medium">Continue as {r.label.toLowerCase()}</span>
                    <ArrowRight className="w-4 h-4 text-foreground group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 flex flex-col sm:flex-row sm:items-center justify-between gap-4 max-w-6xl">
          <p className="text-sm text-muted-foreground">
            Don't have an account yet? <Link to="/signup" className="text-primary font-semibold hover:underline">Create one</Link>
          </p>
          <Link to="/login/admin" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            Admin access →
          </Link>
        </div>
      </div>
    </div>
  );
}
