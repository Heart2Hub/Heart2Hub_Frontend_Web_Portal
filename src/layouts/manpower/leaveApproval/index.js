// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "examples/Tables/DataTable";
import React, { useState, useEffect } from 'react';

import axios from 'axios';

// Data
import authorsTableData from "layouts/tables/data/authorsTableData";
import projectsTableData from "layouts/tables/data/projectsTableData";
import staffTableData from "layouts/administration/staff-management/data/staffTableData";

function LeaveApproval() {
    const { columns, rows } = staffTableData();

  //   const [leaves, setLeaves] = useState([]);

  //   const getAllManagedLeaves = async () => {
  //     const response = await axios.get(`http://localhost:8080/api/managedLeave/3`, {
  //         headers: {
  //             'Authorization': `Bearer ${'eyJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6WyJBRE1JTiJdLCJzdWIiOiJzdGFmZjMiLCJpYXQiOjE2OTQ3NjU5NzUsImV4cCI6MTY5NTM3MDc3NX0.7O_UNC0pqfOEcBTKLpJdKU0RIdhafEGD2HRmkhfdcMQ'}`
  //         }
  //     });
  //     setLeaves(response.data);
  // }

//     const [leave, setLeaves] = useState([]);

//     useEffect(() => {
//       fetch('/managedLeave/{staffid}') // Replace with the actual backend API URL
//         .then((response) => response.json())
//         .then((data) => setLeaves(data));
//     }, []);
// useEffect(() => {
//   getAllManagedLeaves();
// })

//     return (
//         <div>
//           <h1>Leaves</h1>
//           <ul>
//             {leaves.map((item) => (
//               <li key={leaves.leaveId}>{leaves.leaveTypeEnum}</li>
//             ))}
//           </ul>
//         </div>
//       );
    //         }
  return (
    
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDTypography variant="h6" color="white">
                  Managed Leaves
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
                <DataTable canSearch={true} table={{ columns, rows }} />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default LeaveApproval;

// import React, { useState, useEffect } from 'react';

// function App() {
//   const [items, setItems] = useState([]);

//   useEffect(() => {
//     fetch('/api/items') // Replace with the actual backend API URL
//       .then((response) => response.json())
//       .then((data) => setItems(data));
//   }, []);

//   return (
//     <div>
//       <h1>Items</h1>
//       <ul>
//         {items.map((item) => (
//           <li key={item.id}>{item.name}</li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// export default App;