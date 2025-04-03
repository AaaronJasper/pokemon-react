import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "./assets/International_Pokémon_logo.svg.png";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Clear any previous errors
    setError("");
    
    // Validation
    if (!name || !email || !password || !passwordConfirmation) {
      setError("Please fill in all fields");
      return;
    }
    
    if (password !== passwordConfirmation) {
      setError("Passwords do not match");
      return;
    }
    
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }
    
    // Log the registration attempt
    console.log("Registration attempt with:", { 
      name, 
      email, 
      password, 
      passwordConfirmation 
    });
    
    // Here you would typically make an API call to register the user
    fetch("http://127.0.0.1:8000/api/user/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        name, 
        email, 
        password, 
        password_confirmation: passwordConfirmation 
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Registration failed");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Registration successful:", data);
        // Redirect to login page
        navigate("/login");
      })
      .catch((error) => {
        console.error("Registration error:", error);
        setError("Registration failed. Please try again.");
      });
  };

  const handleBackToHome = () => {
    navigate("/");
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <img src={logo} alt="Pokemon Logo" className="login-logo" />
        <h1>Register for Pokémon Collection</h1>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="form-input"
            />
          </div>
          
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
          
          <div className="form-group">
            <label htmlFor="passwordConfirmation">Confirm Password</label>
            <input
              type="password"
              id="passwordConfirmation"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              placeholder="Confirm your password"
              className="form-input"
            />
          </div>
          
          <div className="form-buttons">
            <button type="submit" className="login-submit-button">
              Register
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
          <p>Already have an account? <button 
            className="link-button" 
            onClick={() => navigate("/login")}
          >
            Login here
          </button></p>
        </div>
      </div>
    </div>
  );
}