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
	TextField,
	Select,
	MenuItem,
} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import InputLabel from "@mui/material/InputLabel";
import RefreshIcon from '@mui/icons-material/Refresh';


import DeleteIcon from "@mui/icons-material/Delete";
import { displayMessage } from "store/slices/snackbarSlice";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { prescriptionRecordApi, inventoryApi } from "api/Api";
import { useSelector } from "react-redux";
import { selectStaff } from "store/slices/staffSlice";
import MDButton from "components/MDButton";
import dayjs from 'dayjs'


const PrescriptionDialog = ({ open, onClose, electronicHealthRecordId, handlePageRefresh }) => {

	const [prescriptionRecords, setPrescriptionRecords] = useState([]);
	const [editMode, setEditMode] = useState(false);
	const [inventoryItems, setInventoryItems] = useState([]);
	const [editedRecord, setEditedRecord] = useState(null);
	const [selectedInventoryItem, setSelectedInventoryItem] = useState("");

	const [editedFields, setEditedFields] = useState({
		medicationQuantity: "",
		dosage: "",
		description: "",
		comments: "",
	});
	const [openForm, setOpenForm] = useState(false);
	const [newRecord, setNewRecord] = useState({
		medicationName: "",
		medicationQuantity: 0,
		dosage: 0,
		description: "",
		comments: "",
		prescriptionStatusEnum: "", // Set the initial value according to your enum options
		inventoryItem: "" // Set the initial value according to your medication options
	});

	const handleOpenForm = () => {
		setOpenForm(true);
	};

	const handleCloseForm = () => {
		clearFormFields();
		setOpenForm(false);
	};


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

	const handleAddToCart = async (prescriptionId, ehrId) => {
		try {
			const response = await prescriptionRecordApi.checkOutPrescriptionRecord(prescriptionId, ehrId);
			fetchPrescriptionRecords();
			handlePageRefresh();
			reduxDispatch(
				displayMessage({
					color: "success",
					icon: "notification",
					title: "Success",
					content: "Prescription added to patient's cart!",
				})
			);
		} catch (error) {
			console.error("Error adding prescription to cart: ", error);
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


	const handleEdit = (prescriptionRecord) => {
		setEditMode(true);
		setEditedRecord(prescriptionRecord);
		setEditedFields({
			medicationQuantity: prescriptionRecord.medicationQuantity,
			dosage: prescriptionRecord.dosage,
			description: prescriptionRecord.description,
			comments: prescriptionRecord.comments,
		});

	};

	const handleFieldChange = (field, value) => {
		setEditedFields((prev) => ({
			...prev,
			[field]: value,
		}));
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
				newRecord.medicationQuantity <= 0 ||
				newRecord.dosage <= 0 ||
				newRecord.medicationQuantity === "" ||
				newRecord.dosage === "" ||
				newRecord.inventoryItem === "" ||
				newRecord.prescriptionStatusEnum === ""
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
			const currentDate = new Date().toLocaleString();

			console.log(selectedInventoryItem);

			// Update the newRecord object with the required fields
			const updatedRecord = {
				...newRecord,
				createdDate: currentDate,
				prescribedBy: `Doctor ${loggedInStaff.firstname} ${loggedInStaff.lastname}`,
			};
			console.log(updatedRecord);

			const response = await prescriptionRecordApi.createNewPrescriptionRecord(updatedRecord, electronicHealthRecordId, selectedInventoryItem)
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
		console.log(prescriptionRecordId)
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

	const fetchInventoryItems = async () => {
		try {
			const response = await inventoryApi.getAllMedication("");
			setInventoryItems(response.data);
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
		<Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
			<DialogTitle>Prescription Records
				<IconButton
					onClick={fetchPrescriptionRecords}
					aria-label="refresh"
				>
					<RefreshIcon />
				</IconButton>
			</DialogTitle>

			<DialogContent dividers>
				{prescriptionRecords.filter((prescriptionRecord) => {
					const expirationDate = new Date(
						prescriptionRecord.expirationDate[0],
						prescriptionRecord.expirationDate[1] - 1,
						prescriptionRecord.expirationDate[2]
					);
					const today = new Date();
					return expirationDate > today;
				}).length === 0 ? (
					<Typography variant="subtitle1" align="center">
						Patient has no Prescription Records.
					</Typography>
				) : (
					<List>
						{prescriptionRecords
							.filter((prescriptionRecord) => {
								const expirationDate = new Date(
									prescriptionRecord.expirationDate[0],
									prescriptionRecord.expirationDate[1] - 1,
									prescriptionRecord.expirationDate[2]
								);
								const today = new Date();
								return expirationDate > today;
							})
							.map((prescriptionRecord) => (

								<Card
									key={prescriptionRecord.prescriptionRecordId}
									variant="outlined"
									style={{ backgroundColor: '#e6f2ff', marginBottom: 10 }}
								>							<CardContent>
										<Typography variant="h6">
											Prescription ID: {prescriptionRecord.prescriptionRecordId}
										</Typography>
										<div style={{ marginTop: 10 }}>
											{/* <div><b>Created Date:</b> {prescriptionRecord.createdDate}</div> */}
											<div><b>Expiration Date:</b> {formatDate(prescriptionRecord.expirationDate)}</div>
											<div>
												<b>Medication Name:</b> {prescriptionRecord.medicationName}
											</div>
											{/* <div>
										<b>Medication Quantity:</b> {prescriptionRecord.medicationQuantity}
									</div> */}
											<div>
												<b>Dosage:</b> {prescriptionRecord.dosage}
											</div>
											<div>
												<b>Description:</b> {prescriptionRecord.description}
											</div>
											<div>
												<b>Comments:</b> {prescriptionRecord.comments}
											</div>
											<div><b>Prescribed By:</b> {prescriptionRecord.prescribedBy}</div>
											<div><b>Last Collect Date:</b> {prescriptionRecord.lastCollectDate ? dayjs(prescriptionRecord.lastCollectDate, "YYYY-MM-DD HH:mm:ss").format("DD/MM/YYYY") : "-"}</div>
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

												{/* {loggedInStaff.staffRoleEnum === "DOCTOR" && (
											<IconButton onClick={() => handleEdit(prescriptionRecord)}>
												<EditIcon />
											</IconButton>
										)}
										{loggedInStaff.staffRoleEnum === "DOCTOR" && (
											<IconButton onClick={() => handleDelete(prescriptionRecord.prescriptionRecordId)}>
												<DeleteIcon />
											</IconButton>
										)} */}
										{(loggedInStaff.staffRoleEnum === "DOCTOR" || loggedInStaff.staffRoleEnum === "PHARMACIST") &&(
											<Button onClick={() => handleAddToCart(prescriptionRecord.prescriptionRecordId, electronicHealthRecordId)}>
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
				{/* {loggedInStaff.staffRoleEnum === 'DOCTOR' && (
					<MDButton
						variant="gradient"
						color="primary"
						onClick={handleOpenForm}
					>
						Create New Prescription
					</MDButton>)} */}
			</DialogActions>
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
					<TextField
						label="Medication Quantity"
						type="number"
						value={newRecord.medicationQuantity}
						onChange={(e) => handleCreateFieldChange("medicationQuantity", e.target.value)}
						fullWidth
						margin="normal"
					/>
					<TextField
						label="Dosage"
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
						label="Comments"
						value={newRecord.comments}
						onChange={(e) => handleCreateFieldChange("comments", e.target.value)}
						fullWidth
						margin="normal"
					/>
					<InputLabel>Select Prescription Status</InputLabel>
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
						{prescriptionStatusOptions.map((option, index) => (
							<MenuItem key={index} value={option}>
								{option}
							</MenuItem>
						))}
					</Select>


				</DialogContent>
				<DialogActions>
					<Button onClick={handleCloseForm}>Cancel</Button>
					<Button onClick={() => {
						handleCreatePrescription();
						clearFormFields();
					}} color="primary">
						Create
					</Button>
				</DialogActions>
			</Dialog>
		</Dialog>

	);
};

export default PrescriptionDialog;
