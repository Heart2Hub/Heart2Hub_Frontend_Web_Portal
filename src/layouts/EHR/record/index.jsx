import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

import React from "react";
import Header from "./Header";
//comment

import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { selectEHRRecord } from "../../../store/slices/ehrSlice";
import { selectStaff } from "../../../store/slices/staffSlice";

import AccessAlarmIcon from "@mui/icons-material/AccessAlarm";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import FamilyRestroomIcon from "@mui/icons-material/FamilyRestroom";
import VaccinesIcon from "@mui/icons-material/Vaccines";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";

import ProblemRecordsBox from "./problemRecords/ProblemRecordsBox";
import AppointmentsBox from "./appointmentRecords/AppointmentsBox";
import NextOfKinBox from "./nextOfKinRecords/NextOfKinBox";
import MedicalRecordsBox from "./medicalRecords/MedicalRecordsBox";
import PrescriptionRecordsBox from "./prescriptionRecords/PrescriptionRecordsBox";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { useState } from "react";
import { Tab } from "@mui/material";
import MDBox from "components/MDBox";
import TreatmentPlansBox from "./treatmentPlanRecords/TreatmentPlansBox";
import Subsidies from "./subsidyRecord";

function EHRRecord() {
  const reduxDispatch = useDispatch();
  const ehrRecord = useSelector(selectEHRRecord);
  const loggedInStaff = useSelector(selectStaff);
  const [tabValue, setTabValue] = useState("View Problems");

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Header />

      <TabContext value={tabValue}>
        <MDBox
          sx={{
            borderBottom: 1,
            borderColor: "divider",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <TabList
            onChange={handleChange}
            aria-label="tabs example"
            sx={{ width: "100%", height: "5rem" }}
            centered
          >
            <Tab
              icon={<BusinessCenterIcon fontSize="large" />}
              value="View Problems"
              label="Problems"
              iconPosition="top"
            />
            <Tab
              icon={<AccessAlarmIcon fontSize="large" />}
              value="View Appointments"
              label="Appointments"
              iconPosition="top"
            />
            <Tab
              icon={<LocalHospitalIcon fontSize="large" />}
              value="View Medical"
              label="Medical Records"
              iconPosition="top"
            />
            <Tab
              icon={<FamilyRestroomIcon fontSize="large" />}
              value="View NextOfKin"
              label="Next of Kin"
              iconPosition="top"
            />
            <Tab
              icon={<VaccinesIcon fontSize="large" />}
              value="View Prescription"
              label="Prescription"
              iconPosition="top"
            />
            <Tab
              icon={<InsertDriveFileIcon fontSize="large" />}
              value="View TreatmentPlan"
              label="Treatment Plans"
              iconPosition="top"
            />
            <Tab
              icon={<InsertDriveFileIcon fontSize="large" />}
              value="View Subsidies"
              label="Subsidies"
              iconPosition="top"
            />
          </TabList>
        </MDBox>

        <TabPanel value="View Problems">
          <ProblemRecordsBox />
        </TabPanel>

        <TabPanel value="View Appointments">
          <AppointmentsBox />
        </TabPanel>

        {/* Display the component only if the staff's role is not 'ADMIN' */}
        {loggedInStaff.staffRoleEnum !== "ADMIN" ? (
          <TabPanel value="View Medical">
            <MedicalRecordsBox />
          </TabPanel>
        ) : (
          <TabPanel value="View Medical">
            <b>View Access Rights Required</b>
          </TabPanel>
        )}

        {/* Display the component only if the staff's role is not 'ADMIN' */}
        {loggedInStaff.staffRoleEnum !== "ADMIN" ? (
          <TabPanel value="View NextOfKin">
            <NextOfKinBox />
          </TabPanel>
        ) : (
          <TabPanel value="View NextOfKin">
            <b>View Access Rights Required</b>
          </TabPanel>
        )}

        <TabPanel value="View Prescription">
          <PrescriptionRecordsBox ehrRecord={ehrRecord} />
        </TabPanel>

        {/* Display the component only if the staff's role is not 'ADMIN' */}
        {loggedInStaff.staffRoleEnum !== "ADMIN" ? (
          <TabPanel value="View TreatmentPlan">
            <TreatmentPlansBox />
          </TabPanel>
        ) : (
          <TabPanel value="View TreatmentPlan">
            <b>View Access Rights Required</b>
          </TabPanel>
        )}

        {/* {loggedInStaff.staffRoleEnum !== "ADMIN" ? (
          <TabPanel value="View Subsidies">
            <Subsidies />
          </TabPanel>
        ) : (
          <TabPanel value="View Subsidies">
            <b>View Access Rights Required</b>
          </TabPanel>
        )} */}
      </TabContext>
    </DashboardLayout>
  );
}

export default EHRRecord;
