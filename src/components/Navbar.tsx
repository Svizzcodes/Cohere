import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, LogOut, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/lib/store';

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { currentUser, logout } = useAppStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const dashboardPath = currentUser ? `/dashboard/${currentUser.role}` : '/login';

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg hero-gradient flex items-center justify-center">
            <span className="text-primary-foreground font-display font-bold text-sm">C</span>
          </div>
          <span className="font-display font-bold text-xl text-foreground">Cohere</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/marketplace" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Marketplace</Link>
          <Link to="/feed" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Feed</Link>
          <Link to="/map" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Map</Link>
          <Link to="/impact" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Impact</Link>
          {currentUser ? (
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={() => navigate(dashboardPath)}>
                <LayoutDashboard className="w-4 h-4 mr-1" /> Dashboard
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-1" /> Logout
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>Login</Button>
              <Button variant="hero" size="sm" onClick={() => navigate('/signup')}>Get Started</Button>
            </div>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background border-b border-border overflow-hidden"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col gap-3">
              <Link to="/marketplace" onClick={() => setMobileOpen(false)} className="text-sm font-medium py-2">Marketplace</Link>
              <Link to="/feed" onClick={() => setMobileOpen(false)} className="text-sm font-medium py-2">Feed</Link>
              <Link to="/map" onClick={() => setMobileOpen(false)} className="text-sm font-medium py-2">Map</Link>
              <Link to="/impact" onClick={() => setMobileOpen(false)} className="text-sm font-medium py-2">Impact</Link>
              {currentUser ? (
                <>
                  <Button variant="ghost" size="sm" onClick={() => { navigate(dashboardPath); setMobileOpen(false); }}>Dashboard</Button>
                  <Button variant="outline" size="sm" onClick={() => { handleLogout(); setMobileOpen(false); }}>Logout</Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" size="sm" onClick={() => { navigate('/login'); setMobileOpen(false); }}>Login</Button>
                  <Button variant="hero" size="sm" onClick={() => { navigate('/signup'); setMobileOpen(false); }}>Get Started</Button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
