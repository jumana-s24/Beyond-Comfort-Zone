import React from "react";

const HowItWorks: React.FC = () => {
  return (
    <section className="py-20 bg-white text-center px-20 lg:px-40 mb-20">
      <h2 className="text-5xl font-bold mb-12">How It Works</h2>
      <div className="grid md:grid-cols-3 gap-8">
        {[
          {
            title: "Sign Up",
            description: "Create an account to get started.",
            imageUrl: "/assets/signupImage.png",
          },
          {
            title: "Pick a Challenge",
            description: "Choose challenges that inspire your growth.",
            imageUrl: "/assets/pickChallengeImage.png", // Add your image path here
          },
          {
            title: "Track Your Progress",
            description: "Earn streaks and see your achievements.",
            imageUrl: "assets/trackProgressImage.png", // Add your image path here
          },
        ].map((step, index) => (
          <div
            key={index}
            className="p-4 border rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <img
              src={step.imageUrl}
              alt={step.title}
              className="object-cover w-full h-[320px] md:h-[250px] mb-4"
            />
            <h3 className="text-xl font-semibold text-primary mb-4">
              {step.title}
            </h3>
            <p className="text-lg text-gray-600">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;
