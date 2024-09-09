import ChatComp from "@/components/ChatComp";
import GenerateResearchForm from "@/components/forms/GenerateResearchForm";
import React from "react";

const ChatPage = () => {
  return (
    <div className="min-h-screen flex">
      <ChatComp />
      <GenerateResearchForm />
    </div>
  );
};

export default ChatPage;
