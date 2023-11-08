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
	Icon,
	TextField,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	InputAdornment,
	Tab,
	Tabs,
	styled
} from '@mui/material';

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

function ItemProfileChart() {
	const [chartData, setChartData] = useState(null);
	const [chartOptions, setChartOptions] = useState(null);

	const [chartData2, setChartData2] = useState(null);
	const [chartOptions2, setChartOptions2] = useState(null);

	const [chartData3, setChartData3] = useState(null);
	const [chartOptions3, setChartOptions3] = useState(null);

	const ExportButton = styled(Button)({
		backgroundColor: '#4caf50', // Change the background color as needed
		color: 'white',
		'&:hover': {
			backgroundColor: '#388e3c', // Change the hover color as needed
		},
	});
	const exportChartAsPDF1 = () => {
		const chartElement = document.getElementById('inventory-item-chart'); // Replace 'chart1' with the ID of the first chart
		html2canvas(chartElement).then((canvas) => {
			const imgData = canvas.toDataURL('image/png');
			const pdf = new jsPDF();
			pdf.addImage(imgData, 'PNG', 10, 10, 190, 100); // Adjust the dimensions as needed
			pdf.save('chart1_export.pdf');
		});
	};

	const exportChartAsPDF2 = () => {
		const chartElement = document.getElementById('service-item-chart'); // Replace 'chart2' with the ID of the second chart
		html2canvas(chartElement).then((canvas) => {
			const imgData = canvas.toDataURL('image/png');
			const pdf = new jsPDF();
			pdf.addImage(imgData, 'PNG', 10, 10, 190, 100); // Adjust the dimensions as needed
			pdf.save('chart2_export.pdf');
		});
	};

	const exportChartAsPDF3 = () => {
		const chartElement = document.getElementById('medication-chart'); // Replace 'chart3' with the ID of the third chart
		html2canvas(chartElement).then((canvas) => {
			const imgData = canvas.toDataURL('image/png');
			const pdf = new jsPDF();
			pdf.addImage(imgData, 'PNG', 10, 10, 190, 100); // Adjust the dimensions as needed
			pdf.save('chart3_export.pdf');
		});
	};

	const fetchInventoryItemData = async () => {
		try {
			const inventoryItemResponse = await invoiceApi.findProfitByInventoryItem();
			const inventoryItemData = inventoryItemResponse.data;

			const chartLabels = inventoryItemData.map(item => item.itemName);
			const chartValues = inventoryItemData.map(item => item.totalProfit);

			setChartData({
				labels: chartLabels,
				datasets: [
					{
						label: 'Total Profit',
						data: chartValues,
						backgroundColor: 'rgba(54, 162, 235, 0.6)',
						borderColor: 'rgba(54, 162, 235, 1)',
						borderWidth: 1,
					},
				],
			});

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
						text: `Profit by Inventory Item`,
					},
					tooltip: {
						callbacks: {
							label: context => `Total Profit: $${context.parsed.y}`,
						},
					},
				},
			});
		} catch (error) {
			console.error('Error fetching inventory item data:', error);
		}
	};

	const findProfitByMedication = async () => {
		try {
			const inventoryItemResponse = await invoiceApi.findProfitByMedication();
			const inventoryItemData = inventoryItemResponse.data;

			const chartLabels = inventoryItemData.map(item => item.itemName);
			const chartValues = inventoryItemData.map(item => item.totalProfit);

			setChartData3({
				labels: chartLabels,
				datasets: [
					{
						label: 'Total Profit',
						data: chartValues,
						backgroundColor: 'rgba(54, 162, 235, 0.6)',
						borderColor: 'rgba(54, 162, 235, 1)',
						borderWidth: 1,
					},
				],
			});

			setChartOptions3({
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
						text: `Profit by Medication`,
					},
					tooltip: {
						callbacks: {
							label: context => `Total Profit: $${context.parsed.y}`,
						},
					},
				},
			});
		} catch (error) {
			console.error('Error fetching inventory item data:', error);
		}
	};

	const fetchServiceItemData = async () => {
		try {
			const inventoryItemResponse = await invoiceApi.findProfitByServiceItem();
			const inventoryItemData = inventoryItemResponse.data;

			const chartLabels = inventoryItemData.map(item => item.itemName);
			const chartValues = inventoryItemData.map(item => item.totalProfit);

			setChartData2({
				labels: chartLabels,
				datasets: [
					{
						label: 'Total Profit',
						data: chartValues,
						backgroundColor: 'rgba(54, 162, 235, 0.6)',
						borderColor: 'rgba(54, 162, 235, 1)',
						borderWidth: 1,
					},
				],
			});

			setChartOptions2({
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
						text: `Profit by Service Item`,
					},
					tooltip: {
						callbacks: {
							label: context => `Total Profit: $${context.parsed.y}`,
						},
					},
				},
			});
		} catch (error) {
			console.error('Error fetching inventory item data:', error);
		}
	};

	useEffect(() => {
		fetchServiceItemData();
		findProfitByMedication();
		fetchInventoryItemData();
	}, []);

	const totalAmount = chartData ? parseFloat(chartData.datasets[0].data.reduce((a, b) => a + b, 0)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 0;
	const totalAmount2 = chartData2 ? parseFloat(chartData2.datasets[0].data.reduce((a, b) => a + b, 0)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 0;
	const totalAmount3 = chartData3 ? parseFloat(chartData3.datasets[0].data.reduce((a, b) => a + b, 0)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 0;




	return (
		<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
			<div style={{ marginBottom: '30px' , marginTop: '30px'}}>
				<h2>Profit by Inventory Item</h2>
				<div id="inventory-item-chart" style={{ height: '400px', width: '80vw', maxWidth: '1000px' }}>
					{chartData && <Bar data={chartData} options={chartOptions} />}
				</div>
				<p style={{ marginTop: '10px', fontWeight: 'bold' }}>Total Profit: ${totalAmount}</p>
				<div style={{ textAlign: 'center', marginTop: '20px', marginBottom: '20px' }}>
					<ExportButton variant="contained" onClick={exportChartAsPDF1}>
						Export as PDF
					</ExportButton>
				</div>
			</div>

			<div style={{ marginBottom: '30px' }}>
				<h2>Profit by Service Item</h2>
				<div id="service-item-chart" style={{ height: '400px', width: '80vw', maxWidth: '1000px' }}>
					{chartData2 && <Bar data={chartData2} options={chartOptions2} />}
				</div>
				<p style={{ marginTop: '10px', fontWeight: 'bold' }}>Total Profit: ${totalAmount2}</p>
				<div style={{ textAlign: 'center', marginTop: '20px', marginBottom: '20px' }}>
					<ExportButton variant="contained" onClick={exportChartAsPDF2}>
						Export as PDF
					</ExportButton>
				</div>
			</div>

			<div>
				<h2>Profit by Medication</h2>
				<div id="medication-chart" style={{ height: '400px', width: '80vw', maxWidth: '1000px' }}>
					{chartData3 && <Bar data={chartData3} options={chartOptions3} />}
				</div>
				<p style={{ marginTop: '10px', fontWeight: 'bold' }}>Total Profit: ${totalAmount3}</p>
				<div style={{ textAlign: 'center', marginTop: '20px', marginBottom: '20px' }}>
					<ExportButton variant="contained" onClick={exportChartAsPDF3}>
						Export as PDF
					</ExportButton>
				</div>
			</div>
		</div>
	);
}

export default ItemProfileChart;
