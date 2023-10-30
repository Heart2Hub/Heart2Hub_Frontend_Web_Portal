import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Card, Grid, Divider } from "@mui/material";

import { useSelector } from "react-redux";
import { selectEHRRecord } from "../../../store/slices/ehrSlice";
import { imageServerApi } from "api/Api";

import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import MDBox from "components/MDBox";
import ProfileInfoCard from "examples/Cards/InfoCards/ProfileInfoCard";

function Header() {
  const ehrRecord = useSelector(selectEHRRecord);
  const {
    firstName,
    lastName,
    profilePicture,
    dateOfBirth,
    address,
    contactNumber,
  } = ehrRecord || {};

  const [profileImage, setProfileImage] = useState(null);

  const handleGetProfileImage = async () => {
    if (profilePicture) {
      const response = await imageServerApi.getImageFromImageServer(
        "id",
        profilePicture
      );
      const imageURL = URL.createObjectURL(response.data);
      setProfileImage(imageURL);
    }
  };

  useEffect(() => {
    handleGetProfileImage();
  }, [ehrRecord]);

  return (
    <MDBox position="relative" mb={5}>
      <MDBox position="relative" minHeight="5rem" />

      <Card sx={{ position: "relative", mt: -8, mx: 3, py: 2, px: 2 }}>
        <Grid container spacing={5}>
          {/* Left Side: Image and Name */}
          <Grid
            item
            sm={6}
            container
            justifyContent="center"
            alignItems="center"
            direction="column"
          >
            <MDAvatar
              src={profileImage}
              alt="profile-image"
              size="xxl"
              shadow="xxl"
              sx={{ height: "200px", width: "200px" }}
            />
            <MDTypography
              variant="h3"
              fontWeight="medium"
              sx={{ mt: 0.5, marginTop: "5%" }}
            >
              {firstName} {lastName}
            </MDTypography>
          </Grid>

          {/* Right Side: Details */}
          <Grid item sm={6}>
            <ProfileInfoCard
              title="patient EHR information:"
              info={{
                firstName,
                lastName,
                birthDate: dateOfBirth.split(" ")[0],
                address,
                contactNumber,
              }}
              shadow={false}
            />
          </Grid>
        </Grid>
        <Divider orientation="horizontal" sx={{ my: 2 }} />
      </Card>
    </MDBox>
  );
}

Header.propTypes = {
  children: PropTypes.node,
};

export default Header;
