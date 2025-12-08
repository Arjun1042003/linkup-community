import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import Layout from '../components/Layout';
import PostCard from '../components/PostCard';
import { Loader2, Users, Inbox } from 'lucide-react';

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
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      </Layout>
    );
  }

  if (error || !community) {
    return (
      <Layout>
        <div className="p-4 bg-destructive/20 border border-destructive rounded-lg text-destructive">
          {error || 'Community not found'}
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="glass-card rounded-xl p-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <Users className="w-8 h-8 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold gradient-text">{community.name}</h1>
            <p className="text-muted-foreground mt-1">
              {community.description || 'Welcome to this community'}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {posts.map((post, index) => (
          <div key={post.id} style={{ animationDelay: `${index * 0.1}s` }}>
            <PostCard post={post} onLikeUpdate={handleLikeUpdate} />
          </div>
        ))}

        {posts.length === 0 && (
          <div className="glass-card rounded-xl p-12 text-center">
            <Inbox className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No posts yet</h3>
            <p className="text-muted-foreground">
              Be the first to post in this community!
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Community;
