"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";

import { TbChartBubbleFilled } from "react-icons/tb";

interface ChatProps {
  messages: string[];
  newMessage: string;
}
const ChatComp: React.FC<ChatProps> = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");

  const { data: session } = useSession();

  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => [
    e.preventDefault(),
    setMessages([...messages, newMessage]),
    setNewMessage(""),
  ];

  // useEffect(() => {
  //   // fetch existing messages
  //   if (fetchedMessages) {
  //     setMessages(fetchedMessages);
  //     setHasMessages(true);
  //   }
  // }, []);

  return (
    <>
      {session && (
        <h1
          onClick={() => signOut({ callbackUrl: "/" })}
          className="text-lg ml-6 text-extrabold hover:text-blue-500 cursor-pointer"
        >
          SignOut
        </h1>
      )}

      <main className="max-w-[50rem] h-screen rounded-lg flex flex-col mx-auto border border-black">
        <ul>
          {messages.map((message, msgIndex) => (
            <li key={msgIndex} className="p-4">
              {message}
            </li>
          ))}
        </ul>
        <form
          onSubmit={handleSendMessage}
          className="fixed bottom-10 w-[50rem] flex"
        >
          <input
            type="text"
            name="message"
            id="message"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Start Chatting..."
            className="w-full border border-neutral-400 border-r-0 rounded-l-lg p-2 outline-none"
          />
          <button
            type="submit"
            className="border border-l-0 border-neutral-400 rounded-r-lg p-2"
          >
            <TbChartBubbleFilled size={24} color={"gray"} />
          </button>
        </form>
      </main>
    </>
  );
};

export default ChatComp;
