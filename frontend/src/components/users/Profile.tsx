import { FaPen, FaUserCircle } from 'react-icons/fa';
import {useUserData} from  '../../utils/useUserData';
import '../../styles/users/Profile.css';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Modal from '../../utils/Modal';
import UpdateDatas from './UpdateDatas';

function Profile() {
  const {userName, userLogin, imageUser} = useUserData();
  const [showOptions, setShowOptions] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const optionsRef = useRef<HTMLDivElement>(null);
  const [showFullImage, setShowFullImage] = useState(false);
  const [isUpdateDatasOpen, setIsUpdateDatasOpen] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;

  const handleImageClick = () => {
    setShowOptions((prev) => !prev);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  }

    const handleRemoveImage = async () => {
      try {
          const token = sessionStorage.getItem("token");
          const response = await axios.delete(`${API_URL}/users/image`, {
              headers: {
                  'Authorization': `Bearer ${token}`
              }
          });

          const { token: newToken } = response.data;
          if (newToken) {
              sessionStorage.setItem("token", newToken);
          }

          window.location.reload();
      } catch (error) {
          console.error("Error to delete image " + error);
      }
    };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
      if (file) {
        const token = sessionStorage.getItem("token");
        if (!token) return;

        const formData = new FormData();
        formData.append("imageUser", file);
        formData.append("username", userName);
        formData.append("login", userLogin);

        try {
            const response = await axios.put(`${API_URL}/users`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"
                }
            });

            const { token: newToken } = response.data;
            if (newToken) {
                sessionStorage.setItem("token", newToken);
            }

            window.location.reload();
        } catch (error) {
            console.error("Error to update image:", error);
        }
    }
  }

   useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (
            optionsRef.current &&
            !optionsRef.current.contains(event.target as Node)
        ) {
            setShowOptions(false);
        }
     };

      if (showOptions) {
          document.addEventListener("mousedown", handleClickOutside);
      }

      return () => {
          document.removeEventListener("mousedown", handleClickOutside);
      };
  }, [showOptions]);


  return (
    <div className='personal-profile'>
      <h2>Informações pessoais</h2>

      <div className='profile-icon'>
        {imageUser ? (
          <img src={`${API_URL}${imageUser}`} alt='Imagem do perfil' className='profile-picture'
           style={{ width: 200, height: 200, borderRadius: "50%", objectFit: "cover" }}
          />
        ) : (
            <FaUserCircle size={200} />
          )}
      </div>
      <div className='edit-icon-below'>
          <FaPen className='fa-pen' onClick={handleImageClick}></FaPen>
      </div>

      {showOptions && (
        <div className="edit-options" ref={optionsRef}>
            <button onClick={handleUploadClick}>Atualizar imagem</button>
            <button onClick={handleRemoveImage}>Remover imagem</button>
            <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
            />
        </div>
      )}

      <label>Nome</label>
      <input type='text' value={userName} disabled></input>

      <label>Email</label>
      <input type='email' value={userLogin} disabled></input>

      <div className="div-personal-profile-btn">
                <button className="update-account-btn" onClick={() => setIsUpdateDatasOpen(true)}>
                    Atualizar dados
                </button>
                <Modal isOpen={isUpdateDatasOpen} onClose={() => setIsUpdateDatasOpen(false)}>
                    <UpdateDatas onClose={() => setIsUpdateDatasOpen(false)} />
                </Modal>
                <button className="delete-account-btn">Deletar conta</button>
            </div>

             {/* Modal para exibir a imagem em tela cheia */}
            {showFullImage && (
                <div className="fullscreen-overlay" onClick={() => setShowFullImage(false)}>
                    <img
                        src={`${API_URL}${imageUser}`}
                        alt="Imagem ampliada"
                        className="fullscreen-image"
                    />
                </div>
            )}
    </div>
  )
}

export default Profile