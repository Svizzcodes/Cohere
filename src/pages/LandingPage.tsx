import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Heart, Users, Utensils, Shirt, DollarSign, ArrowRight, MapPin, Award, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CountUp } from '@/components/CountUp';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { Navbar } from '@/components/Navbar';
import { useAppStore } from '@/lib/store';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6, ease: 'easeOut' } }),
};

const categories = [
  { icon: Utensils, label: 'Food', desc: 'Meals & groceries for those in need', color: 'bg-success/10 text-success' },
  { icon: Shirt, label: 'Clothes', desc: 'Clean clothing & essentials', color: 'bg-info/10 text-info' },
  { icon: DollarSign, label: 'Funds', desc: 'Financial aid & micro-grants', color: 'bg-warning/10 text-warning' },
  { icon: Heart, label: 'Essentials', desc: 'Hygiene kits & daily needs', color: 'bg-accent/10 text-accent' },
];

export default function LandingPage() {
  const { ngos, getStats } = useAppStore();
  const stats = getStats();
  const verifiedNGOs = ngos.filter(n => n.status === 'verified');

  return (
    <div className="min-h-screen bg-background relative">
      <AnimatedBackground />
      <Navbar />

      <div className="absolute top-24 left-4 md:left-8 z-20">
        <span className="text-sm font-bold bg-primary/10 text-primary px-4 py-2 rounded-lg border border-primary/20 shadow-sm backdrop-blur-md">An Initiative by RCNI 25-26</span>
      </div>

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="container mx-auto text-center relative z-10">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Shield className="w-4 h-4" /> Trusted by Verified NGOs all over India
            </span>
          </motion.div>
          <motion.h1
            className="font-display text-5xl md:text-7xl font-bold tracking-tight mb-6"
            initial="hidden" animate="visible" variants={fadeUp} custom={1}
          >
            <span className="gradient-text">Cohere</span>
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-10 font-light"
            initial="hidden" animate="visible" variants={fadeUp} custom={2}
          >
            Where impact comes together. Connecting donors, volunteers, and NGOs to build a better world.
          </motion.p>
          <motion.div className="flex flex-col sm:flex-row gap-4 justify-center" initial="hidden" animate="visible" variants={fadeUp} custom={3}>
            <Button variant="hero" size="lg" asChild>
              <Link to="/signup">Start Making Impact <ArrowRight className="w-4 h-4 ml-1" /></Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/marketplace">Explore Resources</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Live Stats */}
      <section className="py-16 px-4 relative z-10">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[
              { label: 'Meals Served', value: stats.mealsServed, suffix: '+', icon: Utensils },
              { label: 'Donations', value: stats.donationsCompleted, suffix: '+', icon: Heart },
              { label: 'Volunteers', value: stats.volunteersEngaged, suffix: '+', icon: Users },
              { label: 'Active NGOs', value: stats.ngosActive, suffix: '', icon: Award },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                className="stat-card text-center"
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
              >
                <stat.icon className="w-6 h-6 text-primary mx-auto mb-3" />
                <div className="text-3xl md:text-4xl font-display font-bold text-foreground">
                  <CountUp end={stat.value} suffix={stat.suffix} />
                </div>
                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 px-4 relative z-10">
        <div className="container mx-auto">
          <motion.div className="text-center mb-12" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Donate What Matters</h2>
            <p className="text-muted-foreground max-w-lg mx-auto">Choose a category and make a difference today</p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.label}
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
              >
                <Link to="/marketplace" className="glass-card p-6 flex flex-col items-center text-center hover:scale-[1.03] transition-transform duration-300 block">
                  <div className={`w-14 h-14 rounded-xl ${cat.color} flex items-center justify-center mb-4`}>
                    <cat.icon className="w-7 h-7" />
                  </div>
                  <h3 className="font-display font-semibold text-lg mb-1">{cat.label}</h3>
                  <p className="text-sm text-muted-foreground">{cat.desc}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured NGOs */}
      <section className="py-16 px-4 relative z-10">
        <div className="container mx-auto">
          <motion.div className="text-center mb-12" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Featured NGOs</h2>
            <p className="text-muted-foreground max-w-lg mx-auto">Verified organizations making real impact</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {verifiedNGOs.map((ngo, i) => (
              <motion.div
                key={ngo.id}
                className="glass-card-elevated p-6 group"
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl hero-gradient flex items-center justify-center text-primary-foreground font-display font-bold">
                    {ngo.name[0]}
                  </div>
                  <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-success/10 text-success">
                    <Shield className="w-3 h-3" /> Verified
                  </span>
                </div>
                <h3 className="font-display font-semibold text-lg mb-2 group-hover:text-primary transition-colors">{ngo.name}</h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{ngo.description}</p>
                <div className="flex items-center gap-1 text-xs text-muted-foreground mb-4">
                  <MapPin className="w-3 h-3" /> {ngo.location}
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 rounded-lg bg-muted/50">
                    <div className="font-semibold text-sm">{ngo.mealsServed.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">Meals</div>
                  </div>
                  <div className="p-2 rounded-lg bg-muted/50">
                    <div className="font-semibold text-sm">{ngo.donationsReceived}</div>
                    <div className="text-xs text-muted-foreground">Donations</div>
                  </div>
                  <div className="p-2 rounded-lg bg-muted/50">
                    <div className="font-semibold text-sm">{ngo.volunteersEngaged}</div>
                    <div className="text-xs text-muted-foreground">Volunteers</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 relative z-10">
        <div className="container mx-auto">
          <motion.div
            className="hero-gradient rounded-2xl p-10 md:p-16 text-center relative overflow-hidden"
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-4">Ready to Make a Difference?</h2>
            <p className="text-primary-foreground/80 max-w-lg mx-auto mb-8">Join thousands of donors, volunteers, and organizations creating lasting impact.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="secondary" size="lg" asChild>
                <Link to="/signup">Join as Donor</Link>
              </Button>
              <Button size="lg" className="bg-background text-foreground hover:bg-background/90" asChild>
                <Link to="/signup">Register NGO</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border relative z-10">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded hero-gradient" />
            <span className="font-display font-semibold text-foreground">Cohere</span>
          </div>
          <p className="text-sm text-muted-foreground">© 2026 Cohere. Where impact comes together.</p>
        </div>
      </footer>
    </div>
  );
}
