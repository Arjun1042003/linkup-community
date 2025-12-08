import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Layout from '../components/Layout';
import { Send, ChevronDown } from 'lucide-react';

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [communityId, setCommunityId] = useState('');
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim() || !communityId) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await api.post('/post', {
        title,
        content,
        community_id: parseInt(communityId),
      });
      navigate(`/community/${communityId}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  const selectedCommunity = communities.find(c => c.id === parseInt(communityId));

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold gradient-text mb-6">Create Post</h1>

        <div className="glass-card rounded-xl p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-4 bg-destructive/20 border border-destructive rounded-lg text-destructive text-sm">
                {error}
              </div>
            )}

            <div className="relative">
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Community
              </label>
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="input-field flex items-center justify-between"
              >
                <span className={selectedCommunity ? 'text-foreground' : 'text-muted-foreground'}>
                  {selectedCommunity?.name || 'Select a community'}
                </span>
                <ChevronDown className={`w-5 h-5 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {dropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-popover border border-border rounded-lg shadow-xl z-10 max-h-60 overflow-y-auto">
                  {communities.map((community) => (
                    <button
                      key={community.id}
                      type="button"
                      onClick={() => {
                        setCommunityId(community.id.toString());
                        setDropdownOpen(false);
                      }}
                      className={`w-full px-4 py-3 text-left hover:bg-muted transition-colors ${
                        communityId === community.id.toString() ? 'bg-muted text-primary' : 'text-foreground'
                      }`}
                    >
                      {community.name}
                    </button>
                  ))}
                  {communities.length === 0 && (
                    <p className="px-4 py-3 text-muted-foreground">No communities available</p>
                  )}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input-field"
                placeholder="Give your post a title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Content
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="input-field min-h-[200px] resize-none"
                placeholder="What do you want to share?"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Publish Post
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default CreatePost;
