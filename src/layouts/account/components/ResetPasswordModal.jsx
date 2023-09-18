import React, { useState } from "react";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import MDButton from "components/MDButton";
import MDBox from "components/MDBox";
import useInput from "hooks/use-input";
import { TextField } from "@mui/material";
import { useDispatch } from "react-redux";
import { displayMessage } from "../../../store/slices/snackbarSlice";
import { authApi } from "api/Api";
import { delay } from "../../../utility/Utility";
import { useNavigate } from "react-router-dom";
import { logout } from "../../../store/slices/staffSlice";
import MDTypography from "components/MDTypography";
import { South } from "@mui/icons-material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};
function ResetPasswordModal(props) {
  const reduxDispatch = useDispatch();
  const navigate = useNavigate();
  const currUsername = props.username;

  const [openModal, setOpenModal] = useState(false);
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => {
    setOpenModal(false);
    resetOldPasswordInput();
    resetOldPasswordCheckInput();
    resetNewPasswordInput();
    resetNewPasswordCheckInput();
  };

  const {
    value: enteredOldPassword,
    isValid: enteredOldPasswordIsValid,
    hasError: oldPasswordInputHasError,
    valueChangeHandler: oldPasswordChangeHandler,
    inputBlurHandler: oldPasswordBlurHandler,
    reset: resetOldPasswordInput,
  } = useInput((value) => value.trim() !== "" && value.length >= 6, "");
  const {
    value: enteredOldPasswordCheck,
    isValid: enteredOldPasswordCheckIsValid,
    hasError: oldPasswordCheckInputHasError,
    valueChangeHandler: oldPasswordCheckChangeHandler,
    inputBlurHandler: oldPasswordCheckBlurHandler,
    reset: resetOldPasswordCheckInput,
  } = useInput((value) => value.trim() === enteredOldPassword, "");
  const {
    value: enteredNewPassword,
    isValid: enteredNewPasswordIsValid,
    hasError: newPasswordInputHasError,
    valueChangeHandler: newPasswordChangeHandler,
    inputBlurHandler: newPasswordBlurHandler,
    reset: resetNewPasswordInput,
  } = useInput(
    (value) =>
      value.trim() !== "" && value.length >= 6 && value !== enteredOldPassword,
    ""
  );
  const {
    value: enteredNewPasswordCheck,
    isValid: enteredNewPasswordCheckIsValid,
    hasError: newPasswordCheckInputHasError,
    valueChangeHandler: newPasswordCheckChangeHandler,
    inputBlurHandler: newPasswordCheckBlurHandler,
    reset: resetNewPasswordCheckInput,
  } = useInput((value) => value.trim() === enteredNewPassword, "");

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    if (
      enteredOldPasswordIsValid &&
      enteredOldPasswordCheckIsValid &&
      enteredNewPasswordCheckIsValid &&
      enteredNewPasswordIsValid
    ) {
      //password checks are valid
      //send to backend
      try {
        const response = await authApi.changePassword(
          currUsername,
          enteredOldPassword,
          enteredNewPassword
        );
        console.log(response);

        //password pass backend
        reduxDispatch(
          displayMessage({
            color: "success",
            icon: "notification",
            title: "Password Change Success!",
            content:
              "Please re-login with your new credentials after the refresh",
          })
        );

        await delay(3000);
        reduxDispatch(logout());
        navigate("/");
      } catch (exception) {
        //password fail to pass backend
        reduxDispatch(
          displayMessage({
            color: "warning",
            icon: "notification",
            title: "Password Change Failed!",
            content: "Error: " + exception.response.data,
          })
        );
      }

      //password checks fail
    } else {
      if (enteredOldPassword === enteredNewPassword) {
        // TODO need check that old and new passwords are not the same
        reduxDispatch(
          displayMessage({
            color: "warning",
            icon: "notification",
            title: "Password Change Failed!",
            content: "New Password inputted is the same as the old.",
          })
        );
      } else if (enteredOldPassword.length < 6) {
        reduxDispatch(
          displayMessage({
            color: "warning",
            icon: "notification",
            title: "Password Change Failed!",
            content: "Old Password inputted too short (minimum 6 characters).",
          })
        );
      } else if (enteredNewPassword.length < 6) {
        reduxDispatch(
          displayMessage({
            color: "warning",
            icon: "notification",
            title: "Password Change Failed!",
            content: "New Password inputted too short (minimum 6 characters).",
          })
        );
      } else {
        reduxDispatch(
          displayMessage({
            color: "warning",
            icon: "notification",
            title: "Password Change Failed!",
            content: "Passwords entered are not valid.",
          })
        );
      }
    }
  };

  return (
    <>
      <MDBox p={2} mt="auto">
        <MDButton variant="gradient" color="primary" onClick={handleOpenModal}>
          Change Password
        </MDButton>
      </MDBox>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={openModal}
        onClose={handleCloseModal}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={openModal}>
          <MDBox
            component="form"
            role="form"
            onSubmit={onSubmitHandler}
            sx={style}
          >
            <MDTypography
              id="transition-modal-title"
              variant="h6"
              component="h2"
            >
              Change Password
            </MDTypography>
            <Typography id="transition-modal-description" sx={{ mt: 2 }}>
              Please fill up the following form:
            </Typography>
            <TextField
              margin="normal"
              required
              id="old password"
              type="password"
              label="Old Password"
              name="old password"
              fullWidth
              value={enteredOldPassword}
              onBlur={oldPasswordBlurHandler}
              onChange={oldPasswordChangeHandler}
              error={oldPasswordInputHasError}
            />
            <TextField
              margin="normal"
              required
              id="old password check"
              type="password"
              label="Re-enter Old Password"
              name="old password check"
              fullWidth
              value={enteredOldPasswordCheck}
              onBlur={oldPasswordCheckBlurHandler}
              onChange={oldPasswordCheckChangeHandler}
              error={oldPasswordCheckInputHasError}
            />
            <TextField
              margin="normal"
              required
              id="new password"
              type="password"
              label="New Password"
              name="new password"
              fullWidth
              value={enteredNewPassword}
              onBlur={newPasswordBlurHandler}
              onChange={newPasswordChangeHandler}
              error={newPasswordInputHasError}
            />
            <TextField
              margin="normal"
              required
              id="new password check"
              type="password"
              label="Re-enter New Password"
              name="new password check"
              fullWidth
              value={enteredNewPasswordCheck}
              onBlur={newPasswordCheckBlurHandler}
              onChange={newPasswordCheckChangeHandler}
              error={newPasswordCheckInputHasError}
            />
            <MDBox sx={{ alignItems: "center", justifyContent: "center" }}>
              <MDButton
                variant="gradient"
                color="primary"
                type="submit"
                fullWidth
                sx={{ marginTop: "10px" }}
              >
                <MDTypography variant="h4" fontWeight="medium" color="white">
                  Confirm
                </MDTypography>
              </MDButton>
            </MDBox>
          </MDBox>
        </Fade>
      </Modal>
    </>
  );
}

export default ResetPasswordModal;
