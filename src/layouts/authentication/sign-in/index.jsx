import { useEffect } from "react";

// @mui material components
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Authentication layout components
import BasicLayout from "layouts/authentication/components/BasicLayout";

// Images
import bgImage from "assets/images/loginbgimage2.png";

import Logo from "../components/Logo/Logo";
import { Grid, TextField } from "@mui/material";
import useInput from "hooks/use-input";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { hasExpired } from "utility/Utility";
import jwt_decode from "jwt-decode";
import { login, postLogin, logout } from "../../../store/slices/staffSlice";
import { authApi } from "../../../api/Api";
import { displayMessage } from "../../../store/slices/snackbarSlice";

function SignInPage() {
  const {
    value: enteredUsername,
    isValid: enteredUsernameIsValid,
    hasError: usernameInputHasError,
    valueChangeHandler: usernameChangeHandler,
    inputBlurHandler: usernameBlurHandler,
    reset: resetUsernameInput,
  } = useInput((value) => value.trim() !== "" && value.length >= 6, "");
  const {
    value: enteredPassword,
    isValid: enteredPasswordIsValid,
    hasError: passwordInputHasError,
    valueChangeHandler: passwordChangeHandler,
    inputBlurHandler: passwordBlurHandler,
    reset: resetPasswordInput,
  } = useInput((value) => value.trim() !== "" && value.length >= 6, "");
  const navigate = useNavigate();
  const reduxDispatch = useDispatch();

  useEffect(() => {
    if (localStorage.getItem("isLoggedIn")) {
      const decodedAccessToken = jwt_decode(
        localStorage.getItem("accessToken")
      );
      const hasAccessTokenExpired = hasExpired(
        new Date(decodedAccessToken.exp * 1000)
      );
      if (hasAccessTokenExpired) {
        reduxDispatch(logout());
        navigate("/");
      } else {
        const fetchData = async () => {
          const details = {
            username: localStorage.getItem("staffUsername"),
          };
          const userResponse = reduxDispatch(postLogin(details));
          await userResponse.unwrap();
        };
        fetchData().catch(console.error).then(navigate("/home"));
      }
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!enteredUsernameIsValid || !enteredPasswordIsValid) {
      if (!enteredUsernameIsValid) {
        reduxDispatch(
          displayMessage({
            color: "warning",
            icon: "notification",
            title: "Error Encountered",
            content: "Username should be 6 characters or more",
          })
        );
      } else {
        reduxDispatch(
          displayMessage({
            color: "warning",
            icon: "notification",
            title: "Error Encountered",
            content: "Password should be 6 characters or more",
          })
        );
      }
      return;
    } else {
      try {
        const response = reduxDispatch(
          login({ username: enteredUsername, password: enteredPassword })
        );
        const data = await response.unwrap();
        authApi.updateAccessToken(data);
        const details = {
          username: enteredUsername,
        };
        const userResponse = reduxDispatch(postLogin(details));
        await userResponse.unwrap();
        reduxDispatch(
          displayMessage({
            color: "success",
            icon: "notification",
            title: "Successfully Logged In!",
            content: "Welcome To Heart2Hub",
          })
        );

        resetUsernameInput();
        resetPasswordInput();
        if (localStorage.getItem("isLoggedIn")) {
          navigate("/home");
        }
      } catch (exception) {
        reduxDispatch(
          displayMessage({
            color: "warning",
            icon: "notification",
            title: "Error Encountered",
            content: exception.message,
          })
        );
      }
    }
  };

  return (
    <BasicLayout image={bgImage}>
      <Grid
        container
        spacing={3}
        justifyContent="center"
        alignItems="center"
        height="100%"
      >
        <Grid item xs={6}>
          <Logo />
        </Grid>
        <Grid item xs={3}>
          <Card>
            <MDBox
              variant="gradient"
              bgColor="info"
              borderRadius="lg"
              coloredShadow="info"
              mx={2}
              mt={-3}
              p={2}
              mb={1}
              textAlign="center"
            >
              <MDTypography variant="h4" fontWeight="medium" color="white">
                Welcome
              </MDTypography>
            </MDBox>
            <MDBox pt={4} pb={3} px={3}>
              <MDBox component="form" role="form" onSubmit={handleSubmit}>
                <TextField
                  margin="normal"
                  required
                  id="username"
                  label="Username"
                  name="username"
                  autoFocus
                  fullWidth
                  value={enteredUsername}
                  onBlur={usernameBlurHandler}
                  onChange={usernameChangeHandler}
                  error={usernameInputHasError}
                />
                <TextField
                  margin="normal"
                  required
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  fullWidth
                  value={enteredPassword}
                  onBlur={passwordBlurHandler}
                  onChange={passwordChangeHandler}
                  error={passwordInputHasError}
                />
                <MDBox mt={4} mb={1}>
                  <MDButton
                    variant="gradient"
                    color="info"
                    type="submit"
                    fullWidth
                  >
                    sign in
                  </MDButton>
                </MDBox>
              </MDBox>
            </MDBox>
          </Card>
        </Grid>
      </Grid>
    </BasicLayout>
  );
}

export default SignInPage;
