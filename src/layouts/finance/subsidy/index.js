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
} from '@mui/material';

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "examples/Tables/DataTable";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { subsidyApi } from 'api/Api';
import { useDispatch } from "react-redux";
import { displayMessage } from "../../../store/slices/snackbarSlice";
import MDButton from "components/MDButton";




function Subsidy() {
	// const [subsidies, setSubsidies] = useState([]);
	const [selectedSubsidy, setSelectedSubsidy] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);
	const [subsidyToDeleteId, setSubsidyToDeleteId] = useState(null);


	const reduxDispatch = useDispatch();

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
			{ Header: 'Item Type', accessor: 'itemTypeEnum', width: '20%' },
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
						<Button variant="outlined" onClick={() => handleEdit(row.original)} style={{ backgroundColor: 'blue', color: 'white' }}>
							Edit
						</Button>
						<Button variant="outlined" onClick={() => handleDelete(row.original.subsidyId)} style={{ backgroundColor: 'red', color: 'white' }}>
							Delete
						</Button>
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
	    
		  // Update formData with the converted subsidy rate
		  const updatedFormData = { ...formData, subsidyRate: subsidyRateBigDecimal.toString() };
	    
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
						itemTypeEnum: subsidy.itemTypeEnum,
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

	const handleAdd = () => {
		// Implement code to open the modal for adding a new subsidy
		// Initialize any necessary state variables for the modal
	};

	const handleEdit = (subsidy) => {
		// Implement code to open the modal for editing an existing subsidy
		// Initialize state variables for the modal with the selected subsidy data
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
						fullWidth
					/>
					<FormControl fullWidth margin="dense">
						<InputLabel>Item Type</InputLabel>
						<Select
							name="itemTypeEnum"
							value={formData.itemTypeEnum}
							onChange={handleInputChange}
							sx={{ lineHeight: "2.5em"}}

						>
							<MenuItem value="INPATIENT">INPATIENT</MenuItem>
							<MenuItem value="OUTPATIENT">OUTPATIENT</MenuItem>
							<MenuItem value="MEDICINE">MEDICINE</MenuItem>
							<MenuItem value="CONSUMABLE">CONSUMABLE</MenuItem>
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
							sx={{ lineHeight: "2.5em"}}
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
							<MenuItem value="Singaporean">Singaporean</MenuItem>
							<MenuItem value="PR">PR</MenuItem>
							<MenuItem value="Foreigner">Foreigner</MenuItem>
						</Select>
					</FormControl>

					<FormControl fullWidth margin="dense">
						<InputLabel>Race</InputLabel>
						<Select
							name="sex"
							value={formData.race}
							onChange={handleInputChange}
							sx={{ lineHeight: "2.5em" }}
						>
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
		</DashboardLayout>

	);
}

export default Subsidy;
