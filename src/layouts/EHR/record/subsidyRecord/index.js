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
	Grid,
	TableContainer,
	Table,
	TableCell,
	TableRow,
	TableHead,
	TableBody,
	CardActions,
	Typography,
	Chip,
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
import { prescriptionRecordApi, inventoryApi, subsidyApi } from "api/Api";

function Subsidies() {
	const reduxDispatch = useDispatch();
	const ehrRecord = useSelector(selectEHRRecord);
	const loggedInStaff = useSelector(selectStaff);
	const [subsidies, setSubsidies] = useState([]);

	const fetchData = async () => {
		try {
			const response = await subsidyApi.findAllSubsidyOfEhr(ehrRecord.electronicHealthRecordId);
			setSubsidies(response.data)
			console.log(response.data)

		} catch (error) {
			console.error("Error fetching Subsidies: ", error);
		}
	};

	const cardStyle = {
		marginBottom: "20px",
		border: "1px solid #e0e0e0",
		borderRadius: "10px",
	};

	const titleStyle = {
		marginBottom: "10px",
		fontWeight: "bold",
	};

	const subtitleStyle = {
		marginBottom: "8px",
	};

	useEffect(() => {
		fetchData();
	}, []);


	return (
		<Grid container spacing={3}>
			<Grid item xs={12}>
				<Card style={{ height: "600px", overflowY: "auto", padding: "20px" }}>
					<CardContent>
						<Typography variant="h4" style={titleStyle}>
							List of Subsidies
						</Typography>
						{subsidies.map((subsidy, index) => (
							<Card key={index} style={cardStyle}>
								<CardContent>
									<Typography variant="h5" style={titleStyle}>
										{subsidy.subsidyName}
									</Typography>
									<Typography style={subtitleStyle}>
										Description: {subsidy.subsidyDescription}
									</Typography>
									<Typography style={subtitleStyle}>
										Subsidy ID: {subsidy.subsidyId}
									</Typography>
									<Typography style={subtitleStyle}>
										Subsidy Rate: {subsidy.subsidyRate * 100} %
									</Typography>
									<Typography style={subtitleStyle}>
										Type:{" "}
										{subsidy.itemTypeEnum === "INPATIENT" ? (
											<Chip label="INPATIENT" color="primary" />
										) : subsidy.itemTypeEnum === "OUTPATIENT" ? (
											<Chip label="OUTPATIENT" color="secondary" />
										) : (
											<Chip label="MEDICINE" style={{ backgroundColor: "#f50057", color: "#fff" }} />
										)}
									</Typography>
								</CardContent>
							</Card>
						))}
					</CardContent>
				</Card>
			</Grid>
		</Grid>
	);
};
export default Subsidies;
