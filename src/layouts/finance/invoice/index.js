
import React, { useState, useEffect, useRef } from 'react';
import {
        Grid,
        Card,
        Button,
        Dialog,
        DialogTitle,
        DialogContent,
        DialogActions,
        List,
        ListItem,
        CardContent,
        Table,
        TableBody,
        TableCell,
        TableContainer,
        TableHead,
        TableRow,
        Paper,
        IconButton,
        Chip
} from '@mui/material';
import DeleteIcon from "@mui/icons-material/Delete";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import CreateInsuranceClaimDialog from './CreateInsuranceClaimDialog';
import CreateMedishieldClaimDialog from './CreateMedishieldClaimDialog';
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "examples/Tables/DataTable";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { invoiceApi } from 'api/Api';
import { useDispatch } from "react-redux";
import MDButton from "components/MDButton";
import { displayMessage } from "store/slices/snackbarSlice";

import moment from 'moment';


function Invoice() {
        // const [subsidies, setSubsidies] = useState([]);
        const [selectedInvoice, setSelectedInvoice] = useState(null);
        const [selectedEHR, setSelectedEHR] = useState([]);
        const [selectedItems, setSelectedItems] = useState([]);

        const [isModalOpen, setIsModalOpen] = useState(false);
        const reduxDispatch = useDispatch();

        const [isCreateInsuranceDialogOpen, setIsCreateInsuranceDialogOpen] = useState(false);
        const [isCreateMedishieldDialogOpen, setIsCreateMedishieldDialogOpen] = useState(false);


        const handleCreateInsuranceDialogOpen = (invoiceId) => {
                setIsCreateInsuranceDialogOpen(true);
                setSelectedInvoice(invoiceId); // Assuming you have a state to hold the selected invoice
        };

        const handleCreateMedishieldDialogOpen = (invoiceId) => {
                // Open the dialog for creating Medishield claims
                setIsCreateMedishieldDialogOpen(true);
                setSelectedInvoice(invoiceId); // Assuming you have a state to hold the selected invoice
        };

        const handleCreateInsuranceClaim = (data) => {
                // Perform action with the insurance claim data
                console.log('Insurance Claim Data:', data);
        };

        const getStatusColor = (status) => {
                switch (status) {
                        case "PAID":
                                return "green";
                        case "OVERDUE":
                                return "red";
                        case "CLAIMS_IN_PROCESS":
                                return "orange";
                        case "UNPAID":
                                return "red";
                        default:
                                return "black";
                }
        };

        const [dialogOpen, setDialogOpen] = useState(false);
        const [selectedInvoiceDetails, setSelectedInvoiceDetails] = useState({});

        const handleEdit = async (invoice) => {
                setSelectedInvoiceDetails(invoice);
                try {
                        const ehr = await invoiceApi.findPatientOfInvoice(invoice.invoiceId);
                        const items = await invoiceApi.findItemsOfInvoice(invoice.invoiceId);
                        setSelectedEHR(ehr.data);
                        setSelectedItems(items.data);

                        fetchData()
                        console.log(ehr.data);
                        console.log(items.data);
                        setDialogOpen(true);
                } catch (error) {
                        console.error("Error fetching prescription records: ", error);
                }

        };

        const handleDialogClose = () => {
                setDialogOpen(false);
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
        const [data, setData] = useState({
                columns: [
                        { Header: 'Invoice ID', accessor: 'invoiceId', width: '10%' },
                        { Header: 'Total Amount', accessor: 'invoiceAmount', width: '20%' },
                        { Header: 'Due Date', accessor: 'invoiceDueDate', width: '20%' },
                        {
                                Header: 'Status', accessor: 'invoiceStatusEnum',
                                Cell: ({ value }) => renderStatusWithColor(value),
                                width: '20%'
                        },
                        // { Header: 'Breakdown', accessor: 'invoiceBreakdown', width: '10%' },

                        {
                                Header: 'Actions',
                                Cell: ({ row }) => (
                                        <>
                                                <MDButton
                                                        style={{
                                                                width: "120px",
                                                                marginRight: "10px",
                                                                marginBottom: "8px",
                                                        }}
                                                        variant="contained"
                                                        color="info"
                                                        onClick={() => handleEdit(row.original)}
                                                >
                                                        View
                                                </MDButton>

                                                {/* <MDButton
                                                        style={{ width: "120px" }}
                                                        variant="contained"
                                                        color="primary"
                                                        onClick={() => handleDelete(row.original.id)}
                                                >
                                                        Delete
                                                </MDButton> */}
                                        </>
                                ),
                                width: '10%',
                        },
                ],
                rows: [],
        });
        const dataRef = useRef({
                columns: [
                        { Header: 'Invoice ID', accessor: 'invoiceId', width: '10%' },
                        { Header: 'Total Amount', accessor: 'invoiceAmount', width: '20%' },
                        { Header: 'Due Date', accessor: 'invoiceDueDate', width: '20%' },
                        { Header: 'Status', accessor: 'invoiceStatusEnum', width: '20%' },

                        // { Header: 'Breakdown', accessor: 'invoiceBreakdown', width: '10%' },

                        {
                                Header: 'Actions',
                                Cell: ({ row }) => (
                                        <>
                                                <MDButton
                                                        style={{
                                                                width: "120px",
                                                                marginRight: "10px",
                                                                marginBottom: "8px",
                                                        }}
                                                        variant="contained"
                                                        color="info"
                                                        onClick={() => handleEdit(row.original)}
                                                >
                                                        View
                                                </MDButton>

                                        </>
                                ),
                                width: '10%',
                        },
                ],
                rows: [],
        });
        useEffect(() => {
                // Fetch subsidies data and populate the "subsidies" state
                fetchData();
        }, []);
        const fetchData = async () => {
                try {
                        invoiceApi
                                .getAllInvoices()
                                .then((response) => {
                                        const invoices = response.data; // Assuming 'facilities' is an array of facility objects
                                        console.log(response);
                                        const mappedRows = invoices.map((invoice) => {
                                                const dueDate = new Date(
                                                        invoice.invoiceDueDate[0], // year
                                                        invoice.invoiceDueDate[1] - 1, // month (zero-indexed)
                                                        invoice.invoiceDueDate[2], // day
                                                        invoice.invoiceDueDate[3], // hour
                                                        invoice.invoiceDueDate[4], // minute
                                                        invoice.invoiceDueDate[5], // second
                                                        invoice.invoiceDueDate[6] // millisecond
                                                ).toLocaleString('en-SG', {
                                                        timeZone: 'Asia/Singapore',
                                                        day: '2-digit',
                                                        month: '2-digit',
                                                        year: 'numeric',
                                                });
                                                return {
                                                        invoiceId: invoice.invoiceId,
                                                        invoiceAmount: `$${invoice.invoiceAmount}`,
                                                        invoiceDueDate: dueDate,
                                                        invoiceStatusEnum: invoice.invoiceStatusEnum,
                                                        invoiceBreakdown: invoice.invoiceBreakdown,
                                                        insuranceClaim: invoice.insuranceClaim,
                                                        medishieldClaim: invoice.medishieldClaim,
                                                        //patient: invoice.patient.username,
                                                        //listOfTransactionItem: invoice.listOfTransactionItem
                                                };
                                        });
                                        dataRef.current = {
                                                ...dataRef.current,
                                                rows: [mappedRows],
                                        };
                                        // Update the 'data' state with the mapped data
                                        setData((prevData) => ({
                                                ...prevData,
                                                rows: mappedRows,
                                        }));
                                });
                        console.log(data)
                } catch (error) {
                        console.error("Error fetching data:", error);
                }
        };

        const handleApproveMedishieldClaim = async (claimId, invoiceId, invoice) => {
                try {
                        const response = await invoiceApi.approveMedishieldClaim(claimId, invoiceId);
                        fetchData();
                        const invoiceResponse = await invoiceApi.findInvoice(invoiceId);
                        handleEdit(invoiceResponse.data);
                        reduxDispatch(
                                displayMessage({
                                        color: "success",
                                        icon: "notification",
                                        title: "Success",
                                        content: "Medishield Claim Approved!",
                                })
                        );
                } catch (error) {
                        console.error("Error Approving Medishield Claim: ", error);
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

        const handleRejectMedishieldClaim = async (claimId, invoice) => {
                try {
                        const response = await invoiceApi.rejectMedishieldClaim(claimId);
                        fetchData();
                        const invoiceResponse = await invoiceApi.findInvoice(invoice.invoiceId);
                        handleEdit(invoiceResponse.data);
                        reduxDispatch(
                                displayMessage({
                                        color: "success",
                                        icon: "notification",
                                        title: "Success",
                                        content: "Medishield Claim Rejected!",
                                })
                        );
                } catch (error) {
                        console.error("Error Rejecting Medishield Claim: ", error);
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

        const handleDeleteInsuranceClaim = async (claimId, invoiceId, invoice) => {
                try {
                        const response = await invoiceApi.deleteInsuranceClaim(claimId, invoiceId);
                        fetchData();
                        const invoiceResponse = await invoiceApi.findInvoice(invoiceId);
                        handleEdit(invoiceResponse.data);
                        reduxDispatch(
                                displayMessage({
                                        color: "success",
                                        icon: "notification",
                                        title: "Success",
                                        content: "Insurance Claim deleted!",
                                })
                        );
                } catch (error) {
                        console.error("Error deleting Insurance Claim: ", error);
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

        const handleDeleteMedishieldClaim = async (claimId, invoiceId, invoice) => {
                try {
                        const response = await invoiceApi.deleteMedishieldClaim(claimId, invoiceId);
                        fetchData();
                        const invoiceResponse = await invoiceApi.findInvoice(invoiceId);
                        handleEdit(invoiceResponse.data);
                        reduxDispatch(
                                displayMessage({
                                        color: "success",
                                        icon: "notification",
                                        title: "Success",
                                        content: "Medishield Claim deleted!",
                                })
                        );
                } catch (error) {
                        console.error("Error deleting Medishield Claim: ", error);
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

        return (
                <DashboardLayout>
                        <DashboardNavbar />
                        <MDBox pt={6} pb={3}>
                                <Grid container spacing={6}>
                                        <Grid item xs={12}>
                                                <Card>
                                                        <MDBox
                                                                mx={2}
                                                                mt={-3}
                                                                py={3}
                                                                px={2}
                                                                variant="gradient"
                                                                bgColor="info"
                                                                borderRadius="lg"
                                                                coloredShadow="info"
                                                        >
                                                                <MDTypography variant="h6" color="white">
                                                                        Invoices
                                                                </MDTypography>
                                                        </MDBox>
                                                        <MDBox pt={3}>
                                                                <DataTable canSearch={true} table={data} />
                                                        </MDBox>
                                                </Card>
                                        </Grid>
                                </Grid>
                        </MDBox>
                        <Dialog open={dialogOpen} onClose={handleDialogClose} PaperProps={{
                                style: {
                                        minWidth: 500,
                                        width: '80%',
                                        maxWidth: 'none',
                                },
                        }}>
                                <DialogTitle>Invoice Details</DialogTitle>
                                <DialogContent>
                                        <List>
                                                <ListItem>
                                                        <MDTypography variant="h5" gutterBottom>
                                                                Invoice Owner: {selectedEHR}
                                                        </MDTypography>
                                                </ListItem>
                                        </List>
                                        {/* <List>
                                                <ListItem>
                                                        <MDTypography variant="h5" gutterBottom>
                                                                Invoice Breakdown:
                                                        </MDTypography>
                                                </ListItem>
                                                <ListItem>{selectedInvoiceDetails.invoiceBreakdown}</ListItem>
                                        </List> */}
                                        <br></br>
                                        <List>
                                                <ListItem>
                                                        <MDTypography variant="h5" gutterBottom>
                                                                Insurance Claim:
                                                        </MDTypography>
                                                </ListItem>
                                                {selectedInvoiceDetails.insuranceClaim ? (
                                                        <Card>
                                                                <CardContent>
                                                                        {/* <MDTypography variant="h5" component="div">
                                                                                Insurance Claim Details
                                                                        </MDTypography> */}
                                                                        <MDTypography variant="h5" >
                                                                                Insurance Claim ID: {selectedInvoiceDetails.insuranceClaim.insuranceClaimId}
                                                                        </MDTypography>
                                                                        <MDTypography variant="body2" color="text.secondary">
                                                                                Date Applied:{' '}
                                                                                {new Date(
                                                                                        selectedInvoiceDetails.insuranceClaim.insuranceClaimDateApplied[0],
                                                                                        selectedInvoiceDetails.insuranceClaim.insuranceClaimDateApplied[1] - 1,
                                                                                        selectedInvoiceDetails.insuranceClaim.insuranceClaimDateApplied[2]
                                                                                ).toLocaleDateString('en-SG', {
                                                                                        timeZone: 'Asia/Singapore',
                                                                                        day: '2-digit',
                                                                                        month: '2-digit',
                                                                                        year: 'numeric',
                                                                                })}
                                                                        </MDTypography>
                                                                        <MDTypography variant="body2" color="text.secondary">
                                                                                Claim Amount: $ {selectedInvoiceDetails.insuranceClaim.insuranceClaimAmount}
                                                                        </MDTypography>
                                                                        <MDTypography variant="body2" color="text.secondary">
                                                                                Insurer Name: {selectedInvoiceDetails.insuranceClaim.insurerName}
                                                                        </MDTypography>
                                                                        <MDTypography variant="body2" color="text.secondary">
                                                                                Is Private Insurer: {selectedInvoiceDetails.insuranceClaim.isPrivateInsurer ? 'Yes' : 'No'}
                                                                        </MDTypography>
                                                                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                                                                <IconButton
                                                                                        aria-label="delete"
                                                                                        onClick={() => handleDeleteInsuranceClaim(selectedInvoiceDetails.insuranceClaim.insuranceClaimId,
                                                                                                selectedInvoiceDetails.invoiceId, selectedInvoiceDetails)} // Assuming you have a handleDeleteInsuranceClaim function to handle the deletion
                                                                                >
                                                                                        <DeleteIcon />
                                                                                </IconButton>
                                                                        </div>
                                                                </CardContent>
                                                        </Card>
                                                ) : (
                                                        <ListItem>

                                                                <MDButton
                                                                        style={{ marginRight: '10px', marginBottom: '8px' }}
                                                                        variant="contained"
                                                                        color="info"
                                                                        onClick={handleCreateInsuranceDialogOpen}
                                                                >
                                                                        Create Insurance Claim
                                                                </MDButton>
                                                                <CreateInsuranceClaimDialog
                                                                        isOpen={isCreateInsuranceDialogOpen}
                                                                        onClose={() => setIsCreateInsuranceDialogOpen(false)}
                                                                        onCreate={handleCreateInsuranceClaim}
                                                                        invoiceId={selectedInvoiceDetails.invoiceId}
                                                                        fetchData={fetchData} // Pass the selectedInvoice to the dialog component
                                                                        handleEdit={handleEdit}
                                                                />
                                                        </ListItem>
                                                )}
                                        </List>
                                        <br></br>

                                        <List>
                                                <ListItem>
                                                        <MDTypography variant="h5" gutterBottom>
                                                                Medishield Claim:
                                                        </MDTypography>
                                                </ListItem>
                                                {selectedInvoiceDetails.medishieldClaim ? (
                                                        <Card>
                                                                <CardContent>
                                                                        {/* <MDTypography variant="h5" component="div">
                                                                                Insurance Claim Details
                                                                        </MDTypography> */}
                                                                        <MDTypography variant="h5" >
                                                                                Medishield Claim ID: {selectedInvoiceDetails.medishieldClaim.medishieldClaimId}
                                                                        </MDTypography>
                                                                        <MDTypography variant="body2" color="text.secondary">
                                                                                Date Applied:{' '}
                                                                                {new Date(
                                                                                        selectedInvoiceDetails.medishieldClaim.medishieldClaimDateApplied[0],
                                                                                        selectedInvoiceDetails.medishieldClaim.medishieldClaimDateApplied[1] - 1,
                                                                                        selectedInvoiceDetails.medishieldClaim.medishieldClaimDateApplied[2]
                                                                                ).toLocaleDateString('en-SG', {
                                                                                        timeZone: 'Asia/Singapore',
                                                                                        day: '2-digit',
                                                                                        month: '2-digit',
                                                                                        year: 'numeric',
                                                                                })}
                                                                        </MDTypography>
                                                                        <MDTypography variant="body2" color="text.secondary">
                                                                                Claim Amount: $ {selectedInvoiceDetails.medishieldClaim.medishieldClaimAmount}
                                                                        </MDTypography>
                                                                        <MDTypography variant="body2" color="text.secondary">
                                                                                {/* Status: {selectedInvoiceDetails.medishieldClaim.approvalStatusEnum} */}
                                                                                <Chip
                                                                                        style={{
                                                                                                position: "absolute",
                                                                                                top: "10px",
                                                                                                right: "10px",
                                                                                        }}
                                                                                        color={
                                                                                                selectedInvoiceDetails.medishieldClaim.approvalStatusEnum === "APPROVED"
                                                                                                        ? "success"
                                                                                                        : selectedInvoiceDetails.medishieldClaim.approvalStatusEnum === "REJECTED"
                                                                                                                ? "warning"
                                                                                                                : "error"
                                                                                        }
                                                                                        label={selectedInvoiceDetails.medishieldClaim.approvalStatusEnum}
                                                                                />
                                                                        </MDTypography>

                                                                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                                                                {selectedInvoiceDetails.medishieldClaim.approvalStatusEnum === "PENDING" && (
                                                                                        <Button
                                                                                                variant="contained"
                                                                                                onClick={() =>
                                                                                                        handleApproveMedishieldClaim(
                                                                                                                selectedInvoiceDetails.medishieldClaim.medishieldClaimId,
                                                                                                                selectedInvoiceDetails.invoiceId,
                                                                                                                selectedInvoiceDetails
                                                                                                        )
                                                                                                }
                                                                                                color="primary"
                                                                                                style={{ backgroundColor: 'green', color: 'white', marginRight: 10 }}
                                                                                        >
                                                                                                Approve
                                                                                        </Button>
                                                                                )}

                                                                                {selectedInvoiceDetails.medishieldClaim.approvalStatusEnum === "PENDING" && (
                                                                                        <Button
                                                                                                variant="contained"
                                                                                                onClick={() =>
                                                                                                        handleRejectMedishieldClaim(
                                                                                                                selectedInvoiceDetails.medishieldClaim.medishieldClaimId,
                                                                                                                selectedInvoiceDetails
                                                                                                        )
                                                                                                }
                                                                                                color="primary"
                                                                                                style={{ backgroundColor: 'red', color: 'white' }}
                                                                                        >
                                                                                                Reject
                                                                                        </Button>
                                                                                )}
                                                                                <IconButton
                                                                                        aria-label="delete"
                                                                                        onClick={() => handleDeleteMedishieldClaim(selectedInvoiceDetails.medishieldClaim.medishieldClaimId,
                                                                                                selectedInvoiceDetails.invoiceId, selectedInvoiceDetails)}
                                                                                >
                                                                                        <DeleteIcon />
                                                                                </IconButton>
                                                                        </div>
                                                                </CardContent>
                                                        </Card>
                                                ) : (
                                                        <ListItem>

                                                                <MDButton
                                                                        style={{
                                                                                // width: "120px",
                                                                                marginRight: "10px",
                                                                                marginBottom: "8px",
                                                                        }}
                                                                        variant="contained"
                                                                        color="info"
                                                                        onClick={handleCreateMedishieldDialogOpen}                                                                >
                                                                        Create Medishield Claim
                                                                </MDButton>
                                                                <CreateMedishieldClaimDialog
                                                                        isOpen={isCreateMedishieldDialogOpen}
                                                                        onClose={() => setIsCreateMedishieldDialogOpen(false)}
                                                                        // onCreate={handleCreateMedishieldDialogOpen} // Pass the handleCreateMedishieldClaim function to the dialog component
                                                                        invoiceId={selectedInvoiceDetails.invoiceId}
                                                                        fetchData={fetchData} // Pass the fetchData function to the dialog component
                                                                        handleEdit={handleEdit}
                                                                />
                                                        </ListItem>
                                                )}
                                        </List>
                                        <br></br>

                                        <List>
                                                <ListItem>
                                                        <MDTypography variant="h5" gutterBottom>
                                                                Patient's Cart:
                                                        </MDTypography>
                                                </ListItem>
                                                {selectedItems.length === 0 ? (
                                                        <ListItem>
                                                                <MDTypography variant="subtitle1">
                                                                        Patient's cart is empty.
                                                                </MDTypography>
                                                        </ListItem>
                                                ) : (
                                                        <ListItem>
                                                                <TableContainer component={Paper}>
                                                                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                                                                <TableHead>
                                                                                        <TableRow>
                                                                                                <TableCell> Name</TableCell>
                                                                                        </TableRow>
                                                                                </TableHead>
                                                                                <TableBody>
                                                                                        {selectedItems.map((item) => (
                                                                                                <TableRow
                                                                                                        key={item.transactionItemId}
                                                                                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                                                                >
                                                                                                        <TableCell component="th" scope="row">
                                                                                                                {item.transactionItemName}
                                                                                                        </TableCell>
                                                                                                        <TableCell align="right">
                                                                                                                Quantity: {item.transactionItemQuantity}
                                                                                                        </TableCell>
                                                                                                        <TableCell align="right">
                                                                                                                Total Price: ${item.transactionItemPrice}
                                                                                                        </TableCell>

                                                                                                </TableRow>
                                                                                        ))}
                                                                                </TableBody>
                                                                                <TableRow>
                                                                                        <TableCell colSpan={2} align="right">
                                                                                                <strong>Total:</strong>
                                                                                        </TableCell>
                                                                                        <TableCell align="right">
                                                                                                <strong>
                                                                                                        ${selectedItems.reduce((total, item) => total + item.transactionItemPrice, 0)}
                                                                                                </strong>
                                                                                        </TableCell>
                                                                                </TableRow>
                                                                        </Table>
                                                                </TableContainer>
                                                        </ListItem>
                                                )}
                                        </List>

                                </DialogContent>
                                <DialogActions>
                                        <Button onClick={handleDialogClose} color="primary">Close</Button>
                                </DialogActions>
                        </Dialog>
                </DashboardLayout>
        );
}
export default Invoice;
