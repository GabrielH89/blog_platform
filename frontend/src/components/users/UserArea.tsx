import { Link } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import Logout from "../../utils/Logout";
import { useUserData } from "../../utils/useUserData";
import axios from "axios";
import Modal from "../../utils/Modal";
import { useState } from "react";
import '../../styles/users/UserArea.css';

interface UserAreaProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  onDeleteAllPosts: () => void;
}

function UserArea({ isSidebarOpen, toggleSidebar, onDeleteAllPosts }: UserAreaProps) {
  const { imageUser } = useUserData();
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;

  const deleteAllPosts = async () => {
    try{
      setLoading(true);
      const token = sessionStorage.getItem('token');
      await axios.delete(`${API_URL}/posts`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      onDeleteAllPosts();
      setIsConfirmModalOpen(false);
    }catch(error) {
      console.log("Error: " + error);
    }finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button className="menu-toggle" onClick={toggleSidebar}>
        {isSidebarOpen ? "✖" : "☰"}
      </button>

      <aside className={`sidebar-user ${isSidebarOpen ? "open" : ""}`}>
        {imageUser ? (
          <img src={`${API_URL}${imageUser}`} alt="Imagem do perfil" className="profile-picture"
            style={{ width: 200, height: 200, borderRadius: "50%", objectFit: "cover" }}
          />
        ) : (
          <FaUserCircle size={200} />
        )}

        <ul>
          <li>
            <Link to="/profile" className="dropdown-button">Informações pessoais</Link>
          </li>
          <li>
            <Link to="/statistics-user" className="dropdown-button">Ver estatísticas</Link>
          </li>
          <li>
            <button onClick={() => setIsConfirmModalOpen(true)}>Deletar todos os seus posts</button>
          </li>
          <li>
            <Logout />
          </li>
        </ul>
      </aside>

      <div className="user-area-modal">
        <Modal isOpen={isConfirmModalOpen} onClose={() => setIsConfirmModalOpen(false)}>
          <h2>Confirmar exclusão</h2>
          <p>Tem certeza que deseja excluir todos os seus posts? Esta ação não pode ser desfeita.</p>

          <div className="user-area-modal-btn">
            <button className="confirm-btn" onClick={deleteAllPosts}>
            {loading ? "Deletando..." : "Confirmar"}
          </button>
          <button className="cancel-btn" onClick={() => setIsConfirmModalOpen(false)}>Cancelar</button>
          </div>
        </Modal>
      </div>
    </>
  );
}

export default UserArea;
