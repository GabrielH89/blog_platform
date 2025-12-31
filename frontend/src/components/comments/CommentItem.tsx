import { useState } from "react";
import axios from "axios";
import CreateComment from "./CreateComment";
import type { Comment } from "./CommentsList";
import "../../styles/comments/CommentItem.css";
import { FaEdit, FaTrash, FaUserCircle } from "react-icons/fa";
import EditComment from "./EditComment";
import Modal from "../../utils/Modal";

interface CommentItemProps {
  comment: Comment;
  postId: number;
  API_URL: string;
  onReload: () => void;
  onDeleted: (id: number) => void;
  onEdited: (comment: Comment) => void;
}

function CommentItem({comment, postId, API_URL, onReload, onDeleted, onEdited}: CommentItemProps) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingComment, setEditingComment] = useState<Comment | null>(null);
  const token = sessionStorage.getItem("token");
  const loggedUserId = Number(sessionStorage.getItem("userId"));
  const repliesCount = comment.replies?.length || 0;
  const canDelete = loggedUserId === comment.userId;
  const canEdit = loggedUserId === comment.userId;

  const handleOpenDeleteModal = () => {
    if (!canDelete) return;
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(
        `${API_URL}/posts/${postId}/comments/${comment.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setShowDeleteModal(false);
      onDeleted(comment.id);
      onReload();
    } catch (error) {
      console.error("Erro ao deletar comentário:", error);
      alert("Não foi possível deletar o comentário.");
    }
  };

  const openEditModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingComment(comment);
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingComment(null);
  };

  return (
    <div className="comment-item">
      {showEditModal && editingComment && (
        <Modal isOpen={showEditModal} onClose={closeEditModal}>
          <EditComment
            comment={editingComment}
            postId={postId}
            onClose={closeEditModal}
            onCommentEdited={(updatedComment) => {
              onEdited(updatedComment);
              closeEditModal();
            }}
          />
        </Modal>
      )}
      
     <div className="comment-avatar">
  {comment.imageUser ? (
    <img
      src={`${API_URL}${comment.imageUser}`}
      alt="Imagem do perfil"
      className="profile-picture"
      style={{ width: 60, height: 60, borderRadius: "50%", objectFit: "cover" }}
    />
  ) : (
    <FaUserCircle size={60} />
  )}
</div>
      <div className="comment-body">
        <div className="comment-content">
          <p className="comment-text">{comment.comment_body}</p>

          <span className="comment-date">
            {new Date(comment.createdAt).toLocaleString()}
          </span>

          <div className="comment-actions">
            <button className="comment-reply-btn" onClick={() => setShowReplyForm(!showReplyForm)}>Responder</button>

            <button
              className="comment-delete-btn" onClick={handleOpenDeleteModal} disabled={!canDelete}
              title={canDelete ? "Excluir comentário" : "Você não pode excluir este comentário"}
              aria-label="Excluir comentário">
              <FaTrash />
            </button>

             <button className="comment-edit-btn" onClick={openEditModal} disabled={!canEdit}
              title={canEdit ? "Editar comentário" : "Você não pode editar este comentário"}
              aria-label="Editar comentário">
              <FaEdit />
            </button>

            {repliesCount > 0 && (
              <button className="comment-toggle-replies" onClick={() => setShowReplies(!showReplies)}>
                {showReplies ? "Ocultar respostas" : `Ver respostas (${repliesCount})`}
              </button>
            )}
          </div>
        </div>

        {showReplyForm && (
          <CreateComment postId={postId} API_URL={API_URL} parentCommentId={comment.id} onClose={() => setShowReplyForm(false)}
            onCommentCreated={onReload}
          />
        )}

        {showReplies && repliesCount > 0 && (
          <div className="comment-replies">
            {comment.replies.map((reply) => (
              <CommentItem key={reply.id} comment={reply} postId={postId} API_URL={API_URL} 
              onReload={onReload} onDeleted={onDeleted} onEdited={onEdited}
              />
            ))}
          </div>
        )}
      </div>

      {showDeleteModal && (
        <div className="modal-overlay-delete-comment">
          <div className="modal-box">
            <h4>Excluir comentário</h4>
            <p>Tem certeza que deseja excluir seu comentário?</p>

            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setShowDeleteModal(false)}>Cancelar</button>
              <button className="btn-confirm" onClick={handleConfirmDelete}>Excluir</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CommentItem;
