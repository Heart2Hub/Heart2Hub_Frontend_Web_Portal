import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

import React from "react";
import Header from "./components/Header";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";

// @mui icons
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import ProfileInfoCard from "examples/Cards/InfoCards/ProfileInfoCard";
import MDInput from "components/MDInput";
import FormCard from "examples/Cards/FormCards";

function Account() {
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mb={2} />
      <Header>
        <MDBox mt={3} mb={3}>
          <ProfileInfoCard
            title="profile information"
            info={{
              username: "tanweekek",
              role: "DOCTOR",
              department: "ACCIDENT & EMERGENCY (A&E)",
              subDepartment: "A&E CLINIC 1",
              head: "Yes",
            }}
            shadow={false}
          />
          <Divider orientation="horizontal" sx={{ ml: -2, mr: 1 }} />
          <FormCard
            title="change password"
            description={`To change your password, please fill in the fields below.
                Your password must contain at least 8 characters.`}
            info={{
              currentPassword: "password",
              newPassword: "password",
              confirmPassword: "password",
            }}
            social={[
              {
                link: "https://www.facebook.com/CreativeTim/",
                icon: <FacebookIcon />,
                color: "facebook",
              },
              {
                link: "https://twitter.com/creativetim",
                icon: <TwitterIcon />,
                color: "twitter",
              },
              {
                link: "https://www.instagram.com/creativetimofficial/",
                icon: <InstagramIcon />,
                color: "instagram",
              },
            ]}
            action={{ route: "", tooltip: "Edit Profile" }}
            shadow={false}
          />
        </MDBox>
      </Header>
    </DashboardLayout>
  );
}

export default Account;
