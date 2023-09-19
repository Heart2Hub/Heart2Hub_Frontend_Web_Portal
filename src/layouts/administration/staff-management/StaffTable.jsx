import React, { useState, useEffect } from "react";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

import DataTable from "examples/Tables/DataTable";

import { staffApi } from "api/Api";
import Checkbox from "@mui/material/Checkbox";
import { IconButton, Icon } from "@mui/material";

function StaffTable({ addStaffHandler, editStaffHandler }) {
  const [rows, setRows] = useState([]);

  const columns = [
    { Header: "id", accessor: "staffId" },
    { Header: "first name", accessor: "firstname", width: "10%" },
    { Header: "last name", accessor: "lastname", width: "10%" },
    { Header: "username", accessor: "username", width: "10%" },
    { Header: "role", accessor: "staffRoleEnum", width: "10%" },
    { Header: "department", accessor: "departmentName", width: "15%" },
    { Header: "sub-department", accessor: "subDepartmentName", width: "15%" },
    { Header: "mobile", accessor: "mobileNumber", width: "10%" },
    { Header: "rosterer", accessor: "isHeadCheckbox", width: "10%" },
    {
      Header: "Actions",
      Cell: ({ row }) => (
        <MDBox>
          <IconButton
            color="secondary"
            onClick={() => editStaffHandler(row.original)}
          >
            <Icon>create</Icon>
          </IconButton>
        </MDBox>
      ),
      width: "10%",
    },
  ];

  const processStaffData = (listOfStaff) => {
    const newListOfStaff = listOfStaff
      .sort((staff1, staff2) => staff1.staffId - staff2.staffId)
      .filter((staff) => !staff.disabled)
      .map((staff) => {
        let subDepartmentName = "-";
        let departmentName = "-";
        if (staff.subDepartment) {
          subDepartmentName = staff.subDepartment.name;
          departmentName = staff.subDepartment.department.name;
        }

        staff.subDepartmentName = subDepartmentName;
        staff.departmentName = departmentName;
        staff.isHeadCheckbox = <Checkbox disabled checked={staff.isHead} />;
        return staff;
      });

    return newListOfStaff;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await staffApi.getAllStaff();
        console.log(response.data);
        setRows(processStaffData(response.data));
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <MDBox
        mx={2}
        mt={-3}
        py={3}
        px={2}
        variant="gradient"
        bgColor="info"
        borderRadius="lg"
        coloredShadow="info"
      >
        <MDTypography variant="h6" color="white">
          Staff Table
        </MDTypography>
      </MDBox>
      <MDBox mx={2} mt={3} px={2}>
        <MDButton
          Button
          variant="contained"
          color="primary"
          onClick={addStaffHandler}
        >
          Create New Staff
          <Icon>add</Icon>
        </MDButton>
      </MDBox>
      <MDBox pt={3}>
        <DataTable canSearch={true} table={{ columns, rows }} />
      </MDBox>
    </>
  );
}

export default StaffTable;
