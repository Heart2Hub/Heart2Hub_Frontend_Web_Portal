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
import EHR from "layouts/EHR";
//import EHRRecord from "layouts/ehr/record";
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
import ProtectedRoute from "examples/ProtectedRoute";
import { StaffRoleEnum } from "constants/StaffRoleEnum";

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
    component: (
      <ProtectedRoute
        authorizedRoles={[StaffRoleEnum.ALL]}
        forHeadsOnly={false}
      >
        <Home />
      </ProtectedRoute>
    ),
  },
  {
    type: "collapse",
    name: "Account",
    key: "account",
    icon: <Icon fontSize="small">account_circle</Icon>,
    route: "/account",
    authorizedRoles: [StaffRoleEnum.ALL],
    component: (
      <ProtectedRoute
        authorizedRoles={[StaffRoleEnum.ALL]}
        forHeadsOnly={false}
      >
        <Account />
      </ProtectedRoute>
    ),
  },
  {
    type: "collapse",
    name: "Outpatient",
    key: "outpatient",
    icon: <Icon fontSize="small">local_hospital</Icon>,
    route: "/outpatient",
    authorizedRoles: [StaffRoleEnum.ALL],
    component: (
      <ProtectedRoute
        authorizedRoles={[StaffRoleEnum.ALL]}
        forHeadsOnly={false}
      >
        <Outpatient />
      </ProtectedRoute>
    ),
  },
  {
    type: "collapse",
    name: "Inpatient",
    key: "inpatient",
    icon: <Icon fontSize="small">bed</Icon>,
    route: "/inpatient",
    authorizedRoles: [StaffRoleEnum.ALL],
    component: (
      <ProtectedRoute
        authorizedRoles={[StaffRoleEnum.ALL]}
        forHeadsOnly={false}
      >
        <Inpatient />,
      </ProtectedRoute>
    ),
  },
  {
    type: "collapse",
    name: "EHR",
    key: "ehr",
    icon: <Icon fontSize="small">receipt_long</Icon>,
    route: "/ehr",
    authorizedRoles: [StaffRoleEnum.ALL],
    component: (
      <ProtectedRoute
        authorizedRoles={[StaffRoleEnum.ALL]}
        forHeadsOnly={false}
      >
        <EHR />
      </ProtectedRoute>
    ),
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
    authorizedRoles: [StaffRoleEnum.DOCTOR],
    component: (
      <ProtectedRoute
        authorizedRoles={[StaffRoleEnum.DOCTOR]}
        forHeadsOnly={true}
      >
        <Administration />
      </ProtectedRoute>
    ),
  },
  {
    name: "Staff Management",
    key: "staffmanagement",
    route: "/administration/staff-management",
    component: (
      <ProtectedRoute
        authorizedRoles={[StaffRoleEnum.ALL]}
        forHeadsOnly={false}
      >
        <StaffManagement />
      </ProtectedRoute>
    ),
  },
  {
    name: "Facility Management",
    key: "facilitymanagement",
    route: "/administration/facility-management",
    component: (
      <ProtectedRoute
        authorizedRoles={[StaffRoleEnum.ALL]}
        forHeadsOnly={false}
      >
        <FacilityManagement />
      </ProtectedRoute>
    ),
  },
  {
    type: "collapse",
    name: "Manpower",
    key: "manpower",
    icon: <Icon fontSize="small">group</Icon>,
    route: "/manpower",
    authorizedRoles: [StaffRoleEnum.ALL],
    component: (
      <ProtectedRoute
        authorizedRoles={[StaffRoleEnum.ALL]}
        forHeadsOnly={false}
      >
        <Manpower />
      </ProtectedRoute>
    ),
  },
  {
    name: "Rostering",
    key: "rostering",
    route: "/manpower/rostering",
    component: (
      <ProtectedRoute
        authorizedRoles={[StaffRoleEnum.ALL]}
        forHeadsOnly={false}
      >
        <CalendarRoster />
      </ProtectedRoute>
    ),
  },
  {
    name: "Shift Allocation",
    key: "shift-allocation",
    route: "/manpower/rostering/shifts",
    component: (
      <ProtectedRoute
        authorizedRoles={[StaffRoleEnum.ALL]}
        forHeadsOnly={false}
      >
        <Rostering />
      </ProtectedRoute>
    ),
  },
  {
    name: "ViewAllLeaves",
    key: "ViewAllLeaves",
    route: "/manpower/viewAllLeaves",
    component: (
      <ProtectedRoute
        authorizedRoles={[StaffRoleEnum.ALL]}
        forHeadsOnly={false}
      >
        <ViewAllLeaves />
      </ProtectedRoute>
    ),
  },
  {
    name: "CreateLeave",
    key: "CreateLeave",
    route: "/manpower/createLeave",
    component: (
      <ProtectedRoute
        authorizedRoles={[StaffRoleEnum.ALL]}
        forHeadsOnly={false}
      >
        <CreateLeave />
      </ProtectedRoute>
    ),
  },
  {
    name: "Leave Approval",
    key: "leaveApproval",
    route: "/manpower/leaveApproval",
    component: (
      <ProtectedRoute
        authorizedRoles={[StaffRoleEnum.ALL]}
        forHeadsOnly={false}
      >
        <LeaveApproval />
      </ProtectedRoute>
    ),
  },
  {
    type: "collapse",
    name: "Finance",
    key: "finance",
    icon: <Icon fontSize="small">attach_money</Icon>,
    route: "/finance",
    authorizedRoles: [StaffRoleEnum.ALL],
    component: (
      <ProtectedRoute
        authorizedRoles={[StaffRoleEnum.ALL]}
        forHeadsOnly={false}
      >
        <Finance />
      </ProtectedRoute>
    ),
  },
  {
    name: "Error",
    key: "error",
    route: "*",
    component: (
      <ProtectedRoute
        authorizedRoles={[StaffRoleEnum.ALL]}
        forHeadsOnly={false}
      >
        <ErrorPage />
      </ProtectedRoute>
    ),
  },
];

export default routes;
