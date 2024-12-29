import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const HeroSection: React.FC = () => {
  return (
    <div className="flex flex-col-reverse md:flex-row items-center w-full bg-gradient-to-b from-[#c2d4f0] to-accent pb-10 md:pb-0">
      <div className="w-full md:w-1/2 md:text-left mt-10 md:mt-0 px-4 xl:px-20">
        <h1 className="text-2xl lg:text-4xl font-bold text-center text-gray-900 mb-6 animate-fadeIn">
          Step Outside Your Comfort Zone
        </h1>
        <p className="text-lg lg:text-2xl text-center text-gray-700 mb-10 animate-fadeIn">
          Turn small actions into life-changing habits. Embrace daily challenges
          that push your limits, track your streaks, and see how far you can
          grow.
        </p>
        <div className="text-center">
          <Link
            to="/challenges/global-challenges"
            className="bg-primary hover:bg-secondary text-white rounded-md px-4 py-2 sm:px-6 sm:py-3 sm:text-md md:text-lg tracking-wider uppercase shadow-lg transition-all duration-200 ease-in-out active:translate-y-1 active:shadow-none hover:-translate-y-1 hover:shadow-2xl animate-fadeIn"
          >
            Start Your First Challenge
          </Link>
        </div>
      </div>

      <div className="w-full md:w-[500px] lg:w-[900px]">
        <motion.img
          src={"/assets/heroSectionImage.png"}
          alt="daily challenge"
          className="w-30 h-25"
          animate={{
            x: [-5, 5, -5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        {/* <img
          src={heroImage}
          alt="A group of people in a supportive session, connecting through the Loneliness Support platform"
          className="w-full h-auto object-cover"
        /> */}
      </div>
    </div>
  );
};

export default HeroSection;
