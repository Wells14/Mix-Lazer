const ContributionMargin = () => {
  const percentage = 75;
  const circumference = 2 * Math.PI * 47;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-semibold mb-4">Margem de Contribuição</h3>
      <div className="relative w-32 h-32 mx-auto">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="64"
            cy="64"
            r="47"
            stroke="#e5e7eb"
            strokeWidth="10"
            fill="none"
          />
          <circle
            cx="64"
            cy="64"
            r="47"
            stroke="#1e40af"
            strokeWidth="10"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="animate-progress-fill"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold">{percentage}%</span>
        </div>
      </div>
    </div>
  );
};

export default ContributionMargin;