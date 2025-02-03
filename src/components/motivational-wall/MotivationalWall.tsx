import React, { useEffect, useState } from "react";
import QuoteModal from "./QuoteModal";
import { IoMdClose } from "react-icons/io";
import {
  addQuoteService,
  deleteQuoteService,
  fetchUserQuotesService,
  fetchGlobalQuotesService,
  updateQuoteService,
} from "../../services/quoteService";
import { auth } from "../../firebase/firebase";
import { Spinner } from "../common/Spinner";

interface Quote {
  id: string;
  text: string;
  bgColor: string;
  fontColor: string;
  isGlobal?: boolean;
}

const MotivationalWall: React.FC = () => {
  const [userQuotes, setUserQuotes] = useState<any[]>([]);
  const [globalQuotes, setGlobalQuotes] = useState<any[]>([]);
  const [hiddenGlobalQuotes, setHiddenGlobalQuotes] = useState<string[]>([]);
  const [editingQuote, setEditingQuote] = useState<Quote | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const userId = auth.currentUser?.uid as string;

  useEffect(() => {
    const fetchQuotes = async () => {
      if (!userId) return;
      try {
        setIsLoading(true);
        const userFetchedQuotes = await fetchUserQuotesService(userId);
        setUserQuotes(userFetchedQuotes);

        const globalFetchedQuotes = await fetchGlobalQuotesService();
        setGlobalQuotes(globalFetchedQuotes);

        const hiddenQuotes = JSON.parse(
          localStorage.getItem(`hiddenGlobalQuotes_${userId}`) || "[]"
        );
        setHiddenGlobalQuotes(hiddenQuotes);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuotes();
  }, [userId]);

  const handleAddOrEditQuote = async (
    text: string,
    bgColor: string,
    fontColor: string
  ) => {
    if (!userId) return;

    if (editingQuote) {
      if (editingQuote.isGlobal) {
        // If editing a global quote, save a personalized version and hide the original
        const newQuoteId = await addQuoteService(
          text,
          bgColor,
          fontColor,
          userId
        );
        const newQuote = {
          id: newQuoteId,
          text,
          bgColor,
          fontColor,
          isGlobal: false,
        };
        setUserQuotes([...userQuotes, newQuote]);
        // Hide the original global quote
        const updatedHiddenQuotes = [...hiddenGlobalQuotes, editingQuote.id];
        setHiddenGlobalQuotes(updatedHiddenQuotes);
        localStorage.setItem(
          `hiddenGlobalQuotes_${userId}`,
          JSON.stringify(updatedHiddenQuotes)
        );
      } else {
        // Edit user-created quote
        console.log("editingQuote: ", editingQuote);
        await updateQuoteService(userId, editingQuote.id, {
          text,
          bgColor,
          fontColor,
        });
        setUserQuotes(
          userQuotes.map((quote) =>
            quote.id === editingQuote.id
              ? { ...quote, text, bgColor, fontColor }
              : quote
          )
        );
      }
    } else {
      // Adding a new quote
      const newQuoteId = await addQuoteService(
        text,
        bgColor,
        fontColor,
        userId
      );
      setUserQuotes([
        ...userQuotes,
        { id: newQuoteId, text, bgColor, fontColor, isGlobal: false },
      ]);
    }

    setEditingQuote(null);
    setIsModalOpen(false);
  };

  const handleEditQuote = (quote: Quote) => {
    setEditingQuote(quote);
    setIsModalOpen(true);
  };

  const handleDeleteQuote = async (id: string, isGlobal?: boolean) => {
    if (isGlobal) {
      // Hide global quote
      const updatedHiddenQuotes = [...hiddenGlobalQuotes, id];
      setHiddenGlobalQuotes(updatedHiddenQuotes);
      localStorage.setItem(
        `hiddenGlobalQuotes_${userId}`,
        JSON.stringify(updatedHiddenQuotes)
      );
    } else {
      // Delete user-created quote
      await deleteQuoteService(userId, id);
      setUserQuotes(userQuotes.filter((quote) => quote.id !== id));
    }
  };

  const visibleGlobalQuotes = globalQuotes.filter(
    (quote) => !hiddenGlobalQuotes.includes(quote.id)
  );

  if (isLoading) return <Spinner />;

  return (
    <div className="p-6 max-w-5xl mx-auto min-h-screen mt-10 mb-40">
      <h1 className="text-4xl font-newsreader-light text-center font-semibold mb-6 animate-fadeIn">
        Motivational Wall
      </h1>
      <p className="text-xl text-center text-gray-600 mb-10 px-10 md:px-20 lg:px-40 animate-fadeIn">
        Your daily dose of inspiration! Add, edit, or reflect on motivational
        quotes that spark joy, fuel your dreams, and keep you moving forward.
      </p>

      <div className="flex justify-end">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-primary text-white py-2 px-4 rounded-md hover:bg-secondary mb-6"
        >
          + Add Motivational Quote
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6 animate-fadeIn">
        {[
          ...visibleGlobalQuotes.map((quote) => ({ ...quote, isGlobal: true })),
          ...userQuotes,
        ].map((quote) => (
          <div
            key={quote.id}
            className="p-4 rounded-md relative cursor-pointer break-words whitespace-normal shadow border border-gray-100 hover:shadow-xl transition-shadow duration-300"
            style={{
              backgroundColor: quote.bgColor,
              color: quote.fontColor,
            }}
            onClick={() => handleEditQuote(quote)}
          >
            <p>{quote.text}</p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteQuote(quote.id, quote.isGlobal);
              }}
              className="absolute top-0 right-0  p-1"
            >
              <IoMdClose size={18} />
            </button>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <QuoteModal
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleAddOrEditQuote}
          initialText={editingQuote?.text || ""}
          initialBgColor={editingQuote?.bgColor || "#2196f3"}
          initialFontColor={editingQuote?.fontColor || "#ffffff"}
        />
      )}
    </div>
  );
};

export default MotivationalWall;
