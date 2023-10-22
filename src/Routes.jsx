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
import Pharmacy from "layouts/pharmacy";


import LeaveApproval from "layouts/manpower/leaveApproval";
import ProtectedRoute from "examples/ProtectedRoute";
import { StaffRoleEnum } from "constants/StaffRoleEnum";
import ConsumableEquipmentManagement from "layouts/administration/inventory-management/consumable-equipment";
import InventoryManagement from "layouts/administration/inventory-management";
import MedicationManagement from "layouts/pharmacy/medication-management";
import ServiceItemManagement from "layouts/administration/inventory-management/service-item-management";

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
    name: "Administration",
    key: "administration",
    icon: <Icon fontSize="small">build</Icon>,
    route: "/administration",
    authorizedRoles: [StaffRoleEnum.ALL],
    component: (
      <ProtectedRoute
        authorizedRoles={[StaffRoleEnum.ALL]}
        forHeadsOnly={false}
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
    name: "Pharmacy",
    key: "pharmacy",
    icon: <Icon fontSize="small">local_pharmacy</Icon>,
    route: "/pharmacy",
    authorizedRoles: [StaffRoleEnum.ALL],
    component: (
      <ProtectedRoute
        authorizedRoles={[StaffRoleEnum.ALL]}
        forHeadsOnly={false}
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
    name: "Facility Booking",
    key: "facilitybooking",
    route: "/administration/facility-booking",
    component: (
      <ProtectedRoute
        authorizedRoles={[StaffRoleEnum.ALL]}
        forHeadsOnly={false}
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
      <ProtectedRoute authorizedRoles={[StaffRoleEnum.ALL]} forHeadsOnly={true}>
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
      <ProtectedRoute authorizedRoles={[StaffRoleEnum.ALL]} forHeadsOnly={true}>
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
      >
        <InventoryManagement />
      </ProtectedRoute>
    ),
  },
  {
    name: "Consumable Equipment Management",
    key: "consumableequipmentmanagement",
    route: "/administration/inventory-management/consumable-equipment-management",
    component: (
      <ProtectedRoute
        authorizedRoles={[StaffRoleEnum.ADMIN]}
        forHeadsOnly={false}
      >
        <ConsumableEquipmentManagement />
      </ProtectedRoute>
    ),
  },
  {
    name: "MedicationManagement",
    key: "medicationmanagement",
    route: "/pharmacy/medication-management",
    component: (
      <ProtectedRoute
        authorizedRoles={[StaffRoleEnum.ADMIN]}
        forHeadsOnly={false}
      >
        <MedicationManagement />
      </ProtectedRoute>
    ),
  },
  {
    name: "Service Item Management",
    key: "serviceItemManagement",
    route: "/administration/inventory-management/service-item-management",
    component: (
      <ProtectedRoute
        authorizedRoles={[StaffRoleEnum.ALL]}
        forHeadsOnly={false}
      >
        <ServiceItemManagement />
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
      >
        <Subsidy />
      </ProtectedRoute>
    ),
  },
];

export default routes;
