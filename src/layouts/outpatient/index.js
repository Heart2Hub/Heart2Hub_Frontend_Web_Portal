import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import React from "react";
import CalenderView from "./CalenderView";

function Outpatient() {
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <CalenderView />
    </DashboardLayout>
  );
}

export default Outpatient;
