import { IoMdClose } from "react-icons/io";

interface ModalProps {
  onClose: () => void;
  children: React.ReactNode;
  title: string;
  maxWidth?: string;
  maxHeight?: string;
}
const Modal: React.FC<ModalProps> = ({
  onClose,
  children,
  title,
  maxWidth = "max-w-md",
  maxHeight,
}) => {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
      <div
        className={`bg-white rounded-lg p-8 shadow-lg relative ${maxWidth} ${maxHeight} w-full mx-auto overflow-y-auto`}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          <IoMdClose size={22} />
        </button>
        {title && <h2 className="text-xl mb-4 font-semibold">{title}</h2>}
        {children}
      </div>
    </div>
  );
};
export default Modal;
