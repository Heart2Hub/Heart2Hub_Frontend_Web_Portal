import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import ProfileInfoCard from "examples/Cards/InfoCards/ProfileInfoCard";

import React, { useEffect, useState } from "react";
import { IMAGE_SERVER } from "constants/RestEndPoint";
import Header from "./components/Header";
import Divider from "@mui/material/Divider";

import { useSelector } from "react-redux";
import { selectEHRRecord } from "../../../store/slices/ehrSlice";

function EHRRecord() {
  const ehrRecord = useSelector(selectEHRRecord);

  console.log(ehrRecord);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Header>
        <Divider orientation="horizontal" sx={{ ml: -2, mr: 1 }} />

        <MDBox mt={3} mb={3}>
          <ProfileInfoCard
            title="patient EHR information:"
            info={{
              firstName: ehrRecord.firstName,
              lastName: ehrRecord.lastName,
              username: ehrRecord.username,
              birthDate: ehrRecord.dateOfBirth.split(" ")[0],
              address: ehrRecord.address,
              contactNumber: ehrRecord.contactNumber,
            }}
            shadow={false}
          />
        </MDBox>
      </Header>

      <MDBox position="relative" mb={5}>
        <MDBox position="relative" minHeight="5rem" />
        <Card
          sx={{
            position: "relative",
            mt: -8,
            mx: 3,
            py: 2,
            px: 2,
          }}
        >
          <Typography variant="h6" gutterBottom>
            List of Problem Records:
            {ehrRecord.listOfProblemRecords.map((problemRecord, index) => (
              <ProfileInfoCard
                key={index}
                title={`Problem ${index + 1}`}
                info={{
                  createdBy: problemRecord.createdBy,
                  createdDate: problemRecord.createdDate.join("/"),
                  description: problemRecord.description,
                  priority: problemRecord.priorityEnum,
                  problemType: problemRecord.problemTypeEnum,
                }}
                shadow={false}
              />
            ))}
          </Typography>
        </Card>
      </MDBox>

      <MDBox position="relative" mb={5}>
        <MDBox position="relative" minHeight="5rem" />
        <Card
          sx={{
            position: "relative",
            mt: -8,
            mx: 3,
            py: 2,
            px: 2,
          }}
        >
          <Typography variant="h6" gutterBottom>
            List of Medical History Records:
          </Typography>
          {ehrRecord.listOfMedicalHistoryRecords.map((medicalRecord, index) => (
            <ProfileInfoCard
              key={index}
              title={`Medical History ${index + 1}`}
              info={{
                createdBy: medicalRecord.createdBy,
                createdDate: medicalRecord.createdDate.join("/"),
                description: medicalRecord.description,
                priority: medicalRecord.priorityEnum,
                problemType: medicalRecord.problemTypeEnum,
                resolvedDate: medicalRecord.resolvedDate.join("/"),
              }}
              shadow={false}
            />
          ))}
        </Card>
      </MDBox>
    </DashboardLayout>
  );
}

export default EHRRecord;
