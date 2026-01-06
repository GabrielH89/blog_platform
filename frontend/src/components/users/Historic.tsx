import HistoricPosts from "../posts/HistoricPosts";
import HistoricComments from "../comments/HistoricComments";
import { useState } from "react";
import "../../styles/users/Historic.css";

function Historic() {
const [tab, setTab] = useState<"posts" | "comments">("posts");

  return (
    <div className="historic-container">
      <h1 className="historic-title">Histórico</h1>

      <div className="tabs">
        <button
          className={`tab-btn ${tab === "posts" ? "active" : ""}`}
          onClick={() => setTab("posts")}
        >
          Meus posts
        </button>

        <button
          className={`tab-btn ${tab === "comments" ? "active" : ""}`}
          onClick={() => setTab("comments")}
        >
          Meus comentários
        </button>
      </div>

      <div className="historic-content">
        {tab === "posts" && <HistoricPosts />}
        {tab === "comments" && <HistoricComments />}
      </div>
    </div>
  );
}

export default Historic