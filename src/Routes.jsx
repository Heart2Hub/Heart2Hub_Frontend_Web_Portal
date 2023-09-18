// Material Dashboard 2 React layouts
import Dashboard from "layouts/dashboard";
import Tables from "layouts/tables";
import Billing from "layouts/billing";
import Notifications from "layouts/notifications";
import Profile from "layouts/profile";
import SignIn from "layouts/authentication/sign-in";

// @mui icons
import Icon from "@mui/material/Icon";
import Outpatient from "layouts/outpatient";
import Inpatient from "layouts/inpatient";
import EHR from "layouts/ehr";
import EHRRecord from "layouts/ehr/record";
import Administration from "layouts/administration";
import Manpower from "layouts/manpower";
import Finance from "layouts/finance";
import StaffManagement from "layouts/administration/staff-management";
import FacilityManagement from "layouts/administration/facility-management";
import Home from "layouts/home";
import Account from "layouts/account";
import ErrorPage from "layouts/error";
import Rostering from "layouts/manpower/rostering/ShiftOverallRoster";
import CalendarRoster from "layouts/manpower/rostering/CalendarRoster";
import ViewAllLeaves from "layouts/manpower/leaveApplication/ViewAllLeaves";
import CreateLeave from "layouts/manpower/leaveApplication/CreateLeave";

import LeaveApproval from "layouts/manpower/leaveApproval";

const routes = [
  {
    name: "Login",
    key: "login",
    route: "/",
    component: <SignIn />,
  },
  {
    name: "Home",
    key: "home",
    route: "/home",
    component: <Home />,
  },
  {
    type: "collapse",
    name: "Account",
    key: "account",
    icon: <Icon fontSize="small">account_circle</Icon>,
    route: "/account",
    component: <Account />,
  },
  {
    type: "collapse",
    name: "Outpatient",
    key: "outpatient",
    icon: <Icon fontSize="small">local_hospital</Icon>,
    route: "/outpatient",
    component: <Outpatient />,
  },
  {
    type: "collapse",
    name: "Inpatient",
    key: "inpatient",
    icon: <Icon fontSize="small">bed</Icon>,
    route: "/inpatient",
    component: <Inpatient />,
  },
  {
    type: "collapse",
    name: "EHR",
    key: "ehr",
    icon: <Icon fontSize="small">receipt_long</Icon>,
    route: "/ehr",
    component: <EHR />,
  },
  // {
  //   type: "collapse",
  //   name: "EHR",
  //   key: "ehr",
  //   icon: <Icon fontSize="small">receipt_long</Icon>,
  //   route: "/ehr/record",
  //   component: <EHRRecord />,
  // },
  {
    type: "collapse",
    name: "Administration",
    key: "administration",
    icon: <Icon fontSize="small">build</Icon>,
    route: "/administration",
    component: <Administration />,
  },
  {
    name: "Staff Management",
    key: "staffmanagement",
    route: "/administration/staff-management",
    component: <StaffManagement />,
  },
  {
    name: "Facility Management",
    key: "facilitymanagement",
    route: "/administration/facility-management",
    component: <FacilityManagement />,
  },
  {
    type: "collapse",
    name: "Manpower",
    key: "manpower",
    icon: <Icon fontSize="small">group</Icon>,
    route: "/manpower",
    component: <Manpower />,
  },
  {
    name: "Rostering",
    key: "rostering",
    route: "/manpower/rostering",
    component: <CalendarRoster />,
  },
  {
    name: "Shift Allocation",
    key: "shift-allocation",
    route: "/manpower/rostering/shifts",
    component: <Rostering />,
  },
  {
    name: "ViewAllLeaves",
    key: "ViewAllLeaves",
    route: "/manpower/viewAllLeaves",
    component: <ViewAllLeaves />,
  },
  {
    name: "CreateLeave",
    key: "CreateLeave",
    route: "/manpower/createLeave",
    component: <CreateLeave />,
  },
  {
    name: "Leave Approval",
    key: "leaveApproval",
    route: "/manpower/leaveApproval",
    component: <LeaveApproval />,
  },
  {
    type: "collapse",
    name: "Finance",
    key: "finance",
    icon: <Icon fontSize="small">attach_money</Icon>,
    route: "/finance",
    component: <Finance />,
  },
  {
    name: "Error",
    key: "error",
    route: "*",
    component: <ErrorPage />,
  },
];

export default routes;
