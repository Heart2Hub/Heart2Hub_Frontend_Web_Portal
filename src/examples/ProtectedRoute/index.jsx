import React from "react";
import { useSelector } from "react-redux";
import { selectStaff } from "../../store/slices/staffSlice";
import { Navigate } from "react-router-dom";
import { StaffRoleEnum } from "../../constants/StaffRoleEnum";

function ProtectedRoute(props) {
  const staff = useSelector(selectStaff);
  const staffRole = staff.staffRoleEnum;
  const authorizedRoles = props.authorizedRoles;
  const forHeadsOnly = props.forHeadsOnly;
  const authorizedUnits = props.authorizedUnits;

  //check staff is logged in
  // if (staff.staffId !== "") {
  if (localStorage.getItem("isLoggedIn")) {
    //authorizedRoles is a list of StaffRoleEnums that can navigate to this page
    for (let index = 0; index < authorizedRoles.length; index++) {
      const authRole = authorizedRoles[index];
      //if all authorized just continue and
      //check role in authorized list
      if (authRole === StaffRoleEnum.ALL || staffRole === authRole) {
        if (forHeadsOnly) {
          if (staff.isHead) return props.children;
        } else {
          if (authorizedUnits === "ALL") {
            return props.children;
          } else if (authorizedUnits === "DEPARTMENT") {
            if (staff.unit.listOfFacilities) {
              return props.children;
            }
          } else if (authorizedUnits === "WARD") {
            if (staff.unit.capacity) {
              return props.children;
            }
          }
        }
      }
    }
    //user is logged in but has not rights to access the page
    //navigate to error page
    return <Navigate to="/error" replace />;
  }
  //else navigate to login page
  return <Navigate to="/" replace />;
}

export default ProtectedRoute;
