import React, { useEffect, useState } from "react";
import { Card, List, ButtonBase } from "@mui/material";
import MDTypography from "components/MDTypography";
import MDBox from "components/MDBox";
import MDAvatar from "components/MDAvatar";
import "./kanbanStyles.css";
import { truncateText } from "utility/Utility";
import { imageServerApi } from "../../../api/Api";

function StaffListSidePanel({
  handleSelectStaffToFilter,
  selectStaffToFilter,
  listOfWorkingStaff,
}) {
  const [imageURLs, setImageURLs] = useState({});

  const fetchImageURLs = async () => {
    const newImageURLs = {};

    for (const staff of listOfWorkingStaff) {
      if (staff.imageLink) {
        const response = await imageServerApi.getImageFromImageServer(
          "id",
          staff.imageLink
        );
        newImageURLs[staff.staffId] = URL.createObjectURL(response.data);
      }
    }

    setImageURLs(newImageURLs);
  };

  const handleClick = (staffId) => {
    if (selectStaffToFilter === staffId) {
      handleSelectStaffToFilter(0);
    } else {
      handleSelectStaffToFilter(staffId);
    }
  };

  useEffect(() => {
    fetchImageURLs();
  }, [listOfWorkingStaff]);

  return (
    <MDBox className="panel-container" sx={{ backgroundColor: "#D3E5F9" }} style={{width: '270px'}}>
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
                className={`card-shadow ${selectStaffToFilter === staff.staffId ? "selected-card" : ""
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
                    src={imageURLs[staff.staffId] || ""}
                    alt="profile-image"
                    size="xl"
                    shadow="xl"
                    style={{ margin: "auto" }}
                  />

                  <MDBox sx={{ marginLeft: "10px" }}>
                    <MDBox>
                      <MDTypography
                        variant="h5"
                        component="div"
                        sx={{ flex: 1, textAlign: "left" }}
                      >
                        {truncateText(
                          staff.firstname + " " + staff.lastname,
                          10
                        )}
                        <br />
                        {staff.staffRoleEnum}
                      </MDTypography>
                    </MDBox>
                    <MDBox>
                      <MDTypography
                        variant="h6"
                        component=""
                        sx={{ flex: 1, textAlign: "left" }}
                      >
                        {staff.name}
                      </MDTypography>
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
