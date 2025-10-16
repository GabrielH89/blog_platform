// src/components/UserArea.tsx
import { Link } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import Logout from "../../utils/Logout";
import { useUserData } from "../../utils/useUserData";

interface UserAreaProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

function UserArea({ isSidebarOpen, toggleSidebar }: UserAreaProps) {
  const { imageUser } = useUserData();
  const API_URL = import.meta.env.VITE_API_URL;

  return (
    <>
      <button className="menu-toggle" onClick={toggleSidebar}>
        {isSidebarOpen ? "✖" : "☰"}
      </button>

      <aside className={`sidebar-user ${isSidebarOpen ? "open" : ""}`}>
        {imageUser ? (
          <img
            src={`${API_URL}${imageUser}`}
            alt="Imagem do perfil"
            className="profile-picture"
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
            <button>Deletar todos os seus posts</button>
          </li>
          <li>
            <Logout />
          </li>
        </ul>
      </aside>
    </>
  );
}

export default UserArea;
