// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import MDBadge from "components/MDBadge";
import { CheckBox } from "@mui/icons-material";

// Images
import team2 from "assets/images/team-2.jpg";
import team3 from "assets/images/team-3.jpg";
import team4 from "assets/images/team-4.jpg";

export default function data() {
  // const Staff = ({ image, name, email }) => (
  //   <MDBox display="flex" alignItems="center" lineHeight={1}>
  //     <MDAvatar src={image} name={name} size="sm" />
  //     <MDBox ml={2} lineHeight={1}>
  //       <MDTypography display="block" variant="button" fontWeight="medium">
  //         {name}
  //       </MDTypography>
  //       <MDTypography variant="caption">{email}</MDTypography>
  //     </MDBox>
  //   </MDBox>
  // );

  // const Designation = ({ role, department }) => (
  //   <MDBox lineHeight={1} textAlign="left">
  //     <MDTypography
  //       display="block"
  //       variant="caption"
  //       color="text"
  //       fontWeight="medium"
  //     >
  //       {role}
  //     </MDTypography>
  //     <MDTypography variant="caption">{department}</MDTypography>
  //   </MDBox>
  // );

  return {
    columns: [
      { Header: "id", accessor: "id", width: "5%" },
      { Header: "first name", accessor: "firstname", width: "12%" },
      { Header: "last name", accessor: "lastname", width: "10%" },
      { Header: "username", accessor: "username", width: "12%" },
      { Header: "password", accessor: "password", width: "12%" },
      { Header: "role", accessor: "role", width: "10%" },
      { Header: "department", accessor: "department", width: "18%" },
      { Header: "sub-department", accessor: "subdepartment", width: "15%" },
      { Header: "head", accessor: "head" },
    ],
    rows: [
      {
        id: 1,
        firstname: "Wen Jie",
        lastname: "Koh",
        username: "kohwenjie",
        password: "password",
        role: "DOCTOR",
        department: "ACCIDENT & EMERGENCY (A&E)",
        subdepartment: "A&E CLINIC 1",
        head: <CheckBox />,
      },
      {
        id: 2,
        firstname: "Elgin",
        lastname: "Chan",
        username: "elginchan",
        password: "password",
        role: "DOCTOR",
        department: "CARDIOLOGY",
        subdepartment: "CARDIO CLINIC 1",
        head: <CheckBox />,
      },
      {
        id: 3,
        firstname: "Ernest",
        lastname: "Chan",
        username: "ernestchan",
        password: "password",
        role: "NURSE",
        department: "INTENSIVE CARE UNIT (ICU)",
        subdepartment: "ICU WARD 2",
        head: <CheckBox />,
      },
    ],
  };
}
