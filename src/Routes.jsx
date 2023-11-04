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
import EHRRecord from "layouts/EHR/record/index.jsx";
//import EHRRecord from "layouts/ehr/record";
import Administration from "layouts/administration";
import Manpower from "layouts/manpower";
import Finance from "layouts/finance";
import StaffManagement from "layouts/administration/staff-management";
import FacilityManagement from "layouts/administration/facility-management";
import FacilityBooking from "layouts/administration/facility-booking";
import Home from "layouts/home";
import Account from "layouts/account";
import ErrorPage from "layouts/error";
import Rostering from "layouts/manpower/rostering/ShiftOverallRoster";
import CalendarRoster from "layouts/manpower/rostering/CalendarRoster";
import ViewAllLeaves from "layouts/manpower/leaveApplication/ViewAllLeaves";
import CreateLeave from "layouts/manpower/leaveApplication/CreateLeave";
import Subsidy from "layouts/finance/subsidy";
import Invoice from "layouts/finance/invoice";
import Pharmacy from "layouts/pharmacy";

import LeaveApproval from "layouts/manpower/leaveApproval";
import ProtectedRoute from "examples/ProtectedRoute";
import { StaffRoleEnum } from "constants/StaffRoleEnum";
import ConsumableEquipmentManagement from "layouts/administration/inventory-management/consumable-equipment";
import InventoryManagement from "layouts/administration/inventory-management";
import MedicationManagement from "layouts/pharmacy/medication-management";
import ServiceManagement from "layouts/administration/inventory-management/service-management";

