interface BookingTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const TABS = [
  { key: "all", label: "All Bookings" },
  { key: "upcoming", label: "Upcoming" },
  { key: "completed", label: "Completed" },
  { key: "cancelled", label: "Cancelled" },
];

export default function BookingTabs({
  activeTab,
  onTabChange,
}: BookingTabsProps) {
  return (
    <div className="flex border-b border-[#1a1a1a] mb-8">
      {TABS.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onTabChange(tab.key)}
          className={`text-[10px] tracking-[0.16em] uppercase px-6 py-4 border-none bg-transparent cursor-pointer transition-colors whitespace-nowrap border-b-2 ${
            activeTab === tab.key
              ? "text-[#c9a96e] border-[#c9a96e]"
              : "text-[#3a3a3a] border-transparent hover:text-[#6b7280]"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
