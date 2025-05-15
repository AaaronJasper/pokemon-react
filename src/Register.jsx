import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import logo from "./assets/International_Pokémon_logo.svg.png";
import { UserContext } from "./UserContext";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [user, setUser] = useContext(UserContext);
  const [loading, setLoading] = useState(false);

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

    setLoading(true);
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
        if (response.status === 422) {
          return response.json().then((data) => {
            if (data.errors) {
              const errorMessages = Object.values(data.errors)
                .flat()
                .join(", ");
              throw new Error(errorMessages);
            }
            throw new Error(data.message || "Validation failed");
          });
        }
        return response.json();
      })
      .then((data) => {
        if (data.code !== 201) {
          throw new Error("Registration failed. Please try again");
        }

        // Handle successful registration
        console.log("Registration successful:", data);

        const userData = {
          id: data.data.id,
          name: data.data.user,
          token: data.data.token,
        };
        // Store token and user data in session storage
        sessionStorage.setItem("token", userData.token);
        sessionStorage.setItem("user", JSON.stringify(userData));

        setUser(userData);
        setLoading(false);
        // Redirect to home page
        navigate("/");
      })
      .catch((error) => {
        console.error("Registration error:", error);
        setError("Registration failed. Please try again.");
        setLoading(false);
      });
  };

  const handleBackToHome = () => {
    navigate("/");
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <Link to="/">
          <img src={logo} alt="Pokemon Logo" className="auth-logo" />
        </Link>
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
          <button
            type="submit"
            className="auth-button register-button"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
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
