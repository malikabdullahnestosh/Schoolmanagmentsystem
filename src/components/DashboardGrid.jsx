import { useEffect, useState } from "react";
import StatCard from "../components/ui/card";
import {
  GraduationCap,
  UserCheck,
  UserX,
  Users,
  Receipt,
  DollarSign,
  Calendar,
} from "lucide-react";
import constant from '../../constant';

// Only include cards relevant to school management
const cardMeta = [
  { title: "Total Student", color: "bg-teal-500", icon: GraduationCap, api: "totalStudent" },
  { title: "Active Student", color: "bg-green-500", icon: UserCheck, api: "activeStudent" },
  { title: "Alumni Student", color: "bg-yellow-500", icon: UserX, api: "alumniStudent" },
  { title: "Total Staff", color: "bg-cyan-500", icon: Users, api: "totalStaff" },
  { title: "Active Staff", color: "bg-green-600", icon: UserCheck, api: "activeStaff" },
  { title: "Alumni Staff", color: "bg-yellow-600", icon: UserX, api: "alumniStaff" },
  { title: "Unpaid Invoices", color: "bg-teal-500", icon: Receipt, api: "unpaidInvoices" },
  { title: "Unpaid Amount", color: "bg-yellow-500", icon: DollarSign, api: "unpaidAmount" },
  { title: "Current Session", color: "bg-yellow-500", icon: Calendar, api: "currentSession" },
  { title: "Total Staff", color: "bg-cyan-500", icon: Users, api: "totalStaff" },
  { title: "Active Staff", color: "bg-green-600", icon: UserCheck, api: "activeStaff" },
  { title: "Alumni Staff", color: "bg-yellow-600", icon: UserX, api: "alumniStaff" },
];

const API_BASE = constant.apiUrl; // Make sure your API url is correct

export default function DashboardGrid() {
  const [cardValues, setCardValues] = useState(cardMeta.map(() => ""));

  useEffect(() => {
    fetch(`${API_BASE}/summary`)
      .then((res) => res.json())
      .then((data) => {
        const mapped = cardMeta.map(card => {
          if (card.api in data) return data[card.api];
          // fallback for different key capitalization (e.g. "currentSession" vs "current_session")
          const altKey = Object.keys(data).find(
            k => k.toLowerCase().replace(/[^a-z]/g, "") === card.api.toLowerCase().replace(/[^a-z]/g, "")
          );
          return altKey ? data[altKey] : "";
        });
        setCardValues(mapped);
      })
      .catch(() => {
        // fallback: try individual fetches if summary fails
        Promise.all(
          cardMeta.map((card) =>
            fetch(`${API_BASE}/${card.api.replace(/[A-Z]/g, (m) => '-' + m.toLowerCase())}`)
              .then((res) => res.json())
              .then((data) => data.value ?? "")
              .catch(() => "")
          )
        ).then(setCardValues);
      });
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mx-2 mt-3 xl:grid-cols-6 gap-4">
      {cardMeta.map((card, i) => (
        <StatCard
          key={i}
          title={card.title}
          value={cardValues[i]}
          color={card.color}
          icon={card.icon}
        />
      ))}
    </div>
  );
}