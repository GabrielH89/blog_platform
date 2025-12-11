import axios from "axios";
import type React from "react";
import { useState } from "react";

interface CommentProps {
    postId: number;
    API_URL: string;
    onClose?: () => void; 
    onCommentCreated?: () => void;
}

function CreateComment({postId, API_URL, onClose, onCommentCreated}: CommentProps) {
    const [commentBody, setCommentBody] = useState("");
    const token = sessionStorage.getItem("token");

    const createComment = async (e: React.FormEvent) => {
        e.preventDefault();
        try{
            await axios.post(`${API_URL}/posts/${postId}/comments`,{ comment_body: commentBody }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })

            setCommentBody("");
            if (onCommentCreated) onCommentCreated(); // atualizar lista de comentários
            if (onClose) onClose();

            
        }catch(error) {
            console.log("Error: " + error);
        }
       
    }
    return (
        <div>
            <form className="comment-form" onSubmit={createComment}>
                <textarea value={commentBody} onChange={(e) => setCommentBody(e.target.value)}
                placeholder="Escreva seu comentário..."
                ></textarea>
                <button onClick={createComment}>Enviar</button>
            </form>
        </div>
    )
}

export default CreateComment