import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Users, Plus, ChevronRight } from 'lucide-react';

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
      <aside className="fixed left-0 top-16 bottom-0 w-64 bg-sidebar border-r border-sidebar-border overflow-y-auto hidden md:block">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Communities
            </h2>
            <button
              onClick={() => setShowCreateModal(true)}
              className="p-2 rounded-lg hover:bg-sidebar-accent text-primary transition-colors"
              title="Create Community"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-1">
            {communities.map((community) => {
              const isActive = location.pathname === `/community/${community.id}`;
              return (
                <Link
                  key={community.id}
                  to={`/community/${community.id}`}
                  className={`sidebar-item ${isActive ? 'sidebar-item-active' : ''}`}
                >
                  <Users className="w-5 h-5 flex-shrink-0" />
                  <span className="truncate">{community.name}</span>
                  <ChevronRight className="w-4 h-4 ml-auto opacity-50" />
                </Link>
              );
            })}

            {communities.length === 0 && (
              <p className="text-sm text-muted-foreground px-4 py-2">
                No communities yet. Create one!
              </p>
            )}
          </div>
        </div>
      </aside>

      {/* Create Community Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-card rounded-xl p-6 w-full max-w-md animate-fade-in">
            <h3 className="text-xl font-bold mb-4 gradient-text">Create Community</h3>
            
            <form onSubmit={handleCreateCommunity} className="space-y-4">
              {error && (
                <div className="p-3 bg-destructive/20 border border-destructive rounded-lg text-destructive text-sm">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
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

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Description
                </label>
                <textarea
                  value={newCommunity.description}
                  onChange={(e) => setNewCommunity({ ...newCommunity, description: e.target.value })}
                  className="input-field min-h-[100px] resize-none"
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
                  className="btn-ghost flex-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary flex-1"
                >
                  {loading ? 'Creating...' : 'Create'}
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
