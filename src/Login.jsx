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
    setError("");

    // Validate form
    if (!email || !password) {
      setError("All fields are required");
      return;
    }

    // Call the login API
    fetch("http://127.0.0.1:8000/api/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((data) => {
            throw new Error(data.message || "Login failed");
          });
        }
        return response.json();
      })
      .then((data) => {
        console.log("Login successful:", data);
        // Store token and user data in session storage
        sessionStorage.setItem("token", data.data.token);
        sessionStorage.setItem("user", JSON.stringify({
          id: data.data.id,
          name: data.data.user,
          token: data.data.token
        }));
        // Navigate to home page
        navigate("/");
      })
      .catch((error) => {
        console.error("Login error:", error);
        setError(error.message || "Login failed. Please try again.");
      });
  };

  const handleBackToHome = () => {
    navigate("/");
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <img src={logo} alt="Pokemon Logo" className="auth-logo" />
        <h2>Login</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
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
            />
          </div>
          <button type="submit" className="auth-button login-button">
            Login
          </button>
        </form>
        <div className="auth-links">
          <p>
            Don't have an account?{" "}
            <a href="/register" className="auth-link">
              Register here
            </a>
          </p>
          <a href="/" className="back-button" onClick={handleBackToHome}>
            Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}
