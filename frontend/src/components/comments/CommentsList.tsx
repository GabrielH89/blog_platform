import { useEffect, useState } from "react";
import axios from "axios";
import CommentItem from "./CommentItem";
import "../../styles/comments/CommentList.css";

export interface Comment {
  id: number;
  comment_body: string;
  createdAt: string;
  updatedAt: string;
  replies: Comment[];
  userId: number;
}

interface CommentsListProps {
  postId: number;
  API_URL: string;
  triggerReload?: boolean;
}

function CommentsList({ postId, API_URL, triggerReload }: CommentsListProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const token = sessionStorage.getItem("token");

  const loadComments = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/posts/${postId}/comments`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setComments(response.data);
    } catch (error) {
      console.log("Error loading comments:", error);
    }
  };

  useEffect(() => {
    loadComments();
  }, [postId, triggerReload]);

  // 🔹 remover comentário da lista
  const handleDeleted = (id: number) => {
    const removeFromTree = (list: Comment[]): Comment[] =>
      list
        .filter((c) => c.id !== id)
        .map((c) => ({
          ...c,
          replies: removeFromTree(c.replies || []),
        }));

    setComments((prev) => removeFromTree(prev));
  };

  // 🔹 FUNÇÃO RECURSIVA → atualiza em qualquer nível
  const updateTree = (list: Comment[], updated: Comment): Comment[] => {
    return list.map((c) => {
      if (c.id === updated.id) return updated;

      return {
        ...c,
        replies: updateTree(c.replies || [], updated),
      };
    });
  };

  // 🔹 atualizar comentário editado
  const handleEdited = (updated: Comment) => {
    setComments((prev) => updateTree(prev, updated));
  };

  return (
    <div className="comment-list">
      {comments.length === 0 ? (
        <p className="comment-empty">Nenhum comentário ainda.</p>
      ) : (
        comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            postId={postId}
            API_URL={API_URL}
            onReload={loadComments}
            onDeleted={handleDeleted}
            onEdited={handleEdited}
          />
        ))
      )}
    </div>
  );
}

export default CommentsList;
