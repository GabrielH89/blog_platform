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
          />
        ))
      )}
    </div>
  );
}

export default CommentsList;
