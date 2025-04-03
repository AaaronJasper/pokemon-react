import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "./assets/International_Pokémon_logo.svg.png";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Clear any previous errors
    setError("");
    
    // Simple validation
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }
    
    // Log the login attempt
    console.log("Login attempt with:", { email, password });
    
    // Here you would typically make an API call to authenticate
    // For demonstration, we'll simulate a successful login
    // In a real app, you would check credentials with your backend
    fetch("http://127.0.0.1:8000/api/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Login failed");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Login successful:", data);
        
        // Store token and user data in sessionStorage
        sessionStorage.setItem("token", data.data.token);
        sessionStorage.setItem("user", JSON.stringify({
          name: data.data.user,
          token: data.data.token
        }));
        
        // Redirect to home page
        navigate("/");
      })
      .catch((error) => {
        console.error("Login error:", error);
        setError("Invalid email or password. Please try again.");
      });
  };

  const handleBackToHome = () => {
    navigate("/");
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <img src={logo} alt="Pokemon Logo" className="login-logo" />
        <h1>Login to Pokémon Collection</h1>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="form-input"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="form-input"
            />
          </div>
          
          <div className="form-buttons">
            <button type="submit" className="login-submit-button">
              Login
            </button>
            <button 
              type="button" 
              onClick={handleBackToHome} 
              className="back-button"
            >
              Back to Home
            </button>
          </div>
        </form>
        
        <div className="auth-links">
          <p>Don't have an account? <button 
            className="link-button" 
            onClick={() => navigate("/register")}
          >
            Register here
          </button></p>
        </div>
      </div>
    </div>
  );
}
