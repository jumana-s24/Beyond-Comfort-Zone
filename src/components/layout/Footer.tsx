import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  return (
    <footer className="p-6 flex flex-col bg-primary text-white">
      <div className="container mx-auto flex flex-col md:flex-row justify-center md:justify-between items-center space-y-6 md:space-y-0">
        <Link
          to="/"
          className="text-3xl font-newsreader-light hover:text-gray-100"
        >
          Beyond Comfort Zone
        </Link>
      </div>
      <div className="mt-8 text-center text-lg italic">
        © 2024 Beyond Comfort Zone. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
