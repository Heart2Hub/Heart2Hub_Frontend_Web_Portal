// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";

import MDBox from "components/MDBox";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import React, { useState, useEffect, useRef } from "react";

import { useSelector } from "react-redux";
import { selectEHRRecord } from "../../../store/slices/ehrSlice";

function EHRRecord() {
  const ehrRecord = useSelector(selectEHRRecord);

  console.log(ehrRecord);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <Typography variant="h5" gutterBottom>
                Patient Information
              </Typography>
              <Typography variant="body1" gutterBottom>
                First Name: {ehrRecord.firstName}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Last Name: {ehrRecord.lastName}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Username: {ehrRecord.username}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Date of Birth:{" "}
                {
                  ehrRecord.dateOfBirth &&
                    ehrRecord.dateOfBirth.join(
                      "/"
                    ) /* Assuming it's an array of [year, month, day] */
                }
              </Typography>
              <Typography variant="body1" gutterBottom>
                Address: {ehrRecord.address}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Contact Number: {ehrRecord.contactNumber}
              </Typography>
              <Grid item xs={12}>
                <Card>
                  <Typography variant="h5" gutterBottom>
                    Medical History
                  </Typography>
                  {ehrRecord.listOfMedicalHistoryRecords.map((record) => (
                    <div key={record.medicalRecordId}>
                      <Typography variant="body1" gutterBottom>
                        Created By: {record.createdBy}
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        Created Date:{" "}
                        {
                          record.createdDate &&
                            record.createdDate.join(
                              "/"
                            ) /* Assuming it's an array of [year, month, day] */
                        }
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        Description: {record.description}
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        Priority: {record.priorityEnum}
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        Problem Type: {record.problemTypeEnum}
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        Resolved Date:{" "}
                        {
                          record.resolvedDate &&
                            record.resolvedDate.join(
                              "/"
                            ) /* Assuming it's an array of [year, month, day] */
                        }
                      </Typography>
                      {/* Add more fields from the record as needed */}
                    </div>
                  ))}
                </Card>
              </Grid>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default EHRRecord;
