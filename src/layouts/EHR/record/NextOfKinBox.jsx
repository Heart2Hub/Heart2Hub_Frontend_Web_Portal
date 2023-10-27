import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Card,
  Divider,
  Chip
} from "@mui/material";
import { ehrApi } from "api/Api";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import ProfileInfoCard from "examples/Cards/InfoCards/ProfileInfoCard";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { selectEHRRecord } from "store/slices/ehrSlice";
import { selectStaff } from "store/slices/staffSlice";

function NextOfKinBox() {
  const reduxDispatch = useDispatch();
  const ehrRecord = useSelector(selectEHRRecord);
  const loggedInStaff = useSelector(selectStaff);
  const [nextOfKinEhrs, setNextOfKinEhrs] = useState([]);

  const handleFetchNextOfKinData = async () => {
    const nextOfKinDataArray = [];
    for (const nextOfKin of ehrRecord.listOfNextOfKinRecords) {
      try {
        const response = await ehrApi.getElectronicHealthRecordByNric(
          nextOfKin.nric
        );
        const data = response.data;
        nextOfKinDataArray.push(data);

        setNextOfKinEhrs(nextOfKinDataArray);
      } catch (error) {
        console.error("Error fetching EHR data:", error);
      }
    }
  };

  useEffect(() => {
    handleFetchNextOfKinData();
  }, [ehrRecord]);

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
            List of Next of Kin Records:
          </MDTypography>
          {ehrRecord.listOfNextOfKinRecords.map((nextOfKinRecord, index) => {
            // Check if nextOfKinRecord.nric exists in nextOfKinEhrs
            const ehrMatch = nextOfKinEhrs.find(
              (ehr) => ehr.nric === nextOfKinRecord.nric
            );
            return (
              <Accordion key={index}>
                <AccordionSummary>
                  <MDTypography variant="h6">
                    {nextOfKinRecord.relationship}
                  </MDTypography>
                </AccordionSummary>
                <AccordionDetails>
                  {ehrMatch ? (
                    // Render the EHR data here if a match is found
                    <MDBox>
                      <MDTypography><b>NRIC: {ehrMatch.nric}</b></MDTypography>
                      <Divider
                        orientation="horizontal"
                        sx={{ ml: -2, mr: 1 }}
                      />
                      {ehrMatch.listOfMedicalHistoryRecords.map((medicalHistory, medicalHistoryIndex) => (
                        <Card variant="outlined" sx={{ my: 2, p: 2 }} key={medicalHistoryIndex}>
                          <MDTypography variant="h6" gutterBottom>
                            Medical History {medicalHistoryIndex + 1}
                          </MDTypography>
                          <MDTypography variant="body1" gutterBottom>
                            <strong>Created By:</strong> {medicalHistory.createdBy}
                          </MDTypography>
                          <MDTypography variant="body1" gutterBottom>
                            <strong>Created Date:</strong> {medicalHistory.createdDate.split(" ")[0]}
                          </MDTypography>
                          <MDTypography variant="body1" gutterBottom>
                            <strong>Resolved Date:</strong> {medicalHistory.resolvedDate.split(" ")[0]}
                          </MDTypography>
                          <MDTypography variant="body1" gutterBottom>
                            <strong>Description:</strong> {medicalHistory.description}
                          </MDTypography>
                          <MDTypography variant="body1" gutterBottom>
                            <strong>Priority: </strong>
                            <Chip
                              color={
                                medicalHistory.priorityEnum === "LOW"
                                  ? "success"
                                  : medicalHistory.priorityEnum === "MEDIUM"
                                    ? "warning"
                                    : "error"
                              }
                              label={medicalHistory.priorityEnum}
                            />
                          </MDTypography>
                          <MDTypography variant="body1" gutterBottom>
                            <strong>Problem Type:</strong> {medicalHistory.problemTypeEnum}
                          </MDTypography>
                        </Card>
                      ))}
                      {ehrMatch.listOfProblemRecords.map((problem, problemIndex) => (
                        <Card variant="outlined" sx={{ my: 2, p: 2 }} key={problemIndex}>
                          <MDTypography variant="h6" gutterBottom>
                            Problem {problemIndex + 1}
                          </MDTypography>
                          <MDTypography variant="body1" gutterBottom>
                            <strong>Created By:</strong> {problem.createdBy}
                          </MDTypography>
                          <MDTypography variant="body1" gutterBottom>
                            <strong>Created Date:</strong> {problem.createdDate.split(" ")[0]}
                          </MDTypography>
                          <MDTypography variant="body1" gutterBottom>
                            <strong>Description:</strong> {problem.description}
                          </MDTypography>
                          <MDTypography variant="body1" gutterBottom>
                            <strong>Priority: </strong>
                            <Chip
                              color={
                                problem.priorityEnum === "LOW"
                                  ? "success"
                                  : problem.priorityEnum === "MEDIUM"
                                    ? "warning"
                                    : "error"
                              }
                              label={problem.priorityEnum}
                            />
                          </MDTypography>
                          <MDTypography variant="body1" gutterBottom>
                            <strong>Problem Type:</strong> {problem.problemTypeEnum}
                          </MDTypography>
                        </Card>
                      ))}
                    </MDBox>
                  ) : (
                    <MDBox>
                      <MDTypography variant="h6">
                        {nextOfKinRecord.nric}
                      </MDTypography>
                      <Divider
                        orientation="horizontal"
                        sx={{ ml: -2, mr: 1 }}
                      />
                      <MDTypography>
                        No EHR data found for this next of kin.
                      </MDTypography>
                    </MDBox>
                  )}
                </AccordionDetails>
              </Accordion>
            );
          })}
        </Card>
      </MDBox>
    </>
  );
}

export default NextOfKinBox;
