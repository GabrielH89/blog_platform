// components/Logout.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../styles/utils/Logout.css';

function Logout() {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    navigate("/");
  };

  return (
    <>
      {/* Botão de sair */}
      <button onClick={() => setShowModal(true)}>Sair</button>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Deseja realmente sair?</h3>
            <div className="modal-actions">
              <button onClick={handleLogout} className="confirm">Sim</button>
              <button onClick={() => setShowModal(false)} className="cancel">Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Logout;
