import { BellIcon } from "lucide-react";

const Header = () => {
  return (
    <header className="fixed top-0 right-0 left-16 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 z-40">
      <div className="flex items-center gap-2">
        <h2 className="text-xl font-semibold text-gray-800">Dashboard</h2>
      </div>
      <div className="flex items-center gap-4">
        <button className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
          <BellIcon size={20} className="text-gray-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
            U
          </div>
          <span className="text-sm font-medium text-gray-700">User Name</span>
        </div>
      </div>
    </header>
  );
};

export default Header;