import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import PostCard from "../posts/PostCard";
import PostItem from "../posts/PostItem";
import Sidebar from "../sidebar/Sidebar";
import "../../styles/admin/AdminHome.css";

interface Post {
  id: number;
  titlePost: string;
  bodyPost: string;
  imagePost: string;
  createdAt: string;
  updatedAt: string;
  userId: number;
}

function AdminPosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;

  const fetchPosts = useCallback(async () => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get(`${API_URL}/posts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(response.data);
    } catch (error) {
      console.error(error);
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
      prev.map((post) =>
        post.id === updatedPost.id ? updatedPost : post
      )
    );
  };

  return (
    <div className="admin-home-container">
      <Sidebar
        role="admin"
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <main className="posts-section">
        {selectedPost ? (
          <PostCard post={selectedPost} onBack={() => setSelectedPost(null)} />
        ) : (
          <>
            <h1>Painel do Administrador</h1>

            {posts.length === 0 ? (
              <p>Nenhum post encontrado</p>
            ) : (
              posts.map((post) => (
                <PostItem
                  key={post.id}
                  post={post}
                  API_URL={API_URL}
                  onClick={() => setSelectedPost(post)}
                  onDeleted={handlePostDeleted}
                  onEdited={handlePostEdited}
                />
              ))
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default AdminPosts;
