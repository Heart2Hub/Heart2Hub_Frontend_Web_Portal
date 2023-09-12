import { useEffect, useState } from "react";

// @mui material components
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Authentication layout components
import BasicLayout from "layouts/authentication/components/BasicLayout";

// Images
import bgImage from "assets/images/loginbgimage2.png";

import Logo from "../components/Logo/Logo";
import { Alert, Box, Grid, Paper, Snackbar, TextField } from "@mui/material";
import useInput from "hooks/use-input";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { hasExpired } from "utility/Utility";
import jwt_decode from "jwt-decode";
import { login, postLogin, logout } from "../../../store/slices/staffSlice";
import { authApi } from "../../../api/Api";

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
  const dispatch = useDispatch();

  useEffect(() => {
    if (localStorage.getItem("isLoggedIn")) {
      const decodedAccessToken = jwt_decode(
        localStorage.getItem("accessToken")
      );
      const hasAccessTokenExpired = hasExpired(
        new Date(decodedAccessToken.exp * 1000)
      );
      if (hasAccessTokenExpired) {
        dispatch(logout());
        navigate("/");
      } else {
        const fetchData = async () => {
          const details = {
            username: localStorage.getItem("staffUsername"),
          };
          const userResponse = dispatch(postLogin(details));
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
        handleOpen({
          message: "Error: Username should be 6 characters or more",
          severity: "error",
        });
      } else {
        handleOpen({
          message: "Error: Password should be 6 characters or more",
          severity: "error",
        });
      }
      return;
    } else {
      try {
        const response = dispatch(
          login({ username: enteredUsername, password: enteredPassword })
        );
        const data = await response.unwrap();
        authApi.updateAccessToken(data);
        const details = {
          username: enteredUsername,
        };
        const userResponse = dispatch(postLogin(details));
        await userResponse.unwrap();
        handleOpen({ message: "Successfully Logged In", severity: "success" });

        resetUsernameInput();
        resetPasswordInput();
        if (localStorage.getItem("isLoggedIn")) {
          navigate("/home");
        }
      } catch (exception) {}
      handleOpen({ message: "Error: Unable to find user", severity: "error" });
    }
  };

  //For Snackbar
  const [snackBarState, setSnackBarState] = useState({
    open: false,
    vertical: "bottom",
    horizontal: "left",
    message: "",
    severity: "info",
  });
  const { vertical, horizontal, open, message, severity } = snackBarState;
  const handleOpen = (newSnackBarState) => {
    setSnackBarState({
      ...newSnackBarState,
      vertical: "bottom",
      horizontal: "left",
      open: true,
    });
  };
  const handleClose = () => {
    setSnackBarState({ ...snackBarState, open: false });
  };

  return (
    <BasicLayout image={bgImage}>
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity={severity} sx={{ width: "100%" }}>
          {message}
        </Alert>
      </Snackbar>

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
                  autoComplete="username"
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
                  autoComplete="current-password"
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
