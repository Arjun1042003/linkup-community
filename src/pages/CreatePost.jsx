import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Layout from '../components/Layout';
import { Send, ChevronDown, Check, PenLine } from 'lucide-react';

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
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <PenLine className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight gradient-text">
              Create Post
            </h1>
          </div>
          <p className="text-muted-foreground font-light">
            Share your thoughts with the community
          </p>
        </div>

        {/* Form Card */}
        <div className="glass-card rounded-3xl p-8 animate-fade-in-delay-1">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-xl text-destructive text-sm animate-scale-in">
                {error}
              </div>
            )}

            {/* Community Selector */}
            <div className="relative space-y-2">
              <label className="block text-sm font-medium text-foreground/70 ml-1">
                Community
              </label>
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="input-field flex items-center justify-between group"
              >
                <span className={selectedCommunity ? 'text-foreground' : 'text-muted-foreground'}>
                  {selectedCommunity?.name || 'Select a community'}
                </span>
                <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {dropdownOpen && (
                <div 
                  className="absolute top-full left-0 right-0 mt-2 rounded-2xl overflow-hidden z-20 animate-scale-in"
                  style={{
                    background: 'hsl(var(--popover))',
                    border: '1px solid hsl(var(--border))',
                    boxShadow: '0 20px 60px hsl(var(--background) / 0.6)',
                  }}
                >
                  {communities.map((community) => (
                    <button
                      key={community.id}
                      type="button"
                      onClick={() => {
                        setCommunityId(community.id.toString());
                        setDropdownOpen(false);
                      }}
                      className={`w-full px-5 py-4 text-left transition-all duration-200 flex items-center justify-between ${
                        communityId === community.id.toString() 
                          ? 'bg-primary/10 text-primary' 
                          : 'text-foreground hover:bg-muted'
                      }`}
                    >
                      <span>{community.name}</span>
                      {communityId === community.id.toString() && (
                        <Check className="w-4 h-4" />
                      )}
                    </button>
                  ))}
                  {communities.length === 0 && (
                    <p className="px-5 py-4 text-muted-foreground text-center">No communities available</p>
                  )}
                </div>
              )}
            </div>

            {/* Title */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground/70 ml-1">
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

            {/* Content */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground/70 ml-1">
                Content
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="input-field min-h-[200px] resize-none"
                placeholder="What do you want to share?"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-3 text-base"
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
