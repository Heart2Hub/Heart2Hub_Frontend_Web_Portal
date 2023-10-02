import React, { useEffect } from "react";
import { Card, Typography, List, ButtonBase } from "@mui/material";
import MDTypography from "components/MDTypography";
import MDBox from "components/MDBox";
import MDAvatar from "components/MDAvatar";
import "./kanbanStyles.css";
import { staffApi } from "../../../api/Api";
import { useSelector } from "react-redux";
import { selectStaff } from "store/slices/staffSlice";
import { useState } from "react";
import { IMAGE_SERVER } from "constants/RestEndPoint";

function StaffListSidePanel({
  handleSelectStaffToFilter,
  selectStaffToFilter,
  // handleLiftListOfCurrentWorkingStaff,
  listOfWorkingStaff,
}) {
  // const staff = useSelector(selectStaff);
  // const [listOfWorkingStaff, setListOfWorkingStaff] = useState([]);

  const handleClick = (staffId) => {
    if (selectStaffToFilter === staffId) {
      handleSelectStaffToFilter(0);
      console.log("Selected Staff: " + 0);
    } else {
      handleSelectStaffToFilter(staffId);
      console.log("Selected Staff: " + staffId);
    }
  };

  // const getStaffCurrentlyWorking = async () => {
  //   const response = await staffApi.getStaffsWorkingInCurrentShiftAndDepartment(
  //     staff.unit.name
  //   );
  //   setListOfWorkingStaff(response.data);
  //   handleLiftListOfCurrentWorkingStaff(response.data);
  // };

  // useEffect(() => {
  //   getStaffCurrentlyWorking();
  // }, []);

  return (
    <MDBox className="panel-container" sx={{ backgroundColor: "#D3E5F9" }}>
      <MDTypography variant="h3" style={{ marginBottom: "20px" }}>
        Staff List
      </MDTypography>
      <MDBox className="scrollable-box">
        <List>
          {listOfWorkingStaff.map((staff) => (
            <ButtonBase
              key={staff.staffId}
              style={{ width: "100%", marginBottom: "10px" }}
              onClick={() => handleClick(staff.staffId)}
            >
              <Card
                className={`card-shadow ${
                  selectStaffToFilter === staff.staffId ? "selected-card" : ""
                }`}
                style={
                  selectStaffToFilter === staff.staffId
                    ? {
                        backgroundColor: "#e0e0e0",
                        boxShadow: "0 0 15px rgba(0, 0, 0, 0.3)",
                        border: "1px solid #b0b0b0",
                        display: "flex",
                        cursor: "pointer",
                        padding: "8px",
                        width: "100%",
                      }
                    : {
                        display: "flex",
                        cursor: "pointer",
                        padding: "8px",
                        width: "100%",
                      }
                }
              >
                <MDBox
                  style={{
                    display: "flex",
                    cursor: "pointer",
                    padding: "8px",
                    width: "100%",
                  }}
                >
                  <MDAvatar
                    src={IMAGE_SERVER + "/images/id/" + staff.imageLink}
                    alt="profile-image"
                    size="xl"
                    shadow="xl"
                    style={{ margin: "auto" }}
                  />

                  <MDBox sx={{ marginLeft: "10px" }}>
                    <MDBox>
                      <Typography
                        variant="h5"
                        component="div"
                        sx={{ flex: 1, textAlign: "left" }}
                      >
                        {staff.firstname + " " + staff.lastname + " | "}
                        {staff.staffRoleEnum}
                      </Typography>
                    </MDBox>
                    <MDBox>
                      <Typography
                        variant="h6"
                        component="div"
                        sx={{ flex: 1, textAlign: "left" }}
                      >
                        {staff.currentAssignedAppointmentSwimlaneStatusEnum !==
                        null
                          ? staff.currentAssignedAppointmentSwimlaneStatusEnum
                          : "Not Assigned"}
                      </Typography>
                    </MDBox>
                  </MDBox>
                </MDBox>
              </Card>
            </ButtonBase>
          ))}
        </List>
      </MDBox>
    </MDBox>
  );
}

export default StaffListSidePanel;
