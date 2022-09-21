import { useEffect, useState } from "react";
import "./App.css";
import io from "socket.io-client";
import { useLoaderData } from "react-router-dom";

const socket = io.connect("http://localhost:3001");
function App() {
  const room = useLoaderData();
  console.log(room);

  const [message, setMessage] = useState("");
  const [receive, setReceive] = useState("");
  const [users, setUsers] = useState();

  const sendMessage = () => {
    socket.emit("send", { message, room });
  };

  useEffect(() => {
    socket.emit("join_room", room);

    socket.on("receive", (data) => {
      setReceive(data.message);
    });

    socket.on("user", (data) => {
      setUsers(data);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }, [socket]);

  return (
    <div className="App">
      <p>Users: {users}</p>
      <input
        type="text"
        placeholder="Digite aqui a sua message"
        onChange={(e) => {
          setMessage(e.target.value);
        }}
      />
      <button onClick={sendMessage}>Enviar Message</button>
      <h1>Message: {receive} </h1>
    </div>
  );
}

export default App;
