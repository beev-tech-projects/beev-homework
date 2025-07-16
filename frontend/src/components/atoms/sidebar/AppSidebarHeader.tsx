import { SidebarHeader } from "@/components/ui/sidebar";
import beevLogo from "@/assets/beev.svg";

export function AppSidebarHeader() {
  return (
    <SidebarHeader className="flex flex-row items-center justify-center p-4">
      <img src={beevLogo} alt="Beev logo" className="w-8 h-8 mb-2" />
      <h2 className="text-xl font-semibold">Beev Homework</h2>
    </SidebarHeader>
  );
}
