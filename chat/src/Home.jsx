import { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io.connect("http://localhost:3001");
function Home() {
  const [rooms, setRooms] = useState();

  useEffect(() => {
    socket.on("rooms", (data) => {
      setRooms(data);
      console.log(data);
    });

    return () => {
      socket.off("rooms");
    };
  }, [socket]);

  return (
    <div>
      <h1>Total de salas: {rooms}</h1>
    </div>
  );
}

export default Home;
