import React, { useState, useEffect } from 'react';
import './App.css';

const docs = [
  "Photo", "Aadhar Card", "PAN Card", "Passport",
  "10th Certificate", "12th Certificate", "Degree", "HR & IT details",
  "Reference ID", "Other Certificate", "Bank Account"
];

const App = () => {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [screen, setScreen] = useState('login');
  const [employees, setEmployees] = useState([]);
  const [currentEmployee, setCurrentEmployee] = useState(null);
  const [newEmp, setNewEmp] = useState({ name: '', id: '' });

  const API_URL = "http://localhost:3000";

  const login = () => {
    if (user && pass) setScreen('dashboard');
    else alert("Enter username and password");
  };

  const addEmployee = async () => {
    if (newEmp.name && newEmp.id) {
      const res = await fetch(`${API_URL}/add-employee`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEmp)
      });
      if (res.ok) {
        alert('Employee added successfully!');
        setNewEmp({ name: '', id: '' });
        setScreen('dashboard');
      } else alert('Failed to add employee');
    } else alert('Please fill all fields');
  };

  const fetchEmployees = async () => {
    const res = await fetch(`${API_URL}/employees`);
    const data = await res.json();
    setEmployees(data);
    setScreen('employee-list');
  };

  const uploadFile = async (doc, fileInput) => {
    const file = fileInput.files[0];
    if (!file) return alert("Select a file first");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("docType", doc);
    formData.append("employeeId", currentEmployee.id);

    const res = await fetch(`${API_URL}/upload`, { method: 'POST', body: formData });
    if (res.ok) {
      alert("Uploaded successfully");
    } else alert("Upload failed");
  };

  const downloadFile = async (doc) => {
    const res = await fetch(`${API_URL}/download?employeeId=${currentEmployee.id}&docType=${doc}`);
    if (res.ok) {
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = doc;
      a.click();
      URL.revokeObjectURL(url);
    } else alert("File not found");
  };

  const deleteFile = async (doc) => {
    if (!window.confirm(`Delete ${doc}?`)) return;

    const res = await fetch(`${API_URL}/delete`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ employeeId: currentEmployee.id, docType: doc })
    });

    if (res.ok) alert("Deleted successfully");
    else alert("Delete failed");
  };

  const downloadStatus = async () => {
    const res = await fetch(`${API_URL}/status/${currentEmployee.id}`);
    const data = await res.json();
    console.log(data);
  };

  const downloadAllStatus = async () => {
    const res = await fetch(`${API_URL}/status-all`);
    const data = await res.json();
    console.log(data);
  };

  return (
    <div className="app">
      {screen === 'login' && (
        <div className="login-box">
          <label>Username: <input type="password" value={user} onChange={e => setUser(e.target.value)} /></label><br /><br />
          <label>Password: <input type="password" value={pass} onChange={e => setPass(e.target.value)} /></label><br /><br />
          <button onClick={login}>Login</button>
        </div>
      )}

      {screen === 'dashboard' && (
        <div className="dashboard">
          <div className="card" onClick={fetchEmployees}><h3>Existing Employees</h3><button>Open</button></div>
          <div className="card" onClick={() => setScreen('add-employee')}><h3>Add New Employee</h3><button>Add</button></div>
          <button onClick={() => setScreen('login')}>Back</button>
        </div>
      )}

      {screen === 'add-employee' && (
        <div className="add-employee">
          <label>Employee Name: <input type="text" value={newEmp.name} onChange={e => setNewEmp({ ...newEmp, name: e.target.value })} /></label><br />
          <label>Employee ID: <input type="text" value={newEmp.id} onChange={e => setNewEmp({ ...newEmp, id: e.target.value })} /></label><br />
          <button onClick={addEmployee}>Submit</button>
          <button onClick={() => setScreen('dashboard')}>Back</button>
        </div>
      )}

      {screen === 'employee-list' && (
        <div className="employee-list">
          <h2>Employee List</h2>
          <ul>
            {employees.map(emp => (
              <li key={emp.id} onClick={() => { setCurrentEmployee(emp); setScreen('upload'); }}>
                ({emp.name}) ({emp.id})
              </li>
            ))}
          </ul>
          <button onClick={() => setScreen('dashboard')}>Back</button>
        </div>
      )}

      {screen === 'upload' && currentEmployee && (
        <div className="upload-section">
          <h2>Documents for {currentEmployee.name} ({currentEmployee.id})</h2>
          {docs.map(doc => (
            <div className="doc-row" key={doc}>
              <label>{doc}</label>
              <input type="file" id={`file-${doc}`} />
              <button onClick={() => uploadFile(doc, document.getElementById(`file-${doc}`))}>Upload</button>
              <button onClick={() => downloadFile(doc)}>Download</button>
              <button onClick={() => deleteFile(doc)}>Delete</button>
            </div>
          ))}
          <button onClick={() => setScreen('employee-list')}>Back</button>
          <button onClick={downloadStatus}>Download Status</button>
          <button onClick={downloadAllStatus}>Download All Status</button>
        </div>
      )}
    </div>
  );
};

export default App;
