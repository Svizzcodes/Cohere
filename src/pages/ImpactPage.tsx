import { motion } from 'framer-motion';
import { Utensils, Heart, Users, Award, TrendingUp } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { CountUp } from '@/components/CountUp';
import { useAppStore } from '@/lib/store';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

export default function ImpactPage() {
  const { getStats, ngos, resources, volunteerApps, proofs } = useAppStore();
  const stats = getStats();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-12">
        <motion.div className="text-center mb-12" initial="hidden" animate="visible" variants={fadeUp} custom={0}>
          <h1 className="font-display text-4xl font-bold mb-3">Impact Dashboard</h1>
          <p className="text-muted-foreground max-w-lg mx-auto">Real-time tracking of our collective impact</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Meals Served', value: stats.mealsServed, icon: Utensils, color: 'text-success' },
            { label: 'Donations Completed', value: stats.donationsCompleted, icon: Heart, color: 'text-accent' },
            { label: 'Volunteers Engaged', value: stats.volunteersEngaged, icon: Users, color: 'text-info' },
            { label: 'Active NGOs', value: stats.ngosActive, icon: Award, color: 'text-primary' },
          ].map((s, i) => (
            <motion.div key={s.label} className="stat-card text-center" initial="hidden" animate="visible" variants={fadeUp} custom={i + 1}>
              <s.icon className={`w-8 h-8 ${s.color} mx-auto mb-3`} />
              <div className="text-3xl font-display font-bold"><CountUp end={s.value} suffix="+" /></div>
              <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Recent Activity */}
        <motion.div className="glass-card p-6" initial="hidden" animate="visible" variants={fadeUp} custom={5}>
          <h2 className="font-display text-xl font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" /> Recent Activity
          </h2>
          <div className="space-y-3">
            {resources.slice(0, 5).map(r => (
              <div key={r.id} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                <div>
                  <p className="text-sm font-medium">{r.title}</p>
                  <p className="text-xs text-muted-foreground">by {r.donorName}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  r.status === 'available' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
                }`}>{r.status}</span>
              </div>
            ))}
            {volunteerApps.slice(0, 3).map(a => (
              <div key={a.id} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                <div>
                  <p className="text-sm font-medium">{a.volunteerName} → {a.ngoName}</p>
                  <p className="text-xs text-muted-foreground">{a.role}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  a.status === 'accepted' ? 'bg-success/10 text-success' : a.status === 'applied' ? 'bg-info/10 text-info' : 'bg-muted text-muted-foreground'
                }`}>{a.status}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
