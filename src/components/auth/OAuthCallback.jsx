import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../../context/UserContext";

export default function OAuthCallback() {
  const [, setCurrentUser] = useContext(UserContext);
  const navigate = useNavigate();
  const { code } = useParams();
  const hasFetched = useRef(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setError(null);

    if (!code || hasFetched.current) {
      setError("The authorization code is invalid or has already been used.");
      return;
    }

    hasFetched.current = true;

    const fetchUserData = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/api/oauth/exchange-tokenn",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ code }),
          }
        );

        const data = await response.json();
        console.log(data);

        const userData = {
          id: data.data.id,
          name: data.data.user,
          token: data.data.token,
          isVerify: data.data.isVerify,
        };

        localStorage.setItem("token", userData.token);
        localStorage.setItem("user", JSON.stringify(userData));
        setCurrentUser(userData);
        navigate("/");
      } catch (err) {
        setError("Login failed. Please try again.");
      }
    };

    fetchUserData();
  }, [code]);

  return (
    <div className="verify-email-container">
      <div className="verify-email-card">
        {error ? (
          <>
            <h2 className="error-message">{error}</h2>
            <button
              className="back-home-button"
              onClick={() => navigate("/login")}
            >
              Back to login
            </button>
          </>
        ) : (
          <div className="loading-message">
            <h2>Redirecting...</h2>
            <div className="loading-spinner"></div>
          </div>
        )}
      </div>
    </div>
  );
}
