import MDSnackbar from "components/MDSnackbar";
import React from "react";

// redux
import { useDispatch, useSelector } from "react-redux";
import { selectSnackbar, closeMessage } from "../../store/slices/snackbarSlice";

function GlobalSnackbar() {
  const snackbar = useSelector(selectSnackbar);
  const reduxDispatch = useDispatch();

  const handleCloseSnackbar = () => {
    reduxDispatch(closeMessage());
  };
  return (
    <>
      <MDSnackbar
        color={snackbar.color}
        icon={snackbar.icon}
        title={snackbar.title}
        content={snackbar.content}
        dateTime={snackbar.dateTime}
        open={snackbar.isOpen}
        onClose={handleCloseSnackbar}
        close={handleCloseSnackbar}
      />
    </>
  );
}

export default GlobalSnackbar;
