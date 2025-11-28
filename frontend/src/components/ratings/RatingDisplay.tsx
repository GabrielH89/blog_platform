import axios from "axios";
import { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";

interface RatingDisplayProps {
    postId: number;
    API_URL: string;
}

function RatingDisplay({postId, API_URL}: RatingDisplayProps) {
    const [media, setMedia] = useState<number | null>(null);
    const [totalRatings, setTotalRatings] = useState<number>(0);

    const fetchRating = async () => {
        const token = sessionStorage.getItem('token');
        try{
            const response = await axios.get(`${API_URL}/posts/${postId}/ratings/average`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log(response.data);
            setMedia(response.data.media);
            setTotalRatings(response.data.totalRating);
        }catch(error) {
            console.log("Error: " + error)
        }
    }

    useEffect(() => {
        fetchRating();
    }, [postId]);

    if (media === null) return <p>Carregando avaliação...</p>;

    return (
        <div className="rating-display">
            <FaStar className="rating-star"/>
            <span>{media.toFixed(1)} ({totalRatings} avaliações)</span>
        </div>
  )
}

export default RatingDisplay