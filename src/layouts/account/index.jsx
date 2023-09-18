import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

import React, { useEffect, useState } from "react";
import Header from "./components/Header";
import Divider from "@mui/material/Divider";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import ProfileInfoCard from "examples/Cards/InfoCards/ProfileInfoCard";

import { useSelector } from "react-redux";
import { selectStaff } from "../../store/slices/staffSlice";

import { departmentApi } from "../../api/Api";

function Account() {
  const staff = useSelector(selectStaff);
  const [listOfDepartments, setListOfDepartments] = useState([]);
  const [departmentName, setDepartmentName] = useState("");

  const getDepartmentName = async () => {
    if (staff.subDepartment !== null) {
      try {
        const response = await departmentApi.getAllDepartments("");
        setListOfDepartments(response.data);
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    getDepartmentName();
  }, [staff.subDepartment]);

  useEffect(() => {
    if (listOfDepartments.length > 0) {
      for (let index = 0; index < listOfDepartments.length; index++) {
        const department = listOfDepartments[index];
        for (let idx = 0; idx < department.listOfSubDepartments.length; idx++) {
          const subDepartment = department.listOfSubDepartments[idx];
          if (subDepartment.name === staff.subDepartment.name) {
            setDepartmentName(department.name);
            break;
          }
        }
        if (departmentName !== "") {
          break;
        }
      }
    }
  }, [listOfDepartments]);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mb={2} />
      <Header>
        <Divider orientation="horizontal" sx={{ ml: -2, mr: 1 }} />

        <MDBox mt={3} mb={3}>
          <ProfileInfoCard
            title="profile information:"
            info={{
              username: staff.username,
              role: staff.staffRoleEnum,
              department:
                departmentName !== "" ? departmentName : "NO DEPARTMENT",
              subDepartment:
                staff.subDepartment !== null
                  ? staff.subDepartment.name
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
