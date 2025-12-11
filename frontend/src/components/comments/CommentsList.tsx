// src/components/comments/CommentsList.tsx
import { useEffect, useState } from "react";
import axios from "axios";

interface Comment {
  id: number;
  comment_body: string;
  createdAt: string;
  updatedAt: string;
}

interface CommentsListProps {
  postId: number;
  API_URL: string;
  triggerReload?: boolean;     // usado para recarregar quando um novo comentário for criado
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

      const sorted = response.data.sort(
        (a: Comment, b: Comment) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      setComments(sorted);
    } catch (error) {
      console.log("Error loading comments:", error);
    }
  };

  useEffect(() => {
    loadComments();
  }, [postId, triggerReload]); 
  // dispara quando o id do post muda OU triggerReload muda

  return (
    <div className="comment-list">
      {comments.length === 0 ? (
        <p>Nenhum comentário ainda.</p>
      ) : (
        comments.map((c) => (
          <div key={c.id} className="comment-item">
            <p>{c.comment_body}</p>
            <small>{new Date(c.createdAt).toLocaleString()}</small>
            <hr />
          </div>
        ))
      )}
    </div>
  );
}

export default CommentsList;
