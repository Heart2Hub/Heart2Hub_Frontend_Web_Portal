import React, { useState, useEffect, useRef } from 'react';
import {
	Grid,
	Card,
	Button,
} from '@mui/material';

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "examples/Tables/DataTable";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { subsidyApi } from 'api/Api';
import { useDispatch } from "react-redux";


function Subsidy() {
	// const [subsidies, setSubsidies] = useState([]);
	const [selectedSubsidy, setSelectedSubsidy] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false);

	const reduxDispatch = useDispatch();

	const [data, setData] = useState({
		columns: [
			{ Header: 'ID', accessor: 'subsidyId', width: '10%' },
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
					console.log(date);
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

	const dataRef = useRef({
		columns: [
			{ Header: 'ID', accessor: 'subsidyId', width: '10%' },
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
						nationality: subsidy.nationality
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
		// Implement code to delete a subsidy by its ID
		// After deletion, update the subsidies state to remove the deleted subsidy
	};

	// // Define columns for the DataTable
	// const columns = [
	// 	{ Header: 'ID', accessor: 'subsidyId', width: '10%' },
	// 	{ Header: 'Subsidy Rate', accessor: 'subsidyRate', width: '20%' },
	// 	{ Header: 'Item Type', accessor: 'itemTypeEnum', width: '20%' },
	// 	{ Header: 'Minimum DOB', accessor: 'minDOB', width: '20%' },
	// 	{ Header: 'Sex', accessor: 'sex', width: '10%' },
	// 	{ Header: 'Race', accessor: 'race', width: '10%' },
	// 	{ Header: 'Nationality', accessor: 'nationality', width: '10%' },
	// 	{
	// 		Header: 'Actions',
	// 		Cell: ({ row }) => (
	// 			<>
	// 				<Button variant="outlined" onClick={() => handleEdit(row.original)}>
	// 					Edit
	// 				</Button>
	// 				<Button variant="outlined" onClick={() => handleDelete(row.original.id)}>
	// 					Delete
	// 				</Button>
	// 			</>
	// 		),
	// 		width: '10%',
	// 	},
	// ];

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
								<DataTable canSearch={true} table={data} />
							</MDBox>
						</Card>
					</Grid>
				</Grid>
			</MDBox>
		</DashboardLayout>
	);
}

export default Subsidy;
