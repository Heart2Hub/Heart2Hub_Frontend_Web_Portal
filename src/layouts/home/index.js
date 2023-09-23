import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import React from "react";
import SimpleBanner from "./simpleBanner";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

function Home() {
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SimpleBanner />
    </DashboardLayout>
  );
}

export default Home;
