import React, { useEffect, useState } from "react";
import axios from "axios";

export default function HomePage({ onSelectEmployee, onBack }) {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [newName, setNewName] = useState("");
  const [newId, setNewId] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const [nameError, setNameError] = useState(""); // Error message state for name validation

  useEffect(() => {
    fetchEmployees();
    const timer = setInterval(() => {
      const now = new Date();
      const date = now.toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });
      const time = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "Asia/Kolkata" });
      setCurrentTime(`${date} ${time} IST`);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get("http://localhost:5000/employees");
      setEmployees(response.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const handleSearch = () => {
    const emp = employees.find(emp => emp.employee_id === selectedEmployeeId);
    if (emp) {
      onSelectEmployee(emp);
    } else {
      alert("Employee not found!");
    }
  };

  const handleAddEmployee = async () => {
    if (!newName || !newId) {
      alert("Please fill both Name and ID.");
      return;
    }
    try {
      const response = await axios.post("http://localhost:5000/add-employee", { name: newName, employee_id: newId });
      if (response.data.success) {
        fetchEmployees();
        setNewName("");
        setNewId("");
        alert("Employee added!");
      }
    } catch (err) {
      alert("Employee ID already exists or error!");
    }
  };

  const handleExit = () => {
    if (window.confirm("Are you sure you want to exit?")) {
      window.location.href = "/";
    }
  };

  const handleBack = () => {
    onBack(); // This will switch back to LoginPage when clicked
  };

  const handleNameChange = (e) => {
    const value = e.target.value;
    if (/^[a-zA-Z\s]*$/.test(value)) {
      setNewName(value);
      setNameError(""); // Clear error message when valid
    } else {
      setNameError("Only alphabets and spaces are allowed");
    }
  };

  return (
    <div style={{ backgroundColor: "#cc4422", height: "100vh", display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1, position: "relative" }}>
        <div style={{ position: "absolute", top: 10, right: 20, color: "white", fontSize: "14px" }}>{currentTime}</div>

        <div style={{ display: "flex", justifyContent: "space-around", marginTop: "80px" }}>
          {/* Existing Employee Section */}
          <div>
            <h2 style={{ color: "white" }}>Existing Employee</h2>
            <div style={{ color: "white", marginBottom: "5px" }}>Select Employee</div>
            <select
              style={styles.input}
              value={selectedEmployeeId}
              onChange={e => setSelectedEmployeeId(e.target.value)}
            >
              <option value="">-- Select --</option>
              {employees.map(emp => (
                <option key={emp.employee_id} value={emp.employee_id}>
                  {emp.name} ({emp.employee_id})
                </option>
              ))}
            </select>
            <button style={styles.button} onClick={handleSearch}>Submit</button>
          </div>

          {/* Add New Employee Section */}
          <div>
            <h2 style={{ color: "white" }}>Add New Employee</h2>
            <div style={{ color: "white" }}>Employee Name</div>
            <input
              style={styles.input}
              value={newName}
              onChange={handleNameChange} // Handle the name change for validation
              placeholder=""
            />
            {nameError && <div style={{ color: "red", fontSize: "12px" }}>{nameError}</div>} {/* Show error message */}

            <div style={{ color: "white" }}>ID Number</div>
            <input
              style={styles.input}
              value={newId}
              onChange={e => setNewId(e.target.value)}
              placeholder=""
            />
            <button style={styles.button} onClick={handleAddEmployee}>Submit</button>
          </div>
        </div>

        {/* Bottom Buttons */}
        <div style={styles.bottomRightButtons}>
          <button style={styles.backButton} onClick={handleBack}>Back</button>
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
    marginBottom: "10px",
    padding: "5px",
    fontSize: "14px"
  },
  button: {
    display: "block",
    marginTop: "10px",
    width: "100px",
    height: "30px",
    backgroundColor: "gray",
    color: "white",
    border: "2px outset darkgray",
    cursor: "pointer"
  },
  bottomRightButtons: {
    position: "absolute",
    bottom: "20px",
    right: "20px",
    display: "flex",
    gap: "10px"
  },
  backButton: {
    width: "80px",
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
