import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAppStore, UserRole } from '@/lib/store';
import { toast } from 'sonner';

const roles: { value: UserRole; label: string; desc: string }[] = [
  { value: 'donor', label: 'Donor', desc: 'Donate food, clothes, or funds' },
  { value: 'volunteer', label: 'Volunteer', desc: 'Lend your time and skills' },
  { value: 'ngo', label: 'NGO', desc: 'Receive and distribute resources' },
];

export default function SignupPage() {
  const [role, setRole] = useState<UserRole>('donor');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [skills, setSkills] = useState('');
  const { signup } = useAppStore();
  const navigate = useNavigate();

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    const success = signup({
      name, email, role, bio, location,
      skills: skills ? skills.split(',').map(s => s.trim()) : undefined,
    }, password);
    if (success) {
      toast.success(role === 'ngo' ? 'NGO registered! Pending admin verification.' : 'Account created!');
      navigate(role === 'ngo' ? '/login' : `/dashboard/${role}`);
    } else {
      toast.error('Email already exists');
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <motion.div
        className="w-full max-w-lg glass-card-elevated p-8"
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      >
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg hero-gradient flex items-center justify-center">
              <span className="text-primary-foreground font-display font-bold text-sm">C</span>
            </div>
            <span className="font-display font-bold text-xl">Cohere</span>
          </Link>
          <h1 className="font-display text-2xl font-bold">Create Account</h1>
          <p className="text-sm text-muted-foreground mt-1">Choose your role and join the community</p>
        </div>

        {/* Role selector */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          {roles.map(r => (
            <button
              key={r.value}
              onClick={() => setRole(r.value)}
              className={`p-3 rounded-xl border text-center transition-all duration-200 ${
                role === r.value ? 'border-primary bg-primary/5 ring-2 ring-primary/20' : 'border-border hover:border-primary/30'
              }`}
            >
              <div className="font-semibold text-sm">{r.label}</div>
              <div className="text-xs text-muted-foreground mt-1">{r.desc}</div>
            </button>
          ))}
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <Label>{role === 'ngo' ? 'Organization Name' : 'Full Name'}</Label>
            <Input value={name} onChange={e => setName(e.target.value)} required />
          </div>
          <div>
            <Label>Email</Label>
            <Input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div>
            <Label>Password</Label>
            <Input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <div>
            <Label>Location</Label>
            <Input value={location} onChange={e => setLocation(e.target.value)} placeholder="City, Country" />
          </div>
          {role === 'volunteer' && (
            <div>
              <Label>Skills (comma separated)</Label>
              <Input value={skills} onChange={e => setSkills(e.target.value)} placeholder="cooking, driving, teaching" />
            </div>
          )}
          {role === 'ngo' && (
            <div>
              <Label>Description</Label>
              <Textarea value={bio} onChange={e => setBio(e.target.value)} placeholder="Describe your organization's mission..." rows={3} />
            </div>
          )}
          <Button variant="hero" className="w-full" type="submit">
            {role === 'ngo' ? 'Register for Verification' : 'Create Account'}
          </Button>
        </form>

        <p className="text-sm text-center text-muted-foreground mt-6">
          Already have an account? <Link to="/login" className="text-primary font-medium hover:underline">Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
}
