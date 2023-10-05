import React, { useState, useEffect, useRef } from "react";
import {
	Modal,
	Button,
	Box,
	TextField,
	TextareaAutosize,
	Select,
	MenuItem,
	FormControl,
	InputLabel,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { selectStaff } from "../../../store/slices/staffSlice";
import { useDispatch, useSelector } from "react-redux";
import { patientApi, appointmentApi } from "api/Api";
import { displayMessage } from "../../../store/slices/snackbarSlice";

function CreateAppointmentModal({ isOpen, onClose }) {
	const reduxDispatch = useDispatch();

	const staff = useSelector(selectStaff);
	const [patients, setPatients] = useState([]);
	const [time, setTime] = useState('');
	const [description, setDescription] = useState('');
	//const singaporeTimeOptions = { timeZone: 'Asia/Singapore' };

	const currentD = new Date();

	const year = currentD.getFullYear();
	const day = String(currentD.getDate()).padStart(2, '0');
	const month = String(currentD.getMonth() + 1).padStart(2, '0'); // Adding 1 to month as it's zero-based
	const hours = String(currentD.getHours()).padStart(2, '0');
	const minutes = String(currentD.getMinutes()).padStart(2, '0');
	const seconds = String(currentD.getSeconds()).padStart(2, '0');
	const milliseconds = String(currentD.getMilliseconds()).padStart(3, '0');

	const currentDate = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}`;


	const style = {
		position: "absolute",
		top: "50%",
		left: "50%",
		transform: "translate(-50%, -50%)",
		width: "25%",
		bgcolor: "background.paper",
		border: "2px solid #000",
		boxShadow: 24,
		p: 4,
		borderRadius: "15px",
	};

	const { handleSubmit, control, reset } = useForm();

	// Define your appointment creation form here
	const onSubmit = (data) => {
		console.log(data);
		console.log(time)

		const n = new Date();

		// Ensure that the selected time is not earlier than the current time
		const et = time.split(":");
		const appointmentDate = new Date(year, month - 1, day, et[0], et[1]);

		if (appointmentDate < n) {
			reduxDispatch(
				displayMessage({
					color: "error",
					icon: "notification",
					title: "Invalid Appointment Time",
					content: "Appointment time cannot be earlier than the current time.",
				})
			);
			return; // Don't proceed with appointment creation
		}

		const now = new Date();
		const defaultDate = new Date(
			Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
		).toISOString().slice(0, 10);


		console.log(new Date())
		console.log(defaultDate)
		const enteredTime = time; // Entered time from the form
		const actualDateTime = `${defaultDate}T${enteredTime}:10.000`; // Combine date and time

		const appointmentData = {
			description: description,
			actualDateTime: actualDateTime, // Set to current date time
			bookedDateTime: currentDate, // Use the state valuee
			priority: data.priority,
			patientUsername: data.patient,
			departmentName: staff.unit.name,
		};

		console.log(appointmentData)


		appointmentApi
			.createNewAppointment(appointmentData.description, appointmentData.actualDateTime, appointmentData.bookedDateTime,
				appointmentData.priority, appointmentData.patientUsername, appointmentData.departmentName)
			.then((response) => {
				console.log("Appointment created:", response.data);

				setTime("");
				setDescription("");
				onClose();
				reduxDispatch(
					displayMessage({
						color: "success",
						icon: "notification",
						title: "Successfully Created Appointment!",
					})
				);

			})
			.catch((error) => {
				reduxDispatch(
					displayMessage({
						color: "error",
						icon: "notification",
						title: "Error Encountered",
						content: error.response.data,
					})
				);
				console.error("Error fetching data:", error);
			});
	};


	const handleCancel = () => {
		// Reset the form fields to their initial values
		reset();
		// Close the modal
		onClose();
	};

	const fetchPatientUsername = async () => {
		patientApi
			.getAllPatientUsername()
			.then((response) => {
				const patients = response.data;
				console.log(patients);

				setPatients(patients)
			})
			.catch((error) => {
				console.error("Error fetching data:", error);
			});
	};

	useEffect(() => {
		fetchPatientUsername();
	}, []);

	return (
		<Modal open={isOpen} onClose={onClose}>
			<Box sx={style}>
				<h2>Create Appointment</h2>
				<h3>Date: {year}-{month}-{day}</h3>
				<form onSubmit={handleSubmit(onSubmit)}>
					{/* <TextField
						label="Date"
						type="date"
						InputLabelProps={{
							shrink: true,
						}}
						defaultValue={defaultDate}
						disabled
						fullWidth
						margin="normal"
					/> */}
					<TextField
						label="Time"
						type="time"
						InputLabelProps={{
							shrink: true,
						}}
						value={time}
						onChange={(e) => setTime(e.target.value)}
						fullWidth
						margin="normal"
						name="time" // Make sure the name matches the Controller field name
						control={control}
					/>
					<TextareaAutosize
						minRows={3}
						label="Description"
						placeholder="Description"
						fullWidth
						margin="normal"
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						// Use Controller to register the Description field
						name="description"
						control={control}
						style={{ width: '100%' }} // Set the width to 100%
					/>
					<FormControl fullWidth margin="normal">
						<InputLabel htmlFor="priority">Priority</InputLabel>
						<Controller
							name="priority"
							control={control}
							render={({ field }) => (
								<Select
									{...field}
									label="Priority"
									labelId="priority"
									id="priority"
									sx={{ lineHeight: "3em" }}
								>
									{/* Replace with your list of priority enums */}
									<MenuItem value="HIGH">HIGH</MenuItem>
									<MenuItem value="MEDIUM">MEDIUM</MenuItem>
									<MenuItem value="LOW">LOW</MenuItem>
								</Select>
							)}
						/>
					</FormControl>

					<FormControl fullWidth margin="normal">
						<InputLabel htmlFor="patient">Patient Username</InputLabel>
						<Controller
							name="patient"
							control={control}
							render={({ field }) => (
								<Select
									{...field}
									label="Patients"
									labelId="patient"
									id="patient"
									sx={{ lineHeight: "3em" }}
								>
									{/* Populate the Select component with patients */}
									{patients.map((patients) => (
										<MenuItem key={patients} value={patients}>
											{patients}
										</MenuItem>
									))}
								</Select>
							)}
						/>
					</FormControl>

					<TextField
						label="Department"
						fullWidth
						margin="normal"
						name="department"
						control={control}
						defaultValue={staff.unit.name} // Set the default value here
						InputProps={{
							readOnly: true, // Make the field read-only
						}}
					/>

					<div style={{ display: "flex", justifyContent: "space-between" }}></div>
					<Button variant="contained" color="primary" sx={{ marginRight: "8px" }} style={{ backgroundColor: 'red', color: 'white' }} onClick={handleCancel} >Cancel</Button>
					<Button variant="contained" color="primary" sx={{ marginLeft: "8px" }} type="submit" style={{ backgroundColor: 'green', color: 'white' }}>Create</Button>


				</form>
			</Box>
		</Modal>
	);
}

export default CreateAppointmentModal;
