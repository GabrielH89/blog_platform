import axios from "axios"; 

export type LikeTargetType = "POST" | "COMMENT";
const API_URL = import.meta.env.VITE_API_URL;
const token = () => sessionStorage.getItem('token')

export const toggleLike = async (targetId: number, targetType: LikeTargetType) => {
  const { data } = await axios.post(`${API_URL}/likes/toggle`, null, {
    params: { targetId, targetType },
    headers: {
        Authorization: `Bearer ${token()}`
    }
  });
  return data as boolean;
};

export const getLikeCount = async (targetId: number, targetType: LikeTargetType) => {
  const { data } = await axios.get(`${API_URL}/likes/count`, {
    params: { targetId, targetType },
    headers: {
        Authorization: `Bearer ${token()}`
    }
  });
  return data as number;
};
