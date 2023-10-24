import React, { useState } from 'react';
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	TextField,
} from '@mui/material';
import { displayMessage } from "store/slices/snackbarSlice";
import { useDispatch } from "react-redux";
import { invoiceApi } from "api/Api";


const CreateInsuranceClaimDialog = ({ isOpen, onClose, onCreate, invoiceId, fetchData }) => {
	const [insuranceClaimData, setInsuranceClaimData] = useState({
		insuranceClaimDateApplied: '',
		insuranceClaimAmount: 0,
		insurerName: '',
		isPrivateInsurer: false,
	});

	const reduxDispatch = useDispatch();


	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setInsuranceClaimData((prevData) => ({
			...prevData,
			[name]: value,
		}));
	};

	const handleCreate = async () => {
		try {
			const requestBody = {
				insurerName: insuranceClaimData.insurerName,
				insuranceClaimAmount: insuranceClaimData.insuranceClaimAmount,
				isPrivateInsurer: insuranceClaimData.isPrivateInsurer,
			};
			console.log(requestBody)
			console.log(invoiceId)

			const response = invoiceApi.createInsuranceClaim(invoiceId, requestBody)
			console.log('Create Insurance Claim Response:', response.data);
			onCreate(insuranceClaimData);
			fetchData()
			reduxDispatch(
				displayMessage({
					color: "success",
					icon: "notification",
					title: "Success",
					content: "Insurance Claim Created!.",
				})
			);
		} catch (error) {
			console.error('Error creating insurance claim:', error);
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
			<DialogTitle>Create Insurance Claim</DialogTitle>
			<DialogContent>

				<TextField
					fullWidth
					label="Claim Amount"
					type="number"
					name="insuranceClaimAmount"
					value={insuranceClaimData.insuranceClaimAmount}
					onChange={handleInputChange}
				/>
				<TextField
					fullWidth
					label="Insurer Name"
					name="insurerName"
					value={insuranceClaimData.insurerName}
					onChange={handleInputChange}
				/>
				<div>
					<label>Is Private Insurer: </label>
					<input
						type="checkbox"
						checked={insuranceClaimData.isPrivateInsurer}
						onChange={(e) =>
							setInsuranceClaimData((prevData) => ({
								...prevData,
								isPrivateInsurer: e.target.checked,
							}))
						}
					/>
				</div>
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

export default CreateInsuranceClaimDialog;
