import React, { useEffect, useState } from 'react'
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Paper from '@mui/material/Paper';
import SimpleBlogCard from "examples/Cards/BlogCards/SimpleBlogCard";
import CardContent from '@mui/material/CardContent';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import UpdateLeaveForm from "./UpdateLeaveForm";
import { useSelector } from "react-redux";
import { selectStaff } from "store/slices/staffSlice";
import { Link } from 'react-router-dom';
import MDAvatar from "components/MDAvatar";
import { IMAGE_SERVER } from "constants/RestEndPoint";




import { DataGrid } from '@mui/x-data-grid';


// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import axios from 'axios';
import moment from 'moment';

function ViewAllLeaves() {

	const staff = useSelector(selectStaff);

	console.log(staff);
	const [leaveList, setLeaveList] = useState([]);
	const [leaveBalance, setLeaveBalance] = useState([]);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [rowToDelete, setRowToDelete] = useState(null);
	const [isUpdateFormOpen, setIsUpdateFormOpen] = useState(false);
	const [selectedRow, setSelectedRow] = useState(null);
	const [openImageDialog, setOpenImageDialog] = useState(false);
	const [selectedImage, setSelectedImage] = useState('');

	const handleViewImage = (leave) => {
		if (leave.imageDocuments?.imageLink) {
			console.log("View Image button clicked.");
			setSelectedImage(`${IMAGE_SERVER}/images/id/${leave.imageDocuments.imageLink}`);
			setOpenImageDialog(true);
		}
	};

	const handleCloseImageDialog = () => {
		setOpenImageDialog(false);
		setSelectedImage('');
	};


	const handleDeleteDialogOpen = (rowId) => {
		setRowToDelete(rowId);
		setDeleteDialogOpen(true);
	};

	const handleDeleteDialogClose = () => {
		setRowToDelete(null);
		setDeleteDialogOpen(false);
	};

	const handleDeleteConfirm = () => {
		if (rowToDelete !== null) {
			handleDeleteLeave(rowToDelete);
			setRowToDelete(null);
			setDeleteDialogOpen(false);
		}
	};

	const handleUpdateDialogOpen = (row) => {
		setSelectedRow(row);
		setIsUpdateFormOpen(true);
	};

	const handleUpdateDialogClose = () => {
		setIsUpdateFormOpen(false);
		setSelectedRow(null);
	};

	const handleUpdateLeave = (updatedLeaveData) => {
		axios
			.put(`http://localhost:8080/leave/updateLeave/${selectedRow.leaveId}/${staff.staffId}`, updatedLeaveData, {
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${localStorage.getItem('accessToken')}`

				},
			})
			.then((response) => {
				console.log('Leave updated successfully:', response.data);
				getLeaveBalance();
				getLeaveList();
			})
			.catch((error) => {
				console.error('Error updating leave:', error);
			});

		handleUpdateDialogClose()
	};


	const getLeaveBalance = async () => {
		const response = await axios.get(`http://localhost:8080/leave/getLeaveBalance?staffId=${staff.staffId}`, {
			headers: {
				'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
			}
		});

		setLeaveBalance(response.data);
	}

	const getLeaveList = async () => {
		const response = await axios.get(`http://localhost:8080/leave/getAllStaffLeaves/${staff.staffId}`, {
			headers: {
				'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
			}
		});

		setLeaveList(response.data);
	}

	function formatDateToDdMmYyyy(inputDate) {
		try {
			const newDate = new Date(inputDate[0], inputDate[1] - 1, inputDate[2])
			return moment(newDate).format('DD/MM/YYYY')

		} catch (error) {
			console.error(`Error formatting date: ${error}`);
		}

		// Return the original date if parsing fails
		return inputDate;
	}

	function ApprovalTypeColor(approvalType) {
		switch (approvalType) {
			case "APPROVED":
				return "green";
			case "REJECTED":
				return "red";
			case "PENDING":
				return "gray";

		}
	}

	const columns = [
		{ field: 'leaveId', headerName: 'S/N', width: 100 },
		{ field: 'startDate', headerName: 'Start Date', width: 150, valueFormatter: (params) => formatDateToDdMmYyyy(params.value) },
		{ field: 'endDate', headerName: 'End Date (Not Inclusive)', width: 150, valueFormatter: (params) => formatDateToDdMmYyyy(params.value) },
		{ field: 'comments', headerName: 'Comments', width: 200 },
		{ field: 'leaveTypeEnum', headerName: 'Leave Type', width: 150 },
		{
			field: 'approvalStatusEnum',
			headerName: 'Approval Status',
			width: 150,
			renderCell: (params) => (
				<div>
					<div
						style={{
							backgroundColor: ApprovalTypeColor(params.value),
							width: '20px',
							height: '20px',
							display: 'inline-block',
							marginRight: '5px',
							borderRadius: '50%',
						}}
					></div>
					{params.value} { }
				</div>
			),
		},
		{
			field: 'headStaff.username',
			headerName: 'Head Staff',
			width: 150,
			valueGetter: (params) => params.row.headStaff.username,
		},
		{
			field: 'update',
			headerName: 'Update',
			width: 100,
			renderCell: (params) => (
				params.row.approvalStatusEnum === 'PENDING' ? (
					<Button
						variant="outlined"
						color="primary"
						onClick={() => handleUpdateDialogOpen(params.row)}
						style={{ backgroundColor: 'grey', color: 'white' }}
					>
						Update
					</Button>
				) : null
			),
		},
		{
			field: 'delete',
			headerName: 'Delete',
			width: 100,
			renderCell: (params) => (
				<Button
					variant="outlined"
					color="secondary"
					onClick={() => handleDeleteDialogOpen(params.row.leaveId)}
					style={{ backgroundColor: 'red', color: 'white' }}
				>
					Delete
				</Button>
			),
		},
		{
			field: 'viewImage',
			headerName: 'View Image',
			width: 150,
			renderCell: (params) => (
				params.row.imageDocuments ? (
					<Button
						variant="outlined"
						color="primary"
						onClick={() => handleViewImage(params.row)}
						style={{ backgroundColor: 'orange', color: 'white' }}
					>
						View Image
					</Button>
				) : null
			),
		},];

	const generateRowId = (row) => {
		return row.leaveId;
	};

	useEffect(() => {
		getLeaveBalance();
		getLeaveList();

	}, []);

	const handleDeleteLeave = (id) => {

		axios.delete(`http://localhost:8080/leave/deleteLeave/${id}`, {
			headers: {
				'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
			}
		})
			.then(() => {
				getLeaveBalance();
				getLeaveList();
			})
			.catch((error) => {
				console.error('Error deleting row:', error);
			});
	};

	console.log(leaveList);
	console.log(leaveBalance);

	return (
		<DashboardLayout>
			<DashboardNavbar />
			<MDBox py={3}>
				<Grid container spacing={3}>

					<Grid item xs={12} md={6} lg={3}>
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
									My Leave Balance
								</MDTypography>
							</MDBox>
							<CardContent>
								<div>
									<strong>Annual Leave:</strong> {leaveBalance.annualLeave}
								</div>
								<div>
									<strong>Sick Leave:</strong> {leaveBalance.sickLeave}
								</div>
								<div>
									<strong>Parental Leave:</strong> {leaveBalance.parentalLeave}
								</div>
								<div>
									<br></br>
									<Link to="/manpower/createLeave" style={{ textDecoration: 'none' }}>
										<Button variant="contained" color="primary" style={{ color: 'white' }}>
											Apply for Leave
										</Button>
									</Link>
								</div>
							</CardContent>
						</Card>

					</Grid>
				</Grid>

			</MDBox>
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
									My Applied Leaves
								</MDTypography>
							</MDBox>
							<MDBox pt={3}>
								<Paper style={{ height: 400, width: '100%' }}>
									<DataGrid
										rows={leaveList}
										columns={columns}
										pageSize={5} // Adjust the number of rows per page as needed
										autoHeight
										getRowId={generateRowId}
									/>
									<Dialog
										open={deleteDialogOpen}
										onClose={handleDeleteDialogClose}
										aria-labelledby="alert-dialog-title"
										aria-describedby="alert-dialog-description"
									>
										<DialogTitle id="alert-dialog-title">Confirm Deletion</DialogTitle>
										<DialogContent>
											<DialogContentText id="alert-dialog-description">
												Are you sure you want to delete your Leave?
											</DialogContentText>
										</DialogContent>
										<DialogActions>
											<Button onClick={handleDeleteDialogClose} color="primary">
												Cancel
											</Button>
											<Button onClick={handleDeleteConfirm} color="secondary" autoFocus>
												Delete
											</Button>
										</DialogActions>
									</Dialog>
									<Dialog open={openImageDialog} onClose={handleCloseImageDialog} style={{ maxWidth: '100%', maxHeight: '100%'}}>
										<DialogContent style={{width: '100vw' }}>
											<img src={selectedImage} alt="Leave Image" style={{ maxWidth: '100%', maxHeight: '100%' }} />
										</DialogContent>
										<Button onClick={handleCloseImageDialog} color="primary">
											Close
										</Button>
									</Dialog>
									<UpdateLeaveForm
										open={isUpdateFormOpen}
										onClose={handleUpdateDialogClose}
										selectedRow={selectedRow}
										onUpdate={handleUpdateLeave}
									/>
								</Paper>
							</MDBox>
						</Card>
					</Grid>
				</Grid>
			</MDBox>
		</DashboardLayout>
	);
}

export default ViewAllLeaves;
