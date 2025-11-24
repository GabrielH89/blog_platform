import { useState, useEffect } from "react";
import axios from "axios";
import { FaStar } from "react-icons/fa";

interface RatingProps {
  postId: number;
  API_URL: string;
  onClose?: () => void;
}

function CreateRating({ postId, API_URL, onClose }: RatingProps) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [error, setError] = useState("");
  const [ratingId, setRatingId] = useState<number | null>(null);

  const token = sessionStorage.getItem("token");

  // 🔥 1) Verificar se o usuário já avaliou este post
  useEffect(() => {
    const fetchUserRating = async () => {
      try {
        const res = await axios.get(
          `${API_URL}/posts/${postId}/ratings/user`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (res.data) {
          setRating(res.data.rating_value);
          setRatingId(res.data.id); 
        }

      } catch (error) {
        console.log("Error " + error);
      }
    };

    fetchUserRating();
  }, [postId]);


  // 🔥 2) Criar ou atualizar rating
  const sendRating = async (value: number) => {
    setError("");

    try {
      // Se já existe avaliação -> PUT
      if (ratingId) {
        const res = await axios.put(
          `${API_URL}/posts/${postId}/ratings/${ratingId}`,
          { rating_value: value },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setRating(res.data.rating_value);
        if (onClose) onClose();
        return;
      }

      // Senão, criar -> POST
      const res = await axios.post(
        `${API_URL}/posts/${postId}/ratings`,
        { rating_value: value },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setRating(res.data.rating_value);
      setRatingId(res.data.id);

      if (onClose) onClose();

    } catch (error) {
      if (error === 409) {
        setError("Você já avaliou este post.");
      } else {
        setError("Erro inesperado ao avaliar o post.");
      }
    }
  };

  return (
    <div style={{ display: "flex", gap: "4px", flexDirection: "column" }}>
      <div style={{ display: "flex", gap: "4px" }}>
        {[1, 2, 3, 4, 5].map((value) => (
          <FaStar
            key={value}
            onClick={() => sendRating(value)}
            onMouseEnter={() => setHover(value)}
            onMouseLeave={() => setHover(0)}
            style={{
              cursor: "pointer",
              color: value <= (hover || rating) ? "#FFD700" : "#ccc",
              fontSize: "24px",
            }}
          />
        ))}
      </div>

      {error && <small style={{ color: "red" }}>{error}</small>}
    </div>
  );
}

export default CreateRating;
