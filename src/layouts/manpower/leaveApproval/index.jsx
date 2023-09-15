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

import { useSelector } from "react-redux";
import { selectStaff } from "../../../store/slices/staffSlice";
import { leaveApi } from "api/Api";

function LeaveApproval() {

    const { columns, rows } = staffTableData();

    const staff = useSelector(selectStaff);
    console.log(staff);

    const staffId = 3;
    const [leaves, setLeaves] = useState([]);

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
  
    
    const getResponse = async () => {
    
      leaveApi.getAllManagedLeaves(3)
        .then((response) => {
         console.log(response);
        })
        .catch((error) => {
          console.log(error);
        });

    };

    useEffect(() => {
      getResponse();
}, []);


    // const response = leaveApi.getAllManagedLeaves(staffId);
    // console.log(response);
    // useEffect(() => {
      
    //     .then((response) => {
    //       setData(response.data);
    //       setLoading(false);
    //     })
    //     .catch((error) => {
    //       console.error('Error fetching data:', error);
    //       setLoading(false);
    //     });
    // }, []);

  //   const getAllManagedLeaves = async () => {
  //     const response = await axios.get(`http://localhost:8080/api/managedLeave/${staffId}`, {
  //         headers: {
  //             'Authorization': `Bearer ${accessToken}`
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

    return (
       <table>
    <tr>
    <th>First Name</th>
    <th>Last Name</th>
    <th>Description</th>
</tr>
{data}
</table>
      );
            }
//   return (
    
//     <DashboardLayout>
//       <DashboardNavbar />
//       <MDBox pt={6} pb={3}>
//         <Grid container spacing={6}>
//           <Grid item xs={12}>
//             <Card>
//               <MDBox
//                 mx={2}
//                 mt={-3}
//                 py={3}
//                 px={2}
//                 variant="gradient"
//                 bgColor="info"
//                 borderRadius="lg"
//                 coloredShadow="info"
//               >
//                 <MDTypography variant="h6" color="white">
//                   Managed Leaves
//                 </MDTypography>
//               </MDBox>
//               <MDBox pt={3}>
//                 <DataTable canSearch={true} table={{ columns, rows }} />
//               </MDBox>
//             </Card>
//           </Grid>
//         </Grid>
//       </MDBox>
//     </DashboardLayout>
//   );
// }

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