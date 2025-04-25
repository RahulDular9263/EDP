import { useState } from "react";
import LoginPage from "./LoginPage";
import HomePage from "./HomePage";
import EmployeePage from "./EmployeePage";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const handleLogout = () => {
    setLoggedIn(false);
    setSelectedEmployee(null);
  };

  const handleBackToHome = () => {
    setSelectedEmployee(null);
  };

  return (
    <>
      {!loggedIn ? (
        <LoginPage onLogin={() => setLoggedIn(true)} />
      ) : selectedEmployee ? (
        <EmployeePage employee={selectedEmployee} onBack={handleBackToHome} />
      ) : (
        <HomePage 
          onSelectEmployee={setSelectedEmployee} 
          onBack={handleLogout} 
        />
      )}
    </>
  );
}

export default App;
