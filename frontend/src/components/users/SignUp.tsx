import axios, { AxiosError } from "axios";
import React, { useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import '../../styles/users/SignUp.css';

function SignUp() {
    const [username, setUsername] = useState("");
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    
    const API_URL = import.meta.env.VITE_API_URL; 
    const navigate = useNavigate();

    useEffect(() => {
        if(errorMessage) {
            const timer = setTimeout(() => {
                setErrorMessage("");
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [errorMessage]);

    const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    const regexLogin = /^[a-zA-Z0-9._-]+@[a-zA-Z.-]+\.[a-zA-Z]{2,4}$/;
    const regexPassword = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*]).\S{6,}$/;

    if (!regexLogin.test(login)) {
        setErrorMessage("Email inválido");
        return;
    }

    if (!regexPassword.test(password)) {
        setErrorMessage("Senha inválida");
        return;
    }

    if (password !== confirmPassword) {
        setErrorMessage("Senha e confirmação de senha diferentes");
        return;
    }

    try{
        const userData = {username, login, password};

        await axios.post(`${API_URL}/auth/register`, userData, {
            headers: {
                "Content-Type": "application/json",
            }
        });
        setUsername(""); setLogin(""); setPassword(""); setConfirmPassword("");

        alert("Cadastro realizado com sucesso");
        navigate("/");
    }catch(error) {
        const axiosError = error as AxiosError;
        if (axiosError.response?.status === 400) {
            setErrorMessage("Usuário já existente, tente se cadastrar com outro.");
        } else {
            setErrorMessage(
            "Erro ao processar o cadastro. Tente novamente mais tarde."
            );
        }
        console.error("Erro no cadastro:", axiosError);
        }
    }
    
    return (
        <div className="signUpContainer">
             <form className="signUpForm" onSubmit={handleSignUp}>
                {errorMessage && (
                <div
                    className="error-message" style={{backgroundColor: "#B22222", color: "white", padding: "10px",
                    marginBottom: "10px", borderRadius: "5px", textAlign: "center", fontSize: "1.1rem"}}
                >
                    {errorMessage}
                </div>
                )}
                <h2>Cadastro</h2>
                <div className="formGroup">
                <label>Nome:</label>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} maxLength={255} required/>
                </div>
                <div className="formGroup">
                <label>Email:</label>
                <input type="email" value={login} onChange={(e) => setLogin(e.target.value)} maxLength={600} required
                />
                </div>
                <div className="formGroup">
                <label>Senha:</label>
                <div className="password-input-container">
                    <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)}
                    maxLength={300} required/>
                    <button type="button" className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                </div>
                <p>
                    A senha deve ter, no mínimo, 6 caracteres, incluindo números, letras
                    maiúsculas, minúsculas, minúsculos e não ter espaço em branco
                </p>
                </div>
                <div className="formGroup">
                <label>Confirmar senha:</label>
                <div className="password-input-container">
                    <input type={showConfirmPassword ? "text" : "password"} value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)} maxLength={300} required/>
                    <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                </div>
                </div>

                <div className="signUp-btn">
                <button type="submit">Cadastrar</button>
                </div>
                <p>
                Já possui uma conta? <Link to="/">Entrar</Link>
                </p>
            </form>
        </div>
    );
}

export default SignUp