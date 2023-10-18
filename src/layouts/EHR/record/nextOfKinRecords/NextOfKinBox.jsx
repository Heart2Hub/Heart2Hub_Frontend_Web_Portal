import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Card,
  Divider,
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
                      <MDTypography>NRIC: {ehrMatch.nric}</MDTypography>
                      <Divider
                        orientation="horizontal"
                        sx={{ ml: -2, mr: 1 }}
                      />
                      {ehrMatch.listOfMedicalHistoryRecords.map(
                        (medicalHistory, medicalHistoryIndex) => (
                          <MDBox key={medicalHistoryIndex}>
                            <MDBox mb={1.5}>
                              <ProfileInfoCard
                                key={index}
                                title={`Medical History ${index + 1}`}
                                info={{
                                  createdBy: medicalHistory.createdBy,
                                  createdDate:
                                    medicalHistory.createdDate.split(" ")[0],
                                  resolvedDate:
                                    medicalHistory.resolvedDate.split(" ")[0],
                                  description: medicalHistory.description,
                                  priority: medicalHistory.priorityEnum,
                                  problemType: medicalHistory.problemTypeEnum,
                                }}
                                shadow={false}
                              />
                            </MDBox>
                          </MDBox>
                        )
                      )}
                      <Divider
                        orientation="horizontal"
                        sx={{ ml: -2, mr: 1 }}
                      />
                      {ehrMatch.listOfProblemRecords.map(
                        (problem, problemIndex) => (
                          <MDBox key={problemIndex}>
                            <ProfileInfoCard
                              key={index}
                              title={`Problem ${index + 1}`}
                              info={{
                                createdBy: problem.createdBy,
                                createdDate: problem.createdDate.split(" ")[0],
                                description: problem.description,
                                priority: problem.priorityEnum,
                                problemType: problem.problemTypeEnum,
                              }}
                              shadow={false}
                            />
                          </MDBox>
                        )
                      )}
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
