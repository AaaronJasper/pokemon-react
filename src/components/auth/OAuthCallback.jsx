import { useContext, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../../context/UserContext";

export default function OAuthCallback() {
  const [, setCurrentUser] = useContext(UserContext);
  const navigate = useNavigate();
  const { code } = useParams();
  const hasFetched = useRef(false);

  useEffect(() => {
    if (!code || hasFetched.current) {
      return;
    }

    hasFetched.current = true;

    const fetchUserData = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/api/user/get_user_data",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ code }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

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
        console.error("無法取得使用者資訊:", err.message);
        navigate("/login");
      }
    };
    fetchUserData();
  }, []);

  return <p>Redirecting...</p>;
}
