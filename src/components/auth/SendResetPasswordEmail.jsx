import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/International_Pokémon_logo.svg.png";

export default function SendResetPasswordEmail() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(false);
    setError("");
    setLoading(true);

    if (!email) {
      setError("All fields are required");
      return;
    }

    fetch("http://127.0.0.1:8000/api/forget_password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (data.code !== 200) {
          setLoading(false);
          setError("Send failed. Please try again.");
        }

        setSent(true);
        setLoading(false);
      })
      .catch((error) => {
        setError("Send failed. Please try again.");
        setLoading(false);
      });
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <Link to="/">
          <img src={logo} alt="Pokemon Logo" className="auth-logo" />
        </Link>
        <h2>Send Reset Email</h2>
        {sent && (
          <div className="success-message">
            A password reset link has been sent. Please check your inbox.
          </div>
        )}
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </div>
          <button
            type="submit"
            className="auth-button login-button"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send"}
          </button>
        </form>
        <div className="auth-links">
          <Link to="/" className="back-button">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
