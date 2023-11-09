import {
  Typography,
  Card,
  CardContent,
  ButtonBase,
  Skeleton,
  Tooltip,
  Icon,
} from "@mui/material";
import React, { useEffect } from "react";
import "./inpatient.css";
import MDTypography from "components/MDTypography";
import { useState } from "react";
import MDAvatar from "components/MDAvatar";
import { truncateText } from "utility/Utility";
import { imageServerApi } from "api/Api";

//FOR UI PURPOSES
const tooltips = {
  1: (
    <Tooltip title="Please register admission" placement="top">
      <Icon fontSize="medium" sx={{ fontWeight: "bold" }} color={"warning"}>
        warning
      </Icon>
    </Tooltip>
  ),
  2: (
    <Tooltip
      title="2 hours since admission time and Admission not registered"
      placement="top"
    >
      <Icon fontSize="medium" sx={{ fontWeight: "bold" }} color={"error"}>
        warning
      </Icon>
    </Tooltip>
  ),
  4: (
    <Tooltip title="Patient is discharging today" placement="top">
      <Icon fontSize="medium" sx={{ fontWeight: "bold" }} color={"warning"}>
        warning
      </Icon>
    </Tooltip>
  ),
};

function AdmissionCard({ admission, handleSelectAdmission }) {
  const [profileImage, setProfileImage] = useState(null);

  const handleGetProfileImage = async () => {
    if (admission.patientProfilePicture !== null) {
      const response = await imageServerApi.getImageFromImageServer(
        "id",
        admission.patientProfilePicture
      );
      const imageURL = URL.createObjectURL(response.data);
      setProfileImage(imageURL);
    }
  };

  useEffect(() => {
    handleGetProfileImage();
  }, [admission]);

  return (
    <>
      <ButtonBase
        key={admission.admissionId}
        style={{ width: "100%", marginBottom: "10px" }}
        onClick={() => handleSelectAdmission(admission)}
      >
        <Card
          // className={`draggable-container ${
          //   snapshot.isDragging ? "dragging" : ""
          // }`}
          // {...provided.draggableProps}
          // {...provided.dragHandleProps}
          // ref={provided.innerRef}
          elevation={3}
          raised={true}
        >
          <CardContent>
            <div className="draggable-icons">
              <MDTypography variant="h5" className="draggable-id">
                Bed {admission.bed}
              </MDTypography>
              {tooltips[admission.patientId]}
            </div>

            <Typography variant="body2" className="draggable-description">
              {admission.birthday}
            </Typography>
            <div className="draggable-icons">
              <Typography
                variant="subtitle2"
                className="avatar-left"
                sx={{ textAlign: "left" }}
              >
                {admission.duration
                  ? truncateText(
                      admission.firstName + " " + admission.lastName,
                      14
                    )
                  : "Vacant"}
                <br />
                {"(" + admission.sex + ")"}
              </Typography>
              {admission.patientProfilePicture === null && (
                <Skeleton
                  className="avatar-right"
                  variant="circular"
                  style={{ height: "50px", width: "50px" }}
                />
              )}
              {admission.patientProfilePicture !== null && (
                <MDAvatar
                  size="xl"
                  className="avatar-right"
                  src={profileImage}
                  alt={"Loading"}
                />
              )}
            </div>
          </CardContent>
        </Card>
      </ButtonBase>

      {/* {selectedadmission && (
        <AdmissionTicketModal
          openModal={openModal}
          handleCloseModal={handleCloseModal}
          selectedadmission={admission}
          listOfWorkingStaff={listOfWorkingStaff}
          forceRefresh={forceRefresh}
        />
      )} */}
    </>
  );
}

export default AdmissionCard;
