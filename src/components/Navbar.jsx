import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Home, Plus, User, LogOut, Sparkles } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 z-50">
      {/* Glassmorphism navbar */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(180deg, hsl(var(--background) / 0.9) 0%, hsl(var(--background) / 0.8) 100%)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          borderBottom: '1px solid hsl(var(--border) / 0.5)',
        }}
      />
      
      <div className="relative h-full max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link 
          to="/" 
          className="flex items-center gap-3 group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-semibold tracking-tight text-foreground hidden sm:block">
            Community
          </span>
        </Link>

        {/* Navigation Items */}
        <div className="flex items-center gap-1">
          <Link
            to="/create-post"
            className={`btn-ghost flex items-center gap-2 ${
              isActive('/create-post') ? 'text-primary bg-primary/10' : ''
            }`}
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">Create</span>
          </Link>

          <Link
            to="/profile"
            className={`btn-ghost flex items-center gap-2 ${
              isActive('/profile') ? 'text-primary bg-primary/10' : ''
            }`}
          >
            <User className="w-5 h-5" />
            <span className="hidden sm:inline">{user?.username}</span>
          </Link>

          <button
            onClick={handleLogout}
            className="btn-ghost flex items-center gap-2 text-muted-foreground hover:text-destructive"
          >
            <LogOut className="w-5 h-5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
