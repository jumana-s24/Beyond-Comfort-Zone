import { useState } from "react";
import Modal from "../common/Modal";

interface ModalProps {
  onClose: () => void;
  onSubmit: (text: string, bgColor: string, fontColor: string) => void;
  initialText?: string;
  initialBgColor?: string;
  initialFontColor?: string;
}

const QuoteModal: React.FC<ModalProps> = ({
  onClose,
  onSubmit,
  initialText = "",
  initialBgColor = "#c2d4f0",
  initialFontColor = "#ffffff",
}) => {
  const [text, setText] = useState(initialText);
  const [bgColor, setBgColor] = useState(initialBgColor);
  const [fontColor, setFontColor] = useState(initialFontColor);

  const handleSubmit = () => {
    if (!text.trim()) return;
    onSubmit(text, bgColor, fontColor);
  };

  return (
    <Modal onClose={onClose} title="Add Motivational Quote">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type your motivational quote..."
        className="w-full p-2 border rounded mb-4"
      />
      <div className="flex items-center mb-4">
        <label className="mr-2">Background Color:</label>
        <input
          type="color"
          value={bgColor}
          onChange={(e) => setBgColor(e.target.value)}
          className="mr-4"
        />
        <label className="mr-2">Font Color:</label>
        <input
          type="color"
          value={fontColor}
          onChange={(e) => setFontColor(e.target.value)}
        />
      </div>
      <div className="flex justify-end">
        <button
          onClick={onClose}
          className="border border-secondary px-4 py-2 rounded hover:bg-accent mr-4"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="bg-primary text-white px-4 py-2 rounded hover:bg-secondary"
        >
          Add Quote
        </button>
      </div>
    </Modal>
  );
};

export default QuoteModal;
