import React, { useState } from 'react';
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	TextField,
	InputLabel
} from '@mui/material';
import { displayMessage } from "store/slices/snackbarSlice";
import { useDispatch } from "react-redux";
import { invoiceApi } from "api/Api";
import { Label } from '@mui/icons-material';


const CreateMedishieldClaimDialog = ({ isOpen, onClose, invoiceId, fetchData, handleEdit }) => {
	const [medishieldClaimData, setMedishieldClaimData] = useState({
		medishieldClaimDateApplied: '',
		medishieldClaimAmount: 0,
		// approvalStatusEnum: '',
	});

	const reduxDispatch = useDispatch();

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setMedishieldClaimData((prevData) => ({
			...prevData,
			[name]: value,
		}));
	};

	const handleCreate = async () => {
		try {
			const requestBody = {
				medishieldClaimAmount: medishieldClaimData.medishieldClaimAmount,
				//approvalStatusEnum: medishieldClaimData.approvalStatusEnum,
			};

			const response = await invoiceApi.createMedishieldClaim(invoiceId, requestBody);
			console.log('Create Medishield Claim Response:', response.data);
			const invoiceResponse = await invoiceApi.findInvoice(invoiceId);
                        handleEdit(invoiceResponse.data);
			fetchData();
			reduxDispatch(
				displayMessage({
					color: "success",
					icon: "notification",
					title: "Success",
					content: "Medishield Claim Created!.",
				})
			);
		} catch (error) {
			console.error('Error creating Medishield claim:', error);
			reduxDispatch(
				displayMessage({
					color: "error",
					icon: "notification",
					title: "Error",
					content: error.response.data,
				})
			);
		}
		onClose();
	};

	return (
		<Dialog open={isOpen} onClose={onClose}>
			<DialogTitle>Create Medishield Claim</DialogTitle>
			<DialogContent>
			<InputLabel sx={{ paddingBottom: "8px" }}>Claim Amount</InputLabel>
				<TextField
					fullWidth
					// label="Claim Amount"
					type="number"
					name="medishieldClaimAmount"
					value={medishieldClaimData.medishieldClaimAmount}
					onChange={handleInputChange}
				/>
				{/* <TextField
					fullWidth
					label="Approval Status"
					name="approvalStatusEnum"
					value={medishieldClaimData.approvalStatusEnum}
					onChange={handleInputChange}
				/> */}
			</DialogContent>
			<DialogActions>
				<Button onClick={handleCreate} color="primary">
					Create
				</Button>
				<Button onClick={onClose} color="primary">
					Cancel
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default CreateMedishieldClaimDialog;
