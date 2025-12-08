import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Home, Plus, User, LogOut } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-card border-b border-border z-50">
      <div className="h-full max-w-7xl mx-auto px-4 flex items-center justify-between">
        <Link 
          to="/" 
          className="flex items-center gap-2 text-xl font-bold gradient-text hover:opacity-80 transition-opacity"
        >
          <Home className="w-6 h-6 text-primary" />
          <span>Community</span>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            to="/create-post"
            className="btn-ghost flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">Create Post</span>
          </Link>

          <Link
            to="/profile"
            className="btn-ghost flex items-center gap-2"
          >
            <User className="w-5 h-5" />
            <span className="hidden sm:inline">{user?.username}</span>
          </Link>

          <button
            onClick={handleLogout}
            className="btn-ghost flex items-center gap-2 text-destructive hover:text-destructive"
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
