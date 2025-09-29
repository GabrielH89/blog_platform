import axios from "axios";
import { useEffect, useState } from "react";
import '../../styles/posts/HomeUser.css';
import { Link } from "react-router-dom";

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
  }, []);

  return (
    <div className="home-container">
      {/* Sidebar do perfil */}
      <button className="menu-toggle" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>{isSidebarOpen ? "✖" : "☰"}</button>
      <aside className={`sidebar-user ${isSidebarOpen ? "open" : ""}`}>
        <h2>Área do Usuário</h2>
        <img
          src="https://via.placeholder.com/150"
          alt="Foto do usuário"
          className="profile-image"
        />
        <ul>
          <li>
            <Link to="/profile" className="dropdown-button">Informações pessoais</Link>
          </li>
          <li>
            <Link to="/statistics-user" className="dropdown-button">Ver estatísticas</Link>
          </li>
          <li>
            <button>Deletar todos os seus posts</button>
          </li>
          <li>
            <button>Sair</button>
          </li>
        </ul>
      </aside>
      
      {/* Área dos posts */}
      <main className="posts-section">
        <h1>Posts</h1>
        {posts.length === 0 ? (
          <p>Nenhum post encontrado</p>
        ) : (
          posts.map((post) => (
            <div
              key={post.id}
              className="post-card"
              style={{border: "1px solid #ccc", margin: "10px", padding: "10px"}}>
              <h2>{post.titlePost}</h2>
               {post.imagePost && (
                <img
                  src={`${API_URL}${post.imagePost}`}
                  alt={post.titlePost}
                  style={{maxWidth: "200px", display: "block", marginTop: "10px"}}/>
              )}
              <p>{post.bodyPost}</p>
              <small>
                Criado em: {new Date(post.createdAt).toLocaleDateString()}
              </small>
            </div>
          ))
        )}
      </main>
    </div>
  );
}

export default HomeUser;

