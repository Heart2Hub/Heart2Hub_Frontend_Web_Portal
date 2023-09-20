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
import { useSelector } from "react-redux";
import { selectStaff } from "store/slices/staffSlice";
import { Link } from 'react-router-dom';
import { staffApi, departmentApi, imageServerApi } from "api/Api";
import moment from "moment";



function CreateLeave() {

	const staff = useSelector(selectStaff);
	const staffId = staff.staffId;

	const [startDate, setStartDate] = useState('');
	const [endDate, setEndDate] = useState('');
	const [leaveBalance, setLeaveBalance] = useState([]);
	const [selectedLeaveTypeEnum, setSelectedLeaveTypeEnum] = useState('');
	const [selectedStaff, setSelectedStaff] = useState('');
	const [leavePhoto, setLeavePhoto] = useState(null);

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


	const getLeaveBalance = async () => {
		const response = await axios.get(`http://localhost:8080/leave/getLeaveBalance?staffId=${staff.staffId}`, {
			headers: {
				'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
			}
		});

		setLeaveBalance(response.data);
	}

	const fetchLeaveTypes = async () => {
		axios.get('http://localhost:8080/leave/getLeaveTypeEnumList', {
			headers: {
				'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
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
				'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
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
		updateStartEndDate(newStartDate);
	};

	const updateStartEndDate = (newStartDate) => {
		setStartDate(newStartDate);
		// If the startDate has been selected, update endDate to a day after startDate
		if (newStartDate) {
			// const startDateObj = new Date(newStartDate);
			// const nextDay = new Date(startDateObj);
			// nextDay.setDate(startDateObj.getDate() + 1);
			// const formattedNextDay = nextDay.toISOString().slice(0, 10);
			setEndDate(newStartDate);
		} else {
			// If startDate is cleared, clear endDate as well
			setEndDate('');
		}
	}

	const handlePhotoUpload = (e) => {
		console.log(e.target.files[0]);
		const formData = new FormData();
		formData.append("image", e.target.files[0], e.target.files[0].name);
		setLeavePhoto(formData);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		setErrorMessages([]);
		setSuccessMessage("");

		// const leaveRecord = {
		// 	staffId,
		// 	startDate,
		// 	endDate,
		// 	selectedLeaveTypeEnum,
		// 	selectedStaff,
		// 	comments
		// };

		try {
			let imageLink = null;
			let createdDate = null;

			if (leavePhoto) {
				// Only make the image server request if leavePhoto is provided
				const imageServerResponse = await imageServerApi.uploadProfilePhoto(
					"id",
					leavePhoto
				);

				imageLink = imageServerResponse.data.filename; // Set imageLink if photo is uploaded
				createdDate = moment().format("YYYY-MM-DDTHH:mm:ss");
			}

			const leaveRecord = {
				staffId,
				startDate,
				endDate,
				selectedLeaveTypeEnum,
				selectedStaff,
				comments,
				imageLink,
				createdDate

			};

			console.log(leaveRecord);

			const response = await axios.post('http://localhost:8080/leave/createLeave', leaveRecord, {
				headers: {
					'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
				}
			});
			console.log('Leave created:', response.data);

			setSuccessMessage("Leave created successfully.");

			setStartDate("");
			setEndDate("");
			setSelectedLeaveTypeEnum("");
			setSelectedStaff("");
			setComments("");
			setLeavePhoto("");
			getLeaveBalance();

		} catch (error) {
			console.error('Error creating leave:', error);

			if (error.response && error.response.data) {
				setErrorMessages([error.response.data]);
				
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
								<Link to="/manpower/leaveApplication" style={{ textDecoration: 'none' }}>
									<Button variant="contained" color="primary" style={{ color: 'white' }}>
										View My Leaves
									</Button>
								</Link>
							</div>
						</CardContent>
					</Card>

				</Grid>
			</Grid>
			<br />
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
							<Grid item xs={6} sx={{ marginBottom: "10px" }}>
								<InputLabel sx={{ paddingBottom: "8px" }}>Select Leave Type</InputLabel>
								<Select
									value={selectedLeaveTypeEnum}
									onChange={(e) => {
										setSelectedLeaveTypeEnum(e.target.value);
										if (e.target.value === 'ANNUAL' || e.target.value === 'PARENTAL') {
											updateStartEndDate(oneMonthLater.toISOString().slice(0, 10));
										} else {
											updateStartEndDate(new Date().toISOString().slice(0, 10))
										}
									}}
									required
									sx={{ lineHeight: "2.5em", width: "30%" }}
								>
									{leaveTypes.map((enumItem, index) => (
										<MenuItem key={index} value={enumItem}>
											{enumItem}
										</MenuItem>
									))}
								</Select>
							</Grid><br />
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
											min: (selectedLeaveTypeEnum === 'ANNUAL' || selectedLeaveTypeEnum === 'PARENTAL') ? (oneMonthLater ? oneMonthLater.toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10)) : new Date().toISOString().slice(0, 10),
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
											min: (selectedLeaveTypeEnum === 'ANNUAL' || selectedLeaveTypeEnum === 'PARENTAL') ? (oneMonthLater ? oneMonthLater.toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10)) : new Date().toISOString().slice(0, 10),
											max: sixMonthsLater ? sixMonthsLater.toISOString().slice(0, 10) : "",
										}}
									/>
								</Grid>
							</Grid><br />
							<Grid item xs={6}>
								<InputLabel sx={{ marginBottom: "8px" }}>Select Head Staff</InputLabel>
								<Select
									value={selectedStaff}
									onChange={(e) => setSelectedStaff(e.target.value)}
									required
									sx={{ lineHeight: "2.5em", width: "30%" }}

								>
									{staffList.filter(user => user.username !== localStorage.getItem('staffUsername')).map((staffItem, index) => (
										<MenuItem key={index} value={staffItem.staffId}>
											{staffItem.firstname + " " + staffItem.lastname}
										</MenuItem>
									))}
								</Select>
							</Grid><br />
							<Grid item xs={12}>
								<InputLabel sx={{ marginBottom: "8px" }}>Comments</InputLabel>
								<TextareaAutosize
									rowsMin={3}
									value={comments}
									onChange={(e) => setComments(e.target.value)}
									fullWidth
									style={{ width: "100%", minHeight: "150px", borderColor: "gainsboro", borderRadius: "6px", fontFamily: 'Arial', padding: "10px", fontSize: "15px" }}
								/>
							</Grid>
							<Grid item xs={6}>
								<MDBox>
									<MDTypography
										variant="button"
										fontWeight="bold"
										textTransform="capitalize"
									>
										Upload Photo
									</MDTypography>
									<br></br>
									<input
										type="file"
										accept="image/*"
										onChange={handlePhotoUpload}
									/>
									<br></br>
								</MDBox>

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

							<br></br>
							<Grid item xs={12}>
								<Button variant="contained" color="primary" type="submit" style={{ backgroundColor: 'green', color: 'white' }}
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
