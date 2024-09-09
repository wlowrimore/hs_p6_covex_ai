"use client";
import { useAction, useMutation } from "convex/react";
import { useState } from "react";
import useConvexAuth from "../../hooks/useConvexAuth";
import { api } from "../../../convex/_generated/api";

import { TbArrowBadgeDownFilled, TbArrowBadgeUpFilled } from "react-icons/tb";
import { RiRobot2Fill } from "react-icons/ri";

const GenerateResearchForm = () => {
  const [prompt, setPrompt] = useState<string>("");
  const [result, setResult] = useState<string>("");
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const { isAuthenticated, userId } = useConvexAuth();

  const generateResults = useAction(api.actions.generateResearchResponses);
  const saveResearchChat = useMutation(api.functions.saveResearchChat);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const researchResults = await generateResults({ prompt });
      if (researchResults !== null) {
        setResult(researchResults);
        console.log("Research Results:", researchResults);

        if (userId) {
          await saveResearchChat({
            userId,
            prompt,
            response: researchResults,
          });
          setPrompt("");
        }
      } else {
        setResult("No results were generated. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      setResult("An error occurred while generating the response.");
    }
  };

  if (!isAuthenticated) {
    return <div className="text-neutral-600">Please signIn to chat.</div>;
  }

  return (
    <div
      className={`fixed right-5 z-40 border border-white rounded-2xl max-w-[25rem] bg-[#3F3F46] px-4 pt-2 pb-2 transition-all duration-300 ease-in-out ${
        isExpanded ? "bottom-3" : "-bottom-[29rem]"
      }`}
    >
      <div
        className="w-full flex items-center pb-2 justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <p className="text-white text-lg font-semibold">
          AI Research Assistant
        </p>
        {isExpanded ? (
          <TbArrowBadgeDownFilled size={24} className="text-white" />
        ) : (
          <TbArrowBadgeUpFilled size={24} className="text-white" />
        )}
      </div>
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl h-[28rem] w-full flex flex-col"
      >
        <div className="overflow-y-auto p-4 max-w-[25rem]">
          {result && (
            <div className="mb-4 text-base font-semibold">{result}</div>
          )}
        </div>
        <div className="flex mt-auto">
          <input
            type="text"
            name="prompt"
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ask me anything..."
            className="w-full border border-neutral-400 border-r-0 p-2 outline-none"
          />
          <button
            type="submit"
            className="border border-l-0 border-neutral-400 bg-white p-2 bg-button-bot bg-center bg-no-repeat"
          >
            <RiRobot2Fill size={24} className="text-neutral-400" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default GenerateResearchForm;
