interface DropdownFilterProps {
  selectedDifficulty: string | null;
  onFilterChange: (difficulty: string | null) => void;
}

const DropdownFilter: React.FC<DropdownFilterProps> = ({
  onFilterChange,
  selectedDifficulty,
}) => {
  return (
    <div className="relative inline-block w-full md:w-40 mb-6 animate-fadeIn">
      <select
        value={selectedDifficulty || "All"}
        onChange={(e) =>
          onFilterChange(e.target.value === "All" ? null : e.target.value)
        }
        className="block w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-3"
      >
        <option value="All">All</option>
        <option value="Easy">Easy</option>
        <option value="Medium">Medium</option>
        <option value="Hard">Hard</option>
      </select>
    </div>
  );
};

export default DropdownFilter;
