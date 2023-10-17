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
import { Divider } from "@mui/material";
import ProfileInfoCard from "examples/Cards/InfoCards/ProfileInfoCard";

function Header({ children }) {
  const ehrRecord = useSelector(selectEHRRecord);

  const [profileImage, setProfileImage] = useState(null);

  const handleGetProfileImage = async () => {
    if (ehrRecord.profilePicture !== null) {
      const response = await imageServerApi.getImageFromImageServer(
        "id",
        ehrRecord?.profilePicture
      );
      const imageURL = URL.createObjectURL(response.data);
      setProfileImage(imageURL);
    }
  };

  useEffect(() => {
    console.log(ehrRecord);
    handleGetProfileImage();
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
              // src={ehrRecord?.profilePicture}
              src={profileImage}
              alt="profile-image"
              size="xxl"
              shadow="xxl"
            />
          </Grid>
          <Grid item xs>
            <MDBox height="100%" mt={0.5} lineHeight={1}>
              <MDTypography variant="h5" fontWeight="medium">
                {ehrRecord?.firstName} {ehrRecord?.lastName}
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
        <Divider orientation="horizontal" sx={{ ml: -2, mr: 1 }} />
        <MDBox mt={3} mb={3}>
          <ProfileInfoCard
            title="patient EHR information:"
            info={{
              firstName: ehrRecord.firstName,
              lastName: ehrRecord.lastName,
              birthDate: ehrRecord.dateOfBirth.split(" ")[0],
              address: ehrRecord.address,
              contactNumber: ehrRecord.contactNumber,
            }}
            shadow={false}
          />
        </MDBox>
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
