import { Suspense } from "react";
import Theme from "@/components/Theme";
import EmployerSidebar from "@/components/sidebars/EmpoyerSidebar";
import SkeletonNavbar from "@/components/skeleton/SkeletonNavbar";
import ProjectContextProvider from "@/context/Projectctx";
import Navbar from "@/components/Navs/NavBar";

import UserContextProvider from "@/context/UserCtx"; 

export default function EmployersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UserContextProvider>
      <ProjectContextProvider>
        <EmployerSidebar />
        <section className="w-full relative  md:pl-[96px] min-[1140px]:pl-[270px]">
          <Suspense fallback={<SkeletonNavbar />}>
            <Navbar />
          </Suspense>
          <div className="flex w-full flex-col h-full relative max-container pt-12 md:pt-0">
            {children}
          </div>
        </section>
        <div className="flex md:hidden">
          <Theme />
        </div>
      </ProjectContextProvider>
    </UserContextProvider>
  );
}
