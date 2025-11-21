import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import "../../styles/posts/HomeUser.css";
import AddPostForm from "./AddPostForm";
import Modal from "../../utils/Modal";
import UserArea from "../users/UserArea";
import PostCard from "./PostCard";
import PostItem from "./PostItem";

interface Post {
  id: number;
  titlePost: string;
  bodyPost: string;
  imagePost: string;
  createdAt: string;
  updatedAt: string;
  userId: number;
}

function HomeUser() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAddPostOpen, setIsAddPostOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const API_URL = import.meta.env.VITE_API_URL;

  const fetchPosts = useCallback(async () => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get(`${API_URL}/posts`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPosts(response.data);
    } catch (error) {
      console.log("Erro ao buscar posts:", error);
    }
  }, [API_URL]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Função chamada quando um post é deletado
  const handlePostDeleted = (id: number) => {
    setPosts((prev) => prev.filter((post) => post.id !== id));
  };

  const handlePostEdited = (updatedPost: Post) => {
    setPosts((prev) => prev.map((p) => (p.id === updatedPost.id ? updatedPost : p)));
  };

  return (
    <div className="home-container">
      {/* Área do usuário */}
      <UserArea
        onDeleteAllPosts={fetchPosts}
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      {/* Área principal */}
      <main className="posts-section">
        {selectedPost ? (
          <PostCard post={selectedPost} onBack={() => setSelectedPost(null)} />
        ) : (
          <>
            <button className="add-post" onClick={() => setIsAddPostOpen(true)}>
              Adicionar postagem
            </button>

            <Modal
              isOpen={isAddPostOpen}
              onClose={() => setIsAddPostOpen(false)}
            >
              <AddPostForm
                onClose={() => setIsAddPostOpen(false)}
                onPostCreated={(newPost) =>
                  setPosts((prev) => [newPost, ...prev])
                }
              />
            </Modal>

            <h1>Posts</h1>

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

export default HomeUser;
