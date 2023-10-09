import React, { useState, useEffect } from 'react';
import {
	Grid,
	Card,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	TextField,
	Button,
	Tabs,
	Tab,
} from '@mui/material';

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "examples/Tables/DataTable";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import { subsidyApi } from 'api/Api';
function Subsidy() {
	const [subsidies, setSubsidies] = useState([]);
	const [selectedSubsidy, setSelectedSubsidy] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	// Define columns for the DataTable
	const columns = [
		{ Header: 'ID', accessor: 'id', width: '10%' },
		{ Header: 'Subsidy Rate', accessor: 'subsidyRate', width: '20%' },
		{ Header: 'Item Type', accessor: 'itemType', width: '20%' },
		{ Header: 'Minimum DOB', accessor: 'minDOB', width: '20%' },
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
	];

	

	useEffect(() => {
		// Fetch subsidies data and populate the "subsidies" state
		// You should implement the fetchData function here
		fetchData();
	}, []);

	const fetchData = async () => {
		subsidyApi.
			getAllSubsidies()
			.then((response) => {
				const subsidiesData = response.data; 
				console.log('Subsidies data:', subsidiesData); // Add this line for debugging

				setSubsidies(subsidiesData);				
			})
			.catch((error) => {
				console.error("Error fetching data:", error);
			});

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
		// Implement code to delete a subsidy by its ID
		// After deletion, update the subsidies state to remove the deleted subsidy
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
									Subsidy
								</MDTypography>
							</MDBox>

							<MDBox pt={3}>


								<DataTable  columns={columns} table={subsidies} />


							</MDBox>
						</Card>
					</Grid>
				</Grid>
			</MDBox>

		</DashboardLayout>
	);
}

export default Subsidy;
