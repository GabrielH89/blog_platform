import { useEffect, useState } from "react";
import { FaThumbsUp, FaRegThumbsUp } from "react-icons/fa";
import { getLikeCount, toggleLike, type LikeTargetType } from "./LikeService";
import "../../styles/likes/LikeButton.css";

type Props = {
  targetId: number;
  targetType: LikeTargetType;
};

function LikeButton({ targetId, targetType }: Props) {
  const [count, setCount] = useState<number>(0);
  const [liked, setLiked] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    loadCount();
  }, [targetId, targetType]);

  const loadCount = async () => {
    try {
      const total = await getLikeCount(targetId, targetType);
      setCount(total);
    } catch (err) {
      console.error("Erro ao carregar likes:", err);
    }
  };

  // 👇 AGORA RECEBE O EVENTO
  const handleLike = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); // 🚀 impede navegar para o card

    if (loading) return;

    try {
      setLoading(true);

      const result = await toggleLike(targetId, targetType);

      // optimistic update
      setLiked(result);
      setCount((prev) => (result ? prev + 1 : prev - 1));
    } catch (err) {
      console.error("Erro ao curtir:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      className={`like-btn ${liked ? "liked" : ""}`}
      onClick={handleLike}
      disabled={loading}
      aria-label={liked ? "Remover like" : "Dar like"}
    >
      {liked ? <FaThumbsUp /> : <FaRegThumbsUp />}
      <span>{count}</span>
    </button>
  );
}

export default LikeButton;