const ALL_EXCEPT_PHARMACIST = [
  StaffRoleEnum.ADMIN,
  StaffRoleEnum.DOCTOR,
  StaffRoleEnum.NURSE,
  StaffRoleEnum.DIAGNOSTIC_RADIOGRAPHERS,
  StaffRoleEnum.DIETITIANS,
  StaffRoleEnum.OCCUPATIONAL_THERAPISTS,
  StaffRoleEnum.MEDICAL_LABORATORY_TECHNOLOGISTS,
  StaffRoleEnum.PHYSIOTHERAPISTS,
  StaffRoleEnum.PODIATRISTS,
  StaffRoleEnum.PSYCHOLOGISTS,
  StaffRoleEnum.PROSTHETISTS,
  StaffRoleEnum.ORTHOTISTS,
  StaffRoleEnum.RADIATION_THERAPISTS,
  StaffRoleEnum.RESPIRATORY_THERAPISTS,
  StaffRoleEnum.SPEECH_THERAPISTS,
  StaffRoleEnum.AUDIOLOGISTS,
  StaffRoleEnum.MEDICAL_SOCIAL_WORKERS,
  StaffRoleEnum.ORTHOPTISTS,
];

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
        authorizedUnits={"ALL"}
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
        authorizedUnits={"ALL"}
      >
        <Account />
      </ProtectedRoute>
    ),
  },
  {
    type: "collapse",
    name: "Administration",
    key: "administration",
    icon: <Icon fontSize="small">build</Icon>,
    route: "/administration",
    authorizedRoles: [StaffRoleEnum.ALL],
    component: (
      <ProtectedRoute
        authorizedRoles={[StaffRoleEnum.ALL]}
        forHeadsOnly={false}
        authorizedUnits={"ALL"}
      >
        <Administration />
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
        authorizedUnits={"ALL"}
      >
        <EHR />
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
        authorizedUnits={"ALL"}
      >
        <Finance />
      </ProtectedRoute>
    ),
  },
  {
    type: "collapse",
    name: "Inpatient",
    key: "inpatient",
    icon: <Icon fontSize="small">bed</Icon>,
    route: "/inpatient",
    authorizedRoles: ALL_EXCEPT_PHARMACIST,
    component: (
      <ProtectedRoute
        authorizedRoles={ALL_EXCEPT_PHARMACIST}
        forHeadsOnly={false}
        authorizedUnits={"ALL"}
      >
        <Inpatient />,
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
        authorizedUnits={"ALL"}
      >
        <Manpower />
      </ProtectedRoute>
    ),
  },
  {
    type: "collapse",
    name: "Outpatient",
    key: "outpatient",
    icon: <Icon fontSize="small">local_hospital</Icon>,
    route: "/outpatient",
    authorizedRoles: ALL_EXCEPT_PHARMACIST,
    component: (
      <ProtectedRoute
        authorizedRoles={ALL_EXCEPT_PHARMACIST}
        forHeadsOnly={false}
        authorizedUnits={"DEPARTMENT"}
      >
        <Outpatient />
      </ProtectedRoute>
    ),
  },
  {
    type: "collapse",
    name: "Pharmacy",
    key: "pharmacy",
    icon: <Icon fontSize="small">local_pharmacy</Icon>,
    route: "/pharmacy",
    authorizedRoles: [StaffRoleEnum.PHARMACIST, StaffRoleEnum.ADMIN],
    component: (
      <ProtectedRoute
        authorizedRoles={[StaffRoleEnum.PHARMACIST, StaffRoleEnum.ADMIN]}
        forHeadsOnly={false}
        authorizedUnits={"DEPARTMENT"}
      >
        <Pharmacy />
      </ProtectedRoute>
    ),
  },

  // {
  //   type: "collapse",
  //   name: "Pharmacy",
  //   key: "pharmacy",
  //   icon: <Icon fontSize="small">medication</Icon>,
  //   route: "/pharmacy",
  //   authorizedRoles: [StaffRoleEnum.ALL],
  //   component: (
  //     <ProtectedRoute
  //       authorizedRoles={[StaffRoleEnum.ALL]}
  //       forHeadsOnly={false}
  //     >
  //       <Pharmacy />
  //     </ProtectedRoute>
  //   ),
  // },

  {
    name: "EHR",
    key: "ehr",
    icon: <Icon fontSize="small">receipt_long</Icon>,
    route: "/ehr/ehrRecord",
    component: <EHRRecord />,
  },

  {
    name: "Staff Management",
    key: "staffmanagement",
    route: "/administration/staff-management",
    component: (
      <ProtectedRoute
        authorizedRoles={[StaffRoleEnum.ADMIN]}
        forHeadsOnly={false}
        authorizedUnits={"ALL"}
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
        authorizedUnits={"ALL"}
      >
        <FacilityManagement />
      </ProtectedRoute>
    ),
  },
  {
    name: "Facility Booking",
    key: "facilitybooking",
    route: "/administration/facility-booking",
    component: (
      <ProtectedRoute
        authorizedRoles={[StaffRoleEnum.ALL]}
        forHeadsOnly={false}
        authorizedUnits={"ALL"}
      >
        <FacilityBooking />
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
        authorizedUnits={"ALL"}
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
        forHeadsOnly={true}
        authorizedUnits={"ALL"}
      >
        <Rostering />
      </ProtectedRoute>
    ),
  },
  {
    name: "ViewAllLeaves",
    key: "ViewAllLeaves",
    route: "/manpower/leaveApplication",
    component: (
      <ProtectedRoute
        authorizedRoles={[StaffRoleEnum.ALL]}
        forHeadsOnly={false}
        authorizedUnits={"ALL"}
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
        authorizedUnits={"ALL"}
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
        forHeadsOnly={true}
        authorizedUnits={"ALL"}
      >
        <LeaveApproval />
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
        authorizedUnits={"ALL"}
      >
        <ErrorPage />
      </ProtectedRoute>
    ),
  },
  {
    name: "Inventory Management",
    key: "inventorymanagement",
    route: "/administration/inventory-management",
    component: (
      <ProtectedRoute
        authorizedRoles={[StaffRoleEnum.ADMIN]}
        forHeadsOnly={false}
        authorizedUnits={"ALL"}
      >
        <InventoryManagement />
      </ProtectedRoute>
    ),
  },
  {
    name: "Consumable Equipment Management",
    key: "consumableequipmentmanagement",
    route:
      "/administration/inventory-management/consumable-equipment-management",
    component: (
      <ProtectedRoute
        authorizedRoles={[StaffRoleEnum.ADMIN]}
        forHeadsOnly={false}
        authorizedUnits={"ALL"}
      >
        <ConsumableEquipmentManagement />
      </ProtectedRoute>
    ),
  },
  // {
  //   name: "MedicationManagement",
  //   key: "medicationmanagement",
  //   route: "/pharmacy/medication-management",
  //   component: (
  //     <ProtectedRoute
  //       authorizedRoles={[StaffRoleEnum.ADMIN]}
  //       forHeadsOnly={false}
  //     >
  //       <MedicationManagement />
  //     </ProtectedRoute>
  //   ),
  // },
  {
    name: "Service Management",
    key: "serviceManagement",
    route: "/administration/inventory-management/service-management",
    component: (
      <ProtectedRoute
        authorizedRoles={[StaffRoleEnum.ALL]}
        forHeadsOnly={false}
        authorizedUnits={"ALL"}
      >
        <ServiceManagement />
      </ProtectedRoute>
    ),
  },
  {
    name: "Subsidy Management",
    key: "subsidy",
    route: "/finance/subsidy",
    component: (
      <ProtectedRoute
        authorizedRoles={[StaffRoleEnum.ALL]}
        forHeadsOnly={false}
        authorizedUnits={"ALL"}
      >
        <Subsidy />
      </ProtectedRoute>
    ),
  },
  {
    name: "Invoice Management",
    key: "invoice",
    route: "/finance/invoice",
    component: (
      <ProtectedRoute
        authorizedRoles={[StaffRoleEnum.ALL]}
        forHeadsOnly={false}
        authorizedUnits={"ALL"}
      >
        <Invoice />
      </ProtectedRoute>
    ),
  },
];

export default routes;
