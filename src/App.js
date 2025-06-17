import React, { useState } from "react";
import posts from "./data/posts.json";

function App() {
  const [selectedCategory, setSelectedCategory] = useState("Tümü");
  const [selectedJournalist, setSelectedJournalist] = useState("Tümü");

  const allCategories = Array.from(
    new Set(posts.flatMap((post) => post.category))
  );

  const allJournalists = Array.from(
    new Set(posts.map((post) => post.journalist))
  );

  // Şu anki zaman
  const now = new Date();
  // Dün bu saat
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);

  // Filtreleme: kategori + gazeteci + zaman
  const filteredPosts = posts
    .filter((post) =>
      selectedCategory === "Tümü"
        ? true
        : post.category.includes(selectedCategory)
    )
    .filter((post) =>
      selectedJournalist === "Tümü"
        ? true
        : post.journalist === selectedJournalist
    )
    .filter((post) => {
      const postDate = new Date(post.timestamp);
      return postDate >= yesterday && postDate <= now;
    })
    .sort((a, b) => b.likes - a.likes); // Likes’a göre sırala

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h1>Bugünün En Popüler Haberleri</h1>

      {/* Filtre Menüsü */}
      <div style={{ marginBottom: "1rem", display: "flex", gap: "1rem" }}>
        {/* Kategori Seçimi */}
        <div>
          <label htmlFor="category">Kategori: </label>
          <select
            id="category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="Tümü">Tümü</option>
            {allCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Gazeteci Seçimi */}
        <div>
          <label htmlFor="journalist">Gazeteci: </label>
          <select
            id="journalist"
            value={selectedJournalist}
            onChange={(e) => setSelectedJournalist(e.target.value)}
          >
            <option value="Tümü">Tümü</option>
            {allJournalists.map((j) => (
              <option key={j} value={j}>
                {j}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Gönderi Listesi */}
      <div style={{ display: "grid", gap: "1rem" }}>
        {filteredPosts.map((post) => (
          <div
            key={post.id}
            style={{
              border: "1px solid #ccc",
              padding: "1rem",
              borderRadius: "8px",
              backgroundColor: "#f9f9f9",
            }}
          >
            <h3>
              {post.journalist} ({post.platform})
            </h3>
            <p>{post.content}</p>
            <a href={post.url} target="_blank" rel="noopener noreferrer">
              Gönderiyi Aç
            </a>
            <p>
              <strong>Kategori:</strong> {post.category.join(", ")}
            </p>
            <p>
              <small>{new Date(post.timestamp).toLocaleString()}</small>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;