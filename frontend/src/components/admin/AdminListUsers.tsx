import axios from "axios";
import { useCallback, useEffect, useState } from "react"
import Sidebar from "../sidebar/Sidebar";
import "../../styles/admin/AdminListUsers.css"; 
import { FaUserCircle } from "react-icons/fa";

interface User {
  id: number;
  username: string;
  login: string;
  imageUser: string;
}

function AdminListUsers() {
  const [listUsers, setListUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;

   const fetchUsers = useCallback(async () => {
      try {
        const token = sessionStorage.getItem("token");
        const response = await axios.get(`${API_URL}/admin/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setListUsers(response.data);
      } catch (error) {
        console.error(error);
      }
    }, [API_URL]);
  
    useEffect(() => {
      fetchUsers();
    }, [fetchUsers]);
  
    
    
    return (
      <div className="admin-list-users">
        <Sidebar role="admin" isSidebarOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}/>
       <main className="users-section">
            <h1>Usuários do sistema</h1>

             {listUsers.length === 0 ? (
          <p>Nenhum usuário encontrado</p>
        ) : (
          listUsers.map((user) => (
            <div key={user.id} className="user-card">
             <div className='profile-icon'>
                {user.imageUser ? (
                  <img src={`${API_URL}${user.imageUser}`} alt='Imagem do perfil' className='profile-picture'
                  style={{ width: 200, height: 200, borderRadius: "50%", objectFit: "cover" }}
                  />
                ) : (
                    <FaUserCircle size={200} />
                  )}
              </div>
               <div className="user-info">
    <div className="info-row">
      <span className="label">Nome:</span>
      <span className="value">{user.username}</span>
    </div>

    <div className="info-row">
      <span className="label">Email:</span>
      <span className="value">{user.login}</span>
    </div>
  </div>

  <button onClick={() => setSelectedUser(user)}>
    Ver detalhes
  </button>
            </div>
          ))
        )}
      </main>
      </div>
    )
}

export default AdminListUsers