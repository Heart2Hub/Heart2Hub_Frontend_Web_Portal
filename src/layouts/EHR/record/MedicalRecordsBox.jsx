import { Card, CardContent, Grid, styled, Chip } from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import React from "react";
import { useSelector } from "react-redux";
import { selectEHRRecord } from "store/slices/ehrSlice";

const PriorityCircle = styled("div")(({ theme, priority }) => ({
  width: 20,
  height: 20,
  borderRadius: "50%",
  display: "inline-block",
  marginRight: theme.spacing(1),
  backgroundColor:
    priority === "LOW"
      ? "green"
      : priority === "MEDIUM"
      ? "orange"
      : priority === "HIGH"
      ? "red"
      : "gray",
}));

function MedicalRecordsBox() {
  const ehrRecord = useSelector(selectEHRRecord);

  return (
    <MDBox position="relative" mb={5}>
      <MDBox position="relative" minHeight="5rem" />
      <Card sx={{ position: "relative", mt: -8, mx: 3, py: 2, px: 2 }}>
        <MDTypography variant="h6" gutterBottom>
          List of Medical History Records:
        </MDTypography>
        <Grid container spacing={2}>
          {ehrRecord.listOfMedicalHistoryRecords.map((medicalRecord, index) => (
            <Grid item xs={12} key={index}>
              <Card variant="outlined" sx={{ p: 2 }}>
                <CardContent>
                  <MDTypography variant="h6" gutterBottom>
                    Medical History {index + 1}
                  </MDTypography>
                  <MDTypography variant="body1" gutterBottom>
                    <strong>Created By:</strong> {medicalRecord.createdBy}
                  </MDTypography>
                  <MDTypography variant="body1" gutterBottom>
                    <strong>Created Date:</strong>{" "}
                    {medicalRecord.createdDate.split(" ")[0]}
                  </MDTypography>
                  <MDTypography variant="body1" gutterBottom>
                    <strong>Resolved Date:</strong>{" "}
                    {medicalRecord.resolvedDate.split(" ")[0]}
                  </MDTypography>
                  <MDTypography variant="body1" gutterBottom>
                    <strong>Description:</strong> {medicalRecord.description}
                  </MDTypography>
                  <MDTypography variant="body1" gutterBottom>
                    <strong>Problem Type:</strong> {medicalRecord.problemTypeEnum}
                  </MDTypography>
                  <MDTypography variant="body1" gutterBottom>
                    <strong>Priority: </strong>{" "}
                    <Chip
                              color={
                                medicalRecord.priorityEnum === "LOW"
                                  ? "success"
                                  : medicalRecord.priorityEnum === "MEDIUM"
                                    ? "warning"
                                    : "error"
                              }
                              label={medicalRecord.priorityEnum}
                            />
                  </MDTypography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Card>
    </MDBox>
  );
}

export default MedicalRecordsBox;
