import axios from "axios";
import LoadingModal from "../../utils/LoadingModal";
import { useState } from "react";

interface Comment {
  id: number;
  comment_body: string;
  createdAt: string;
  updatedAt: string;
  postId: string;
  userId: string;
  deleted: boolean;
  parentCommentId: string;
}

interface EditCommentProps {
  comment: Comment;
  postId: number;
  onClose: () => void;
  onCommentEdited: (comment: Comment) => void;
}

function EditComment({ comment, postId, onClose, onCommentEdited }: EditCommentProps) {
  const [commentBody, setCommentBody] = useState(comment.comment_body);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const API_URL = import.meta.env.VITE_API_URL;

  const editComment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      const token = sessionStorage.getItem("token");

      const response = await axios.put(
        `${API_URL}/posts/${postId}/comments/${comment.id}`,
        { comment_body: commentBody },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      onCommentEdited(response.data);
      onClose();
    } catch (error) {
      setErrorMessage("Erro ao atualizar comentário");
      console.log("Error: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {isLoading && <LoadingModal />}

      <button type="button" onClick={onClose} className="close-button">
        X
      </button>

      <form className="EditCommentForm" onSubmit={editComment}>
        <div className="formGroup">
          <label>Seu comentário</label>

          <textarea
            value={commentBody}
            onChange={(e) => setCommentBody(e.target.value)}
            maxLength={10000}
            rows={10}
            cols={50}
            required
          />
        </div>

        {errorMessage && <p className="error">{errorMessage}</p>}

        <div className="div-edit-btn-comment">
          <button className="edit-btn-comment" type="submit">
            Atualizar
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditComment;
