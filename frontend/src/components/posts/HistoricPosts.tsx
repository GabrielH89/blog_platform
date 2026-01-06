import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import PostItem from "../posts/PostItem";

interface Post {
  id: number;
  titlePost: string;
  bodyPost: string;
  imagePost: string;
  createdAt: string;
  updatedAt: string;
  userId: number;
}

function HistoricPosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [visible, setVisible] = useState(3);   // 👉 começa mostrando 4
  const API_URL = import.meta.env.VITE_API_URL;

  const fetchPosts = useCallback(async () => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get(`${API_URL}/posts/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setPosts(response.data);
    } catch (error) {
      console.log("Erro ao buscar posts:", error);
    }
  }, [API_URL]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handlePostDeleted = (id: number) => {
    setPosts((prev) => prev.filter((post) => post.id !== id));
  };

  const handlePostEdited = (updatedPost: Post) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === updatedPost.id ? updatedPost : p))
    );
  };

  return (
    <div>
      <main className="posts-section">
        <h1>Posts</h1>

        {posts.length === 0 ? (
          <p>Nenhum post encontrado</p>
        ) : (
          <>
            {posts.slice(0, visible).map((post) => (
              <PostItem
                key={post.id} post={post} API_URL={API_URL} onDeleted={handlePostDeleted} onEdited={handlePostEdited}/>
            ))}

            {visible < posts.length && (
              <button className="see-more-btn" onClick={() => setVisible((prev) => prev + 3)}>Ver mais</button>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default HistoricPosts;
