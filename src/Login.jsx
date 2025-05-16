import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import logo from "./assets/International_Pokémon_logo.svg.png";
import { UserContext } from "./UserContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useContext(UserContext);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email || !password) {
      setError("All fields are required");
      return;
    }

    fetch("http://127.0.0.1:8000/api/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })
      .then((response) => {
        if (response.status === 422) {
          return response.json().then((data) => {
            if (data.errors) {
              const errorMessages = Object.values(data.errors)
                .flat()
                .join(", ");
              throw new Error("Validation failed");
            }
            throw new Error(data.message || "Validation failed");
          });
        }
        return response.json();
      })
      .then((data) => {
        if (data.code !== 200) {
          setLoading(false);
          setError("Login failed. Please try again.");
        }

        const userData = {
          id: data.data.id,
          name: data.data.user,
          token: data.data.token,
        };

        sessionStorage.setItem("token", userData.token);
        sessionStorage.setItem("user", JSON.stringify(userData));

        setUser(userData);
        setLoading(false);

        navigate("/");
      })
      .catch((error) => {
        console.error("Login error:", error);
        setError("Login failed. Please try again.");
        setLoading(false);
      });
  };

  const handleBackToHome = (e) => {
    e.preventDefault();
    navigate("/");
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <Link to="/">
          <img src={logo} alt="Pokemon Logo" className="auth-logo" />
        </Link>
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
