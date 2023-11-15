import {
  Typography,
  Card,
  CardContent,
  ButtonBase,
  Skeleton,
  Tooltip,
  Icon,
  Chip,
  SvgIcon,
  Stack,
} from "@mui/material";
import React, { useEffect } from "react";
import "./inpatient.css";
import MDTypography from "components/MDTypography";
import { useState } from "react";
import MDAvatar from "components/MDAvatar";
import { truncateText } from "utility/Utility";
import { imageServerApi } from "api/Api";
import moment from "moment";
import { ReactComponent as WaterIcon } from "assets/projectImages/glass-water-solid.svg";
import { ReactComponent as ToiletIcon } from "assets/projectImages/toilet-solid.svg";
import { ReactComponent as BathIcon } from "assets/projectImages/shower-solid.svg";
import ClearIcon from "@mui/icons-material/Clear";
import { patientRequestApi } from "api/Api";
import { useDispatch } from "react-redux";
import { displayMessage } from "store/slices/snackbarSlice";

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
  3: (
    <Tooltip title="Patient is discharging today" placement="top">
      <Icon fontSize="medium" sx={{ fontWeight: "bold" }} color={"warning"}>
        warning
      </Icon>
    </Tooltip>
  ),
  4: (
    <Tooltip title="Patient has an order to be completed now" placement="top">
      <Icon fontSize="medium" sx={{ fontWeight: "bold" }} color={"warning"}>
        warning
      </Icon>
    </Tooltip>
  ),
  5: (
    <Tooltip title="Patient has an order that is overdue" placement="top">
      <Icon fontSize="medium" sx={{ fontWeight: "bold" }} color={"error"}>
        warning
      </Icon>
    </Tooltip>
  ),
};

const iconMap = {
  WATER: <WaterIcon />,
  TOILET: <ToiletIcon />,
  BATH: <BathIcon />,
};

function AdmissionCard({ admission, handleSelectAdmission, events }) {
  const reduxDispatch = useDispatch();
  const [profileImage, setProfileImage] = useState(null);
  const [tooltip, setTooltip] = useState(null);
  const [patientRequests, setPatientRequests] = useState([]);

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

  const handleGetTooltipColorAndMessage = () => {
    let admissionDateTime = admission.admissionDateTime;
    if (admissionDateTime.length > 6) {
      admissionDateTime.pop();
    }
    const admissionMoment = moment(admissionDateTime);
    admissionMoment.subtract(1, "months");
    const hoursPassed = moment().diff(admissionMoment, "hours");

    if (hoursPassed < 2 && !admission.arrived) {
      setTooltip(1);
    } else if (hoursPassed >= 2 && !admission.arrived) {
      setTooltip(2);
    }

    const dischargeMoment = moment(admission.dischargeDateTime);
    dischargeMoment.subtract(1, "months");
    const dischargeToday = dischargeMoment.isSame(moment(), "day");

    if (dischargeToday) {
      setTooltip(3);
    }

    //filter events by bed
    const filteredEvents = events.filter(
      (event) => event.resourceId === admission.bed
    );
    console.log(filteredEvents);
    for (const event of filteredEvents) {
      if (event.id === 1) {
        setTooltip(4);
      } else if (event.id === 2) {
        setTooltip(5);
        break;
      }
    }
  };

  const handleGetPatientRequests = async () => {
    const response = await patientRequestApi.getPatientRequests(
      admission.username
    );
    //console.log(response.data);
    setPatientRequests(response.data);
  };

  useEffect(() => {
    if (admission) {
      //console.log(admission);
      handleGetProfileImage();
      handleGetTooltipColorAndMessage();
      handleGetPatientRequests();
    }
  }, []);

  const handleDelete = async (request) => {
    await patientRequestApi.deletePatientRequest(
      request.patientRequestEnum,
      admission.username
    );

    reduxDispatch(
      displayMessage({
        color: "success",
        icon: "notification",
        title: "Success",
        content: "Patient request has been completed!",
      })
    );

    const updatedPatientRequests = patientRequests.filter(
      (existingRequest) =>
        existingRequest.patientRequestId !== request.patientRequestId
    );
    setPatientRequests(updatedPatientRequests);
  };

  return (
    admission && (
      <ButtonBase
        key={admission.admissionId}
        onClick={() => handleSelectAdmission(admission)}
      >
        <Card
          // className={`draggable-container ${
          //   snapshot.isDragging ? "dragging" : ""
          // }`}
          // {...provided.draggableProps}
          // {...provided.dragHandleProps}
          // ref={provided.innerRef}
          style={{ width: "280px", margin: "10px" }}
          elevation={3}
          raised={true}
        >
          <CardContent>
            <div className="draggable-icons">
              <MDTypography variant="h5" className="draggable-id">
                HH-{admission.admissionId}
              </MDTypography>
              {tooltip && tooltips[tooltip]}
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
            <Stack
              direction="row"
              spacing={2}
              style={{ marginTop: 20, height: 36 }}
            >
              {patientRequests.map((request) => (
                <Chip
                  icon={
                    <SvgIcon fontSize="medium">
                      {iconMap[request.patientRequestEnum]}
                    </SvgIcon>
                  }
                  style={{ height: 36 }}
                  onDelete={() => handleDelete(request)}
                  deleteIcon={<ClearIcon fontSize="small" />}
                />
              ))}
            </Stack>
          </CardContent>
        </Card>
      </ButtonBase>
    )
  );
}

export default AdmissionCard;
