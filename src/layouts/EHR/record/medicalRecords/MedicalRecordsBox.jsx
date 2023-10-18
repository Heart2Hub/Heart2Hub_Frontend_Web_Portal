import { Card, CardContent, Chip, Grid } from "@mui/material";
import MDTypography from "components/MDTypography";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { selectEHRRecord } from "store/slices/ehrSlice";
import { selectStaff } from "store/slices/staffSlice";

function MedicalRecordsBox() {
  const reduxDispatch = useDispatch();
  const ehrRecord = useSelector(selectEHRRecord);
  const loggedInStaff = useSelector(selectStaff);

  const [allergyList, setAllergyList] = useState([]);
  const [allMedicalRecords, setAllMedicalRecords] = useState([]);

  const priorityValue = (priority) => {
    switch (priority) {
      case "HIGH":
        return 1;
      case "MEDIUM":
        return 2;
      case "LOW":
        return 3;
      default:
        return 4;
    }
  };

  const seperateAllergyAdnMedicalRecords = () => {
    const sortAllergiesFunction = (a, b) => {
      // First sort by priority
      const priorityComparison =
        priorityValue(a.priorityEnum) - priorityValue(b.priorityEnum);
      if (priorityComparison !== 0) {
        return priorityComparison;
      }
      // If priorities are the same, sort by createdDate
      return new Date(b.createdDate) - new Date(a.createdDate);
    };

    const sortMedicalRecordsFunction = (a, b) => {
      return new Date(b.resolvedDate) - new Date(a.resolvedDate);
    };

    const listOfAllergies = ehrRecord.listOfMedicalHistoryRecords
      .filter(
        (record) => record.problemTypeEnum === "ALLERGIES_AND_IMMUNOLOGIC"
      )
      .sort(sortAllergiesFunction);

    const listOfNonAllergies = ehrRecord.listOfMedicalHistoryRecords
      .filter(
        (record) => record.problemTypeEnum !== "ALLERGIES_AND_IMMUNOLOGIC"
      )
      .sort(sortMedicalRecordsFunction);

    setAllergyList(listOfAllergies);
    setAllMedicalRecords(listOfNonAllergies);
  };

  useEffect(() => {
    console.log(ehrRecord.listOfMedicalHistoryRecords);
    seperateAllergyAdnMedicalRecords();
  }, []);

  const recordCardStyles = {
    width: "92%",
    margin: "20px",
    border: "1px solid #e0e0e0",
    boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
    transition: "all 0.3s ease",
    marginBottom: "20px",
    padding: "12px",
    borderRadius: "8px",
    height: "300px",
  };

  const centerMessageStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  };

  const invisibleScrollBarStyles = {
    "&::WebkitScrollbar": {
      display: "none",
    },
    scrollbarWidth: "none",
    msOverflowStyle: "none",
  };

  return (
    <>
      <Grid container spacing={3}>
        {/* Non Allergy Records Column */}
        <Grid item xs={6}>
          <Card
            style={{
              height: "600px",
              overflowY: "auto",
              ...invisibleScrollBarStyles,
            }}
          >
            <MDTypography variant="h3" style={{ padding: "10px 20px" }}>
              List of Medical History Records:
            </MDTypography>
            {allMedicalRecords.length > 0 ? (
              allMedicalRecords.map((medicalRecord, index) => (
                <Card key={index} style={recordCardStyles}>
                  <CardContent style={{ position: "relative" }}>
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
                          : medicalRecord.priorityEnum === "MEDIUM"
                          ? "warning"
                          : "error"
                      }
                      label={medicalRecord.priorityEnum + " PRIORITY"}
                    />
                    <MDTypography
                      variant="h6"
                      style={{ marginTop: "8px", fontWeight: "bold" }}
                    >
                      Created By: {medicalRecord.createdBy}
                    </MDTypography>
                    <MDTypography variant="h6" style={{ marginTop: "8px" }}>
                      Created Date: {medicalRecord.createdDate.split(" ")[0]}
                    </MDTypography>
                    <MDTypography variant="h6" style={{ marginTop: "8px" }}>
                      Resolved Date: {medicalRecord.resolvedDate.split(" ")[0]}
                    </MDTypography>
                    <MDTypography variant="h6" style={{ marginTop: "8px" }}>
                      Description: {medicalRecord.description}
                    </MDTypography>
                    <MDTypography variant="h6" style={{ marginTop: "8px" }}>
                      Problem Type: {medicalRecord.problemTypeEnum}
                    </MDTypography>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div style={centerMessageStyle}>No Medical Records Found</div>
            )}
          </Card>
        </Grid>

        {/* Allergies Column */}
        <Grid item xs={6}>
          <Card
            style={{
              height: "600px",
              overflowY: "auto",
              ...invisibleScrollBarStyles,
            }}
          >
            <MDTypography variant="h3" style={{ padding: "10px 20px" }}>
              List of Allergy Records:
            </MDTypography>

            {allergyList.length > 0 ? (
              allergyList.map((allergy, index) => (
                <Card key={index} style={recordCardStyles}>
                  <CardContent style={{ position: "relative" }}>
                    <MDTypography variant="h4" color="info">
                      Allergy History {index + 1}
                    </MDTypography>
                    <Chip
                      style={{
                        position: "absolute",
                        top: "10px",
                        right: "10px",
                      }}
                      color={
                        allergy.priorityEnum === "LOW"
                          ? "success"
                          : allergy.priorityEnum === "MEDIUM"
                          ? "warning"
                          : "error"
                      }
                      label={allergy.priorityEnum + " PRIORITY"}
                    />
                    <MDTypography
                      variant="h6"
                      style={{ marginTop: "8px", fontWeight: "bold" }}
                    >
                      Created By: {allergy.createdBy}
                    </MDTypography>
                    <MDTypography variant="h6" style={{ marginTop: "8px" }}>
                      Created Date: {allergy.createdDate.split(" ")[0]}
                    </MDTypography>
                    <MDTypography variant="h6" style={{ marginTop: "8px" }}>
                      Description: {allergy.description}
                    </MDTypography>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div style={centerMessageStyle}>No Allergy Records Found</div>
            )}
          </Card>
        </Grid>
      </Grid>
    </>
  );
}

export default MedicalRecordsBox;
