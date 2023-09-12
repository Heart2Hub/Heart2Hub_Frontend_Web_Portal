import { Button } from "@mui/material";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function ErrorPage() {
  const navigate = useNavigate();

  const [buttonClicked, setButtonClicked] = useState(false);

  useEffect(() => {
    return () => {
      if (!buttonClicked) {
        navigate("/error");
      }
    };
  }, [navigate, buttonClicked]);

  const handleReroute = () => {
    setButtonClicked(true);
    navigate("/home");
  };

  return (
    <>
      <DashboardLayout>
        ERROR 404 Oops looks like theres no where to go Click here to return to
        the login page
        <Button onClick={handleReroute}>Click me</Button>
      </DashboardLayout>
    </>
  );
}

export default ErrorPage;
