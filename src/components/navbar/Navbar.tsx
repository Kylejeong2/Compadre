import { UserButton } from "@clerk/nextjs";

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center py-2 px-4 sm:px-16 border-b">
      <h3 className="font-semibold text-lg tracking-tight">ShipFast</h3>
      <UserButton />
    </nav>
  );
}