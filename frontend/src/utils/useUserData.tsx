import axios from "axios";
import { useEffect, useState } from "react"

export interface UserData {
    username: string,
    login: string;
    imageUser: string;
}

export const useUserData = () => {
    const [userName, setUserName] = useState("");
    const [userLogin, setUserLogin] = useState("");
    const [imageUser, setUserImage] = useState("");

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = sessionStorage.getItem("token");
                const response = await axios.get("http://localhost:8080/users", {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });

                const { username, login, imageUser } = response.data;
                setUserName(username);
                setUserLogin(login);
                setUserImage(imageUser || ""); 
            } catch (error) {
                console.log("Error " + error);
            }
        };
        fetchUser();
    }, []);

    return {userName, userLogin, imageUser};
}