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
    setError("");

    // Validate form
    if (!name || !email || !password || !passwordConfirmation) {
      setError("All fields are required");
      return;
    }

    if (password !== passwordConfirmation) {
      setError("Passwords do not match");
      return;
    }

    // Call the register API
    fetch("http://127.0.0.1:8000/api/user/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((data) => {
            throw new Error(data.message || "Registration failed");
          });
        }
        return response.json();
      })
      .then((data) => {
        console.log("Registration successful:", data);
        // Store token and user data in session storage
        sessionStorage.setItem("token", data.data.token);
        sessionStorage.setItem("user", JSON.stringify({
          id: data.data.id,
          name: data.data.user,
          token: data.data.token
        }));
        // Redirect to home page
        navigate("/");
      })
      .catch((error) => {
        console.error("Registration error:", error);
        setError(error.message || "Registration failed. Please try again.");
      });
  };

  const handleBackToHome = () => {
    navigate("/");
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <img src={logo} alt="Pokemon Logo" className="auth-logo" />
        <h2>Register</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
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
          <div className="form-group">
            <label htmlFor="passwordConfirmation">Confirm Password</label>
            <input
              type="password"
              id="passwordConfirmation"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              placeholder="Confirm your password"
            />
          </div>
          <button type="submit" className="auth-button register-button">
            Register
          </button>
        </form>
        <div className="auth-links">
          <p>
            Already have an account?{" "}
            <a href="/login" className="auth-link">
              Login here
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