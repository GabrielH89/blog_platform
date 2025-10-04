import { useState } from "react"
import LoadingModal from "../../utils/LoadingModal";
import axios from "axios";
import '../../styles/posts/AddPostForm.css';

interface Post {
  id: number;
  titlePost: string;
  bodyPost: string;
  imagePost: string;
  createdAt: string;
  updatedAt: string;
  userId: number;
}

interface AddPostProps {
  onClose: () => void;
  onPostCreated?: (post: Post) => void; // nova prop
}

function AddPostForm({ onClose, onPostCreated }: AddPostProps) {
  const [titlePost, setTitlePost] = useState("");
  const [bodyPost, setBodyPost] = useState("");
  const [imagePost, setImagePost] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const API_URL = import.meta.env.VITE_API_URL;

  const addPost = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      const token = sessionStorage.getItem("token");
      if (!token) {
        setErrorMessage("Usuário não autenticado");
        setIsLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append("titlePost", titlePost);
      formData.append("bodyPost", bodyPost);
      if (imagePost) {
        formData.append("imagePost", imagePost);
      }

      const response = await axios.post(`${API_URL}/posts`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      // chama callback para atualizar a lista de posts
      if (onPostCreated) {
        onPostCreated(response.data);
      }

      // limpa os campos
      setTitlePost("");
      setBodyPost("");
      setImagePost(null);

      onClose();
    } catch (error) {
      setErrorMessage("Erro ao cadastrar postagem");
      console.log("Error: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {isLoading && <LoadingModal />}
      <button type="button" onClick={onClose} className="close-button">X</button>
      <form className="addCredentialForm" onSubmit={addPost}>
        <div className="formGroup">
          <label>Título do post:</label>
          <input 
            type="text" 
            value={titlePost} 
            onChange={(e) => setTitlePost(e.target.value)} 
            maxLength={200} 
            required 
          />
        </div>
        <div className="formGroup">
          <label>Conteúdo do post</label>
          <textarea 
            value={bodyPost} 
            onChange={(e) => setBodyPost(e.target.value)} 
            maxLength={10000} 
            rows={10} 
            cols={50} 
            required
          />
          <div className="formGroup">
            <input 
              type="file"  
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setImagePost(e.target.files[0]); 
                }
              }}
            />
          </div>
        </div>
        {/* Preview da imagem */}
        {imagePost && (
          <div className="image-preview">
            <img
              src={URL.createObjectURL(imagePost)}
              alt="Prévia da imagem"
              width="200"
            />
          </div>
        )}
        {errorMessage && <p className="error">{errorMessage}</p>}
        <div className="div-add-btn">
          <button className="add-btn" type="submit">Cadastrar</button>
        </div>
      </form>
    </div>
  )
}

export default AddPostForm;
