import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
} from "@mui/material";
import { ehrApi } from "api/Api";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { selectEHRRecord } from "store/slices/ehrSlice";
import { selectStaff } from "store/slices/staffSlice";

import Man4Icon from "@mui/icons-material/Man4";
import Woman2Icon from "@mui/icons-material/Woman2";
import GroupIcon from "@mui/icons-material/Group";
import PeopleIcon from "@mui/icons-material/People";
import ChildCareIcon from "@mui/icons-material/ChildCare";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

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
        // console.error("Error fetching EHR data:", error);
      }
    }
  };

  //write method to show different icons depending on relationship
  const showIcon = (relationship) => {
    if (relationship === "Father") {
      return <Man4Icon fontSize="large" />;
    } else if (relationship === "Mother") {
      return <Woman2Icon fontSize="large" />;
    } else if (relationship === "Spouse") {
      return <GroupIcon fontSize="large" />;
    } else if (relationship === "Brother" || relationship === "Sister") {
      return <PeopleIcon fontSize="large" />;
    } else if (relationship === "Child") {
      return <ChildCareIcon fontSize="large" />;
    } else {
      return null;
    }
  };

  useEffect(() => {
    handleFetchNextOfKinData();
  }, [ehrRecord]);

  const recordCardStyles = {
    width: "92%",
    marginTop: "10px",
    margin: "20px",
    border: "1px solid #e0e0e0",
    boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
    transition: "all 0.3s ease",
    marginBottom: "20px",
    padding: "12px",
    borderRadius: "8px",
    height: "250px",
  };

  const centerMessageStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  };

  const invisibleScrollBarStyles = {
    "&::WebkitScrollba": {
      display: "none",
    },
    scrollbarWidth: "none",
    msOverflowStyle: "none",
  };

  return (
    <>
      <MDBox position="relative" mb={5}>
        <Card
          sx={{
            position: "relative",
            mt: 0,
            mx: 3,
            py: 2,
            px: 2,
          }}
        >
          <MDTypography variant="h3" gutterBottom>
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
                  <div style={{ display: "flex", alignItems: "center" }}>
                    {showIcon(nextOfKinRecord.relationship)}

                    <MDTypography variant="h6" style={{ marginLeft: "8px" }}>
                      {nextOfKinRecord.relationship}
                    </MDTypography>
                  </div>
                </AccordionSummary>
                <AccordionDetails sx={{ minHeight: "200px" }}>
                  {ehrMatch ? (
                    // Render the EHR data here if a match is found
                    <MDBox>
                      <MDTypography>
                        Name: {ehrMatch.firstName + " " + ehrMatch.lastName}
                      </MDTypography>
                      <MDTypography>NRIC: {ehrMatch.nric}</MDTypography>

                      <Divider
                        orientation="horizontal"
                        sx={{ ml: -2, mr: 1 }}
                      />
                      <Grid container spacing={3} alignItems="flex-start">
                        <Grid item xs={6} alignItems="flex-start">
                          <Card
                            style={{
                              height: "500px",
                              overflowY: "auto",
                              ...invisibleScrollBarStyles,
                            }}
                          >
                            <MDTypography
                              variant="h3"
                              style={{ padding: "10px 20px" }}
                            >
                              List of Medical History Records:
                            </MDTypography>
                            {ehrMatch.listOfMedicalHistoryRecords.length > 0 ? (
                              ehrMatch.listOfMedicalHistoryRecords.map(
                                (medicalRecord, index) => (
                                  <Card key={index} style={recordCardStyles}>
                                    <CardContent
                                      style={{ position: "relative" }}
                                    >
                                      <MDTypography variant="h4" color="info">
                                        Medical History {index + 1}
                                      </MDTypography>
                                      <Chip
                                        style={{
                                          position: "absolute",
                                          top: "10px",
                                          right: "10px",
                                        }}
                                        color={
                                          medicalRecord.priorityEnum === "LOW"
                                            ? "success"
                                            : medicalRecord.priorityEnum ===
                                              "MEDIUM"
                                            ? "warning"
                                            : "error"
                                        }
                                        label={
                                          medicalRecord.priorityEnum +
                                          " PRIORITY"
                                        }
                                      />
                                      <MDTypography
                                        variant="h6"
                                        style={{
                                          marginTop: "8px",
                                          fontWeight: "bold",
                                        }}
                                      >
                                        Created By: {medicalRecord.createdBy}
                                      </MDTypography>
                                      <MDTypography
                                        variant="h6"
                                        style={{ marginTop: "8px" }}
                                      >
                                        Created Date:{" "}
                                        {
                                          medicalRecord.createdDate.split(
                                            " "
                                          )[0]
                                        }
                                      </MDTypography>
                                      <MDTypography
                                        variant="h6"
                                        style={{ marginTop: "8px" }}
                                      >
                                        Resolved Date:{" "}
                                        {
                                          medicalRecord.resolvedDate.split(
                                            " "
                                          )[0]
                                        }
                                      </MDTypography>
                                      <MDTypography
                                        variant="h6"
                                        style={{ marginTop: "8px" }}
                                      >
                                        Description: {medicalRecord.description}
                                      </MDTypography>
                                      <MDTypography
                                        variant="h6"
                                        style={{ marginTop: "8px" }}
                                      >
                                        Problem Type:{" "}
                                        {medicalRecord.problemTypeEnum}
                                      </MDTypography>
                                    </CardContent>
                                  </Card>
                                )
                              )
                            ) : (
                              <div style={centerMessageStyle}>
                                No Medical Records Found
                              </div>
                            )}
                          </Card>
                        </Grid>

                        <Grid item xs={6}>
                          <Card
                            style={{
                              height: "500px",
                              overflowY: "auto",
                              ...invisibleScrollBarStyles,
                            }}
                          >
                            <MDTypography
                              variant="h3"
                              style={{ padding: "10px 20px" }}
                            >
                              List of Problem Records:
                            </MDTypography>

                            {ehrMatch.listOfProblemRecords.length > 0 ? (
                              ehrMatch.listOfProblemRecords.map(
                                (problemRecord, index) => (
                                  <Card key={index} style={recordCardStyles}>
                                    <CardContent
                                      style={{ position: "relative" }}
                                    >
                                      <MDTypography variant="h4" color="info">
                                        Problem Record {index + 1}
                                      </MDTypography>
                                      <Chip
                                        style={{
                                          position: "absolute",
                                          top: "10px",
                                          right: "10px",
                                        }}
                                        color={
                                          problemRecord.priorityEnum === "LOW"
                                            ? "success"
                                            : problemRecord.priorityEnum ===
                                              "MEDIUM"
                                            ? "warning"
                                            : "error"
                                        }
                                        label={
                                          problemRecord.priorityEnum +
                                          " PRIORITY"
                                        }
                                      />
                                      <MDTypography
                                        variant="h6"
                                        style={{
                                          marginTop: "8px",
                                          fontWeight: "bold",
                                        }}
                                      >
                                        Created By: {problemRecord.createdBy}
                                      </MDTypography>
                                      <MDTypography
                                        variant="h6"
                                        style={{ marginTop: "8px" }}
                                      >
                                        Created Date:{" "}
                                        {
                                          problemRecord.createdDate.split(
                                            " "
                                          )[0]
                                        }
                                      </MDTypography>

                                      <MDTypography
                                        variant="h6"
                                        style={{ marginTop: "8px" }}
                                      >
                                        Description: {problemRecord.description}
                                      </MDTypography>
                                      <MDTypography
                                        variant="h6"
                                        style={{ marginTop: "8px" }}
                                      >
                                        Problem Type:{" "}
                                        {problemRecord.problemTypeEnum}
                                      </MDTypography>
                                    </CardContent>
                                  </Card>
                                )
                              )
                            ) : (
                              <div style={centerMessageStyle}>
                                No Problem Records Found
                              </div>
                            )}
                          </Card>
                        </Grid>
                      </Grid>
                    </MDBox>
                  ) : (
                    <MDBox sx={{ height: "100px" }}>
                      <MDTypography variant="h6">
                        NRIC: {nextOfKinRecord.nric}
                      </MDTypography>
                      <Divider
                        orientation="horizontal"
                        sx={{ ml: -2, mr: 1 }}
                      />

                      <MDTypography style={centerMessageStyle}>
                        <ErrorOutlineIcon fontSize="large" />
                        &nbsp; No EHR data found for this next of kin.
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
