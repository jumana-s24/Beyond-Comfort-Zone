import React from "react";

const Features: React.FC = () => {
  return (
    <section className="py-20 bg-white text-center px-20 mb-20">
      <h2 className="text-5xl font-bold mb-12">Features</h2>
      <div className="grid gap-8">
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Daily Challenges",
              description: "Random challenges to keep you inspired.",
            },
            {
              title: "Global Challenges",
              description: "Participate alongside a global community.",
            },
            {
              title: "Progress Dashboard",
              description: "Track your streaks, stats, and achievements.",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="p-6 bg-accent border rounded-lg shadow-sm"
            >
              <h3 className="text-xl font-semibold text-primary mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
        <div className="grid md:grid-cols-2 gap-8 md:px-40">
          {[
            {
              title: "Motivational Wall",
              description: "Share and view inspiring quotes and stories.",
            },
            {
              title: "Custom Challenges",
              description: "Create personalized challenges for your goals.",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="p-6 bg-accent border rounded-lg shadow-sm"
            >
              <h3 className="text-xl font-semibold text-primary mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
