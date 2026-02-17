import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../sidebar/Sidebar";
import "../../styles/admin/AdminHome.css";

function AdminHome() {
  const [totalUsers, setTotalUsers] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const fetchTotalUsers = useCallback(async () => {
    try {
      const token = sessionStorage.getItem("token");

      const response = await axios.get(
        `${API_URL}/admin/users/count`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setTotalUsers(response.data);
    } catch (error) {
      console.error(error);
    }
  }, [API_URL]);

  useEffect(() => {
    fetchTotalUsers();
  }, [fetchTotalUsers]);

  return (
    <div className="admin-home-container">
      <Sidebar
        role="admin"
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <div
        className="admin-card"
        onClick={() => navigate("/admin/users")}
      >
        <h3>Total de Usuários</h3>
        <p className="admin-card-number">{totalUsers}</p>
      </div>
    </div>
  );
}

export default AdminHome;
