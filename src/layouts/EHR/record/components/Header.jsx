import { useState, useEffect } from "react";

import PropTypes from "prop-types";

import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";

import { useSelector } from "react-redux";
import { selectEHRRecord } from "../../../../store/slices/ehrSlice";
import { imageServerApi } from "api/Api";

function Header({ children }) {
  const ehrRecord = useSelector(selectEHRRecord);

  // const [profileImage, setProfileImage] = useState(null);

  // const handleGetProfileImage = async () => {
  //   if (ehrRecord.electronicHealthRecordId !== null) {
  //     const response = await imageServerApi.getImageFromImageServer(
  //       "id",
  //       ehrRecord?.electronicHealthRecordId
  //     );
  //     const imageURL = URL.createObjectURL(response.data);
  //     setProfileImage(imageURL);
  //   }
  // };

  useEffect(() => {
    console.log(ehrRecord);
    // handleGetProfileImage();
  }, [ehrRecord]);

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
              src={ehrRecord?.profilePicture}
              // src={profileImage}
              alt="profile-image"
              size="xxl"
              shadow="xxl"
            />
          </Grid>
          <Grid item xs>
            <MDBox height="100%" mt={0.5} lineHeight={1}>
              <MDTypography variant="h5" fontWeight="medium">
                {ehrRecord?.firstname} {ehrRecord?.lastname}
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
            ></MDBox>
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
