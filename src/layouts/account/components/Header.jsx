import { IMAGE_SERVER } from "constants/RestEndPoint";

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";

import { useSelector } from "react-redux";
import { selectStaff } from "../../../store/slices/staffSlice";
import ResetPasswordModal from "./ResetPasswordModal";

function Header({ children }) {
  const staff = useSelector(selectStaff);

  return (
    <MDBox position="relative" mb={5}>
      <MDBox position="relative" minHeight="5rem" />
      <Card
        sx={{
          position: "relative",
          mt: -8,
          mx: 3,
          py: 2,
          px: 2,
        }}
      >
        <Grid container spacing={5} alignItems="center" width="100%">
          <Grid item justifyContent="center">
            <MDAvatar
              src={
                IMAGE_SERVER + "/images/id/" + staff.profilePicture?.imageLink
              }
              alt="profile-image"
              size="xxl"
              shadow="xxl"
            />
          </Grid>
          <Grid item xs>
            <MDBox height="100%" mt={0.5} lineHeight={1}>
              <MDTypography variant="h5" fontWeight="medium">
                {staff.firstname} {staff.lastname}
              </MDTypography>
            </MDBox>
          </Grid>
          <Grid item>
            <MDBox
              height="100%"
              mt={0.5}
              lineHeight={1}
              style={{
                flexGrow: 1,
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <MDTypography variant="h5" fontWeight="medium">
                <ResetPasswordModal username={staff.username} />
              </MDTypography>
            </MDBox>
          </Grid>
        </Grid>
        {children}
      </Card>
    </MDBox>
  );
}

// Setting default props for the Header
Header.defaultProps = {
  children: "",
};

// Typechecking props for the Header
Header.propTypes = {
  children: PropTypes.node,
};

export default Header;
