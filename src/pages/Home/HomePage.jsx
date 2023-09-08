import React from "react";
import { useDispatch } from "react-redux";
import { logout } from "../../store/slices/staffSlice";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const logoutHandler = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <div>
      <Button variant="contained" onClick={() => logoutHandler()}>
        Log Out
      </Button>
    </div>
  );
}

export default HomePage;
