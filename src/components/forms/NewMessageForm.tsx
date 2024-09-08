"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useSession } from "next-auth/react";

import { TbChartBubbleFilled } from "react-icons/tb";

const NewMessageForm = () => {
  const [newMessage, setNewMessage] = useState<string>("");

  const { data: session } = useSession();

  const sender = session?.user?.name || "";
  const createMessage = useMutation(api.functions.createMessage);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await createMessage({ sender, text: newMessage });
    setNewMessage("");
  };

  return (
    <div className="bg-white fixed bottom-1 left-[50%] translate-x-[-50%] min-w-[53rem] h-[4.5rem] px-12 flex justify-center">
      <form onSubmit={handleSubmit} className="w-full flex items-center">
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
          className="border border-l-0 border-neutral-400 bg-white rounded-r-lg p-2"
        >
          <TbChartBubbleFilled size={24} color={"gray"} />
        </button>
      </form>
    </div>
  );
};

export default NewMessageForm;
