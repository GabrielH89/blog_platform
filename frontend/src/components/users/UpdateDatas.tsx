import { useEffect, useState } from "react";
import { useUserData } from "../../utils/useUserData";
import axios from "axios";
import LoadingModal from "../../utils/LoadingModal";

interface UpdateDatasProps {
    onClose: () => void;
}

function UpdateDatas({onClose}: UpdateDatasProps) {
    const {userName, userLogin} = useUserData();
    const [userNameData, setUserNameData] = useState("");
    const [userLoginData, setUserLoginData] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        setUserNameData(userName);
        setUserLoginData(userLogin);
    }, [userName, userLogin]);

    const updateDatasUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMessage("");

        try{
            const formData = new FormData();
            formData.append("username", userNameData);
            formData.append("login", userLoginData);

            const token = sessionStorage.getItem("token");

            if(!token) {
                throw new Error("Usuário não autenticado");
            }

            const response = await axios.put(`${API_URL}/users`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"
                }
            } )

            const {token: newToken} = response.data;
            if(newToken) {
                sessionStorage.setItem("token", newToken);
            }

            window.location.reload();

            onClose();
        }catch(error) {
            setErrorMessage("Erro ao atualizar os dados do usuário");
            console.log("Erro: " + error);
            setIsLoading(false);
        }   
    } 

    return (
        <div>
            {isLoading && <LoadingModal/>}
            <form className="update-datasUser-form" onSubmit={updateDatasUser}>
                <div className="formgroup">
                    <label>Nome</label>
                    <input type="text" value={userNameData} maxLength={255}
                    onChange={(e) => setUserNameData(e.target.value)}
                    ></input>
                </div>
                <div className="formgroup">
                    <label>Login</label>
                    <input type="email" value={userLoginData} maxLength={600}
                    onChange={(e) => setUserLoginData(e.target.value)}
                    ></input>
                </div>

                {errorMessage && <p className="error">{errorMessage}</p>}
                <div className="div-update-btn">
                    <button type="submit" className="update-btn" >Atualizar</button>
                </div>
            </form>
        </div>
    )
}

export default UpdateDatas