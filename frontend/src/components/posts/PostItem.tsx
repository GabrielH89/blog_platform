import { FaEdit, FaStar, FaTrash } from "react-icons/fa";
import axios from "axios";
import "../../styles/posts/PostItem.css";
import EditPost from "./EditPost";
import { useState } from "react";
import Modal from "../../utils/Modal";

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
  onEdited: (post: Post) => void;
}

function PostItem({ post, API_URL, onClick, onDeleted, onEdited }: PostItemProps) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);

  const deletePostById = async (e: React.MouseEvent) => {
    e.stopPropagation();

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

  const openEditModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingPost(post);
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingPost(null); // <- ESSA LINHA É ESSENCIAL
  };

  return (
    <>
      {showEditModal && editingPost && (
        <Modal isOpen={showEditModal} onClose={closeEditModal}>
          <EditPost
            post={editingPost}
            onClose={closeEditModal}
            onPostEdited={(updatedPost) => {
              onEdited(updatedPost); // Atualiza no pai
              closeEditModal();
            }}
          />
        </Modal>
      )}

      <div className="post-card" onClick={onClick}>
        <div className="icons-div">
          <FaTrash
            onClick={deletePostById}
            className="icon-wrapper delete-icon"
          />
          <FaEdit
            onClick={openEditModal}
            className="icon-wrapper edit-icon"
          />
          <FaStar className="icon-wrapper star-icon" />
        </div>

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
    </>
  );
}

export default PostItem;
