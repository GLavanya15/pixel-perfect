import { Award, Briefcase, Building2, History, Languages, LayoutGrid, MapPin, TrendingUp, Users, UsersRound, type LucideIcon } from "lucide-react";

export const SECTIONS: { to: string; label: string; icon: LucideIcon }[] = [
  { to: "/", label: "Overview", icon: LayoutGrid },
  { to: "/profile", label: "Company Profile", icon: Building2 },
  { to: "/leadership", label: "Leadership", icon: Users },
  { to: "/services", label: "Services & Solutions", icon: Briefcase },
  { to: "/locations", label: "Locations", icon: MapPin },
  { to: "/workforce", label: "Workforce", icon: UsersRound },
  { to: "/languages", label: "Languages", icon: Languages },
  { to: "/financials", label: "Financial Information", icon: TrendingUp },
  { to: "/history", label: "History & Milestones", icon: History },
  { to: "/awards", label: "Awards & Recognition", icon: Award },
];
