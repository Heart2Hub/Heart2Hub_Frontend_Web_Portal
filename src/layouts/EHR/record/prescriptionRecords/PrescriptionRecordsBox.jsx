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
	TextField,
	Select,
	Box,
	MenuItem,
} from "@mui/material"; import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import ProfileInfoCard from "examples/Cards/InfoCards/ProfileInfoCard";
import React, { useState, useEffect } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from '@mui/icons-material/Edit';
import MDButton from "components/MDButton";
import InputLabel from "@mui/material/InputLabel";

import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { selectEHRRecord } from "store/slices/ehrSlice";
import { selectStaff } from "store/slices/staffSlice";
import { displayMessage } from "store/slices/snackbarSlice";
import { prescriptionRecordApi, inventoryApi } from "api/Api";
import {
	parseDateFromLocalDateTime,
	formatDateToYYYYMMDD,
} from "utility/Utility";


function PrescriptionRecordsBox() {
	const reduxDispatch = useDispatch();
	const ehrRecord = useSelector(selectEHRRecord);
	const loggedInStaff = useSelector(selectStaff);
	const [openEditDialog, setOpenEditDialog] = useState(false);
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
	const [selectedRecord, setSelectedRecord] = useState(null);
	const [inventoryItems, setInventoryItems] = useState([]);
	const [inventoryItemsAllergy, setInventoryItemsAllergy] = useState([]);
	const [editedRecord, setEditedRecord] = useState(null);
	const [prescriptionRecords, setPrescriptionRecords] = useState([]);
	const [selectedInventoryItem, setSelectedInventoryItem] = useState("");
	const [openForm, setOpenForm] = useState(false);

	const [newRecord, setNewRecord] = useState({
		medicationName: "",
		medicationQuantity: 0,
		dosage: 0,
		description: "",
		comments: "",
		prescriptionStatusEnum: "", // Set the initial value according to your enum options
		inventoryItem: "", // Set the initial value according to your medication options
		expirationDate: ""
	});
	const handleCloseForm = () => {
		clearFormFields();
		setOpenForm(false);
	};
	const handleOpenForm = () => {
		setOpenForm(true);
	};
	const fetchPrescriptionRecords = async () => {
		try {
			const response = await prescriptionRecordApi.getAllPrescriptionRecord(ehrRecord.electronicHealthRecordId);
			setPrescriptionRecords(response.data);
			console.log(response.data)
		} catch (error) {
			console.error("Error fetching prescription records: ", error);
		}
	};

	const handleCreateFieldChange = (field, value) => {
		setNewRecord((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	const handleCreatePrescription = async () => {
		try {
			if (
				newRecord.dosage <= 0 ||
				newRecord.dosage === "" ||
				newRecord.inventoryItem === ""
				// newRecord.prescriptionStatusEnum === ""
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


			const existsInAllergy = inventoryItemsAllergy.some(
				(item) => item.inventoryItemId === selectedInventoryItem
			    );
		    
			    if (!existsInAllergy) {
				reduxDispatch(
					displayMessage({
						color: "error",
						icon: "notification",
						title: "Error",
						content: "Patient has allergy restrictions from selected Medication.",
					})
				);
				return;	
			    }

			// const options = {
			// 	day: '2-digit',
			// 	month: '2-digit',
			// 	year: 'numeric',
			// 	hour: '2-digit',
			// 	minute: '2-digit',
			// 	second: '2-digit',
			// 	hour12: false, // Use 24-hour format
			// };
			// const currentDate = new Date().toLocaleString('en-GB', options);
			const currentDate = new Date()

			const date = new Date(newRecord.expirationDate);
			console.log(currentDate);

			const formattedDate = `${("0" + date.getDate()).slice(-2)}/${("0" + (date.getMonth() + 1)).slice(-2)}/${date.getFullYear()}, 00:00:00`;
			const formattedCurrentDate = `${("0" + currentDate.getDate()).slice(-2)}/${("0" + (currentDate.getMonth() + 1)).slice(-2)}/${currentDate.getFullYear()}, 00:00:00`;

			console.log(selectedInventoryItem);

			// Update the newRecord object with the required fields
			const updatedRecord = {
				...newRecord,
				createdDate: formattedCurrentDate,
				expirationDate: formattedDate,
				prescribedBy: `Doctor ${loggedInStaff.firstname} ${loggedInStaff.lastname}`,
				prescriptionStatusEnum: "ONGOING"
			};
			console.log(updatedRecord);

			const response = await prescriptionRecordApi.createNewPrescriptionRecord(updatedRecord, ehrRecord.electronicHealthRecordId, selectedInventoryItem)
			console.log("New record data:", response.data);

			reduxDispatch(
				displayMessage({
					color: "success",
					icon: "notification",
					title: "Success",
					content: "New prescription record created successfully.",
				})
			);
			fetchPrescriptionRecords();
			setOpenForm(false)
			setNewRecord({
				medicationName: "",
				medicationQuantity: 0,
				dosage: 0,
				description: "",
				comments: "",
				prescriptionStatusEnum: "",
				selectedInventoryItem: "",
			});
		} catch (error) {
			console.error("Error creating new prescription record:", error);
			reduxDispatch(
				displayMessage({
					color: "error",
					icon: "notification",
					title: "Error",
					content: "Failed to create a new prescription record. Please try again.",
				})
			);
		}
	};

	const handleEditPrescription = async () => {
		try {
			console.log(editedRecord)
			if (
				//editedRecord.medicationQuantity <= 0 ||
				editedRecord.dosage <= 0 ||
				//editedRecord.medicationQuantity === "" ||
				editedRecord.dosage === ""
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
				editedRecord
			);

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
	const clearFormFields = () => {
		setNewRecord({
			medicationName: "",
			medicationQuantity: 0,
			dosage: 0,
			description: "",
			comments: "",
			prescriptionStatusEnum: "",
			selectedInventoryItem: "",
		});
	};

	const getStatusColor = (status) => {
		switch (status) {
			case "ONGOING":
				return "green";
			case "EXPIRED":
				return "red";
			// case "PENDING":
			// 	return "orange";
			// case "INPATIENT_TAKEN":
			// 	return "green";
			// case "INPATIENT_OVERDUE":
			// 	return "red";
			default:
				return "green";
		}
	};

	const prescriptionStatusOptions = [
		"COLLECTED",
		"UNCOLLECTED",
		"PENDING",
		"INPATIENT_TAKEN",
		"INPATIENT_OVERDUE"
	];

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

	const handleEdit = (record) => {
		setSelectedRecord(record);
		setEditedRecord({
			prescriptionRecordId: record.prescriptionRecordId,
			expirationDate: record.expirationDate,
			dosage: record.dosage,
			description: record.description,
			comments: record.comments,
		});
		setOpenEditDialog(true);
	};

	const handleDelete = (record) => {
		setSelectedRecord(record);
		setOpenDeleteDialog(true);
	};

	const handleEditDialogClose = () => {

		setOpenEditDialog(false);
	};

	const handleDeleteDialogClose = () => {
		setOpenDeleteDialog(false);
	};

	const handleConfirmDelete = async () => {
		try {
			await prescriptionRecordApi.deletePrescriptionRecord(selectedRecord);
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
			// Handle error here
			console.error('Error deleting prescription record: ', error);
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
		setOpenDeleteDialog(false);
	};

	const fetchInventoryItems = async () => {
		try {
			const response = await inventoryApi.getAllMedication();
			setInventoryItems(response.data);
			const response2 = await inventoryApi.getAllMedicationsByAllergy(ehrRecord.electronicHealthRecordId);
			setInventoryItemsAllergy(response2.data);

			console.log(response.data)
			console.log(response2.data)
		} catch (error) {
			console.error("Error fetching inventory items: ", error);
		}
	};
	function formatDate(expirationDateArray) {
		const [year, month, day] = expirationDateArray;
		const formattedDate = new Date(year, month - 1, day).toLocaleDateString('en-GB');
		return formattedDate;
	}
	useEffect(() => {
		fetchInventoryItems();
		fetchPrescriptionRecords();
	}, []);


	return (
		<>
			<Card
				variant="outlined"
				style={{ backgroundColor: "white", padding: 20, borderRadius: 12, boxShadow: "0 6px 12px rgba(0, 0, 0, 0.1)" }}
			>
				<Box display="flex" justifyContent="space-between" pb={2}>
					<MDTypography variant="h6" gutterBottom align="left">
						List of Prescription Records
					</MDTypography>
					{loggedInStaff.staffRoleEnum === 'DOCTOR' && (
						<MDButton
							variant="gradient"
							color="primary"
							onClick={handleOpenForm}
						>
							Create New Prescription
						</MDButton>
					)}
				</Box>
				{prescriptionRecords.map((pr, index) => {


					return (
						<Card key={index} variant="outlined" style={{ marginBottom: 10, backgroundColor: "#f8f8f8" }}>
							<CardContent>
								<Typography variant="h6">
									Prescription ID: {pr.prescriptionRecordId}
								</Typography>
								<div style={{ marginTop: 10 }}>
									<div><b>Expiration Date:</b> {formatDate(pr.expirationDate)}</div>
									<div>
										<b>Medication Name:</b> {pr.medicationName}
									</div>
									{/* <div>
              <b>Medication Quantity:</b> {pr.medicationQuantity}
            </div> */}
									<div>
										<b>Quantity:</b> {pr.dosage}
									</div>
									<div>
										<b>Description:</b> {pr.description}
									</div>
									<div>
										<b>Dosage Comments:</b> {pr.comments}
									</div>
									<div><b>Prescribed By:</b> {pr.prescribedBy}</div>
									<div>
										<b>Prescription Status:</b>{" "}
										{renderStatusWithColor(pr.prescriptionStatusEnum)}
									</div>
								</div>
							</CardContent>
							<CardActions style={{ justifyContent: "flex-end" }}>
								{loggedInStaff.staffRoleEnum === "DOCTOR" && (
									<IconButton onClick={() => handleEdit(pr)}>
										<EditIcon />
									</IconButton>
								)}
								{loggedInStaff.staffRoleEnum === "DOCTOR" && (
									<IconButton onClick={() => handleDelete(pr.prescriptionRecordId)}>
										<DeleteIcon />
									</IconButton>
								)}
							</CardActions>
						</Card>
					);
				})}
			</Card>
			<Dialog open={openEditDialog} onClose={handleEditDialogClose}>
				{/* Add your edit form here to update the record's information */}
			</Dialog>
			<Dialog open={openDeleteDialog} onClose={handleDeleteDialogClose}>
				<DialogTitle>Confirm Delete</DialogTitle>
				<DialogContent>
					<Typography>
						Are you sure you want to delete this record?
					</Typography>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleDeleteDialogClose} color="primary">
						Cancel
					</Button>
					<Button onClick={handleConfirmDelete} color="secondary">
						Delete
					</Button>
				</DialogActions>
			</Dialog>
			<Dialog open={openForm} onClose={handleCloseForm} fullWidth maxWidth="md">
				<DialogTitle>Create New Prescription</DialogTitle>
				<DialogContent dividers>
					{/* <TextField
						label="Medication Name"
						value={newRecord.medicationName}
						onChange={(e) => handleCreateFieldChange("medicationName", e.target.value)}
						fullWidth
						margin="normal"
					/> */}
					<InputLabel>Select Medication</InputLabel>

					<Select
						value={selectedInventoryItem} // Use the selectedInventoryItem state to manage the selection
						onChange={(e) => {
							handleCreateFieldChange("inventoryItem", e.target.value);
							setSelectedInventoryItem(e.target.value); // Update the selected inventory item
						}}
						displayEmpty
						fullWidth
						margin="normal"
						sx={{ lineHeight: "3em" }}
					>
						<MenuItem value="" disabled>
							Select Medication
						</MenuItem>
						{inventoryItems.map((item) => (
							<MenuItem key={item.inventoryItemId} value={item.inventoryItemId}>
								{item.inventoryItemName}
							</MenuItem>
						))}
					</Select>
					{/* <TextField
						label="Medication Quantity"
						type="number"
						value={newRecord.medicationQuantity}
						onChange={(e) => handleCreateFieldChange("medicationQuantity", e.target.value)}
						fullWidth
						margin="normal"
					/> */}
					<TextField
						label="Quantity"
						type="number"
						value={newRecord.dosage}
						onChange={(e) => handleCreateFieldChange("dosage", e.target.value)}
						fullWidth
						margin="normal"
					/>
					<TextField
						label="Description"
						value={newRecord.description}
						onChange={(e) => handleCreateFieldChange("description", e.target.value)}
						fullWidth
						margin="normal"
					/>
					<TextField
						label="Dosage Comments"
						value={newRecord.comments}
						onChange={(e) => handleCreateFieldChange("comments", e.target.value)}
						fullWidth
						margin="normal"
					/>
					<TextField
						id="expiration-date"
						label="Expiration Date"
						type="date"
						value={newRecord.expirationDate}
						onChange={(e) => handleCreateFieldChange("expirationDate", e.target.value)}
						InputLabelProps={{
							shrink: true,
						}}
						fullWidth
						margin="normal"
					/>
					{/* <InputLabel>Select Prescription Status</InputLabel>
					<Select
						value={newRecord.prescriptionStatusEnum}
						onChange={(e) => handleCreateFieldChange("prescriptionStatusEnum", e.target.value)}
						displayEmpty
						fullWidth
						margin="normal"
						sx={{ lineHeight: "3em" }}
					>
						{/* <MenuItem value="" disabled>
							Select Prescription Status
						</MenuItem> */}
					{/* {prescriptionStatusOptions.map((option, index) => (
							<MenuItem key={index} value={option}>
								{option}
							</MenuItem>
						))}
					</Select> */}


				</DialogContent>
				<DialogActions>
					<Button onClick={handleCloseForm}>Cancel</Button>
					<Button onClick={() => {
						handleCreatePrescription();
						//clearFormFields();
					}} color="primary">
						Create
					</Button>
				</DialogActions>
			</Dialog>
			<Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
				<DialogTitle>Edit Prescription Record</DialogTitle>
				<DialogContent dividers>
					{/* <TextField
						label="Medication Quantity"
						type="number"
						value={editedRecord ? editedRecord.medicationQuantity : ''}
						onChange={(e) => setEditedRecord({ ...editedRecord, medicationQuantity: e.target.value })}
						fullWidth
						margin="normal"
					/> */}
					<TextField
						label="Quantity"
						type="number"
						value={editedRecord ? editedRecord.dosage : ''}
						onChange={(e) => setEditedRecord({ ...editedRecord, dosage: e.target.value })}
						fullWidth
						margin="normal"
					/>
					<TextField
						label="Description"
						value={editedRecord ? editedRecord.description : ''}
						onChange={(e) => setEditedRecord({ ...editedRecord, description: e.target.value })}
						fullWidth
						margin="normal"
					/>
					<TextField
						label="Dosage Comments"
						value={editedRecord ? editedRecord.comments : ''}
						onChange={(e) => setEditedRecord({ ...editedRecord, comments: e.target.value })}
						fullWidth
						margin="normal"
					/>
					<TextField
						id="expiration-date"
						label="Expiration Date"
						type="date"
						value={editedRecord ? editedRecord.expirationDate : ''}
						onChange={(e) => setEditedRecord({ ...editedRecord, expirationDate: e.target.value })} InputLabelProps={{
							shrink: true,
						}}
						fullWidth
						margin="normal"
					/>
					{/* <InputLabel>Select Prescription Status</InputLabel>
					<Select
						value={editedRecord ? editedRecord.prescriptionStatusEnum : ''}
						onChange={(e) => setEditedRecord({ ...editedRecord, prescriptionStatusEnum: e.target.value })}
						displayEmpty
						fullWidth
						margin="normal"
						sx={{ lineHeight: '3em' }}
					>
						{prescriptionStatusOptions.map((option, index) => (
							<MenuItem key={index} value={option}>
								{option}
							</MenuItem>
						))}
					</Select> */}
				</DialogContent>
				<DialogActions>
					<Button onClick={handleEditDialogClose}>Cancel</Button>
					<Button onClick={handleEditPrescription} color="primary">
						Save
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
}

export default PrescriptionRecordsBox;
