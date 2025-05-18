import { useState, useContext } from "react";
import { UserContext } from "./UserContext";

export default function SendVerifyEmail() {
  const [currentUser] = useContext(UserContext);
  const [loading, setLoading] = useState(false);

  async function handleClick(e) {
    e.preventDefault();

    if (loading || !currentUser?.token) return;

    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/send_verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser.token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to send verification email");
      }

      alert("✅ Verification email sent!");
    } catch (error) {
      alert(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="verify-status">
      Your email is not verified
      <br />
      {loading ? (
        <span>Sending...</span>
      ) : (
        <a href="#" onClick={handleClick}>
          Resend verification email
        </a>
      )}
    </div>
  );
}
