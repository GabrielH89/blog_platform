import axios from "axios";
import { useEffect, useState } from "react"

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
    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const fetchPosts = async () => {
            try{
                const token = sessionStorage.getItem("token");
                const response = await axios.get(`${API_URL}/posts`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                })
                console.log(response.data);
                setPosts(response.data);
            }catch(error) {
                console.log("Error: " + error);
            }
        }
        fetchPosts(); 
    }, []);
    
    return (
        <div>
            <h1>Posts</h1>
      {posts.length === 0 ? (
        <p>Nenhum post encontrado</p>
      ) : (
        posts.map((post) => (
          <div key={post.id} 
          className="post-card"
          style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}>
            <h2>{post.titlePost}</h2>
            <p>{post.bodyPost}</p>
            {post.imagePost && (
              <img
                src={post.imagePost}
                alt={post.titlePost}
                style={{ maxWidth: "200px", display: "block", marginTop: "10px" }}
              />
            )}
            <small>Criado em: {new Date(post.createdAt).toLocaleDateString()}</small>
          </div>
        ))
      )}
        </div>
    )
}

export default HomeUser