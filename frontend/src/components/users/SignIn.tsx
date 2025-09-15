import axios, { AxiosError } from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function SignIn() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if(!login.trim() || !password.trim()) {
      setErrorMessage("Preencha todos os campos");
      return;
    }

    try{
      const response = await axios.post("http://localhost:8080/auth/login", {login, password})
      const {token, userId} = response.data;
      sessionStorage.setItem("token", token);
      sessionStorage.setItem("userId", userId);
      navigate("/home");
    }catch(error) {
      const axiosError = error as AxiosError;
      if(axiosError.response?.status === 409 || axiosError.response?.status) {
        setErrorMessage("Email ou senha inválidos");
      }else{
        setErrorMessage("Erro ao tentar login, tente novmaente mais tarde");
      }
      setTimeout(() => setErrorMessage(""), 3000);
    }
  }

  return (
    <div className="signInContainer">
      <form className="signInForm" onSubmit={handleLogin}>
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        <h2>Login</h2>
        <div className="formGroup">
          <label>Email</label>
          <input type="login" value={login} onChange={(e) => setLogin(e.target.value)} required></input>
        </div>

         <div className="formGroup">
          <label>Senha</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required></input>
        </div>

        <button type="submit">Entrar</button>
        <p>Não possui uma conta? <Link to="/signUp"></Link></p>
      </form>
    </div>
  )
}

export default SignIn