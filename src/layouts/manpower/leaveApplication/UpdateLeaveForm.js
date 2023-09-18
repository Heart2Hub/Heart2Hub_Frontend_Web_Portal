import React, { useState, useEffect } from 'react';
import {
	Dialog,
	DialogTitle,
	DialogContent,
	TextField,
	Button,
	Grid,
	Alert,
} from '@mui/material';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ViewAllLeaves from './ViewAllLeaves';


function UpdateLeaveForm({ open, onClose, selectedRow, onUpdate }) {
	const [comments, setComments] = useState('');
	const [startDate, setStartDate] = useState('');
	const [endDate, setEndDate] = useState('');

	const [oneMonthLater, setOneMonthLater] = useState(null);
	const [sixMonthsLater, setSixMonthsLater] = useState(null);

	const [errorMessages, setErrorMessages] = useState([]);
	const [successMessage, setSuccessMessage] = useState("");

	const [isSuccessMessageVisible, setIsSuccessMessageVisible] = useState(false);
	const [isErrorMessageVisible, setIsErrorMessageVisible] = useState(false);


	useEffect(() => {


		if (!open) {
			setComments('');
			setStartDate('');
			setEndDate('');
			setErrorMessages([]);
			setSuccessMessage('');
		};


		if (selectedRow) {
			setComments(selectedRow.comments);
			setStartDate(selectedRow.startDate);
			setEndDate(selectedRow.endDate);
		}
		const currentDate = new Date();
		const oneMonthDate = new Date(currentDate);
		oneMonthDate.setDate(oneMonthDate.getDate() + 1);
		oneMonthDate.setMonth(currentDate.getMonth() + 1);

		const sixMonthsDate = new Date(currentDate);
		sixMonthsDate.setDate(sixMonthsDate.getDate() + 1);
		sixMonthsDate.setMonth(currentDate.getMonth() + 6);

		setOneMonthLater(oneMonthDate);
		setSixMonthsLater(sixMonthsDate);
	}, [open], [selectedRow], startDate, endDate);

	const handleUpdate = async() => {

		setErrorMessages([]);
		setSuccessMessage("");

		try {
			if (!startDate || !endDate) {
				setErrorMessages(["Please select both start and end dates."]);
				return;
			}

			const selectedStartDate = new Date(startDate);
			const selectedEndDate = new Date(endDate);

			if (selectedStartDate >= selectedEndDate) {
				setErrorMessages(["Start date must be earlier than the end date."]);
				return;
			}

			const updatedLeaveData = {
				comments,
				startDate,
				endDate,
			};

			const response = await axios.put(`http://localhost:8080/leave/updateLeave/${selectedRow.leaveId}/1`, updatedLeaveData, {
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${'eyJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6WyJBRE1JTiJdLCJzdWIiOiJzdGFmZjEiLCJpYXQiOjE2OTQ2NjIwNzUsImV4cCI6MTY5NTI2Njg3NX0.16DmhDzY10h2YnIXgEUWE9ZqdPRFUDvcJoawlJt2_es'}`

				},
			});

			console.log('Leave created:', response.data);
			
			setIsSuccessMessageVisible(true);

			setSuccessMessage("Leave updated successfully.");
			setTimeout(() => {
				setIsSuccessMessageVisible(false);
			}, 3000);


			// onClose();
			onUpdate(updatedLeaveData);


		} catch (error) {
			console.error('Failed to update leave:', error.message);
			setIsErrorMessageVisible(true);


			if (error.response && error.response.data) {
				const errorData = error.response.data;
				if (errorData.message === "Start date and end date must be within allowed date ranges.") {
					setErrorMessages(["Start date and end date must be within allowed date ranges."]);
				} else {
					setErrorMessages([errorData.message || "Error Updating Leave"]);
				}
			} else {
				setErrorMessages(["Please Enter a Start and End Date"]);
			}
		}

	};

	return (
		<Dialog open={open} onClose={onClose}>
			<DialogTitle>Update Leave Details</DialogTitle>
			<DialogContent>
				<Grid container spacing={2}>
					<Grid item xs={12}>
						<TextField
							label="Comments"
							fullWidth
							value={comments}
							placeholder={comments}
							onChange={(e) => setComments(e.target.value)}
						/>
					</Grid>
					<Grid item xs={6}>
						<TextField
							type="date"
							label="Start Date"
							fullWidth
							value={startDate}
							onChange={(e) => setStartDate(e.target.value)}
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
							fullWidth
							value={endDate}
							onChange={(e) => setEndDate(e.target.value)}
							InputLabelProps={{ shrink: true }}
							inputProps={{
								min: oneMonthLater ? oneMonthLater.toISOString().slice(0, 10) : "",
								max: sixMonthsLater ? sixMonthsLater.toISOString().slice(0, 10) : "",
							}}
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

			</DialogContent>
			<div style={{ padding: '16px' }}>
				<Button variant="contained" color="primary" style={{ backgroundColor: 'green', color: 'white' }} onClick={handleUpdate}>
					Update
				</Button>
				<Button variant="outlined" color="secondary" style={{ backgroundColor: 'red', color: 'white' }} onClick={onClose}>
					Cancel
				</Button>
			</div>
		</Dialog>
	);
}

export default UpdateLeaveForm;