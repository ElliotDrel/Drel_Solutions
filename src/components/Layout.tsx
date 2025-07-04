import * as React from "react";
import Navigation from "@/components/ui/Navigation";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <Navigation />
      {children}
    </>
  );
};

export default Layout;