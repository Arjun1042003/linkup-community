import { useState, useEffect } from 'react';
import api from '../api/axios';
import Layout from '../components/Layout';
import PostCard from '../components/PostCard';
import { Loader2, Inbox, Sparkles } from 'lucide-react';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchFeed();
  }, []);

  const fetchFeed = async () => {
    try {
      const response = await api.get('/feed');
      setPosts(response.data);
    } catch (err) {
      setError('Failed to load feed');
      console.error('Failed to fetch feed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLikeUpdate = (postId, liked, likes) => {
    setPosts(posts.map(post => 
      post.id === postId ? { ...post, liked, likes } : post
    ));
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center animate-pulse-glow">
              <Sparkles className="w-8 h-8 text-primary-foreground" />
            </div>
          </div>
          <p className="text-muted-foreground animate-pulse">Loading your feed...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero Section */}
      <div className="mb-10 animate-fade-in">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">
          <span className="gradient-text">Home Feed</span>
        </h1>
        <p className="text-lg text-muted-foreground font-light">
          See what's happening in your communities
        </p>
      </div>

      {error && (
        <div className="p-5 bg-destructive/10 border border-destructive/30 rounded-2xl text-destructive mb-8 animate-scale-in">
          {error}
        </div>
      )}

      {/* Posts Grid */}
      <div className="space-y-5">
        {posts.map((post, index) => (
          <PostCard 
            key={post.id} 
            post={post} 
            onLikeUpdate={handleLikeUpdate}
            index={index}
          />
        ))}

        {posts.length === 0 && !error && (
          <div className="glass-card rounded-3xl p-16 text-center animate-fade-in">
            <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-6">
              <Inbox className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-semibold text-foreground mb-3">No posts yet</h3>
            <p className="text-muted-foreground text-lg font-light max-w-sm mx-auto">
              Be the first to share something with the community!
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Home;
