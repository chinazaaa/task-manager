import { Suspense } from "react";
import EmployersNav from "@/components/Navs/EmployersNav";
import EmployerSidebar from "@/components/sidebars/EmpoyerSidebar";
import SkeletonNavbar from "@/components/skeleton/SkeletonNavbar";

import UserContextProvider from "@/context/UserCtx";

export default function EmployersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UserContextProvider>
      <EmployerSidebar />
      <section className="w-full relative  md:pl-[96px] min-[1140px]:pl-[270px]">
        <Suspense fallback={<SkeletonNavbar />}>
          <EmployersNav />
        </Suspense>
        <div className="flex w-full flex-col h-full relative max-container pt-12 md:pt-0">
          {children}
        </div>
      </section>
    </UserContextProvider>
  );
}
