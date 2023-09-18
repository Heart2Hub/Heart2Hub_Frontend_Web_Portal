// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import LeaveDataTable from "./leaveDataTable";
import React, { useState, useEffect } from 'react';

import axios from 'axios';
import moment from 'moment';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';

// Data
import authorsTableData from "layouts/tables/data/authorsTableData";
import projectsTableData from "layouts/tables/data/projectsTableData";
import staffTableData from "layouts/administration/staff-management/data/staffTableData";

import { useSelector } from "react-redux";
import { selectStaff } from "../../../store/slices/staffSlice";
import { leaveApi } from "api/Api";
import MDButton from "components/MDButton";

import ViewLeave from './viewLeave';

function LeaveApproval() {

  const staff = useSelector(selectStaff);
  console.log(staff);

  const staffId = 3;
  const [leaves, setLeaves] = useState([]);

  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState({});

  const [approvalStatus, setApprovalStatus] = useState(''); // Initialize with an initial status


  const getResponse = async () => {
    try {
      const response = await leaveApi.getAllManagedLeaves(3);
      console.log(response);
      setLeaves(response.data);
      setIsLoading(false);
      console.log("Row Object:", leaves[0]); // Add this line
    } catch (error) {
      console.error(error);
      setIsLoading(false); // Handle errors and mark loading as complete
    }
  };

  useEffect(() => {
    getResponse();
  }, []);

  const columns = [
    { Header: "Leave ID", accessor: "leaveId", width: "20%" },
    { Header: "Staff Name", accessor: "name", width: "20%" },
    { Header: "Start Date", accessor: "startDate", width: "20%" },
    { Header: "End Date", accessor: "endDate", width: "20%" },
    { Header: "Leave Type", accessor: "leaveType", width: "20%" },
    { Header: "Approval Status", accessor: "approvalStatus", width: "20%" },
    {
      Header: "View", accessor: "view", width: "20%", Cell: ({ row }) => {
        return (
          <MDBox p={2} mt="auto">
            <MDButton
              variant="gradient"
              color="primary"
              onClick={() => handleViewClick(row.original)}
            >
              View Details
            </MDButton>
          </MDBox>

        );
      },
    }

  ]
  const handleViewClick = (row) => {
    console.log('Selected Original Row Data:', row)
    setSelectedRowData(row);
    setIsModalOpen(true);
  };

  useEffect(() => {
    console.log('Selected Row Data:', selectedRowData);
  }, [selectedRowData]);

  // const rows = []
  const rows = leaves?.map((leave) => ({
    leaveId: leave.leaveId,
    name: leave.staff.firstname + ' ' + leave.staff.lastname,
    startDate: moment(leave.startDate, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY'),
    endDate: moment(leave.endDate, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY'),
    leaveType: leave.leaveTypeEnum,
    approvalStatus: leave.approvalStatusEnum,
  }));

  const handleApproval = (row) => {
    // Perform the approval logic
    // Update the approval status when needed
    setApprovalStatus(JSON.stringify(row.approvalStatus));
    console.log(approvalStatus);
  };

  const handleRejection = (row) => {
    // Perform the rejection logic
    // Update the approval status when needed
    setApprovalStatus(JSON.stringify(row.approvalStatus));
    console.log(approvalStatus);
  };

  // const [openModal, setOpenModal] = useState(false);
  // const handleOpenModal = () => setOpenModal(true);
  // const handleCloseModal = () => {
  //   setOpenModal(false);
  // };


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
                <LeaveDataTable canSearch={true} table={{ columns, rows }} />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
        <ViewLeave
          isOpen={isModalOpen}
          onRequestClose={() => setIsModalOpen(false)}
          rowData={selectedRowData}
          approvalStatus={approvalStatus}
        // onApproval={handleApproval}
        // onRejection={handleRejection}
        />
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