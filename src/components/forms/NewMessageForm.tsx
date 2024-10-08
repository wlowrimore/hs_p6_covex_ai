"use client";

import { useState } from "react";
import useConvexAuth from "../../hooks/useConvexAuth";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";

import { TbChartBubbleFilled } from "react-icons/tb";

const NewMessageForm = () => {
  const [message, setMessage] = useState<string>("");
  const { isAuthenticated, userId } = useConvexAuth();
  const addMessage = useMutation(api.functions.addMessage);
  // const messages = useQuery(api.functions.listMessages);

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isAuthenticated || userId === null) return;
    await addMessage({ content: message, userId });
    setMessage("");
  };

  if (!isAuthenticated) {
    return <div className="text-neutral-600">Please signIn to chat.</div>;
  }

  return (
    <div className="bg-white fixed z-1 bottom-0 left-[50%] translate-x-[-50%] min-w-[54rem] h-[5.4rem] px-12 flex justify-center">
      <form onSubmit={handleSendMessage} className=" w-full flex items-center">
        <input
          type="text"
          name="message"
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Start Chatting..."
          className="w-full border border-neutral-600 border-r-0 rounded-l-lg p-2 mb-12 outline-none bg-none"
        />
        <button
          type="submit"
          className="border border-l-0 border-neutral-600 bg-white rounded-r-lg p-2 mb-12"
        >
          <TbChartBubbleFilled size={24} color={"gray"} />
        </button>
      </form>
    </div>
  );
};

export default NewMessageForm;
