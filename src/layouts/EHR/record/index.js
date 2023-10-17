import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

import React from "react";
import Header from "./components/Header";

import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { selectEHRRecord } from "../../../store/slices/ehrSlice";
import { selectStaff } from "../../../store/slices/staffSlice";

import ProblemRecordsBox from "./components/ProblemRecordsBox";
import AppointmentsBox from "./components/AppointmentsBox";
import NextOfKinBox from "./components/NextOfKinBox";
import MedicalRecordsBox from "./components/MedicalRecordsBox";

function EHRRecord() {
  const reduxDispatch = useDispatch();
  const ehrRecord = useSelector(selectEHRRecord);
  const loggedInStaff = useSelector(selectStaff);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Header />

      {/* Problem List */}
      <ProblemRecordsBox />

      {/* Appointment List */}
      <AppointmentsBox />

      {/* medical records */}
      {loggedInStaff.staffRoleEnum === "DOCTOR" && <MedicalRecordsBox />}

      {/* next of kin */}
      {loggedInStaff.staffRoleEnum === "DOCTOR" && <NextOfKinBox />}
    </DashboardLayout>
  );
}

export default EHRRecord;
