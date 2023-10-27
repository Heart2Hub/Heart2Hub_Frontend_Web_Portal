import { Grid, Card, CardContent, Divider, Icon, Chip } from "@mui/material";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { selectEHRRecord } from "store/slices/ehrSlice";
import { selectStaff } from "store/slices/staffSlice";
import CreateNewTreatmentPlanRecordDialog from "./CreateNewTreatmentPlanRecordDialog";

import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import ViewTreatmentPlanRecordDialog from "./ViewTreatmentPlanRecordDialog";
import { useEffect } from "react";

function TreatmentPlansBox() {
  const reduxDispatch = useDispatch();
  const ehrRecord = useSelector(selectEHRRecord);
  const loggedInStaff = useSelector(selectStaff);

  //creating treatment plan records
  const [
    openCreateTreatmentPlanRecordDialog,
    setOpenCreateTreatmentPlanRecordDialog,
  ] = useState(false);

  //view treatment plan records
  const [
    openViewTreatmentPlanRecordDialog,
    setOpenViewTreatmentPlanRecordDialog,
  ] = useState(false);
  const [
    selectedTreatmentPlanRecordToView,
    setSelectedTreatmentPlanRecordToView,
  ] = useState(null);

  // //updating treatment plan records
  // const [
  //   openUpdateTreatmentPlanRecordDialog,
  //   setOpenUpdateTreatmentPlanRecordDialog,
  // ] = useState(false);
  // const [
  //   selectedTreatmentPlanRecordToUpdate,
  //   setSelectedTreatmentPlanRecordToUpdate,
  // ] = useState(null);

  // //deleting treatment plan records
  // const [
  //   openDeleteTreatmentPlanRecordDialog,
  //   setOpenDeleteTreatmentPlanRecordDialog,
  // ] = useState(false);
  // const [
  //   selectedTreatmentPlanRecordToDelete,
  //   setSelectedTreatmentPlanRecordToDelete,
  // ] = useState(null);

  //create treatment plan records
  const handleOpenCreateTreatmentPlanRecordDialog = () => {
    setOpenCreateTreatmentPlanRecordDialog(true);
  };

  const handleCloseCreateTreatmentPlanRecordDialog = () => {
    setOpenCreateTreatmentPlanRecordDialog(false);
  };

  //view treatment plan records
  const handleOpenViewTreatmentPlanRecordDialog = (treatmentPlan) => {
    setOpenViewTreatmentPlanRecordDialog(true);
    setSelectedTreatmentPlanRecordToView(treatmentPlan);
  };

  const handleCloseViewTreatmentPlanRecordDialog = () => {
    setOpenViewTreatmentPlanRecordDialog(false);
    setSelectedTreatmentPlanRecordToView(null);
  };

  return (
    <>
      <MDBox position="relative" minHeight="5rem" />
      <Card
        sx={{
          position: "relative",
          mt: -8,
          mx: 3,
          py: 2,
          px: 2,
          height: "600px",
          overflowY: "auto",
          "&::WebkitScrollbar": {
            width: "0px",
            background: "transparent",
          },
          scrollbarWidth: "none",
        }}
      >
        <MDBox
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "20px",
            marginLeft: "20px",
            marginBottom: "20px",
          }}
        >
          <MDTypography variant="h3">List of Treatment Plans:</MDTypography>

          {loggedInStaff.staffRoleEnum === "DOCTOR" && (
            <MDBox mx={2} mt={3} px={2}>
              <MDButton
                variant="contained"
                color="primary"
                onClick={handleOpenCreateTreatmentPlanRecordDialog}
              >
                <Icon sx={{ marginRight: "5px" }}>add</Icon>
                Create New Treatment Plan
              </MDButton>
            </MDBox>
          )}
        </MDBox>
        <Divider variant="middle" />

        {ehrRecord.listOfTreatmentPlanRecords.length === 0 ? (
          <MDTypography
            variant="h5"
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
            }}
          >
            <EmojiEmotionsIcon fontSize="large" /> &nbsp; No Treatment Plan
            records available.
          </MDTypography>
        ) : (
          <Grid container spacing={3} justify="center" alignItems="center">
            {ehrRecord.listOfTreatmentPlanRecords.map(
              (treatmentPlan, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <Card
                    style={{
                      width: "90%",
                      margin: "auto",
                      border: "1px solid #e0e0e0",
                      boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
                      transition: "all 0.3s ease",
                      marginBottom: "16px",
                    }}
                  >
                    <CardContent>
                      <Grid container spacing={2}>
                        <Grid item xs={9}>
                          <MDTypography
                            variant="h3"
                            style={{ marginBottom: "8px" }}
                          >
                            {`Plan ${index + 1}`}
                          </MDTypography>
                          <MDTypography
                            variant="h6"
                            style={{ marginTop: "8px" }}
                          >
                            {`Start Date: ${
                              treatmentPlan.startDate.split(" ")[0]
                            }`}
                          </MDTypography>

                          <MDTypography
                            variant="h6"
                            style={{ marginTop: "8px" }}
                          >
                            End Date:
                            {treatmentPlan.endDate !== null
                              ? treatmentPlan.endDate.split(" ")[0]
                              : "-"}
                          </MDTypography>
                          <MDTypography
                            variant="h6"
                            style={{ marginTop: "8px" }}
                          >
                            {`Treatment Plan Type: ${treatmentPlan.treatmentPlanTypeEnum}`}
                          </MDTypography>
                        </Grid>
                        <Grid item xs={3}>
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "space-between",
                              height: "100%",
                            }}
                          >
                            <MDButton
                              style={{
                                width: "120px",
                                marginRight: "20px",
                                marginBottom: "8px",
                                marginTop: "15px",
                              }}
                              variant="contained"
                              color="success"
                              onClick={() =>
                                handleOpenViewTreatmentPlanRecordDialog(
                                  treatmentPlan
                                )
                              }
                            >
                              View
                            </MDButton>

                            {/* This will be at the bottom */}
                            <div style={{ textAlign: "left" }}>
                              <MDTypography
                                variant="h5"
                                style={{ marginTop: "8px", fontWeight: "bold" }}
                              >
                                Status:
                                <Chip
                                  color={
                                    treatmentPlan.isCompleted
                                      ? "success"
                                      : "warning"
                                  }
                                  label={
                                    treatmentPlan.isCompleted
                                      ? "Completed"
                                      : "Ongoing"
                                  }
                                />
                              </MDTypography>
                            </div>
                          </div>
                        </Grid>
                        {/* )} */}
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              )
            )}
          </Grid>
        )}
      </Card>
      <CreateNewTreatmentPlanRecordDialog
        openCreateTreatmentPlanRecordDialog={
          openCreateTreatmentPlanRecordDialog
        }
        handleCloseCreateTreatmentPlanRecordDialog={
          handleCloseCreateTreatmentPlanRecordDialog
        }
      />
      <ViewTreatmentPlanRecordDialog
        openViewTreatmentPlanRecordDialog={openViewTreatmentPlanRecordDialog}
        handleCloseViewTreatmentPlanRecordDialog={
          handleCloseViewTreatmentPlanRecordDialog
        }
        selectedTreatmentPlanRecordToView={selectedTreatmentPlanRecordToView}
      />
    </>
  );
}

export default TreatmentPlansBox;
