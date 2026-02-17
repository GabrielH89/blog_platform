import { Link } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import Logout from "../../utils/Logout";
import { useUserData } from "../../utils/useUserData";
import Modal from "../../utils/Modal";
import axios from "axios";
import { useState } from "react";
import "../../styles/sidebar/Sidebar.css";

interface SidebarProps {
  role: "user" | "admin";
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  onDeleteAllPosts?: () => void; // só usuário comum
}

function Sidebar({
  role,
  isSidebarOpen,
  toggleSidebar,
  onDeleteAllPosts,
}: SidebarProps) {
  const { imageUser } = useUserData();
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;

  const deleteAllPosts = async () => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem("token");

      await axios.delete(`${API_URL}/posts`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      onDeleteAllPosts?.();
      setIsConfirmModalOpen(false);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button className="menu-toggle" onClick={toggleSidebar}>
        {isSidebarOpen ? "✖" : "☰"}
      </button>

      {isSidebarOpen && (
        <div className="sidebar-overlay" onClick={toggleSidebar}></div>
      )}

      <aside className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        {/* FOTO */}
        {imageUser ? (
          <img
            src={`${API_URL}${imageUser}`}
            alt="Perfil"
            className="profile-picture"
          />
        ) : (
          <FaUserCircle size={180} />
        )}

        <ul>
          {/* ===== USER ===== */}
          {role === "user" && (
            <>
              <li>
                <Link to="/user/profile">Informações pessoais</Link>
              </li>
              <li>
                <Link to="/user/historic">Histórico</Link>
              </li>
              <li>
                <Link to="/user/statistics-user">Estatísticas</Link>
              </li>
              <li>
                <button onClick={() => setIsConfirmModalOpen(true)}>
                  Deletar meus posts
                </button>
              </li>
            </>
          )}

          {/* ===== ADMIN ===== */}
          {role === "admin" && (
            <>
              <li>
                <Link to="/admin/home">Painel do Admin</Link>
              </li>
              <li>
                <Link to="/admin/profile">Informações pessoais</Link>
              </li>
              <li>
                <Link to="/admin/users">Usuários</Link>
              </li>
              <li>
                <Link to="/admin/posts">Gerenciar Posts</Link>
              </li>
              <li>
                <Link to="/admin/statistics">Estatísticas</Link>
              </li>
            </>
          )}

          <li>
            <Logout />
          </li>
        </ul>
      </aside>

      {/* MODAL (só user) */}
      {role === "user" && (
        <Modal
          isOpen={isConfirmModalOpen}
          onClose={() => setIsConfirmModalOpen(false)}
        >
          <h2>Confirmar exclusão</h2>
          <p>Deseja realmente excluir todos os seus posts?</p>

          <button onClick={deleteAllPosts}>
            {loading ? "Deletando..." : "Confirmar"}
          </button>
          <button onClick={() => setIsConfirmModalOpen(false)}>
            Cancelar
          </button>
        </Modal>
      )}
    </>
  );
}

export default Sidebar;
