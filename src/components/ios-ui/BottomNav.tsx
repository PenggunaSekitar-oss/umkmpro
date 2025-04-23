
import * as React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Home, FileText, PlusCircle, CreditCard, User } from "lucide-react";

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}

const NavItem = ({ to, icon, label, active }: NavItemProps) => (
  <Link
    to={to}
    className={cn(
      "flex flex-col items-center justify-center pt-1.5 pb-0.5 w-full",
      active ? "text-ios-blue" : "text-ios-gray-600"
    )}
  >
    <div className="w-6 h-6 mb-0.5">{icon}</div>
    <span className="text-[10px] font-medium">{label}</span>
  </Link>
);

interface BottomNavProps {
  activeRoute?: string;
}

export function BottomNav({ activeRoute }: BottomNavProps) {
  return (
    <div className="ios-blur fixed bottom-0 left-0 right-0 border-t border-ios-gray-200 h-[80px] px-2 z-50">
      <div className="flex items-center justify-around h-full max-w-lg mx-auto">
        <NavItem
          to="/"
          icon={<Home size={24} />}
          label="Dashboard"
          active={activeRoute === "dashboard"}
        />
        <NavItem
          to="/invoices"
          icon={<FileText size={24} />}
          label="Permintaan"
          active={activeRoute === "invoices"}
        />
        <NavItem
          to="/generator"
          icon={<PlusCircle size={28} />}
          label="Buat"
          active={activeRoute === "generator"}
        />
        <NavItem
          to="/receipts"
          icon={<CreditCard size={24} />}
          label="Penerimaan"
          active={activeRoute === "receipts"}
        />
        <NavItem
          to="/profile"
          icon={<User size={24} />}
          label="Profil"
          active={activeRoute === "profile"}
        />
      </div>
    </div>
  );
}
