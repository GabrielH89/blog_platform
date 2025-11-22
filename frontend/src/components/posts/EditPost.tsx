import React, { useState } from "react";
import LoadingModal from "../../utils/LoadingModal";
import axios from "axios";
import '../../styles/posts/EditPostForm.css';

interface Post {
  id: number;
  titlePost: string;
  bodyPost: string;
  imagePost: string;
  createdAt: string;
  updatedAt: string;
  userId: number;
}

interface EditPostProps {
  post: Post;
  onClose: () => void;
  onPostEdited: (post: Post) => void;
}

function EditPost({ post, onClose, onPostEdited }: EditPostProps) {
  const [titlePost, setTitlePost] = useState(post.titlePost);
  const [bodyPost, setBodyPost] = useState(post.bodyPost);
  const [imagePost, setImagePost] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const API_URL = import.meta.env.VITE_API_URL;

  const editPost = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try{

        const token = sessionStorage.getItem("token");
        const formData = new FormData();
        formData.append("titlePost", titlePost);
        formData.append("bodyPost", bodyPost);

        // Envia a imagem APENAS se o usuário selecionou uma nova
        if (imagePost) {
        formData.append("imagePost", imagePost);
        }

        const response = await axios.put(
        `${API_URL}/posts/${post.id}`,
        formData,
        {
            headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
            }
        }
        );

        onPostEdited(response.data);
        onClose();

        }catch(error) {
            setErrorMessage("Erro ao ataualizar postagem");
            console.log("Error: ", error);
        }finally {
            setIsLoading(false);
        }
    };

  return (
    <div>
      {isLoading && <LoadingModal />}
      <button type="button" onClick={onClose} className="close-button">
        X
      </button>

      <form className="EditPostForm" onSubmit={editPost}>
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

        <div className="div-edit-btn">
          <button className="edit-btn" type="submit">
            Atualizar
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditPost;
