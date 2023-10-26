import React from "react";
import { Card, CardContent, Chip, Icon, Grid, Divider } from "@mui/material";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import { selectEHRRecord } from "../../../../store/slices/ehrSlice";
import { useState } from "react";
import { useSelector } from "react-redux";
import { selectStaff } from "store/slices/staffSlice";
import { useDispatch } from "react-redux";
import CreateNewProblemRecordDialog from "./CreateNewProblemRecordDialog";
import ResolveProblemRecordDialog from "./ResolveProblemRecordDialog";
import UpdateProblemRecordDialog from "./UpdateProblemRecordDialog";
import DeleteProblemRecordDialog from "./DeleteProblemRecordDialog";

import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";

function ProblemRecordsBox() {
  const reduxDispatch = useDispatch();
  const ehrRecord = useSelector(selectEHRRecord);
  const loggedInStaff = useSelector(selectStaff);
  //resolving problem records
  const [openResolveProblemRecordModal, setOpenResolveProblemRecordModal] =
    useState(false);
  const [selectedProblemRecordToResolve, setSelectedProblemRecordToResolve] =
    useState(null);

  //creating problem records
  const [openCreateProblemRecordDialog, setOpenCreateProblemRecordDialog] =
    useState(false);

  //updating problem records
  const [openUpdateProblemRecordDialog, setOpenUpdateProblemRecordDialog] =
    useState(false);
  const [selectedProblemRecordToUpdate, setSelectedProblemRecordToUpdate] =
    useState(null);

  //deleting problem records
  const [openDeleteProblemRecordDialog, setOpenDeleteProblemRecordDialog] =
    useState(false);
  const [selectedProblemRecordToDelete, setSelectedProblemRecordToDelete] =
    useState(null);

  //create problem records
  const handleCloseCreateProblemRecordDialog = () => {
    setOpenCreateProblemRecordDialog(false);
  };

  const handleOpenCreateProblemRecordDialog = () => {
    setOpenCreateProblemRecordDialog(true);
  };

  //resolve problem records
  const handleOpenResolveProblemRecordModal = (problemRecord) => {
    setSelectedProblemRecordToResolve(problemRecord);
    setOpenResolveProblemRecordModal(true);
  };

  const handleCloseResolveProblemRecordModal = () => {
    setOpenResolveProblemRecordModal(false);
    setSelectedProblemRecordToResolve(null);
  };

  //update problem
  const handleOpenUpdateProblemRecordDialog = (problemRecord) => {
    setSelectedProblemRecordToUpdate(problemRecord);
    setOpenUpdateProblemRecordDialog(true);
  };

  const handleCloseUpdateProblemRecordDialog = () => {
    setOpenUpdateProblemRecordDialog(false);
    setSelectedProblemRecordToUpdate(null);
  };

  //delete problem
  const handleOpenDeleteProblemRecordDialog = (problemRecord) => {
    setSelectedProblemRecordToDelete(problemRecord);
    setOpenDeleteProblemRecordDialog(true);
  };

  const handleCloseDeleteProblemRecordDialog = () => {
    setSelectedProblemRecordToDelete(null);
    setOpenDeleteProblemRecordDialog(false);
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
          <MDTypography variant="h3">List of Problem Records:</MDTypography>

          {loggedInStaff.staffRoleEnum === "DOCTOR" && (
            <MDBox mx={2} mt={3} px={2}>
              <MDButton
                variant="contained"
                color="primary"
                onClick={handleOpenCreateProblemRecordDialog}
              >
                <Icon sx={{ marginRight: "5px" }}>add</Icon>
                Create New Problem
              </MDButton>
            </MDBox>
          )}
        </MDBox>

        <Divider variant="middle" />
        {ehrRecord.listOfProblemRecords.length === 0 ? (
          <MDTypography
            variant="h5"
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
            }}
          >
            <EmojiEmotionsIcon fontSize="large" /> &nbsp; No problem records
            available.
          </MDTypography>
        ) : (
          <Grid container spacing={3} justify="center" alignItems="center">
            {ehrRecord.listOfProblemRecords.map((problemRecord, index) => (
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
                          {`Problem ${index + 1}`}
                        </MDTypography>
                        <MDTypography variant="h6" color="secondary">
                          {`Created By: ${problemRecord.createdBy}`}
                        </MDTypography>
                        <MDTypography variant="h5" style={{ marginTop: "8px" }}>
                          {`Date: ${problemRecord.createdDate.split(" ")[0]}`}
                        </MDTypography>
                        <MDTypography variant="h5" style={{ marginTop: "8px" }}>
                          {`Description: ${problemRecord.description}`}
                        </MDTypography>
                        <MDTypography
                          variant="h5"
                          style={{ marginTop: "8px", fontWeight: "bold" }}
                        >
                          Priority:
                          <Chip
                            color={
                              problemRecord.priorityEnum === "LOW"
                                ? "success"
                                : problemRecord.priorityEnum === "MEDIUM"
                                ? "warning"
                                : "error"
                            }
                            label={problemRecord.priorityEnum}
                          />
                        </MDTypography>
                        <MDTypography variant="h6" style={{ marginTop: "8px" }}>
                          {`Problem Type: ${problemRecord.problemTypeEnum}`}
                        </MDTypography>
                      </Grid>
                      {loggedInStaff.staffRoleEnum === "DOCTOR" && (
                        <Grid item xs={3}>
                          <div style={{ marginTop: "12px", textAlign: "left" }}>
                            <MDButton
                              style={{
                                width: "120px",
                                marginRight: "10px",
                                marginBottom: "8px",
                              }}
                              variant="contained"
                              color="success"
                              onClick={() =>
                                handleOpenResolveProblemRecordModal(
                                  problemRecord
                                )
                              }
                            >
                              Resolve
                            </MDButton>
                            <br />
                            <MDButton
                              style={{
                                width: "120px",
                                marginRight: "10px",
                                marginBottom: "8px",
                              }}
                              variant="contained"
                              color="info"
                              onClick={() =>
                                handleOpenUpdateProblemRecordDialog(
                                  problemRecord
                                )
                              }
                            >
                              Update
                            </MDButton>
                            <br />
                            <MDButton
                              style={{ width: "120px" }}
                              variant="contained"
                              color="primary"
                              onClick={() =>
                                handleOpenDeleteProblemRecordDialog(
                                  problemRecord
                                )
                              }
                            >
                              Delete
                            </MDButton>
                          </div>
                        </Grid>
                      )}
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Card>
      <CreateNewProblemRecordDialog
        openCreateProblemRecordDialog={openCreateProblemRecordDialog}
        handleCloseCreateProblemRecordDialog={
          handleCloseCreateProblemRecordDialog
        }
      />

      <ResolveProblemRecordDialog
        openResolveProblemRecordModal={openResolveProblemRecordModal}
        selectedProblemRecordToResolve={selectedProblemRecordToResolve}
        handleCloseResolveProblemRecordModal={
          handleCloseResolveProblemRecordModal
        }
      />

      <UpdateProblemRecordDialog
        openUpdateProblemRecordDialog={openUpdateProblemRecordDialog}
        handleCloseUpdateProblemRecordDialog={
          handleCloseUpdateProblemRecordDialog
        }
        selectedProblemRecordToUpdate={selectedProblemRecordToUpdate}
      />
      <DeleteProblemRecordDialog
        openDeleteProblemRecordDialog={openDeleteProblemRecordDialog}
        selectedProblemRecordToDelete={selectedProblemRecordToDelete}
        handleCloseDeleteProblemRecordDialog={
          handleCloseDeleteProblemRecordDialog
        }
      />
    </>
  );
}

export default ProblemRecordsBox;
