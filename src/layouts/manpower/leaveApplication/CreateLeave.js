import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import React, { useEffect, useState } from "react";
import axios from 'axios';


import {
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	TextField,
	Button,
	Grid,
	Card,
	Snackbar,
	Alert,
	TextareaAutosize
} from '@mui/material';
import { useNavigate } from 'react-router-dom';


import { useRouter } from 'react-router-dom';


// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import ProfileInfoCard from "examples/Cards/InfoCards/ProfileInfoCard";
import MDInput from "components/MDInput";
import FormCard from "examples/Cards/FormCards";
import SimpleBlogCard from "examples/Cards/BlogCards/SimpleBlogCard";
import CardContent from '@mui/material/CardContent';



function CreateLeave() {

	const [startDate, setStartDate] = useState('');
	const [endDate, setEndDate] = useState('');
	const [leaveBalance, setLeaveBalance] = useState([]);
	const [selectedLeaveTypeEnum, setSelectedLeaveTypeEnum] = useState('');
	const [selectedStaff, setSelectedStaff] = useState('');

	const [leaveTypes, setLeaveTypes] = useState([]);
	const [staffList, setStaffList] = useState([]);

	const [oneMonthLater, setOneMonthLater] = useState(null);
	const [sixMonthsLater, setSixMonthsLater] = useState(null);

	const [errorMessages, setErrorMessages] = useState([]);
	const [successMessage, setSuccessMessage] = useState("");

	const [comments, setComments] = useState("");


	const handleClose = () => {
		setErrorMessages([]);
		setSuccessMessage(null);
	};

	let navigate = useNavigate();
	const routeChange = () => {
		let path = `/manpower/viewAllLeaves`;
		navigate(path);
	}

	//Remember to edit
	const staffId = '1';


	const getLeaveBalance = async () => {
		const response = await axios.get('http://localhost:8080/leave/getLeaveBalance?staffId=1', {
			headers: {
				'Authorization': `Bearer ${'eyJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6WyJBRE1JTiJdLCJzdWIiOiJzdGFmZjEiLCJpYXQiOjE2OTQ2NjIwNzUsImV4cCI6MTY5NTI2Njg3NX0.16DmhDzY10h2YnIXgEUWE9ZqdPRFUDvcJoawlJt2_es'}`
			}
		});

		setLeaveBalance(response.data);
	}

	const fetchLeaveTypes = async () => {
		axios.get('http://localhost:8080/leave/getLeaveTypeEnumList', {
			headers: {
				'Authorization': `Bearer ${'eyJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6WyJBRE1JTiJdLCJzdWIiOiJzdGFmZjEiLCJpYXQiOjE2OTQ2NjIwNzUsImV4cCI6MTY5NTI2Njg3NX0.16DmhDzY10h2YnIXgEUWE9ZqdPRFUDvcJoawlJt2_es'}`
			}
		})
			.then((response) => {
				if (response.data) {
					setLeaveTypes(response.data);
				} else {
					console.warn('Empty response from the API');
				}
			})
			.catch((error) => {
				console.error('Error fetching Leave Types:', error);
			});
	};

	const fetchStaffList = async () => {
		axios.get('http://localhost:8080/staff/getAllHeadStaff', {
			headers: {
				'Authorization': `Bearer ${'eyJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6WyJBRE1JTiJdLCJzdWIiOiJzdGFmZjEiLCJpYXQiOjE2OTQ2NjIwNzUsImV4cCI6MTY5NTI2Njg3NX0.16DmhDzY10h2YnIXgEUWE9ZqdPRFUDvcJoawlJt2_es'}`
			}
		})
			.then((response) => {
				if (response.data) {
					setStaffList(response.data);
				} else {
					console.warn('Empty response from the API');
				}
			})
			.catch((error) => {
				console.error('Error fetching staff:', error);
			});
	};

	useEffect(() => {
		fetchLeaveTypes();
		fetchStaffList();
		const currentDate = new Date();
		const oneMonthDate = new Date(currentDate);
		oneMonthDate.setDate(oneMonthDate.getDate() + 1);
		oneMonthDate.setMonth(currentDate.getMonth() + 1);

		const sixMonthsDate = new Date(currentDate);
		sixMonthsDate.setDate(sixMonthsDate.getDate() + 1);
		sixMonthsDate.setMonth(currentDate.getMonth() + 6);

		setOneMonthLater(oneMonthDate);
		setSixMonthsLater(sixMonthsDate);

		getLeaveBalance();

	}, []);

	const handleStartDateChange = (e) => {
		const newStartDate = e.target.value;
		setStartDate(newStartDate);

		// If the startDate has been selected, update endDate to a day after startDate
		if (newStartDate) {
			const startDateObj = new Date(newStartDate);
			const nextDay = new Date(startDateObj);
			nextDay.setDate(startDateObj.getDate() + 1);
			const formattedNextDay = nextDay.toISOString().slice(0, 10);
			setEndDate(formattedNextDay);
		} else {
			// If startDate is cleared, clear endDate as well
			setEndDate('');
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		setErrorMessages([]);
		setSuccessMessage("");

		const leaveRecord = {
			staffId,
			startDate,
			endDate,
			selectedLeaveTypeEnum,
			selectedStaff,
			comments
		};

		try {
			const response = await axios.post('http://localhost:8080/leave/createLeave', leaveRecord, {
				headers: {
					'Authorization': `Bearer ${'eyJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6WyJBRE1JTiJdLCJzdWIiOiJzdGFmZjEiLCJpYXQiOjE2OTQ2NjIwNzUsImV4cCI6MTY5NTI2Njg3NX0.16DmhDzY10h2YnIXgEUWE9ZqdPRFUDvcJoawlJt2_es'}`
				}
			});
			console.log('Leave created:', response.data);

			setSuccessMessage("Leave created successfully.");

			setStartDate("");
			setEndDate("");
			setSelectedLeaveTypeEnum("");
			setSelectedStaff("");
			getLeaveBalance();

		} catch (error) {
			console.error('Error creating leave:', error);

			if (error.response && error.response.data) {
				const errorData = error.response.data;
				if (errorData.message === "Leave overlaps with existing leaves") {
					setErrorMessages(["Leave overlaps with existing leaves."]);
				} else if (errorData.message === "Start date and end date must be within allowed date ranges") {
					setErrorMessages(["Start date and end date must be within allowed date ranges."]);

				} else {
					setErrorMessages(["Leave Dates overlap with existing leaves"]);
				}
			} else {
				setErrorMessages(["Insufficient Leave Balance."]);
			}
		}


	};

	return (
		<DashboardLayout>
			<DashboardNavbar />
			<MDBox mb={2} />
			<Grid container spacing={3}>
				<Grid item xs={12} md={6} lg={3}>
					<MDBox mb={1.5}>
						<SimpleBlogCard
							image="https://bit.ly/3Hlw1MQ"
							title="Leave Management"
							action={{
								type: "internal",
								route: "/manpower/viewAllLeaves",
								color: "info",
								label: "View My Leaves",
							}}
						/>{" "}
					</MDBox>
				</Grid>
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
						</CardContent>
					</Card>

				</Grid>
			</Grid>
			<MDBox mt={3} mb={3}>
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
							Apply for Leave
						</MDTypography>
					</MDBox>
					<MDBox pt={3} style={{ padding: '20px' }}>
						<form onSubmit={handleSubmit}>
							<Grid container spacing={8}>
								<Grid item xs={6}>
									<TextField
										type="date"
										label="Start Date"
										value={startDate}
										onChange={handleStartDateChange}
										required
										fullWidth
										InputLabelProps={{ shrink: true }}
										inputProps={{
											min: oneMonthLater ? oneMonthLater.toISOString().slice(0, 10) : "",
											max: sixMonthsLater ? sixMonthsLater.toISOString().slice(0, 10) : "",
										}}
									/>
								</Grid>
								<Grid item xs={6}>
									<TextField
										type="date"
										label="End Date"
										value={endDate}
										onChange={(e) => setEndDate(e.target.value)}
										required
										fullWidth
										InputLabelProps={{ shrink: true }}
										inputProps={{
											min: oneMonthLater ? oneMonthLater.toISOString().slice(0, 10) : "",
											max: sixMonthsLater ? sixMonthsLater.toISOString().slice(0, 10) : "",
										}}
									/>
								</Grid>
								<Grid item xs={6}>
									<InputLabel >Select Leave Type</InputLabel>
									<FormControl fullWidth>
										<Select
											value={selectedLeaveTypeEnum}
											onChange={(e) => setSelectedLeaveTypeEnum(e.target.value)}
											required
										>
											{leaveTypes.map((enumItem, index) => (
												<MenuItem key={index} value={enumItem}>
													{enumItem}
												</MenuItem>
											))}
										</Select>
									</FormControl>
								</Grid>
								<Grid item xs={6}>
									<InputLabel >Select Head Staff</InputLabel>
									<FormControl fullWidth>

										<Select
											value={selectedStaff}
											onChange={(e) => setSelectedStaff(e.target.value)}
											required
										>
											{staffList.map((staffItem, index) => (
												<MenuItem key={index} value={staffItem.staffId}>
													{staffItem.username}
												</MenuItem>
											))}
										</Select>
									</FormControl>
								</Grid>
								<Grid item xs={12}>
									<InputLabel>Comments</InputLabel>
									<TextareaAutosize
										rowsMin={3}
										value={comments}
										onChange={(e) => setComments(e.target.value)}
										fullWidth
										style={{ width: "100%", minHeight: "150px" }}
									/>
								</Grid>

							</Grid>
							{errorMessages.length > 0 && (
								<Alert severity="error">
									{errorMessages.map((message, index) => (
										<div key={index}>{message}</div>
									))}
								</Alert>
							)}

							{successMessage && (
								<Alert severity="success">
									{successMessage}
								</Alert>
							)}

							<Grid item xs={12}>
								<Button variant="contained" color="primary" type="submit" style={{ backgroundColor: 'blue', color: 'white' }}
								>
									Create Leave
								</Button>
							</Grid>
						</form>
					</MDBox>
				</Card>

			</MDBox>
		</DashboardLayout>
	);
}

export default CreateLeave;
