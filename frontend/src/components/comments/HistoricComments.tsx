import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import CommentItem from "../comments/CommentItem";

interface Comment {
  id: number;
  postId: number;
  userId: number;
  comment_body: string;
  createdAt: string;
  imageUser?: string;
  replies?: Comment[];
}

function HistoricComments() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [visible, setVisible] = useState(3);

  const API_URL = import.meta.env.VITE_API_URL;

  const fetchComments = useCallback(async () => {
    try {
      const token = sessionStorage.getItem("token");

      if (!token) return;

      const res = await axios.get(
        `${API_URL}/user/me/comments`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setComments(res.data);
    } catch (err) {
      console.error("Erro ao buscar comentários:", err);
    }
  }, [API_URL]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleCommentDeleted = (id: number) => {
    setComments((prev) => prev.filter((c) => c.id !== id));
  };

  const handleCommentEdited = (updated: Comment) => {
    setComments((prev) =>
      prev.map((c) => (c.id === updated.id ? updated : c))
    );
  };

  return (
    <main className="comments-user-section">
      <h1>Meus comentários</h1>

      {comments.length === 0 ? (
        <p>Nenhum comentário encontrado</p>
      ) : (
        <>
          {comments.slice(0, visible).map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              postId={comment.postId}
              API_URL={API_URL}
              onReload={fetchComments}
              onDeleted={handleCommentDeleted}
              onEdited={handleCommentEdited}
            />
          ))}

          {visible < comments.length && (
            <button onClick={() => setVisible((v) => v + 3)}>
              Ver mais
            </button>
          )}
        </>
      )}
    </main>
  );
}

export default HistoricComments;
