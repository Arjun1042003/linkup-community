import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { Heart, User, Clock } from 'lucide-react';

const PostCard = ({ post, onLikeUpdate, index = 0 }) => {
  const [isLiked, setIsLiked] = useState(post.liked || false);
  const [likes, setLikes] = useState(post.likes || 0);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleLike = async () => {
    try {
      const response = await api.post(`/like/${post.id}`);
      setIsLiked(response.data.liked);
      setLikes(response.data.likes);
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 400);
      
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
    <article 
      className="glass-card rounded-2xl p-6 hover-lift"
      style={{ 
        animationDelay: `${index * 0.1}s`,
        opacity: 0,
        animation: `fadeInUp 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${index * 0.1}s forwards`
      }}
    >
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0 shadow-lg">
          <User className="w-6 h-6 text-primary-foreground" />
        </div>

        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-3">
            <span className="font-semibold text-foreground">
              {post.author || post.username || 'Anonymous'}
            </span>
            {post.community_name && (
              <>
                <span className="text-muted-foreground/50">·</span>
                <Link
                  to={`/community/${post.community_id}`}
                  className="text-primary hover:text-secondary transition-colors duration-300 font-medium text-sm"
                >
                  {post.community_name}
                </Link>
              </>
            )}
            <span className="text-muted-foreground/50">·</span>
            <span className="text-muted-foreground flex items-center gap-1.5 text-sm">
              <Clock className="w-3.5 h-3.5" />
              {formatDate(post.created_at)}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-xl font-semibold text-foreground mb-2 leading-tight">
            {post.title}
          </h3>

          {/* Content */}
          <p className="text-muted-foreground leading-relaxed mb-5">
            {post.content}
          </p>

          {/* Actions */}
          <div className="flex items-center">
            <button
              onClick={handleLike}
              className={`group flex items-center gap-2.5 px-5 py-2.5 rounded-xl transition-all duration-300 ${
                isLiked 
                  ? 'bg-secondary/15 text-secondary' 
                  : 'hover:bg-muted text-muted-foreground hover:text-secondary'
              }`}
            >
              <Heart
                className={`w-5 h-5 transition-all duration-300 ${
                  isLiked ? 'fill-secondary scale-100' : 'group-hover:scale-110'
                } ${isAnimating ? 'animate-heart' : ''}`}
              />
              <span className="font-medium text-sm">{likes}</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default PostCard;
