import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import { User, Mail, Calendar } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold gradient-text mb-6">Your Profile</h1>

        <div className="glass-card rounded-xl p-8">
          <div className="flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-6">
              <User className="w-12 h-12 text-primary-foreground" />
            </div>

            <h2 className="text-2xl font-bold text-foreground mb-2">
              {user?.username || 'User'}
            </h2>

            <div className="flex flex-col gap-3 mt-4 text-muted-foreground">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                <span>@{user?.username}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-secondary" />
                <span>Member since today</span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-border">
            <h3 className="font-semibold text-foreground mb-4">Account Stats</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="glass-card rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-primary">0</div>
                <div className="text-sm text-muted-foreground">Posts</div>
              </div>
              <div className="glass-card rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-secondary">0</div>
                <div className="text-sm text-muted-foreground">Likes</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
