export const SECTIONS = [
  { to: "/", label: "Origin", sub: "Company Overview", code: "00" },
  { to: "/profile", label: "Company Profile", sub: "Identity", code: "01" },
  { to: "/leadership", label: "Leadership", sub: "People", code: "02" },
  { to: "/history", label: "History & Milestones", sub: "Timeline", code: "03" },
  { to: "/services", label: "Services & Solutions", sub: "Offerings", code: "04" },
  { to: "/locations", label: "Locations", sub: "Presence", code: "05" },
  { to: "/financials", label: "Financial Information", sub: "Estimates", code: "06" },
  { to: "/workforce", label: "Workforce & Languages", sub: "Capability", code: "07" },
  { to: "/awards", label: "Awards & Recognition", sub: "Recognition", code: "08" },
] as const;
export type SectionPath = (typeof SECTIONS)[number]["to"];
