import { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/comments/CommentList.css";

interface Comment {
  id: number;
  comment_body: string;
  createdAt: string;
  updatedAt: string;
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

  return (
    <div className="comment-list">
      {comments.length === 0 ? (
        <p className="comment-empty">Nenhum comentário ainda.</p>
      ) : (
        comments.map((c) => (
          <div key={c.id} className="comment-item">
            
            {/* Avatar simples */}
            <div className="comment-avatar"></div>

            {/* Conteúdo */}
            <div className="comment-content">
              <p className="comment-text">{c.comment_body}</p>
              <span className="comment-date">
                {new Date(c.createdAt).toLocaleString()}
              </span>
            </div>

          </div>
        ))
      )}
    </div>
  );
}

export default CommentsList;
