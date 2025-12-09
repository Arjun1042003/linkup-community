import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import Layout from '../components/Layout';
import PostCard from '../components/PostCard';
import { Users, Inbox, Sparkles } from 'lucide-react';

const Community = () => {
  const { id } = useParams();
  const [community, setCommunity] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCommunityData();
  }, [id]);

  const fetchCommunityData = async () => {
    setLoading(true);
    try {
      const [communityRes, postsRes] = await Promise.all([
        api.get(`/community/${id}`),
        api.get(`/community/${id}/posts`),
      ]);
      setCommunity(communityRes.data);
      setPosts(postsRes.data);
    } catch (err) {
      setError('Failed to load community');
      console.error('Failed to fetch community:', err);
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
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center animate-pulse-glow">
            <Sparkles className="w-8 h-8 text-primary-foreground" />
          </div>
          <p className="text-muted-foreground animate-pulse">Loading community...</p>
        </div>
      </Layout>
    );
  }

  if (error || !community) {
    return (
      <Layout>
        <div className="p-5 bg-destructive/10 border border-destructive/30 rounded-2xl text-destructive animate-scale-in">
          {error || 'Community not found'}
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Community Header */}
      <div className="glass-card rounded-3xl p-8 mb-8 animate-fade-in">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-2xl">
            <Users className="w-10 h-10 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight gradient-text mb-2">
              {community.name}
            </h1>
            <p className="text-muted-foreground text-lg font-light">
              {community.description || 'Welcome to this community'}
            </p>
          </div>
        </div>
      </div>

      {/* Posts */}
      <div className="space-y-5">
        {posts.map((post, index) => (
          <PostCard 
            key={post.id} 
            post={post} 
            onLikeUpdate={handleLikeUpdate}
            index={index}
          />
        ))}

        {posts.length === 0 && (
          <div className="glass-card rounded-3xl p-16 text-center animate-fade-in">
            <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-6">
              <Inbox className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-semibold text-foreground mb-3">No posts yet</h3>
            <p className="text-muted-foreground text-lg font-light">
              Be the first to post in this community!
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Community;
