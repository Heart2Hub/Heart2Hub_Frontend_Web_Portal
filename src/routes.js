/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

/** 
  All of the routes for the Material Dashboard 2 React are added here,
  You can add a new route, customize the routes and delete the routes here.

  Once you add a new route on this file it will be visible automatically on
  the Sidenav.

  For adding a new route you can follow the existing routes in the routes array.
  1. The `type` key with the `collapse` value is used for a route.
  2. The `type` key with the `title` value is used for a title inside the Sidenav. 
  3. The `type` key with the `divider` value is used for a divider between Sidenav items.
  4. The `name` key is used for the name of the route on the Sidenav.
  5. The `key` key is used for the key of the route (It will help you with the key prop inside a loop).
  6. The `icon` key is used for the icon of the route on the Sidenav, you have to add a node.
  7. The `collapse` key is used for making a collapsible item on the Sidenav that has other routes
  inside (nested routes), you need to pass the nested routes inside an array as a value for the `collapse` key.
  8. The `route` key is used to store the route location which is used for the react router.
  9. The `href` key is used to store the external links location.
  10. The `title` key is only for the item with the type of `title` and its used for the title text on the Sidenav.
  10. The `component` key is used to store the component of its route.
*/

// Material Dashboard 2 React layouts
import Dashboard from "layouts/dashboard";
import Tables from "layouts/tables";
import Billing from "layouts/billing";
import Notifications from "layouts/notifications";
import Profile from "layouts/profile";
import SignIn from "layouts/authentication/sign-in";
import SignUp from "layouts/authentication/sign-up";

// @mui icons
import Icon from "@mui/material/Icon";
import Outpatient from "layouts/outpatient";
import Inpatient from "layouts/inpatient";
import EHR from "layouts/EHR";
import Administration from "layouts/administration";
import Manpower from "layouts/manpower";
import Finance from "layouts/finance";
import StaffManagement from "layouts/administration/staff-management";

const routes = [
  {
    type: "collapse",
    name: "Outpatient",
    key: "outpatient",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/outpatient",
    component: <Outpatient />,
  },
  {
    type: "collapse",
    name: "Inpatient",
    key: "inpatient",
    icon: <Icon fontSize="small">table_view</Icon>,
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
  {
    type: "collapse",
    name: "Administration",
    key: "administration",
    icon: <Icon fontSize="small">notifications</Icon>,
    route: "/administration",
    component: <Administration />,
  },
  {
    name: "Staff Management",
    key: "staffmanagement",
    icon: <Icon fontSize="small">notifications</Icon>,
    route: "/administration/staff-management",
    component: <StaffManagement />,
  },
  {
    type: "collapse",
    name: "Manpower",
    key: "manpower",
    icon: <Icon fontSize="small">person</Icon>,
    route: "/manpower",
    component: <Manpower />,
  },
  {
    type: "collapse",
    name: "Finance",
    key: "finance",
    icon: <Icon fontSize="small">login</Icon>,
    route: "/finance",
    component: <Finance />,
  },
];

export default routes;
