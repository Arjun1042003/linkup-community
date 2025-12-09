import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import { User, AtSign, Calendar, TrendingUp, Heart } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        {/* Profile Card */}
        <div className="glass-card rounded-3xl p-10 animate-fade-in">
          {/* Avatar & Name */}
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-6">
              <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-2xl">
                <User className="w-14 h-14 text-primary-foreground" />
              </div>
              <div 
                className="absolute -bottom-2 -right-2 w-8 h-8 rounded-lg bg-secondary flex items-center justify-center"
                style={{ boxShadow: '0 4px 12px hsl(var(--secondary) / 0.4)' }}
              >
                <span className="text-xs font-bold text-secondary-foreground">✓</span>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-foreground mb-2">
              {user?.username || 'User'}
            </h2>
            
            <div className="flex flex-wrap items-center justify-center gap-4 mt-3 text-muted-foreground">
              <div className="flex items-center gap-2">
                <AtSign className="w-4 h-4 text-primary" />
                <span className="text-sm">{user?.username}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-secondary" />
                <span className="text-sm">Member since today</span>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="mt-10 pt-8 border-t border-border/50">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-5 text-center">
              Account Stats
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div 
                className="rounded-2xl p-6 text-center transition-all duration-300 hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, hsl(var(--primary) / 0.1) 0%, hsl(var(--primary) / 0.05) 100%)',
                  border: '1px solid hsl(var(--primary) / 0.2)',
                }}
              >
                <div className="flex items-center justify-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  <span className="text-3xl font-bold text-primary">0</span>
                </div>
                <div className="text-sm text-muted-foreground font-medium">Posts</div>
              </div>
              <div 
                className="rounded-2xl p-6 text-center transition-all duration-300 hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, hsl(var(--secondary) / 0.1) 0%, hsl(var(--secondary) / 0.05) 100%)',
                  border: '1px solid hsl(var(--secondary) / 0.2)',
                }}
              >
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Heart className="w-5 h-5 text-secondary fill-secondary" />
                  <span className="text-3xl font-bold text-secondary">0</span>
                </div>
                <div className="text-sm text-muted-foreground font-medium">Likes</div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <p className="text-center mt-8 text-sm text-muted-foreground/50 animate-fade-in-delay-1">
          Your activity will appear here as you engage with the community
        </p>
      </div>
    </Layout>
  );
};

export default Profile;
