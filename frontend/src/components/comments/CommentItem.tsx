import { useState } from "react";
import CreateComment from "./CreateComment";
import type { Comment } from "./CommentsList";
import "../../styles/comments/CommentItem.css";

interface CommentItemProps {
  comment: Comment;
  postId: number;
  API_URL: string;
  onReload: () => void;
}

function CommentItem({
  comment,
  postId,
  API_URL,
  onReload,
}: CommentItemProps) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showReplies, setShowReplies] = useState(false);

  const repliesCount = comment.replies?.length || 0;

  return (
    <div className="comment-item">
      <div className="comment-avatar" />

      <div className="comment-body">
        {/* Conteúdo */}
        <div className="comment-content">
          <p className="comment-text">{comment.comment_body}</p>
          <span className="comment-date">
            {new Date(comment.createdAt).toLocaleString()}
          </span>

          <div className="comment-actions">
            <button
              className="comment-reply-btn"
              onClick={() => setShowReplyForm(!showReplyForm)}
            >
              Responder
            </button>

            {repliesCount > 0 && (
              <button
                className="comment-toggle-replies"
                onClick={() => setShowReplies(!showReplies)}
              >
                {showReplies
                  ? "Ocultar respostas"
                  : `Ver respostas (${repliesCount})`}
              </button>
            )}
          </div>
        </div>

        {/* Formulário de resposta */}
        {showReplyForm && (
          <CreateComment
            postId={postId}
            API_URL={API_URL}
            parentCommentId={comment.id}
            onClose={() => setShowReplyForm(false)}
            onCommentCreated={onReload}
          />
        )}

        {/* Respostas (OCULTAS por padrão) */}
        {showReplies && repliesCount > 0 && (
          <div className="comment-replies">
            {comment.replies.map((reply) => (
              <CommentItem
                key={reply.id}
                comment={reply}
                postId={postId}
                API_URL={API_URL}
                onReload={onReload}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default CommentItem;
