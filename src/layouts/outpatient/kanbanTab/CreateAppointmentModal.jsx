import React, { useState, useEffect } from "react";
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
import { useForm, Controller, reset } from "react-hook-form";
import { selectStaff } from "../../../store/slices/staffSlice";
import { useDispatch, useSelector } from "react-redux";
import { patientApi, appointmentApi } from "api/Api";
import { displayMessage } from "../../../store/slices/snackbarSlice";

function CreateAppointmentModal({ isOpen, onClose, onAppointmentCreated }) {
	const reduxDispatch = useDispatch();

	const staff = useSelector(selectStaff);
	const [nric, setNric] = useState('');
	const [time, setTime] = useState('');
	const [description, setDescription] = useState('');
	//const singaporeTimeOptions = { timeZone: 'Asia/Singapore' };

	const currentD = new Date();

	currentD.setHours((currentD.getHours() + 1) % 24);
	// currentD.setMinutes(0);
	// currentD.setSeconds(0);


	const year = currentD.getFullYear();
	let day = String(currentD.getDate()).padStart(2, '0');
	const month = String(currentD.getMonth() + 1).padStart(2, '0'); // Adding 1 to month as it's zero-based
	const hours = String(currentD.getHours()).padStart(2, '0');
	const minutes = String(currentD.getMinutes()).padStart(2, '0');
	const seconds = String(currentD.getSeconds()).padStart(2, '0');
	const milliseconds = String(currentD.getMilliseconds()).padStart(3, '0');

	let currentDate = `${year}-${month}-${day}T${String(currentD.getHours() - 1).padStart(2, '0')}:${minutes}:${seconds}.${milliseconds}`;

	if (currentD.getHours() === 0) {
		day = String(currentD.getDate() + 1).padStart(2, '0');
		currentDate = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}`;

	}


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
		const actualDateTime = `${year}-${month}-${day}T${time}:10.000`;

		const appointmentData = {
			description: description,
			actualDateTime: actualDateTime, // Set to current date time
			bookedDateTime: currentDate, // Use the state valuee
			priority: data.priority,
			patientUsername: nric,
			departmentName: staff.unit.name,
		};

		console.log(appointmentData)


		appointmentApi
			.createNewAppointmentOnWeb(appointmentData.description, appointmentData.actualDateTime, appointmentData.bookedDateTime,
				appointmentData.priority, appointmentData.patientUsername, appointmentData.departmentName)
			.then((response) => {
				console.log("Appointment created:", response.data);

				//setTime("");
				setDescription("");
				onAppointmentCreated();
				setNric("");
				reset();
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
		reset();
		setNric("");
		onClose();
	};

	useEffect(() => {

		setTime(`${(currentD.getHours()).toString().padStart(2, '0')}:00`);

	}, []);

	return (
		<Modal open={isOpen} onClose={onClose}>
			<Box sx={style}>
				<h2>Create Appointment</h2>
				<h3>Date: {year}-{month}-{day}</h3>
				<h3>Time: {time}</h3>
				<form onSubmit={handleSubmit(onSubmit)}>

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

					<TextField
						label="NRIC"
						fullWidth
						margin="normal"
						name="nric"
						value={nric}
						onChange={(e) => setNric(e.target.value)}
					/>

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
