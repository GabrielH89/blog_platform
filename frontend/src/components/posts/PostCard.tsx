// src/components/PostCard.tsx
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

  return (
    <div className="post-detail">
      <button onClick={onBack} style={{ marginBottom: "15px" }}>
        ← Voltar
      </button>
      <h1>{post.titlePost}</h1>
      {post.imagePost && (
        <img
          src={`${API_URL}${post.imagePost}`}
          alt={post.titlePost}
          style={{ maxWidth: "400px", marginTop: "10px" }}
        />
      )}
      <p>{post.bodyPost}</p>
      <small>Criado em: {new Date(post.createdAt).toLocaleDateString()}</small>
    </div>
  );
}

export default PostCard;
