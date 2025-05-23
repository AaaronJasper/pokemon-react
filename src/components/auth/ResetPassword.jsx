import { useState } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import logo from "../../../public/International_Pokemon_logo.svg.png";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isResetSuccess, setIsResetSuccess] = useState(false);
  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setIsResetSuccess(false);

    // Validate form
    if (!email || !password || !passwordConfirmation) {
      setError("All fields are required");
      setLoading(false);
      return;
    }

    if (password !== passwordConfirmation) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    fetch(`http://127.0.0.1:8000/api/reset_password/${token}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
        password_confirmation: passwordConfirmation,
        token,
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (data.code !== 200) {
          setLoading(false);
          setError("Reset failed. Please try again.");
          return;
        }
        setIsResetSuccess(true);
        setLoading(false);
      })
      .catch((error) => {
        setError("Reset failed. Please try again.");
        setLoading(false);
      });
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <Link to="/">
          <img src={logo} alt="Pokemon Logo" className="auth-logo" />
        </Link>
        <h2>Reset Password</h2>
        {isResetSuccess && (
          <div className="success-message">
            Password reset successful! Please log in to continue.
          </div>
        )}
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
            className="auth-button login-button"
            disabled={loading}
          >
            {loading ? "Reseting..." : "reset"}
          </button>
        </form>
        <div className="auth-links">
          <p>
            Already reset?{" "}
            <Link to="/Login" className="auth-link">
              Back to Login
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
