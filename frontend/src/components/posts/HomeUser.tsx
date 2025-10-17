// src/pages/HomeUser.tsx
import axios from "axios";
import { useEffect, useState } from "react";
import "../../styles/posts/HomeUser.css";
import AddPostForm from "./AddPostForm";
import Modal from "../../utils/Modal";
import UserArea from "../users/UserArea";
import PostCard from "./PostCard";

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

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const response = await axios.get(`${API_URL}/posts`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPosts(response.data);
      } catch (error) {
        console.log("Error: " + error);
      }
    };
    fetchPosts();
  }, [API_URL]);

  return (
    <div className="home-container">
      {/* Área do usuário importada */}
      <UserArea 
        isSidebarOpen={isSidebarOpen} 
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
      />

      {/* Área principal */}
      <main className="posts-section">
        {/* Se um post foi selecionado, mostra o conteúdo completo */}
        {selectedPost ? (
          <PostCard post={selectedPost} onBack={() => setSelectedPost(null)} />
        ) : (
          <>
            <button className="add-post" onClick={() => setIsAddPostOpen(true)}>
              Adicionar postagem
            </button>

            <Modal isOpen={isAddPostOpen} onClose={() => setIsAddPostOpen(false)}>
              <AddPostForm 
                onClose={() => setIsAddPostOpen(false)} 
                onPostCreated={(newPost) => setPosts((prev) => [newPost, ...prev])} 
              />
            </Modal>

            <h1>Posts</h1>
            {posts.length === 0 ? (
              <p>Nenhum post encontrado</p>
            ) : (
              posts.map((post) => (
                <div
                  key={post.id}
                  className="post-card"
                  onClick={() => setSelectedPost(post)} // <- abre o post
                  style={{
                    border: "1px solid #ccc",
                    margin: "10px",
                    padding: "10px",
                    cursor: "pointer",
                  }}
                >
                  <h2>{post.titlePost}</h2>
                  {post.imagePost && (
                    <img
                      src={`${API_URL}${post.imagePost}`}
                      alt={post.titlePost}
                      style={{ maxWidth: "200px", display: "block", marginTop: "10px" }}
                    />
                  )}
                  <p>{post.bodyPost}</p>
                  <div className="description-div">
                  <small>
                    Criado em: {new Date(post.createdAt).toLocaleDateString()}
                  </small>

                  <small>
                    Atualizado em: {new Date(post.updatedAt).toLocaleDateString()}
                  </small>
                  </div>
                  
                </div>
              ))
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default HomeUser;
