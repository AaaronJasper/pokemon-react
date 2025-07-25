import { useEffect, useState } from "react";
import socket from "../components/socket";

export default function useTradeNotification(user) {
  const [latestTradeUpdate, setLatestTradeUpdate] = useState(null);
  const [receiverTrigger, setReceiverTrigger] = useState(0);

  useEffect(() => {
    if (!user || !user.id) return;

    const userKey = `user_${user.id}`;
    const storedData = localStorage.getItem(`${userKey}_lastTradeUpdate`);
    if (storedData) {
      try {
        setLatestTradeUpdate(JSON.parse(storedData));
      } catch (e) {
        console.error("❌ JSON parse error:", e);
      }
    }

    const handler = (data) => {
      if (
        data.trade.sender_id !== user.id &&
        data.trade.receiver_id !== user.id
      )
        return;

      if (data.trade.sender_id == user.id) {
        console.log("📦 收到 TradeStatusUpdated 訊息:", data);
        localStorage.setItem(`${userKey}_hasTradeNotification`, "true");
        localStorage.setItem(
          `${userKey}_lastTradeUpdate`,
          JSON.stringify(data)
        );
        setLatestTradeUpdate(data);
      }
      if (data.trade.receiver_id == user.id) {
        console.log("📦 收到 TradeStatusUpdated 訊息:", data);
        localStorage.setItem(`${userKey}_hasTradeNotification`, "true");
        setLatestTradeUpdate(null);
        setReceiverTrigger((prev) => prev + 1);
      }
    };

    socket.on("TradeStatusUpdated", handler);

    const room = `trades.${user.id}`;
    socket.emit("join", room);
    console.log("🧩 join channel", room);

    return () => {
      socket.off("TradeStatusUpdated", handler);
      socket.emit("leave", room);
    };
  }, [user]);

  return [latestTradeUpdate, setLatestTradeUpdate];
}
