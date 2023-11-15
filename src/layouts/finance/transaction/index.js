import React, { useState, useEffect, useRef } from 'react';
import {
	Grid,
	Card,
	Chip,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	List,
	ListItem,
	Typography,
	CardContent,
	IconButton,
	Icon,
	TextField,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	InputAdornment,
	Tab,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Tabs,
	Paper,
	styled
} from '@mui/material';
import DeleteIcon from "@mui/icons-material/Delete";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "examples/Tables/DataTable";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { subsidyApi, transactionApi, invoiceApi } from 'api/Api';
import { useDispatch } from "react-redux";
import { displayMessage } from "../../../store/slices/snackbarSlice";
import MDButton from "components/MDButton";
import { useSelector } from "react-redux";
import { selectStaff } from "store/slices/staffSlice";
import { Bar } from 'react-chartjs-2';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import ItemProfileChart from './ItemProfitChart';


function Transaction() {
	const reduxDispatch = useDispatch();
	const staff = useSelector(selectStaff);
	const [currentTab, setCurrentTab] = useState('invoices');
	const [chartData, setChartData] = useState(null);
	const [chartOptions, setChartOptions] = useState(null);
	const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

	const [open, setOpen] = useState(false);
	const [invoiceData, setInvoiceData] = useState(null);
	const [selectedEHR, setSelectedEHR] = useState([]);
	const [selectedItems, setSelectedItems] = useState([]);

	const handleOpenInvoice = async (transaction) => {
		console.log(transaction);
		try {
			const response = await invoiceApi.findInvoiceUsingTransaction(transaction);
			console.log(response.data)
			const ehr = await invoiceApi.findPatientOfInvoice(response.data);
			const items = await invoiceApi.findItemsOfInvoice(response.data);
			setSelectedEHR(ehr.data);
			setInvoiceData(response.data)
			// setInvoiceData(response.data);
			setSelectedItems(items.data);
			setOpen(true);
		} catch (error) {
			console.error('Error fetching invoice data:', error);
		}
	};



	const months = [
		'January', 'February', 'March', 'April', 'May', 'June',
		'July', 'August', 'September', 'October', 'November', 'December'

	];
	const ExportButton = styled(Button)({
		backgroundColor: '#4caf50', // Change the background color as needed
		color: 'white',
		'&:hover': {
			backgroundColor: '#388e3c', // Change the hover color as needed
		},
	});
	const exportChartAsPDF = () => {
		const chartElement = document.getElementById('bar-chart');
		html2canvas(chartElement).then((canvas) => {
			const imgData = canvas.toDataURL('image/png');
			const pdf = new jsPDF();
			pdf.addImage(imgData, 'PNG', 10, 10, 190, 100); // Adjust the dimensions as needed
			pdf.save('revenue_report.pdf');
		});
	};

	const [data, setData] = useState({
		columns: [
			{ Header: 'Transaction ID', accessor: 'transactionId', width: '10%' },
			{ Header: 'Transaction Date', accessor: 'transactionDate', width: '20%' },
			{ Header: 'Transaction Amount', accessor: 'transactionAmount', width: '20%' },
			{
				Header: 'Status',
				accessor: 'approvalStatusEnum',
				width: '20%',
				Cell: ({ row }) => (
					<Chip
						label={
							row.original.approvalStatusEnum === 'REJECTED'
								? 'OUTSTANDING'
								: row.original.approvalStatusEnum
						}
						color={
							row.original.approvalStatusEnum === 'APPROVED'
								? 'success'
								: row.original.approvalStatusEnum === 'PENDING'
									? 'warning'
									: 'error'
						}
					/>
				),
			}, {
				Header: 'Actions',
				Cell: ({ row }) => (
					<>
						<MDButton
							style={{
								width: "120px",
								marginRight: "10px",
								marginBottom: "8px",
							}}
							variant="contained"
							color="info"
							onClick={() => handleOpenInvoice(row.original.transactionId)}
						>
							View Invoice
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
			{ Header: 'Transaction ID', accessor: 'transactionId', width: '10%' },
			{ Header: 'Transaction Date', accessor: 'transactionDate', width: '20%' },
			{ Header: 'Transaction Amount', accessor: 'transactionAmount', width: '20%' },
			{
				Header: 'Status',
				accessor: 'approvalStatusEnum',
				width: '20%',
				Cell: ({ row }) => (
					<Chip
						label={
							row.original.approvalStatusEnum === 'REJECTED'
								? 'OUTSTANDING'
								: row.original.approvalStatusEnum
						}
						color={
							row.original.approvalStatusEnum === 'APPROVED'
								? 'success'
								: row.original.approvalStatusEnum === 'PENDING'
									? 'warning'
									: 'error'
						}
					/>
				),
			}, {
				Header: 'Actions',
				Cell: ({ row }) => (
					<>
						<MDButton
							style={{
								width: "120px",
								marginRight: "10px",
								marginBottom: "8px",
							}}
							variant="contained"
							color="info"
							onClick={() => handleOpenInvoice(row.original.transactionId)}
						>
							View Invoice
						</MDButton>


					</>
				),
				width: '10%',
			},
		],
		rows: [],
	});

	const calculateAverage = (data) => {
		if (data.length === 0) return 0;
		const sum = data.reduce((acc, val) => acc + val, 0);
		return sum / data.length;
	};


	useEffect(() => {
		// Fetch subsidies data and populate the "subsidies" state
		fetchData();
		const fetchChartData = async () => {
			try {
				const chartResponse = await transactionApi.getTotalSumOfTransactionsForCurrentYearByMonth();
				const monthlyData = chartResponse.data; // Assuming monthlyData is an array of monthly transaction amounts

				// Processing data for Chart.js
				const chartLabels = monthlyData.map((data, index) => `${months[index]}`);
				const chartValues = monthlyData.map((data) => data);

				// Set the Chart.js data
				setChartData({
					labels: chartLabels,
					datasets: [
						{
							label: 'Monthly Transaction Amount',
							data: chartValues,
							backgroundColor: 'rgba(54, 162, 235, 0.6)', // Example color
							borderColor: 'rgba(54, 162, 235, 1)', // Example color
							borderWidth: 1,
						},
					],
				});

				// Adding a trend line
				const trendLine = {
					type: 'line',
					mode: 'horizontal',
					scaleID: 'y',
					value: calculateAverage(monthlyData),
					borderColor: 'rgba(255, 99, 132, 1)', // Adjusted color to make it more prominent
					borderWidth: 2.5, // Adjusted width to make it more prominent
					label: {
						enabled: true,
						content: 'Average', // The label for the trend line
					},
				};

				setChartOptions({
					scales: {
						y: {
							beginAtZero: true,
						},
					},
					plugins: {
						legend: {
							display: true,
							position: 'top',
						},
						title: {
							display: true,
							text: `Revenue Report for ${currentYear}`,
						},
						annotation: {
							annotations: {
								trendLine,
							},
						},
						custom: {
							draw: function (context) {
								const bar = context.chart.data.datasets[0].data;
								const sum = bar.reduce((a, b) => a + b, 0);
								context.chart.ctx.textAlign = 'center';
								context.chart.ctx.textBaseline = 'bottom';
								context.chart.ctx.fillStyle = '#000000';
								context.chart.ctx.font = '14px Arial';
								context.chart.ctx.fillText(`Total: $${sum}`, context.chart.width / 2, context.chart.height - 20);
							},
						},
					},
				});
			} catch (error) {
				console.error('Error fetching chart data:', error);
			}
		};

		if (currentTab === 'profit') {
			fetchChartData();
		}
	}, [currentTab]);


	const fetchData = async () => {
		try {
			transactionApi
				.getAllTransactions()
				.then((response) => {
					const transactions = response.data; // Assuming 'facilities' is an array of facility objects
					console.log(response);

					const mappedRows = transactions.map((transaction) => {
						const dueDate = new Date(
							transaction.transactionDate[0], // year
							transaction.transactionDate[1] - 1, // month (zero-indexed)
							transaction.transactionDate[2], // day
							transaction.transactionDate[3], // hour
							transaction.transactionDate[4], // minute
							transaction.transactionDate[5], // second
							transaction.transactionDate[6] // millisecond
						).toLocaleString('en-SG', {
							timeZone: 'Asia/Singapore',
							day: '2-digit',
							month: '2-digit',
							year: 'numeric',
						});
						return {
							transactionId: transaction.transactionId,
							transactionAmount: `$${transaction.transactionAmount.toFixed(2)}`,
							transactionDate: dueDate,
							approvalStatusEnum: transaction.approvalStatusEnum === 'REJECTED' ? 'OUTSTANDING' : transaction.approvalStatusEnum,
						};
					});
					console.log(mappedRows)
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

	const totalAmount = chartData ? parseFloat(chartData.datasets[0].data.reduce((a, b) => a + b, 0)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 0;


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
									Transactions Analysis
								</MDTypography>

							</MDBox>

							<div>
								<Tabs value={currentTab} onChange={(e, value) => setCurrentTab(value)}>
									<Tab value="invoices" label="All Transactions" />
									<Tab value="profit" label="Revenue Report" />
									<Tab value="item" label="Profit Report for Items" />
								</Tabs>

								{currentTab === 'invoices' ? (
									<div>
										<MDBox pt={3}>
											<DataTable canSearch={true} table={data} />
										</MDBox>
									</div>
								) : currentTab === 'profit' ? (
									<div style={{ marginTop: '30px' }}>
										<Grid container justifyContent="center" alignItems="center">
											{chartData && (
												<div>
													<h2>Revenue Report for 2023</h2>
													<div style={{ height: '500px', width: '1000px' }}>
														<Bar
															id="bar-chart"
															data={chartData}
															options={{
																scales: {
																	y: {
																		beginAtZero: true,
																	},
																},
																plugins: {
																	legend: {
																		display: true,
																		position: 'top',
																	},
																	title: {
																		display: true,
																		text: 'Revenue Report for 2023',
																	},
																	tooltip: {
																		callbacks: {
																			label: (context) => `Total: $${context.parsed.y}`,
																		},
																	},
																},
															}}
														/>
													</div>
													<MDTypography variant="h6" color="black">
														Total Revenue for 2023: ${totalAmount}
													</MDTypography>
													<div style={{ textAlign: 'center', marginTop: '20px', marginBottom: '20px' }}>
														<ExportButton variant="contained" onClick={exportChartAsPDF}>
															Export as PDF
														</ExportButton>
													</div>
												</div>
											)}
										</Grid>
									</div>
								) : currentTab === 'item' ? (
									<ItemProfileChart />
								) : null}
							</div>

						</Card>
					</Grid>
				</Grid>

			</MDBox>


			<Dialog open={open} onClose={() => setOpen(false)} PaperProps={{
				style: {
					minWidth: 500,
					width: '80%',
					maxWidth: 'none',
				},
			}}>
				<DialogTitle sx={{ fontSize: '24px', textAlign: 'center' }}>Invoice Details</DialogTitle>
				<DialogContent>
					<List>
						<ListItem>
							<MDTypography variant="h5" gutterBottom style={{ marginTop: '20px', fontWeight: 'bold' }}>
								Invoice ID: {invoiceData}
							</MDTypography>
						</ListItem>
					</List>
					<List>
						<ListItem>
							<MDTypography variant="h5" gutterBottom style={{ marginTop: '20px', marginBottom: '20px', fontWeight: 'bold' }}>
								Invoice Owner: {selectedEHR}
							</MDTypography>
						</ListItem>
					</List>


					<List>
						<ListItem>
							<MDTypography variant="h5" gutterBottom>
								Patient's Cart:
							</MDTypography>
						</ListItem>

						<ListItem>
							<TableContainer component={Paper}>
								<Grid container spacing={2}>
									{/* Positive Items */}
									<Grid item xs={12} md={6}>
										<Paper elevation={3} style={{ padding: '10px', marginBottom: '10px', height: '100%' }}>
											<Typography variant="h6" gutterBottom>
												Product and Services
											</Typography>
											{selectedItems
												.filter(item => item.transactionItemPrice * item.transactionItemQuantity >= 0)
												.map(item => (
													<div key={item.transactionItemId}>
														<Typography variant="subtitle1">
															{item.transactionItemName}
														</Typography>
														<Typography variant="body2">
															Quantity: {item.transactionItemQuantity} | Total Price: ${(
																item.transactionItemPrice * item.transactionItemQuantity
															).toFixed(2)}
														</Typography>
													</div>
												))}
											{/* Total Price */}

											<div style={{ alignSelf: 'flex-end', paddingTop: '10px' }}>
												<Typography variant="h5" style={{ fontWeight: 'bold', color: '#e74c3c' }}>
													<strong> Total Payable: $
														{selectedItems
															.filter(item => item.transactionItemPrice * item.transactionItemQuantity >= 0)
															.reduce((total, item) => total + item.transactionItemPrice * item.transactionItemQuantity, 0)
															.toFixed(2)}</strong>

												</Typography>
											</div>
										</Paper>
									</Grid>
									{/* Negative Items */}
									<Grid item xs={12} md={6}>
										<Paper elevation={3} style={{ padding: '10px', height: '100%' }}>
											<Typography variant="h6" gutterBottom>
												Claims and Subsidies
											</Typography>
											{selectedItems
												.filter(item => item.transactionItemPrice * item.transactionItemQuantity < 0)
												.map(item => (
													<div key={item.transactionItemId}>
														<Typography variant="subtitle1">
															{item.transactionItemName}
														</Typography>
														<Typography variant="body2">
															${item.transactionItemPrice.toFixed(2)}
														</Typography>
													</div>
												))}
											{/* Total Price */}
											<div style={{ alignSelf: 'flex-end', paddingTop: '10px' }}>
												<Typography variant="h5" style={{ fontWeight: 'bold' }}>
													<strong>
														Total Receivables: $
														{selectedItems
															.filter(item => item.transactionItemPrice * item.transactionItemQuantity < 0)
															.reduce((total, item) => total + item.transactionItemPrice * item.transactionItemQuantity, 0)
															.toFixed(2)}
													</strong>
												</Typography>
											</div>
										</Paper>
									</Grid>
								</Grid>

							</TableContainer>
						</ListItem>
					</List>
					<Typography align="center" variant="body1" marginTop={20} style={{ fontWeight: 'bold', color: '#e74c3c' }}>
						<strong>Total Invoice Amount: $
							{selectedItems.reduce((total, item) =>
								total + item.transactionItemPrice * item.transactionItemQuantity, 0).toFixed(2)}
						</strong>
					</Typography>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setOpen(false)} color="primary">Close</Button>
				</DialogActions>
			</Dialog>
		</DashboardLayout>

	);
}

export default Transaction;
