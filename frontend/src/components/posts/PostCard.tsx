import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import '../../styles/posts/PostCard.css';
import CreateComment from "../comments/CreateComment";
import CommentsList from "../comments/CommentsList";

interface Post {
  id: number;
  titlePost: string;
  bodyPost: string;
  imagePost: string;
  createdAt: string;
  updatedAt: string;
}

function PostCard() {
  const { id } = useParams();
  const API_URL = import.meta.env.VITE_API_URL;
  const [post, setPost] = useState<Post | null>(null);
  const [isImageOpen, setIsImageOpen] = useState(false);
  const [reloadComments, setReloadComments] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchPost() {
      const token = sessionStorage.getItem("token");

      const response = await axios.get(`${API_URL}/posts/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = response.data;

      setPost({
        id: data.id,
        titlePost: data.titlePost,
        bodyPost: data.bodyPost,
        imagePost: data.imagePost,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt 
      });
    }

    fetchPost();
  }, [id]);

  if (!post) {
    return <p>Carregando post...</p>;
  }

  return (
    <div className="post-detail">
      <button onClick={() => navigate("/user/home")} className="btn-voltar">← Voltar</button>

      <div className="post-header">
        <h1>{post.titlePost}</h1>

        {post.imagePost && (
          <img
            src={`${API_URL}${post.imagePost}`}
            alt={post.titlePost}
            onClick={() => setIsImageOpen(true)}
          />
        )}
      </div>

      <p>{post.bodyPost}</p>
      <small>
        Criado em: {new Date(post.createdAt).toLocaleDateString()}
      </small>

       <small>
        Atualizado em: {new Date(post.updatedAt).toLocaleDateString()}
      </small>

      {isImageOpen && (
        <div className="image-modal" onClick={() => setIsImageOpen(false)}>
          <img
            src={`${API_URL}${post.imagePost}`}
            alt={post.titlePost}
            className="image-modal-content"
          />
          <span className="close-button">&times;</span>
        </div>
      )}

      <h3>Adicionar comentário</h3>
      <CreateComment
        postId={post.id}
        API_URL={API_URL}
        onCommentCreated={() => setReloadComments(!reloadComments)}
      />

      <h3>Comentários</h3>
      <CommentsList
        postId={post.id}
        API_URL={API_URL}
        triggerReload={reloadComments}
      />
    </div>
  );
}

export default PostCard;
