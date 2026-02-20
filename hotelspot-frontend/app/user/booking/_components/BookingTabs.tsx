interface BookingTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const TABS = [{ key: "all", label: "All Bookings" }];

export default function BookingTabs({
  activeTab,
  onTabChange,
}: BookingTabsProps) {
  return (
    <div className="flex gap-2 mb-6 overflow-x-auto">
      {TABS.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onTabChange(tab.key)}
          className={`px-6 py-3 rounded-lg font-medium whitespace-nowrap transition-colors ${
            activeTab === tab.key
              ? "bg-emerald-600 text-white"
              : "bg-gray-800 text-gray-100 hover:bg-gray-700 border border-gray-700"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
