import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { Heart, User, Clock } from 'lucide-react';

const PostCard = ({ post, onLikeUpdate }) => {
  const [isLiked, setIsLiked] = useState(post.liked || false);
  const [likes, setLikes] = useState(post.likes || 0);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleLike = async () => {
    try {
      const response = await api.post(`/like/${post.id}`);
      setIsLiked(response.data.liked);
      setLikes(response.data.likes);
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 300);
      
      if (onLikeUpdate) {
        onLikeUpdate(post.id, response.data.liked, response.data.likes);
      }
    } catch (error) {
      console.error('Failed to like post:', error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return 'Just now';
  };

  return (
    <article className="glass-card rounded-xl p-5 hover-lift animate-fade-in">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0">
          <User className="w-5 h-5 text-primary-foreground" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-semibold text-foreground">
              {post.author || post.username || 'Anonymous'}
            </span>
            {post.community_name && (
              <>
                <span className="text-muted-foreground">in</span>
                <Link
                  to={`/community/${post.community_id}`}
                  className="text-primary hover:underline font-medium"
                >
                  {post.community_name}
                </Link>
              </>
            )}
            <span className="text-muted-foreground flex items-center gap-1 text-sm">
              <Clock className="w-3 h-3" />
              {formatDate(post.created_at)}
            </span>
          </div>

          <h3 className="text-lg font-bold text-foreground mb-2">
            {post.title}
          </h3>

          <p className="text-muted-foreground leading-relaxed mb-4">
            {post.content}
          </p>

          <div className="flex items-center">
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 ${
                isLiked 
                  ? 'bg-secondary/20 text-secondary' 
                  : 'hover:bg-muted text-muted-foreground hover:text-secondary'
              }`}
            >
              <Heart
                className={`w-5 h-5 transition-all duration-200 ${
                  isLiked ? 'fill-secondary' : ''
                } ${isAnimating ? 'animate-heart' : ''}`}
              />
              <span className="font-medium">{likes}</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default PostCard;
