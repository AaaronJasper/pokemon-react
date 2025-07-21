//src/socket.js
import { io } from "socket.io-client";

const socket = io("http://localhost:6001", {
  transports: ["websocket"],
});

socket.on("connect", () => {
  console.log("Connect Successfully WebSocket:", socket.id);
});

// socket.on("TradeStatusUpdated", (data) => {
//   console.log("📦 收到 TradeStatusUpdated 訊息:", data);
// });

export default socket;
