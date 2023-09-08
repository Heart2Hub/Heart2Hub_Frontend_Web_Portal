import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import useInput from "../../hooks/use-input";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login, postLogin, logout } from "../../store/slices/staffSlice";
import { authApi } from "../../api/Api";
import { hasExpired } from "../../utility/Utility";
import jwt_decode from "jwt-decode";
import { Alert, Snackbar } from "@mui/material";

function LoginPage() {
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
    <>
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

      <Grid container spacing={2} sx={{ width: "100vw" }}>
        <Grid item xs>
          <Typography
            component="h1"
            variant="h1"
            sx={{
              marginTop: "40%",
              zIndex: 1,
              marginLeft: "20%",
              fontFamily: "Lato",
            }}
            color="white"
            textAlign="left"
          >
            Heart2Hub
          </Typography>
          <Typography
            component="h1"
            variant="h4"
            sx={{
              zIndex: 1,
              marginLeft: "20%",
              fontFamily: "Lato",
            }}
            color="lightBlue"
            textAlign="left"
          >
            Clinical Excellence, Digital Elegance.
          </Typography>
        </Grid>
        <Grid item xs={5}>
          <Box
            sx={{
              marginTop: "10%",
              top: "50%",
              marginRight: 20,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "white",
              borderColor: "black",
              borderRadius: 3,
              border: 1,
              boxShadow: "2px 2px 4px #8A795D",
              opacity: 0.9,
            }}
          >
            <Typography
              component="h1"
              variant="h4"
              sx={{ marginTop: "10%", zIndex: 1 }}
              color="black"
            >
              Sign In
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                autoFocus
                sx={{
                  width: "70%",
                }}
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
                sx={{
                  width: "70%",
                }}
                value={enteredPassword}
                onBlur={passwordBlurHandler}
                onChange={passwordChangeHandler}
                error={passwordInputHasError}
              />

              {/* Sign in Button */}
              <Button
                type="submit"
                variant="contained"
                sx={{ mt: 3, mb: 2, width: "70%" }}
              >
                Sign In
              </Button>
              {/* <Grid container>
                <Grid item xs>
                  <Link href="#" variant="body2">
                    Forgot password?
                  </Link>
                </Grid>
              </Grid> */}
            </Box>

            {/* Copyright */}
            <Typography
              variant="body2"
              color="text.secondary"
              align="center"
              sx={{ mt: 8, mb: 4 }}
            >
              {"Copyright © "}
              <Link color="inherit" href="">
                Heart2Hub
              </Link>{" "}
              {new Date().getFullYear()} {"."}
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </>
  );
}

export default LoginPage;
