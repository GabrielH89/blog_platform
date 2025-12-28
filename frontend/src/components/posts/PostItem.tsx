import { FaEdit, FaStar, FaTrash } from "react-icons/fa";
import axios from "axios";
import "../../styles/posts/PostItem.css";
import EditPost from "./EditPost";
import { useState } from "react";
import Modal from "../../utils/Modal";
import CreateRating from "../ratings/CreateRating";
import RatingDisplay from "../ratings/RatingDisplay";
import { useNavigate } from "react-router-dom";

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
  onDeleted: (id: number) => void;
  onEdited: (post: Post) => void;
}

function PostItem({ post, API_URL, onDeleted, onEdited }: PostItemProps) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const navigate = useNavigate();

  const deletePostById = async (e: React.MouseEvent) => {
    e.stopPropagation(); 

    if (!confirm("Tem certeza que deseja deletar este post?")) return;

    try {
      const token = sessionStorage.getItem("token");

      await axios.delete(`${API_URL}/posts/${post.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      onDeleted(post.id);
    } catch (error) {
      console.error("Error to delete post", error);
    }
  };

  const openEditModal = (e: React.MouseEvent) => {
    e.stopPropagation(); // ← impede abrir a página do post
    setEditingPost(post);
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingPost(null);
  };

  return (
    <>
      {/* MODAL EDITAR */}
      {showEditModal && editingPost && (
        <Modal isOpen={showEditModal} onClose={closeEditModal}>
          <EditPost
            post={editingPost}
            onClose={closeEditModal}
            onPostEdited={(updatedPost) => {
              onEdited(updatedPost);
              closeEditModal();
            }}
          />
        </Modal>
      )}

      {/* MODAL RATING */}
      {showRatingModal && (
        <Modal isOpen={showRatingModal} onClose={() => setShowRatingModal(false)}>
          <CreateRating
            postId={post.id}
            API_URL={API_URL}
            onClose={() => setShowRatingModal(false)}
          />
        </Modal>
      )}

      {/* CARD */}
      <div className="post-card" onClick={() => navigate(`/home/post/${post.id}`)}>
        <div className="icons-div">
          
          {/* DELETE */}
          <FaTrash
            className="icon-wrapper delete-icon"
            onClick={deletePostById}
          />

          {/* EDITAR */}
        
          <FaEdit
            className="icon-wrapper edit-icon"
            onClick={openEditModal}
          />

          {/* ESTRELA (RATING) */}
          <FaStar
            className="icon-wrapper star-icon"
            onClick={(e) => {
              e.stopPropagation(); // ← impede navegação
              setShowRatingModal(true);
            }}
          />
        </div>

        <RatingDisplay postId={post.id} API_URL={API_URL} />

        <h2>{post.titlePost}</h2>

        {post.imagePost && (
          <img src={`${API_URL}${post.imagePost}`} alt={post.titlePost} />
        )}

        <p>{post.bodyPost}</p>

        <div className="description-div">
          <small>Criado em: {new Date(post.createdAt).toLocaleDateString()}</small>
          <small>Atualizado em: {new Date(post.updatedAt).toLocaleDateString()}</small>
        </div>
      </div>
    </>
  );
}

export default PostItem;
