import { useEffect, useState } from "react";
import socket from "../components/socket";

export default function useTradeNotification(user) {
  const [latestTradeUpdate, setLatestTradeUpdate] = useState(null);

  useEffect(() => {
    console.log("🧠 user in useTradeNotification:", user);

    if (!user || !user.id) return;

    const storedData = localStorage.getItem("lastTradeUpdate");
    if (storedData) {
      try {
        setLatestTradeUpdate(JSON.parse(storedData));
      } catch (e) {
        console.error("❌ JSON parse error:", e);
      }
    }

    socket.on("TradeStatusUpdated", (data) => {
      console.log("📦 收到 TradeStatusUpdated 訊息:", data);

      localStorage.setItem("hasTradeNotification", "true");
      localStorage.setItem("lastTradeUpdate", JSON.stringify(data));

      setLatestTradeUpdate(data);
    });

    const room = `trades.${user.id}`;

    socket.emit("join", room);
    console.log("join channel".room);

    return () => {
      socket.emit("leave", room);
    };
  }, [user]);

  return [latestTradeUpdate, setLatestTradeUpdate];
}
