import { FaTrash } from "react-icons/fa";
import axios from "axios";

interface Post {
  id: number;
  titlePost: string;
  bodyPost: string;
  imagePost: string;
  createdAt: string;
  updatedAt: string;
  userId: number;
}

interface PostItemProps {
  post: Post;
  API_URL: string;
  onClick: () => void;
  onDeleted: (id: number) => void;
}

function PostItem({ post, API_URL, onClick, onDeleted }: PostItemProps) {
  const deletePostById = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Evita abrir o post ao clicar no ícone

    if (!confirm("Tem certeza que deseja deletar este post?")) return;

    try {
      const token = sessionStorage.getItem("token");
      await axios.delete(`${API_URL}/posts/${post.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      onDeleted(post.id);
    } catch (error) {
      console.error("Error to delete post", error);
    }
  };

  return (
    <div className="post-card" onClick={onClick}>
      {/* Ícone de lixeira no canto superior direito */}
      <FaTrash className="delete-icon" onClick={deletePostById} />

      <h2>{post.titlePost}</h2>
      {post.imagePost && (
        <img src={`${API_URL}${post.imagePost}`} alt={post.titlePost} />
      )}
      <p>{post.bodyPost}</p>

      <div className="description-div">
        <small>
          Criado em: {new Date(post.createdAt).toLocaleDateString()}
        </small>
        <small>
          Atualizado em: {new Date(post.updatedAt).toLocaleDateString()}
        </small>
      </div>
    </div>
  );
}

export default PostItem;
