import React from "react";

const CVPage = () => {
  return (
    <main style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "2rem" }}>
      <h1 style={{
            fontSize: '3rem',
            fontWeight: 'bold',
            textAlign: 'left',
            color: '#374151',
            fontFamily: 'Syne, sans-serif',
            marginBottom: '1rem'
      }}>Resume</h1>
      <img
        src="/ra.png"
        alt="Rimante Awdisson CV"
        style={{ maxWidth: "40%", height: "auto", border: "1px solid #ccc", borderRadius: "8px" }}
      />
    </main>
  );
};

export default CVPage;
