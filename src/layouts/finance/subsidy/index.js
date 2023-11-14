import React, { useState, useEffect, useRef } from 'react';
import {
	Grid,
	Card,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Icon,
	TextField,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	Chip,
	InputAdornment
} from '@mui/material';

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "examples/Tables/DataTable";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { subsidyApi, stripeApi } from 'api/Api';
import { useDispatch } from "react-redux";
import { displayMessage } from "../../../store/slices/snackbarSlice";
import MDButton from "components/MDButton";


function Subsidy() {
	// const [subsidies, setSubsidies] = useState([]);
	const [selectedSubsidy, setSelectedSubsidy] = useState([]);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);
	const [subsidyToDeleteId, setSubsidyToDeleteId] = useState(null);

	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [editFormData, setEditFormData] = useState({
		subsidyRate: '',
	});

	const reduxDispatch = useDispatch();

	const handleEdit = (subsidy) => {
		setSelectedSubsidy(subsidy);
		setEditFormData({
			subsidyRate: subsidy.subsidyRate,
		});
		setIsEditModalOpen(true);
	};

	const handleUpdateSubsidy = async () => {
		try {
			const updatedSubsidy = { ...selectedSubsidy, subsidyRate: editFormData.subsidyRate };
			console.log(updatedSubsidy)
			console.log(updatedSubsidy.subsidyRate / 100)

			if (updatedSubsidy.subsidyRate / 100 <= 0) {
				reduxDispatch(
					displayMessage({
						color: "error",
						icon: "notification",
						title: "Invalid Quantity",
						content: "Please select a valid Subsidy Rate.",
					})
				);
				return;
			}

			await subsidyApi.updateSubsidyRate(updatedSubsidy.subsidyId, updatedSubsidy);

			// Reset the edit form data
			setEditFormData({ subsidyRate: '' });
			setIsEditModalOpen(false);

			fetchData();
			reduxDispatch(
				displayMessage({
					color: 'success',
					icon: 'notification',
					title: 'Successfully Updated Subsidy!',
				})
			);
		} catch (error) {
			// Handle error and display an error message to the user
			reduxDispatch(
				displayMessage({
					color: 'error',
					icon: 'notification',
					title: 'Error Encountered',
					content: error.message || 'An error occurred while updating the subsidy.',
				})
			);
			console.error('Error updating subsidy:', error);
		}
	};

	const itemTypeColors = {
		SERVICE: 'default',    
		MEDICINE: 'primary',    
	};

	const [data, setData] = useState({
		columns: [
			{ Header: 'ID', accessor: 'subsidyId', width: '10%' },
			{ Header: 'Name', accessor: 'subsidyName', width: '10%' },
			{ Header: 'Description', accessor: 'subsidyDescription', width: '10%' },
			{
				Header: 'Subsidy Rate',
				accessor: 'subsidyRate',
				width: '20%',
				Cell: ({ value }) => `${value * 100}%`,
			},
			{
				Header: 'Item Type',
				accessor: 'itemTypeEnum',
				width: '20%',
				Cell: ({ value }) => (
				  <Chip
				    label={value}
				    color={itemTypeColors[value]}
				    style={{ marginRight: '5px' }}
				  />
				),
			      },
			{
				Header: 'Minimum DOB',
				accessor: 'minDOB',
				width: '20%',
				Cell: ({ value }) => {
					const dateString = value.toString();
					const dateArray = dateString.split(',');
					const year = dateArray[0];
					return year;
				},
			},
			{ Header: 'Sex', accessor: 'sex', width: '10%' },
			{ Header: 'Race', accessor: 'race', width: '10%' },
			{ Header: 'Nationality', accessor: 'nationality', width: '10%' },
			{
				Header: 'Actions',
				Cell: ({ row }) => (
					<>
						<MDButton onClick={() => handleEdit(row.original)} variant="gradient" color="success">
							Edit
						</MDButton>
						<MDButton onClick={() => handleDelete(row.original.subsidyId)} variant="gradient" color="error" style={{ marginLeft: "20px" }}>
							Delete
						</MDButton>
					</>
				),
				width: '10%',
			},
		],
		rows: [],
	});

	const dataRef = useRef({
		columns: [
			{ Header: 'ID', accessor: 'subsidyId', width: '10%' },
			{ Header: 'Name', accessor: 'subsidyName', width: '10%' },
			{ Header: 'Description', accessor: 'subsidyDescription', width: '10%' },
			{
				Header: 'Subsidy Rate',
				accessor: 'subsidyRate',
				width: '20%',
				Cell: ({ value }) => `${value}%`,
			},
			{ Header: 'Item Type', accessor: 'itemTypeEnum', width: '20%' },
			{
				Header: 'Minimum DOB',
				accessor: 'minDOB',
				width: '20%',
				Cell: ({ value }) => {
					const date = new Date(value);
					const day = date.getDate().toString().padStart(2, '0');
					const month = (date.getMonth() + 1).toString().padStart(2, '0');
					const year = date.getFullYear();
					return `${day}/${month}/${year}`;
				},
			},
			{ Header: 'Sex', accessor: 'sex', width: '10%' },
			{ Header: 'Race', accessor: 'race', width: '10%' },
			{ Header: 'Nationality', accessor: 'nationality', width: '10%' },
			{
				Header: 'Actions',
				Cell: ({ row }) => (
					<>
						<Button variant="outlined" onClick={() => handleEdit(row.original)}>
							Edit
						</Button>
						<Button variant="outlined" onClick={() => handleDelete(row.original.id)}>
							Delete
						</Button>
					</>
				),
				width: '10%',
			},
		],
		rows: [],
	});

	const [formData, setFormData] = useState({
		subsidyRate: '',
		itemTypeEnum: '',
		minDOB: new Date().getFullYear(),
		sex: '',
		race: '',
		nationality: '',
		subsidyName: '',
		subsidyDescription: '',
	});

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const handleCreateSubsidy = async () => {
		try {
			// Convert the subsidy rate from a percentage string to BigDecimal
			const subsidyRatePercentage = parseFloat(formData.subsidyRate);
			if (isNaN(subsidyRatePercentage)) {
				throw new Error('Invalid subsidy rate format');
			}
			const subsidyRateBigDecimal = subsidyRatePercentage / 100;

			if (subsidyRateBigDecimal <= 0) {
				reduxDispatch(
					displayMessage({
						color: "error",
						icon: "notification",
						title: "Invalid Quantity",
						content: "Please select a valid Subsidy Rate",
					})
				);
				return;
			}

			if (
				!formData.subsidyRate ||
				!formData.itemTypeEnum ||
				!formData.minDOB ||
				!formData.sex ||
				!formData.race ||
				!formData.nationality ||
				!formData.subsidyName
			) {
				reduxDispatch(
					displayMessage({
						color: 'error',
						icon: 'notification',
						title: 'Missing Fields',
						content: 'Please fill in all mandatory fields.',
					})
				);
				return;
			}

			// Update formData with the converted subsidy rate
			const updatedFormData = { ...formData, subsidyRate: subsidyRateBigDecimal.toString() };
			console.log(updatedFormData)

			// You can make an API request here to create the new subsidy using updatedFormData
			const response = await subsidyApi.createSubsidy(updatedFormData);

			// Handle success, reset form, and fetch updated data
			console.log(response);
			setFormData({
				subsidyRate: '',
				itemTypeEnum: '',
				minDOB: new Date().getFullYear(),
				sex: '',
				race: '',
				nationality: '',
				subsidyName: '',
				subsidyDescription: '',
			});
			fetchData(); // Fetch updated data
			setIsModalOpen(false); // Close the modal
			// Display a success message to the user
			reduxDispatch(
				displayMessage({
					color: 'success',
					icon: 'notification',
					title: 'Successfully Created Subsidy!',
				})
			);
		} catch (error) {
			// Handle error and display an error message to the user
			reduxDispatch(
				displayMessage({
					color: 'error',
					icon: 'notification',
					title: 'Error Encountered',
					content: error.message || 'An error occurred while creating the subsidy.',
				})
			);
			console.error('Error creating subsidy:', error);
		}
	};


	useEffect(() => {
		// Fetch subsidies data and populate the "subsidies" state
		fetchData();
	}, []);

	const fetchData = async () => {
		try {
			subsidyApi
				.getAllSubsidies()
				.then((response) => {
					const subsidies = response.data; // Assuming 'facilities' is an array of facility objects
					console.log(response);
					const mappedRows = subsidies.map((subsidy) => ({
						subsidyId: subsidy.subsidyId,
						subsidyRate: subsidy.subsidyRate,
						itemTypeEnum: subsidy.itemTypeEnum === 'INPATIENT' || subsidy.itemTypeEnum === 'OUTPATIENT' ? 'SERVICE' : subsidy.itemTypeEnum,
						minDOB: subsidy.minDOB,
						sex: subsidy.sex,
						race: subsidy.race,
						nationality: subsidy.nationality,
						subsidyName: subsidy.subsidyName,
						subsidyDescription: subsidy.subsidyDescription
					}));
					dataRef.current = {
						...dataRef.current,
						rows: [mappedRows],
					};

					// Update the 'data' state with the mapped data
					setData((prevData) => ({
						...prevData,
						rows: mappedRows,
					}));
				})

		} catch (error) {
			console.error("Error fetching data:", error);
		}
	};


	const handleDelete = (subsidyId) => {
		console.log(subsidyId);
		setIsDeleteConfirmationOpen(true);
		setSubsidyToDeleteId(subsidyId);
	};

	const handleConfirmDelete = () => {
		try {
			console.log(subsidyToDeleteId);

			subsidyApi
				.deleteSubsidy(subsidyToDeleteId)
				.then((response => {
					const subsidies = response.data; // Assuming 'facilities' is an array of facility objects
					console.log(subsidies);
					fetchData();
					setIsDeleteConfirmationOpen(false);

					reduxDispatch(
						displayMessage({
							color: "success",
							icon: "notification",
							title: "Successfully Deleted Subsidy!",
						})
					);

				})).catch((error) => {
					reduxDispatch(
						displayMessage({
							color: "error",
							icon: "notification",
							title: "Error Encountered",
							content: error.response.data,
						})
					);
					console.error("Error Deleting data:", error);
				});

		} catch (error) {
			console.error("Error fetching data:", error);
		}
	};

	// Function to cancel the delete operation
	const handleCancelDelete = () => {
		setIsDeleteConfirmationOpen(false);
		setSubsidyToDeleteId(null);
	};

	const testStripe = async () => {
		const requestBody = {
			amount: 1000,
			currency: "usd",
			successUrl: "https://example.com/success",
			cancelUrl: "https://example.com/cancel"
		};
		const response = await stripeApi.createPaymentLink(requestBody)
		console.log(response.data)
	}


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
									Subsidies Table
								</MDTypography>

							</MDBox>
							<MDBox mx={2} mt={3} px={2}>
								<MDButton
									Button
									variant="contained"
									color="primary"
									onClick={() => setIsModalOpen(true)}
								>
									Create New Subsidy
									<Icon>add</Icon>
								</MDButton>
							</MDBox>
							<MDBox pt={3}>
								<DataTable canSearch={true} table={data} />
							</MDBox>
						</Card>
					</Grid>
				</Grid>
				{/* <Button
					onClick={() => testStripe()}
				>
					Click to try stripe
				</Button> */}
			</MDBox>
			<Dialog
				open={isDeleteConfirmationOpen}
				onClose={handleCancelDelete}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				<DialogTitle id="alert-dialog-title">Confirm Deletion</DialogTitle>
				<DialogContent>
					<DialogContentText id="alert-dialog-description">
						Are you sure you want to delete this subsidy? This action cannot be undone.
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleCancelDelete} color="primary">
						Cancel
					</Button>
					<Button onClick={handleConfirmDelete} color="primary">
						Confirm
					</Button>
				</DialogActions>
			</Dialog>
			<Dialog
				open={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				aria-labelledby="form-dialog-title"
			>
				<DialogTitle id="form-dialog-title">Create New Subsidy</DialogTitle>
				<DialogContent>
					{/* Create form inputs for each field */}
					<TextField
						margin="dense"
						label="Subsidy Name"
						type="text"
						name="subsidyName"
						value={formData.subsidyName}
						onChange={handleInputChange}
						fullWidth
					/>
					<TextField
						margin="dense"
						label="Subsidy Description"
						type="text"
						name="subsidyDescription"
						value={formData.subsidyDescription}
						onChange={handleInputChange}
						fullWidth
					/>
					<TextField
						autoFocus
						margin="dense"
						label="Subsidy Rate"
						type="text"
						name="subsidyRate"
						value={formData.subsidyRate}
						onChange={handleInputChange}
						InputProps={{
							endAdornment: <InputAdornment position="end">%</InputAdornment>,
						}}
						fullWidth
					/>
					<FormControl fullWidth margin="dense">
						<InputLabel>Item Type</InputLabel>
						<Select
							name="itemTypeEnum"
							value={formData.itemTypeEnum}
							onChange={handleInputChange}
							sx={{ lineHeight: "2.5em" }}

						>
							<MenuItem value="INPATIENT">INPATIENT</MenuItem>
							<MenuItem value="OUTPATIENT">OUTPATIENT</MenuItem>
							<MenuItem value="MEDICINE">MEDICINE</MenuItem>
							{/* <MenuItem value="CONSUMABLE">CONSUMABLE</MenuItem> */}
						</Select>
					</FormControl>
					{/* Create form inputs for minDOB, sex, race, nationality, subsidyName, and subsidyDescription */}
					<TextField
						margin="dense"
						label="Minimum DOB"
						type="number"
						name="minDOB"
						value={formData.minDOB}
						onChange={handleInputChange}
						fullWidth
					/>
					<FormControl fullWidth margin="dense">
						<InputLabel>Sex</InputLabel>
						<Select
							name="sex"
							value={formData.sex}
							onChange={handleInputChange}
							sx={{ lineHeight: "2.5em" }}
						>
							<MenuItem value="All">All</MenuItem>
							<MenuItem value="Female">Female</MenuItem>
							<MenuItem value="Male">Male</MenuItem>
						</Select>
					</FormControl>

					<FormControl fullWidth margin="dense">
						<InputLabel>Nationality</InputLabel>
						<Select
							name="nationality"
							value={formData.nationality}
							onChange={handleInputChange}
							sx={{ lineHeight: "2.5em" }}

						>
							<MenuItem value="All">All</MenuItem>
							<MenuItem value="Singaporean">Singapore Citizen</MenuItem>
							<MenuItem value="PR">PR</MenuItem>
							<MenuItem value="Foreigner">Foreigner</MenuItem>
						</Select>
					</FormControl>

					<FormControl fullWidth margin="dense">
						<InputLabel>Race</InputLabel>
						<Select
							name="race"
							value={formData.race}
							onChange={handleInputChange}
							sx={{ lineHeight: "2.5em" }}
						>
							<MenuItem value="All">All</MenuItem>
							<MenuItem value="Chinese">Chinese</MenuItem>
							<MenuItem value="Malay">Malay</MenuItem>
							<MenuItem value="Indian">Indian</MenuItem>
							<MenuItem value="Others">Others</MenuItem>
						</Select>
					</FormControl>
					{/* Create similar form inputs for race and nationality */}

				</DialogContent>
				<DialogActions>
					<Button onClick={() => setIsModalOpen(false)} color="primary">
						Cancel
					</Button>
					<Button onClick={handleCreateSubsidy} color="primary">
						Create
					</Button>
				</DialogActions>
			</Dialog>

			<Dialog
				open={isEditModalOpen}
				onClose={() => setIsEditModalOpen(false)}
				aria-labelledby="form-dialog-title"
			>
				<DialogTitle id="form-dialog-title">Edit Subsidy Rate</DialogTitle>
				<DialogContent>
					{/* Create form inputs for editing the subsidy rate */}
					<TextField
						autoFocus
						margin="dense"
						label="Subsidy Rate"
						type="text"
						placeholder={`${selectedSubsidy.subsidyRate * 100}%`}
						onChange={(e) => setEditFormData({ ...editFormData, subsidyRate: e.target.value })}
						fullWidth
						InputProps={{
							endAdornment: <InputAdornment position="end">%</InputAdornment>,
						}}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setIsEditModalOpen(false)} color="primary">
						Cancel
					</Button>
					<Button onClick={handleUpdateSubsidy} color="primary">
						Confirm
					</Button>
				</DialogActions>
			</Dialog>

		</DashboardLayout>

	);
}

export default Subsidy;
