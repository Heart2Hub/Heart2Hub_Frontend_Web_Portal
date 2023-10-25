import { Card } from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import ProfileInfoCard from "examples/Cards/InfoCards/ProfileInfoCard";
import React from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { selectEHRRecord } from "store/slices/ehrSlice";
import { selectStaff } from "store/slices/staffSlice";

function MedicalRecordsBox() {
  const reduxDispatch = useDispatch();
  const ehrRecord = useSelector(selectEHRRecord);
  const loggedInStaff = useSelector(selectStaff);
  return (
    <>
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
          <MDTypography variant="h6" gutterBottom>
            List of Medical History Records:
          </MDTypography>
          {ehrRecord.listOfMedicalHistoryRecords.map((medicalRecord, index) => (
            <ProfileInfoCard
              key={index}
              title={`Medical History ${index + 1}`}
              info={{
                createdBy: medicalRecord.createdBy,
                createdDate: medicalRecord.createdDate.split(" ")[0],
                resolvedDate: medicalRecord.resolvedDate.split(" ")[0],
                description: medicalRecord.description,
                priority: medicalRecord.priorityEnum,
                problemType: medicalRecord.problemTypeEnum,
              }}
              shadow={false}
            />
          ))}
        </Card>
      </MDBox>
    </>
  );
}

export default MedicalRecordsBox;
