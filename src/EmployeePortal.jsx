// src/EmployeePortal.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function EmployeePortal() {
  const [employeeName, setEmployeeName] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [existingEmployees, setExistingEmployees] = useState([]);
  const [currentTime, setCurrentTime] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    
    fetchEmployees();
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
      setCurrentTime(`${date}  ${time} IST`);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get("http://localhost:5000/employees");
      setExistingEmployees(response.data);
    } catch (error) {
      console.error("Error fetching employees", error);
    }
  };

  const handleAddEmployee = async () => {
    try {
      await axios.post("http://localhost:5000/addEmployee", { employeeName, idNumber });
      alert("Employee Added!");
      setEmployeeName("");
      setIdNumber("");
      fetchEmployees();
    } catch (error) {
      alert("Error adding employee");
    }
  };

  const handleExit = () => {
    window.close();
  };

  return (
    <div style={{ backgroundColor: "#cc4422", height: "100vh", display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1, position: "relative", padding: "20px" }}>
        <div style={{ position: "absolute", top: 10, right: 20, color: "white", fontSize: "14px" }}>{currentTime}</div>

        {/* Top two sections */}
        <div style={{ display: "flex", justifyContent: "space-around", marginTop: "40px" }}>
          {/* Existing Employee */}
          <div>
            <h2 style={{ color: "white", textAlign: "center" }}>Existing Employee</h2>
            <div style={{ color: "white", marginBottom: "10px" }}>Employee Name</div>
            <select style={styles.input}>
              {existingEmployees.map((emp, index) => (
                <option key={index}>{emp.employeeName} ({emp.idNumber})</option>
              ))}
            </select>
            <button style={styles.button}>Submit</button>
          </div>

          {/* Add New Employee */}
          <div>
            <h2 style={{ color: "white", textAlign: "center" }}>Add New Employee</h2>
            <div style={{ color: "white", marginBottom: "10px" }}>Employee Name</div>
            <input
              style={styles.input}
              value={employeeName}
              onChange={(e) => setEmployeeName(e.target.value)}
            />
            <div style={{ color: "white", marginTop: "10px", marginBottom: "10px" }}>ID Number</div>
            <input
              style={styles.input}
              value={idNumber}
              onChange={(e) => setIdNumber(e.target.value)}
            />
            <button style={styles.button} onClick={handleAddEmployee}>Submit</button>
          </div>
        </div>

        {/* Back and Exit */}
        <div style={{ position: "absolute", bottom: 80, left: "43%" }}>
          <button style={{ ...styles.button, marginRight: "20px" }} onClick={() => navigate("/")}>Back</button>
          <button style={styles.button} onClick={handleExit}>Exit</button>
        </div>
      </div>

      {/* Footer */}
      <div style={{ backgroundColor: "white", padding: "10px", textAlign: "center" }}>
        <div>
          <img src="/logo-placeholder.png" alt="Logo" style={{ height: "40px" }} />
        </div>
        <div style={{ fontSize: "24px", fontWeight: "bold", marginTop: "10px" }}>Employee Database Portal</div>
        <div style={{ fontSize: "12px", marginTop: "5px" }}>SKETCHCOM Engineering & Design Pvt. Ltd.</div>
        <div style={{ fontSize: "10px", marginTop: "2px" }}>Faridabad - Mumbai - Bangalore - Dubai (UAE)</div>
        <div style={{ fontSize: "10px", marginTop: "2px" }}>www.sketchconsultant.in | info@sketchconsultant.co.in</div>
        <div style={{ fontSize: "10px", marginTop: "2px" }}>Mobile / WhatsApp : +91-9711079859</div>
        <div style={{ marginTop: "5px" }}>
          <img src="/iso-placeholder.png" alt="ISO" style={{ height: "30px", margin: "5px" }} />
          <img src="/cmmi-placeholder.png" alt="CMMI" style={{ height: "30px", margin: "5px" }} />
        </div>
      </div>
    </div>
  );
}

const styles = {
  input: {
    width: "220px",
    height: "30px",
    border: "2px inset gray",
    backgroundColor: "lightgray",
    fontSize: "14px",
    marginBottom: "10px"
  },
  button: {
    width: "100px",
    height: "30px",
    backgroundColor: "gray",
    color: "white",
    border: "2px outset darkgray",
    cursor: "pointer",
    marginTop: "10px"
  }
};