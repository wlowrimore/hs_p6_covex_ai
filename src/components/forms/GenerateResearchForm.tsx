"use client";
import { useAction, useMutation } from "convex/react";
import { useState, useEffect, useRef } from "react";
import useConvexAuth from "../../hooks/useConvexAuth";
import { api } from "../../../convex/_generated/api";

import WaveLoader from "../ui/WaveLoader";

import { TbArrowBadgeDownFilled, TbArrowBadgeUpFilled } from "react-icons/tb";
import { RiRobot2Fill } from "react-icons/ri";

interface ResearchResult {
  id: string;
  content: string;
}

const GenerateResearchForm = () => {
  const [prompt, setPrompt] = useState<string>("");
  const [results, setResults] = useState<ResearchResult[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const { isAuthenticated, userId } = useConvexAuth();

  const generateResults = useAction(api.actions.generateResearchResponses);
  const saveResearchChat = useMutation(api.functions.saveResearchChat);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setResults([]);
    try {
      const researchResults = await generateResults({ prompt });
      if (researchResults !== null) {
        setIsLoading(false);
        const newResult = {
          id: Date.now().toString(),
          content: researchResults,
        };
        setResults((prevResults) => [...prevResults, newResult]);
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
        setIsLoading(false);
        setResults((prevResults) => [
          ...prevResults,
          {
            id: Date.now().toString(),
            content: "An error occurred while generating the response.",
          },
        ]);
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Error:", error);
      setResults((prevResults) => [
        ...prevResults,
        {
          id: Date.now().toString(),
          content: "An error occurred while generating the response.",
        },
      ]);
    }
  };

  if (!isAuthenticated) {
    return <div className="text-neutral-600">Please signIn to chat.</div>;
  }

  const latestResultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (latestResultRef.current) {
      latestResultRef.current?.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [results]);

  const startNewChat = () => {
    setPrompt("");
    setResults([]);
  };

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
        {isLoading ? (
          <div className="flex w-full h-full items-center">
            <WaveLoader />
          </div>
        ) : (
          <div className="overflow-y-auto p-4 max-w-[25rem]">
            {results.map((result, index) => (
              <div
                key={result.id}
                ref={index === results.length - 1 ? latestResultRef : null}
                className="mb-4 text-base font-semibold"
              >
                {result.content}
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-col mt-auto">
          <div className="w-full flex justify-end">
            <h5
              onClick={startNewChat}
              className="bg-[#3F3F46] rounded-tl-lg text-white text-xs w-fit py-1 pl-3 pr-1.5 hover:bg-[#343439] transition duration-200 cursor-pointer"
            >
              Start New Chat
            </h5>
          </div>
          <div className="flex">
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
              className="border border-l-0 border-neutral-400 bg-white p-2 "
            >
              <RiRobot2Fill size={24} className="text-neutral-400" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default GenerateResearchForm;
