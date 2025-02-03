export const Spinner: React.FC = () => {
  return (
    <div
      className="min-h-screen flex justify-center items-center"
      role="status"
      aria-label="Loading"
    >
      <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500"></div>
    </div>
  );
};
