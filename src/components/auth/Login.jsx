import { useState, useContext, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import logo from "../../../public/International_Pokemon_logo.svg.png";
import googleLogo from "../../../public/Google_Favicon_2025.svg.png";
import { UserContext } from "../../context/UserContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useContext(UserContext);
  const loginRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    loginRef.current?.focus();
  }, []);

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
          return;
        }

        const userData = {
          id: data.data.id,
          name: data.data.user,
          token: data.data.token,
          isVerify: data.data.isVerify,
        };

        const now = new Date();
        const expiry = now.getTime() + 3 * 24 * 60 * 60 * 1000;

        localStorage.setItem("token", userData.token);
        localStorage.setItem("expiry", expiry);
        localStorage.setItem("user", JSON.stringify(userData));

        setUser(userData);
        setLoading(false);

        navigate("/");
      })
      .catch((error) => {
        console.log(error);
        setError("Login failed. Please try again.");
        setLoading(false);
      });
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
              ref={loginRef}
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
          <div className="google-signin-container">
            <a
              href="http://127.0.0.1:8000/api/auth/google"
              className="google-signin-button"
            >
              <img src={googleLogo} alt="Google Logo" className="google-logo" />
              Login in with Google
            </a>
          </div>
          <p>
            Don't have an account?{" "}
            <Link to="/register" className="auth-link">
              Register here
            </Link>
          </p>
          <p>
            Forget password?{" "}
            <Link to="/send_reset_password_email" className="auth-link">
              Reset password
            </Link>
          </p>
          <Link to="/" className="back-button">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
