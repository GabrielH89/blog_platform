import { useState } from 'react';
import '../../styles/posts/PostCard.css';

interface Post {
  id: number;
  titlePost: string;
  bodyPost: string;
  imagePost: string;
  createdAt: string;
}

interface PostCardProps {
  post: Post;
  onBack: () => void;
}

function PostCard({ post, onBack }: PostCardProps) {
  const API_URL = import.meta.env.VITE_API_URL;
  const [isImageOpen, setIsImageOpen] = useState(false);

   return (
    <div className="post-detail">
      <button onClick={onBack} style={{ marginBottom: "15px" }} className="btn-voltar">
        ← Voltar
      </button>

      {/* Nova div para agrupar título e imagem */}
      <div className="post-header">
        <h1>{post.titlePost}</h1>
        {post.imagePost && (
          <img src={`${API_URL}${post.imagePost}`} alt={post.titlePost} onClick={() => setIsImageOpen(true)}/>
        )}
      </div>

      <p>{post.bodyPost}</p>
      <small>Criado em: {new Date(post.createdAt).toLocaleDateString()}</small>

      {/*Modal de imagem ampliada*/}
      {isImageOpen && (
        <div className='image-modal' onClick={() => setIsImageOpen(false)}>
          <img src={`${API_URL}${post.imagePost}`} alt={post.titlePost} className='image-modal-content'/>
          <span className='close-button'>&times;</span>
        </div>
      )}
      
    </div>
  );
}

export default PostCard;
