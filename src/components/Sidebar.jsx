import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Users, Plus, ChevronRight, X, Loader2 } from 'lucide-react';

const Sidebar = () => {
  const [communities, setCommunities] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCommunity, setNewCommunity] = useState({ name: '', description: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCommunities();
  }, []);

  const fetchCommunities = async () => {
    try {
      const response = await api.get('/communities');
      setCommunities(response.data);
    } catch (err) {
      console.error('Failed to fetch communities:', err);
    }
  };

  const handleCreateCommunity = async (e) => {
    e.preventDefault();
    if (!newCommunity.name.trim()) {
      setError('Community name is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await api.post('/community', {
        name: newCommunity.name,
        description: newCommunity.description,
      });
      setShowCreateModal(false);
      setNewCommunity({ name: '', description: '' });
      fetchCommunities();
      navigate(`/community/${response.data.id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create community');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <aside 
        className="fixed left-0 top-16 bottom-0 w-72 overflow-y-auto hidden md:block"
        style={{
          background: 'linear-gradient(180deg, hsl(var(--sidebar-background)) 0%, hsl(var(--background)) 100%)',
          borderRight: '1px solid hsl(var(--sidebar-border) / 0.5)',
        }}
      >
        <div className="p-5">
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
              Communities
            </h2>
            <button
              onClick={() => setShowCreateModal(true)}
              className="p-2.5 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary transition-all duration-300 hover:scale-105 active:scale-95"
              title="Create Community"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Community List */}
          <div className="space-y-1">
            {communities.map((community, index) => {
              const isActive = location.pathname === `/community/${community.id}`;
              return (
                <Link
                  key={community.id}
                  to={`/community/${community.id}`}
                  className={`sidebar-item ${isActive ? 'sidebar-item-active' : ''}`}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                    isActive 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    <Users className="w-4 h-4" />
                  </div>
                  <span className="truncate flex-1 text-sm">{community.name}</span>
                  <ChevronRight className={`w-4 h-4 opacity-0 -translate-x-2 transition-all duration-300 ${
                    isActive ? 'opacity-100 translate-x-0' : 'group-hover:opacity-50'
                  }`} />
                </Link>
              );
            })}

            {communities.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm">No communities yet</p>
                <p className="text-xs mt-1 opacity-70">Create the first one!</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Create Community Modal */}
      {showCreateModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{
            background: 'hsl(var(--background) / 0.8)',
            backdropFilter: 'blur(8px)',
          }}
          onClick={() => setShowCreateModal(false)}
        >
          <div 
            className="glass-card rounded-3xl p-8 w-full max-w-md animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold gradient-text">Create Community</h3>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setError('');
                  setNewCommunity({ name: '', description: '' });
                }}
                className="p-2 rounded-xl hover:bg-muted transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
            
            <form onSubmit={handleCreateCommunity} className="space-y-5">
              {error && (
                <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-xl text-destructive text-sm animate-scale-in">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground/70 ml-1">
                  Community Name
                </label>
                <input
                  type="text"
                  value={newCommunity.name}
                  onChange={(e) => setNewCommunity({ ...newCommunity, name: e.target.value })}
                  className="input-field"
                  placeholder="Enter community name"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground/70 ml-1">
                  Description
                </label>
                <textarea
                  value={newCommunity.description}
                  onChange={(e) => setNewCommunity({ ...newCommunity, description: e.target.value })}
                  className="input-field min-h-[120px] resize-none"
                  placeholder="What is this community about?"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setError('');
                    setNewCommunity({ name: '', description: '' });
                  }}
                  className="btn-ghost flex-1 py-4"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary flex-1 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    'Create'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
