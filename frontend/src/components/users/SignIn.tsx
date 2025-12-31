import axios, { AxiosError } from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LoadingModal from "../../utils/LoadingModal";
import '../../styles/users/SignIn.css';
import SignUp from "./SignUp";
import Modal from "../../utils/Modal";

function SignIn() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUpOpen, setSignUpOpen] = useState(false);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);
    setErrorMessage("");

    if(!login.trim() || !password.trim()) {
      setErrorMessage("Preencha todos os campos");
      return;
    }

    try{
      const response = await axios.post(`${API_URL}/auth/login`, {login, password})
      const {token, userId, role} = response.data;
      sessionStorage.setItem("token", token);
      sessionStorage.setItem("userId", userId);
      sessionStorage.setItem("role", role);

      if(role === "USER") {
        navigate("/user/home");
      }else{
        navigate("/admin")
      }
    }catch(error) {
      const axiosError = error as AxiosError;
      if(axiosError.response?.status === 401 || axiosError.response?.status === 404) {
        setErrorMessage("Email ou senha inválidos");
        setIsLoading(false);
      }else{
        setErrorMessage("Erro ao tentar login, tente novamente mais tarde");
      }
      setTimeout(() => setErrorMessage(""), 3000);
    }finally {
       setIsLoading(false);
    }
  }

  return (
    <div className="signInContainer">
      {isLoading && <LoadingModal/>}
      <form className="signInForm" onSubmit={handleLogin}>
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        <h2>Login</h2>
        <div className="formGroup">
          <label>Email</label>
          <input type="email" value={login} onChange={(e) => setLogin(e.target.value)} required></input>
        </div>

         <div className="formGroup">
          <label>Senha</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required></input>
        </div>

        <button type="submit">Entrar</button>
        <p>Não possui uma conta?{" "} 
          <Link className="cadastre-div" to="#" onClick={() => setSignUpOpen(true)}>Cadastre-se</Link></p>
      </form>

        <Modal isOpen={isSignUpOpen} onClose={() => setSignUpOpen(false)}>
          <SignUp />
        </Modal>
    </div>
  )
}

export default SignIn