"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";

interface ChatProps {
  messages: string[];
  newMessage: string;
}
const ChatComp: React.FC<ChatProps> = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const { data: session } = useSession();

  const handleSendMessage = () => [
    // setMessages([...messages, newMessage]),
    // setNewMessage('')
  ];

  useEffect(() => {
    // fetch existing messages
  }, []);

  return (
    <main>
      {session && (
        <h1
          onClick={() => signOut({ callbackUrl: "/" })}
          className="text-lg ml-6 text-extrabold hover:text-blue-500 cursor-pointer"
        >
          SignOut
        </h1>
      )}
      <ul>{/* map through messages and render them here in an <li> tag */}</ul>
      <div>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button onClick={handleSendMessage}>Send Message</button>
      </div>
    </main>
  );
};

export default ChatComp;
