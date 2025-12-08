import { useState, useEffect } from 'react';
import api from '../api/axios';
import Layout from '../components/Layout';
import PostCard from '../components/PostCard';
import { Loader2, Inbox } from 'lucide-react';

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
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold gradient-text">Home Feed</h1>
        <p className="text-muted-foreground mt-1">See what's happening in your communities</p>
      </div>

      {error && (
        <div className="p-4 bg-destructive/20 border border-destructive rounded-lg text-destructive mb-6">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {posts.map((post, index) => (
          <div key={post.id} style={{ animationDelay: `${index * 0.1}s` }}>
            <PostCard post={post} onLikeUpdate={handleLikeUpdate} />
          </div>
        ))}

        {posts.length === 0 && !error && (
          <div className="glass-card rounded-xl p-12 text-center">
            <Inbox className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No posts yet</h3>
            <p className="text-muted-foreground">
              Be the first to share something with the community!
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Home;
