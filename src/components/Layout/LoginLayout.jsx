import { Backdrop, Box, Toolbar } from "@mui/material";
import React, { useEffect, useState } from "react";
import bgImage1 from "../../assets/images/loginbgimage1.jpg";
import bgImage2 from "../../assets/images/loginbgimage2.png";

function LoginLayout(props) {
  const imageList = [bgImage1, bgImage2];
  const [imageIndex, setImageIndex] = useState(0);
  const styles = {
    paperContainer: {
      backgroundImage: `url(${imageList[imageIndex]})`,
      height: "100vh",
      width: "100vw",
      backgroundSize: "cover",
      backgroundPosition: "center",
    },
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setImageIndex((v) => {
        return v === 1 ? 0 : v + 1;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box sx={{ display: "flex" }}>
      <Box component="main" style={styles.paperContainer} sx={{ flexGrow: 1 }}>
        <Backdrop
          sx={{
            color: "#fff",
            zIndex: (theme) => theme.zIndex.drawer + 1,
          }}
          open={true}
        >
          {/* body */}

          <Toolbar />
          <main>{props.children}</main>
        </Backdrop>
      </Box>
    </Box>
  );
}

export default LoginLayout;
