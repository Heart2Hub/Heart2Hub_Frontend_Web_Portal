import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

import React from "react";
import Header from "./components/Header";
import Divider from "@mui/material/Divider";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import ProfileInfoCard from "examples/Cards/InfoCards/ProfileInfoCard";

import { useSelector } from "react-redux";
import { selectStaff } from "../../store/slices/staffSlice";

function Account() {
  const staff = useSelector(selectStaff);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mb={2} />
      <Header>
        <Divider orientation="horizontal" sx={{ ml: -2, mr: 1 }} />
        <MDBox mt={3} mb={3}>
          <ProfileInfoCard
            title="profile information"
            info={{
              username: staff.username,
              role: staff.staffRoleEnum,
              department: staff.department ? staff.department : "NO DEPARTMENT",
              subDepartment: staff.subDepartment
                ? staff.subDepartment
                : "NO SUB DEPARTMENT",
              head: staff.isHead ? "TRUE" : "FALSE",
            }}
            shadow={false}
          />
        </MDBox>
      </Header>
    </DashboardLayout>
  );
}

export default Account;
