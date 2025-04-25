// src/LoginPage.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

export default function LoginPage({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const date = now.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric"
      });
      const time = now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: "Asia/Kolkata"
      });
      setCurrentTime(`${date} ${time} IST`);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://localhost:5000/login", {
        username,
        password
      });
      if (response.data.success) {
        onLogin(); // call onLogin prop
      } else {
        alert("Invalid Credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Error connecting to server.");
    }
  };

  const handleExit = () => {
    if (window.confirm("Are you sure you want to exit?")) {
      window.location.href = "/";
    }
  };

  return (
    <div style={{ backgroundColor: "#cc4422", height: "100vh", display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1, position: "relative" }}>
        <div style={{ position: "absolute", top: 10, right: 20, color: "white", fontSize: "14px" }}>{currentTime}</div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%" }}>
          <div>
            <div style={{ color: "white", marginBottom: "10px" }}>Username</div>
            <input
              style={styles.input}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder=""
            />
          </div>
          <div style={{ marginTop: "10px" }}>
            <div style={{ color: "white", marginBottom: "10px" }}>Password</div>
            <input
              style={styles.input}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder=""
            />
          </div>
          <button style={styles.loginButton} onClick={handleLogin}>Login</button>
        </div>
        <div style={{ position: "absolute", bottom: 20, right: 20 }}>
          <button style={styles.exitButton} onClick={handleExit}>Exit</button>
        </div>
      </div>

      {/* --- Updated Footer --- */}
      <div style={footerStyles.footer}>
        <div style={footerStyles.footerLeft}>
          <div style={footerStyles.logoAboveName}>
            <img src="/sketch.png" alt="Logo" style={footerStyles.logo} />
            <div style={footerStyles.companyName}>SKETCHCOM Engineering & Design Pvt. Ltd.</div>
          </div>
          <div style={footerStyles.subText}>Faridabad – Mumbai – Bangalore – Dubai (UAE)</div>
          <div style={footerStyles.subText}>www.sketchconsultant.in | info@sketchconsultant.co.in</div>
          <div style={footerStyles.subText}>Mobile / WhatsApp: +91-9711079859</div>
        </div>

        <div style={footerStyles.footerCenter}>
          <h1 style={{ fontSize: "36px", fontWeight: "bold", margin: "0" }}>Employee Database</h1>
          <h1 style={{ fontSize: "36px", fontWeight: "bold", margin: "0" }}>Portal</h1>
        </div>

        <div style={footerStyles.footerRight}>
          <img src="crop_image.png" alt="Certificates" style={{ maxWidth: "260px", height: "auto" }} />
        </div>
      </div>

    </div>
  );
}

const styles = {
  input: {
    width: "200px",
    height: "30px",
    border: "2px inset gray",
    backgroundColor: "lightgray",
    fontSize: "14px"
  },
  loginButton: {
    marginTop: "20px",
    width: "100px",
    height: "30px",
    backgroundColor: "gray",
    color: "white",
    border: "2px outset darkgray",
    cursor: "pointer"
  },
  exitButton: {
    width: "80px",
    height: "30px",
    backgroundColor: "gray",
    color: "white",
    border: "2px outset darkgray",
    cursor: "pointer"
  }
};

const footerStyles = {
  footer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 30px",
    backgroundColor: "#ffffff",
    borderTop: "3px solid #ccc",
    fontFamily: "Arial, sans-serif",
    flexWrap: "wrap",
    height: "200px"
  },
  footerLeft: {
    flex: 1,
    textAlign: "center",
    color: "#555",
    fontSize: "14px",
    lineHeight: "1.4",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },
  logoAboveName: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: "5px"
  },
  logo: {
    width: "80px",
    height: "80px",
    marginBottom: "5px"
  },
  companyName: {
    fontWeight: "bold",
    fontSize: "18px",
    color: "#333",
    whiteSpace: "nowrap",
    textAlign: "center"
  },
  subText: {
    margin: "2px 0",
    fontSize: "13px",
    color: "#777",
  },
  footerCenter: {
    flex: 2,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    color: "black",
    textAlign: "center"
  },
  footerRight: {
    flex: 1,
    textAlign: "right",
  }
};
