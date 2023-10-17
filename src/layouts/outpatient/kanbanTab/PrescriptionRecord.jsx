import React, { useState, useEffect } from "react";
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	List,
	ListItem,
	ListItemText,
	IconButton,
	Card,
	CardContent,
	CardActions,
	Typography,
	TextField
} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';

import DeleteIcon from "@mui/icons-material/Delete";
import { displayMessage } from "store/slices/snackbarSlice";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { prescriptionRecordApi } from "api/Api";
import { useSelector } from "react-redux";
import { selectStaff } from "store/slices/staffSlice";
import MDButton from "components/MDButton";


const PrescriptionDialog = ({ open, onClose, electronicHealthRecordId }) => {

	const [prescriptionRecords, setPrescriptionRecords] = useState([]);
	const [editMode, setEditMode] = useState(false);
	const [editedRecord, setEditedRecord] = useState(null);
	const [editedFields, setEditedFields] = useState({
		medicationQuantity: "",
		dosage: "",
		description: "",
		comments: "",
	});

	const loggedInStaff = useSelector(selectStaff);

	const reduxDispatch = useDispatch();

	const getStatusColor = (status) => {
		switch (status) {
			case "COLLECTED":
				return "green";
			case "UNCOLLECTED":
				return "red";
			case "PENDING":
				return "orange";
			case "INPATIENT_TAKEN":
				return "green";
			case "INPATIENT_OVERDUE":
				return "red";
			default:
				return "black";
		}
	};

	const renderStatusWithColor = (status) => (
		<div
			style={{
				display: "inline-block",
				backgroundColor: getStatusColor(status),
				color: "white",
				borderRadius: "10px",
				padding: "5px 10px",
			}}
		>
			{status}
		</div>
	);

	const handleEdit = (prescriptionRecord) => {
		setEditMode(true);
		setEditedRecord(prescriptionRecord);
		setEditedFields({
			medicationQuantity: prescriptionRecord.medicationQuantity,
			dosage: prescriptionRecord.dosage,
			description: prescriptionRecord.description,
			comments: prescriptionRecord.comments
		});
	};

	const handleFieldChange = (field, value) => {
		setEditedFields((prev) => ({
			...prev,
			[field]: value,
		}));
	};
	const handleSaveEdit = async () => {
		try {
			if (
				editedFields.medicationQuantity <= 0 ||
				editedFields.dosage <= 0 ||
				editedFields.medicationQuantity === "" ||
				editedFields.dosage === ""
			) {
				reduxDispatch(
					displayMessage({
						color: "error",
						icon: "notification",
						title: "Error",
						content: "Please fill all the required fields with valid values.",
					})
				);
				return;
			}
			await prescriptionRecordApi.updatePrescriptionRecord(
				editedRecord.prescriptionRecordId,
				editedFields
			);
			setEditMode(false);
			fetchPrescriptionRecords();
			reduxDispatch(
				displayMessage({
					color: "success",
					icon: "notification",
					title: "Success",
					content: "Prescription Record has been updated.",
				})
			);
		} catch (error) {
			console.error("Error updating prescription record: ", error);
			reduxDispatch(
				displayMessage({
					color: "error",
					icon: "notification",
					title: "Error",
					content: error.response.data,
				})
			);
		}
	};
	const fetchPrescriptionRecords = async () => {
		try {
			const response = await prescriptionRecordApi.getAllPrescriptionRecord(electronicHealthRecordId);
			setPrescriptionRecords(response.data);
		} catch (error) {
			console.error("Error fetching prescription records: ", error);
		}
	};

	const handleDelete = async (prescriptionRecordId) => {
		const confirmDelete = window.confirm("Are you sure you want to delete this record?");
		if (confirmDelete) {
			try {
				await prescriptionRecordApi.deletePrescriptionRecord(prescriptionRecordId);
				fetchPrescriptionRecords();
				reduxDispatch(
					displayMessage({
						color: "success",
						icon: "notification",
						title: "Success",
						content: "Prescription Record has been deleted!.",
					})
				);
			} catch (error) {
				console.error("Error deleting prescription record: ", error);
				reduxDispatch(
					displayMessage({
						color: "error",
						icon: "notification",
						title: "Error",
						content: error.response.data,
					})
				);
			}
		}
	};

	useEffect(() => {
		fetchPrescriptionRecords();
	}, []);

	return (
		<Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
			<DialogTitle>Prescription Records</DialogTitle>
			<DialogContent dividers>
				{prescriptionRecords.length === 0 ? (
					<Typography variant="subtitle1" align="center">
						The patient has no prescription records.
					</Typography>
				) : (<List>
					{prescriptionRecords.map((prescriptionRecord) => (
						<Card
							key={prescriptionRecord.prescriptionRecordId}
							variant="outlined"
							style={{ backgroundColor: '#e6f2ff', marginBottom: 10 }}
						>							<CardContent>
								<Typography variant="h6">
									Prescription ID: {prescriptionRecord.prescriptionRecordId}
								</Typography>
								<div style={{ marginTop: 10 }}>
									<div><b>Created Date:</b> {prescriptionRecord.createdDate}</div>
									<br></br>
									<div>
										<b>Medication Name:</b> {prescriptionRecord.medicationName}
									</div>
									<br></br>
									<div>


										<TextField
											label="Medication Quantity"
											value={editMode ? editedFields.medicationQuantity : prescriptionRecord.medicationQuantity}
											onChange={(e) => handleFieldChange("medicationQuantity", e.target.value)}
											style={{
												background: editMode ? "#f6f6f6" : "white",
												marginRight: 10
											}}
											InputProps={{ readOnly: !editMode }}
										/>

										<TextField
											label="Dosage"
											value={editMode ? editedFields.dosage : prescriptionRecord.dosage}
											onChange={(e) => handleFieldChange("dosage", e.target.value)}
											style={{
												background: editMode ? "#f6f6f6" : "white",
												marginRight: 10
											}}
											InputProps={{ readOnly: !editMode }}
										/>

									</div>
									<br></br>

									<div>
										<TextField
											label="Description"
											value={editMode ? editedFields.description : prescriptionRecord.description}
											onChange={(e) => handleFieldChange("description", e.target.value)}
											style={{
												background: editMode ? "#f6f6f6" : "white",
												marginRight: 10
											}}
											InputProps={{ readOnly: !editMode }}
										/>

										<TextField
											label="Comments"
											value={editMode ? editedFields.comments : prescriptionRecord.comments}
											onChange={(e) => handleFieldChange("comments", e.target.value)}
											style={{
												background: editMode ? "#f6f6f6" : "white",
												marginRight: 10
											}}
											InputProps={{ readOnly: !editMode }}
										/>
									</div>
									<br></br>

									<div><b>Prescribed By:</b> {prescriptionRecord.prescribedBy}</div>
									<div>
										<b>Prescription Status:</b>{" "}
										{renderStatusWithColor(prescriptionRecord.prescriptionStatusEnum)}
									</div>
								</div>
							</CardContent>
							<CardActions style={{ justifyContent: "flex-end" }}>
								{editMode && editedRecord?.prescriptionRecordId === prescriptionRecord.prescriptionRecordId ? (
									<div>
										<Button onClick={handleSaveEdit}>Save</Button>
										<Button onClick={() => setEditMode(false)}>Cancel</Button>
									</div>
								) : (
									<>

										{loggedInStaff.staffRoleEnum === "DOCTOR" && (
											<IconButton onClick={() => handleEdit(prescriptionRecord)}>
												<EditIcon />
											</IconButton>
										)}
										{loggedInStaff.staffRoleEnum === "DOCTOR" && (
											<IconButton onClick={() => handleDelete(prescriptionRecord.prescriptionRecordId)}>
												<DeleteIcon />
											</IconButton>
										)}
										{loggedInStaff.staffRoleEnum === "DOCTOR" && (
											<Button

											>
												Add to Patient's Cart
											</Button>
										)}
									</>
								)}
							</CardActions>
						</Card>
					))}
				</List>
				)}
			</DialogContent>
			<DialogActions style={{ display: 'flex', justifyContent: 'space-between' }}>
				<Button onClick={onClose} >
					Close
				</Button>
				{loggedInStaff.staffRoleEnum === 'DOCTOR' && (
					<MDButton
						variant="gradient"
						color="primary"
					>
						Create New Prescription
					</MDButton>)}
			</DialogActions>
		</Dialog>
	);
};

export default PrescriptionDialog;
