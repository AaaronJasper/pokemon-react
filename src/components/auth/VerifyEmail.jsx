import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";

export default function VerifyEmail() {
  const { token } = useParams();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [_, setCurrentUser] = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    async function verify() {
      setMessage("");
      if (!token) {
        setMessage("No token found.");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`http://127.0.0.1:8000/api/verify/${token}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
        console.log(data);

        if (data.code === 200) {
          const savedUser = localStorage.getItem("user");

          if (savedUser) {
            const parsedUser = JSON.parse(savedUser);
            const updatedUser = { ...parsedUser, isVerify: true };
            localStorage.setItem("user", JSON.stringify(updatedUser));
            setCurrentUser(updatedUser);
            console.log(localStorage.getItem("user"));
          }
          setMessage("✅ Email verification successful!");
        }
      } catch (error) {
        setMessage(`❌ Link has expired`);
      } finally {
        setLoading(false);
      }
    }

    verify();
  }, []);

  return (
    <div className="verify-email-container">
      <div className="verify-email-card">
        {loading ? (
          <div className="loading-message">
            <h2>Verifying your email...</h2>
            <div className="loading-spinner"></div>
          </div>
        ) : (
          <>
            <h2
              className={
                message.includes("✅") ? "success-message" : "error-message"
              }
            >
              {message}
            </h2>
            <button className="back-home-button" onClick={() => navigate("/")}>
              Back to Home
            </button>
          </>
        )}
      </div>
    </div>
  );
}
