import Link from "next/link";
import { ChartBarIcon } from "@phosphor-icons/react/ssr";
import AuthControls from "@/components/AuthControls";

function Navbar() {
  return (
    <nav className="bg-primary p-4 text-white h-20 flex items-center justify-between">
      <Link
        href="/analytics"
        className="font-bold text-2xl flex items-center gap-2"
      >
        <ChartBarIcon size={30} />
        NextCash
      </Link>
      <div className="flex items-center gap-6">
        <AuthControls />
      </div>
    </nav>
  );
}

export default Navbar;
