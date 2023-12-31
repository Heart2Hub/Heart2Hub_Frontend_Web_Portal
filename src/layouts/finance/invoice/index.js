import React, { useState, useEffect, useRef } from "react";
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
        Typography,
        DialogContentText,
        Chip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import CreateInsuranceClaimDialog from "./CreateInsuranceClaimDialog";
import CreateMedishieldClaimDialog from "./CreateMedishieldClaimDialog";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "examples/Tables/DataTable";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { invoiceApi } from "api/Api";
import { useDispatch } from "react-redux";
import MDButton from "components/MDButton";
import { displayMessage } from "store/slices/snackbarSlice";

import moment from "moment";

function Invoice() {
        // const [subsidies, setSubsidies] = useState([]);
        const [selectedInvoice, setSelectedInvoice] = useState(null);
        const [selectedEHR, setSelectedEHR] = useState([]);
        const [selectedItems, setSelectedItems] = useState([]);

        const [isModalOpen, setIsModalOpen] = useState(false);
        const reduxDispatch = useDispatch();

        const [isCreateInsuranceDialogOpen, setIsCreateInsuranceDialogOpen] =
                useState(false);
        const [isCreateMedishieldDialogOpen, setIsCreateMedishieldDialogOpen] =
                useState(false);

        const [open, setOpen] = useState(false);

        const [transactionData, setTransactionData] = useState(null);

        const handleOpen = (transaction) => {
                const formattedDate = new Date(
                        transaction.transactionDate[0], // year
                        transaction.transactionDate[1] - 1, // month (zero-indexed)
                        transaction.transactionDate[2], // day
                        transaction.transactionDate[3], // hour
                        transaction.transactionDate[4], // minute
                        transaction.transactionDate[5], // second
                        transaction.transactionDate[6] // millisecond
                ).toLocaleString("en-SG", {
                        timeZone: "Asia/Singapore",
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                });
                setTransactionData({ ...transaction, transactionDate: formattedDate });
                setOpen(true);
        };

        const handleClose = () => {
                setOpen(false);
        };

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
                console.log("Insurance Claim Data:", data);
        };

        const getStatusColor = (status) => {
                switch (status) {
                        case "PAID":
                                return "green";
                        case "OVERDUE":
                                return "red";
                        case "CLAIMS_IN_PROCESS":
                                return "orange";
                        case "PAYMENT DUE":
                                return "red";
                        default:
                                return "red";
                }
        };

        const [dialogOpen, setDialogOpen] = useState(false);
        const [selectedInvoiceDetails, setSelectedInvoiceDetails] = useState({});

        const handleEdit = async (invoice) => {
                const dueDate = new Date(
                        invoice.invoiceDueDate[0],
                        invoice.invoiceDueDate[1] - 1,
                        invoice.invoiceDueDate[2],
                        invoice.invoiceDueDate[3],
                        invoice.invoiceDueDate[4],
                        invoice.invoiceDueDate[5],
                        invoice.invoiceDueDate[6]
                ).toLocaleString('en-SG', {
                        timeZone: 'Asia/Singapore',
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                });
                invoice.invoiceDueDate = dueDate
                setSelectedInvoiceDetails(invoice);
                try {
                        const ehr = await invoiceApi.findPatientOfInvoice(invoice.invoiceId);
                        const items = await invoiceApi.findItemsOfInvoice(invoice.invoiceId);
                        setSelectedEHR(ehr.data);
                        setSelectedItems(items.data);
                        console.log(invoice)
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
                        { Header: "Invoice ID", accessor: "invoiceId", width: "10%" },
                        { Header: "Total Amount", accessor: "invoiceAmount", width: "20%" },
                        { Header: "Due Date", accessor: "invoiceDueDate", width: "20%" },
                        { Header: "Patient Name", accessor: "patientName", width: "20%" },
                        { Header: "NRIC", accessor: "patientNric", width: "20%" },

                        {
                                Header: "Status",
                                accessor: "invoiceStatusEnum",
                                Cell: ({ value }) => renderStatusWithColor(value),
                                width: "20%",
                        },
                        // { Header: 'Breakdown', accessor: 'invoiceBreakdown', width: '10%' },

                        {
                                Header: "Actions",
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
                                width: "10%",
                        },
                ],
                rows: [],
        });
        const dataRef = useRef({
                columns: [
                        { Header: "Invoice ID", accessor: "invoiceId", width: "10%" },
                        { Header: "Total Amount", accessor: "invoiceAmount", width: "20%" },
                        { Header: "Due Date", accessor: "invoiceDueDate", width: "20%" },
                        { Header: "Status", accessor: "invoiceStatusEnum", width: "20%" },
                        { Header: "Patient Name", accessor: "patientName", width: "20%" },
                        { Header: "NRIC", accessor: "patientNric", width: "20%" },


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

        function maskNric(nric) {
                if (nric.length >= 7) {
                        const firstChar = nric.charAt(0);
                        const maskedPart = '*'.repeat(nric.length - 4);
                        const lastThreeChars = nric.slice(-3);
                        return `${firstChar}${maskedPart}${lastThreeChars}`;
                } else {
                        // Handle the case where the NRIC is too short
                        return nric;
                }
        }
        useEffect(() => {
                // Fetch subsidies data and populate the "subsidies" state
                fetchData();
        }, []);
        const fetchData = async () => {
                try {
                        const response = await invoiceApi.getAllInvoices();
                        const invoices = response.data;
                        console.log(response.data);
                        const mappedRows = await Promise.all(
                                invoices.map(async (invoice) => {
                                        const dueDate = new Date(
                                                invoice.invoiceDueDate[0],
                                                invoice.invoiceDueDate[1] - 1,
                                                invoice.invoiceDueDate[2],
                                                invoice.invoiceDueDate[3],
                                                invoice.invoiceDueDate[4],
                                                invoice.invoiceDueDate[5],
                                                invoice.invoiceDueDate[6]
                                        ).toLocaleString('en-SG', {
                                                timeZone: 'Asia/Singapore',
                                                day: '2-digit',
                                                month: '2-digit',
                                                year: 'numeric',
                                        });

                                        const patientNameResponse = await invoiceApi.findPatientOfInvoice(
                                                invoice.invoiceId
                                        );
                                        const patientName = patientNameResponse.data;

                                        const patientNricResponse = await invoiceApi.findPatientNRICOfInvoice(
                                                invoice.invoiceId
                                        );
                                        const patientNric = maskNric(patientNricResponse.data);
                                        return {
                                                invoiceId: invoice.invoiceId,
                                                invoiceAmount: `$${invoice.invoiceAmount.toFixed(2)}`,
                                                invoiceDueDate: dueDate,
                                                invoiceStatusEnum:
                                                        invoice.invoiceStatusEnum === "UNPAID"
                                                                ? "PAYMENT DUE"
                                                                : invoice.invoiceStatusEnum,
                                                invoiceBreakdown: invoice.invoiceBreakdown,
                                                insuranceClaim: invoice.insuranceClaim,
                                                medishieldClaim: invoice.medishieldClaim,
                                                transaction: invoice.transaction,
                                                patientName: patientName,
                                                patientNric: patientNric
                                        };
                                })
                        );
                        dataRef.current = {
                                ...dataRef.current,
                                rows: [mappedRows],
                        };
                        // Update the 'data' state with the mapped data
                        setData((prevData) => ({
                                ...prevData,
                                rows: mappedRows,
                        }));
                        console.log(data);
                } catch (error) {
                        console.error("Error fetching data:", error);
                }
        };

        const handleApproveMedishieldClaim = async (claimId, invoiceId, invoice) => {
                try {
                        const response = await invoiceApi.approveMedishieldClaim(
                                claimId,
                                invoiceId
                        );
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
                        const response = await invoiceApi.deleteInsuranceClaim(
                                claimId,
                                invoiceId
                        );
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
                        const response = await invoiceApi.deleteMedishieldClaim(
                                claimId,
                                invoiceId
                        );
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
                                <DialogTitle sx={{ fontSize: '24px', textAlign: 'center' }}>Invoice Details</DialogTitle>
                                <DialogContent>
                                        <List>
                                                <ListItem>
                                                        <MDTypography variant="h5" gutterBottom style={{ marginTop: '20px', marginBottom: '20px', fontWeight: 'bold' }}>
                                                                Invoice ID: {selectedInvoiceDetails.invoiceId}
                                                        </MDTypography>
                                                </ListItem>
                                        </List>
                                        {/* <List>
                                                <ListItem>
                                                        <MDTypography variant="h5" gutterBottom style={{ marginBottom: '20px', fontWeight: 'bold' }}>
                                                                Invoice Due Date: {selectedInvoiceDetails.invoiceDueDate}
                                                        </MDTypography>
                                                </ListItem>
                                        </List> */}
                                        <List>
                                                <ListItem>
                                                        <Chip
                                                                label={`Invoice Status: ${selectedInvoiceDetails.invoiceStatusEnum}`}
                                                                style={{
                                                                        marginTop: '20px',
                                                                        marginBottom: '20px',
                                                                        fontWeight: 'bold',
                                                                        backgroundColor: getStatusColor(selectedInvoiceDetails.invoiceStatusEnum),
                                                                        color: 'white', // You can adjust the text color based on your design
                                                                }}
                                                        />
                                                </ListItem>
                                        </List>
                                        <List>
                                                <ListItem>
                                                        <MDTypography variant="h5" gutterBottom style={{ marginTop: '20px', marginBottom: '20px', fontWeight: 'bold' }}>
                                                                Invoice Owner: {selectedEHR}
                                                        </MDTypography>
                                                </ListItem>
                                        </List>


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
                                                                                Claim Amount: $ {selectedInvoiceDetails.insuranceClaim.insuranceClaimAmount.toFixed(2)}
                                                                        </MDTypography>
                                                                        <MDTypography variant="body2" color="text.secondary">
                                                                                Insurer Name:
                                                                                <Chip
                                                                                        label={` ${selectedInvoiceDetails.insuranceClaim.insurerName}`}
                                                                                        color="default"
                                                                                />
                                                                        </MDTypography>
                                                                        <MDTypography variant="body2" color="text.secondary">
                                                                                Private Insurer:
                                                                                <Chip
                                                                                        label={` ${selectedInvoiceDetails?.insuranceClaim?.privateInsurer ? 'Yes' : 'No'}`}
                                                                                        color={selectedInvoiceDetails?.insuranceClaim?.privateInsurer ? 'primary' : 'secondary'}
                                                                                />
                                                                        </MDTypography>

                                                                        {selectedInvoiceDetails && (selectedInvoiceDetails.transaction == null || selectedInvoiceDetails.transaction.approvalStatusEnum === "REJECTED") && (
                                                                                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                                                                        <IconButton
                                                                                                aria-label="delete"
                                                                                                onClick={() =>
                                                                                                        handleDeleteInsuranceClaim(
                                                                                                                selectedInvoiceDetails.insuranceClaim.insuranceClaimId,
                                                                                                                selectedInvoiceDetails.invoiceId,
                                                                                                                selectedInvoiceDetails
                                                                                                        )
                                                                                                }
                                                                                        >
                                                                                                <DeleteIcon />
                                                                                        </IconButton>
                                                                                </div>
                                                                        )}
                                                                </CardContent>
                                                        </Card>
                                                ) : (
                                                        selectedInvoiceDetails.invoiceAmount === 0 || selectedInvoiceDetails.invoiceStatusEnum === "PAID" ? (
                                                                <ListItem>
                                                                        <MDTypography variant="h6" color="text.secondary" gutterBottom>
                                                                                This invoice has already been paid.
                                                                        </MDTypography>
                                                                </ListItem>
                                                        ) :
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
                                                                        <MDTypography variant="h5">
                                                                                Medishield Claim ID:{" "}
                                                                                {selectedInvoiceDetails.medishieldClaim.medishieldClaimId}
                                                                        </MDTypography>
                                                                        <MDTypography variant="body2" color="text.secondary">
                                                                                Date Applied:{" "}
                                                                                {new Date(
                                                                                        selectedInvoiceDetails.medishieldClaim.medishieldClaimDateApplied[0],
                                                                                        selectedInvoiceDetails.medishieldClaim
                                                                                                .medishieldClaimDateApplied[1] - 1,
                                                                                        selectedInvoiceDetails.medishieldClaim.medishieldClaimDateApplied[2]
                                                                                ).toLocaleDateString("en-SG", {
                                                                                        timeZone: "Asia/Singapore",
                                                                                        day: "2-digit",
                                                                                        month: "2-digit",
                                                                                        year: "numeric",
                                                                                })}
                                                                        </MDTypography>
                                                                        <MDTypography variant="body2" color="text.secondary">
                                                                                Claim Amount: ${" "}
                                                                                {selectedInvoiceDetails.medishieldClaim.medishieldClaimAmount.toFixed(
                                                                                        2
                                                                                )}
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
                                                                                                selectedInvoiceDetails.medishieldClaim
                                                                                                        .approvalStatusEnum === "APPROVED"
                                                                                                        ? "success"
                                                                                                        : selectedInvoiceDetails.medishieldClaim
                                                                                                                .approvalStatusEnum === "REJECTED"
                                                                                                                ? "warning"
                                                                                                                : "error"
                                                                                        }
                                                                                        label={
                                                                                                selectedInvoiceDetails.medishieldClaim
                                                                                                        .approvalStatusEnum
                                                                                        }
                                                                                />
                                                                        </MDTypography>

                                                                        <div style={{ display: "flex", justifyContent: "flex-end" }}>
                                                                                {selectedInvoiceDetails.medishieldClaim
                                                                                        .approvalStatusEnum === "PENDING" && (
                                                                                                <Button
                                                                                                        variant="contained"
                                                                                                        onClick={() =>
                                                                                                                handleApproveMedishieldClaim(
                                                                                                                        selectedInvoiceDetails.medishieldClaim
                                                                                                                                .medishieldClaimId,
                                                                                                                        selectedInvoiceDetails.invoiceId,
                                                                                                                        selectedInvoiceDetails
                                                                                                                )
                                                                                                        }
                                                                                                        color="primary"
                                                                                                        style={{
                                                                                                                backgroundColor: "green",
                                                                                                                color: "white",
                                                                                                                marginRight: 10,
                                                                                                        }}
                                                                                                >
                                                                                                        Approve
                                                                                                </Button>
                                                                                        )}

                                                                                {selectedInvoiceDetails.medishieldClaim
                                                                                        .approvalStatusEnum === "PENDING" && (
                                                                                                <Button
                                                                                                        variant="contained"
                                                                                                        onClick={() =>
                                                                                                                handleRejectMedishieldClaim(
                                                                                                                        selectedInvoiceDetails.medishieldClaim
                                                                                                                                .medishieldClaimId,
                                                                                                                        selectedInvoiceDetails
                                                                                                                )
                                                                                                        }
                                                                                                        color="primary"
                                                                                                        style={{ backgroundColor: "red", color: "white" }}
                                                                                                >
                                                                                                        Reject
                                                                                                </Button>
                                                                                        )}
                                                                                {selectedInvoiceDetails && (selectedInvoiceDetails.transaction == null || selectedInvoiceDetails.transaction.approvalStatusEnum === "REJECTED") && (
                                                                                        <IconButton
                                                                                                aria-label="delete"
                                                                                                onClick={() =>
                                                                                                        handleDeleteMedishieldClaim(
                                                                                                                selectedInvoiceDetails.medishieldClaim.medishieldClaimId,
                                                                                                                selectedInvoiceDetails.invoiceId,
                                                                                                                selectedInvoiceDetails
                                                                                                        )
                                                                                                }
                                                                                        >
                                                                                                <DeleteIcon />
                                                                                        </IconButton>
                                                                                )}
                                                                        </div>
                                                                </CardContent>
                                                        </Card>
                                                ) : selectedInvoiceDetails.invoiceAmount === 0 ||
                                                        selectedInvoiceDetails.invoiceStatusEnum === "PAID" ? (
                                                        <ListItem>
                                                                <MDTypography variant="h6" color="text.secondary" gutterBottom>
                                                                        This invoice has already been paid.
                                                                </MDTypography>
                                                        </ListItem>
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
                                                                        onClick={handleCreateMedishieldDialogOpen}
                                                                >
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

                                        <div>
                                                <List>
                                                        <ListItem>
                                                                <Typography variant="h5" gutterBottom>
                                                                        Patient's Cart:
                                                                </Typography>
                                                        </ListItem>
                                                        {selectedItems.length === 0 ? (
                                                                <ListItem>
                                                                        <Typography variant="subtitle1">
                                                                                Patient's cart is empty.
                                                                        </Typography>
                                                                </ListItem>
                                                        ) : (
                                                                <Grid container spacing={2}>
                                                                        {/* Positive Items */}
                                                                        <Grid item xs={12} md={6}>
                                                                                <Paper elevation={3} style={{ padding: '10px', marginBottom: '10px', height: '100%' }}>
                                                                                        <Typography variant="h6" gutterBottom>
                                                                                                Product and Services
                                                                                        </Typography>
                                                                                        {selectedItems
                                                                                                .filter(item => item.transactionItemPrice * item.transactionItemQuantity >= 0)
                                                                                                .map(item => (
                                                                                                        <div key={item.transactionItemId}>
                                                                                                                <Typography variant="subtitle1">
                                                                                                                        {item.transactionItemName}
                                                                                                                </Typography>
                                                                                                                <Typography variant="body2">
                                                                                                                        Quantity: {item.transactionItemQuantity} | Total Price: ${(
                                                                                                                                item.transactionItemPrice * item.transactionItemQuantity
                                                                                                                        ).toFixed(2)}
                                                                                                                </Typography>
                                                                                                        </div>
                                                                                                ))}
                                                                                        {/* Total Price */}

                                                                                        <div style={{ alignSelf: 'flex-end', paddingTop: '10px' }}>
                                                                                                <Typography variant="h5" style={{ fontWeight: 'bold', color: '#e74c3c' }}>
                                                                                                        <strong> Total Payable: $
                                                                                                                {selectedItems
                                                                                                                        .filter(item => item.transactionItemPrice * item.transactionItemQuantity >= 0)
                                                                                                                        .reduce((total, item) => total + item.transactionItemPrice * item.transactionItemQuantity, 0)
                                                                                                                        .toFixed(2)}</strong>

                                                                                                </Typography>
                                                                                        </div>
                                                                                </Paper>
                                                                        </Grid>
                                                                        {/* Negative Items */}
                                                                        <Grid item xs={12} md={6}>
                                                                                <Paper elevation={3} style={{ padding: '10px', height: '100%' }}>
                                                                                        <Typography variant="h6" gutterBottom>
                                                                                                Claims and Subsidies
                                                                                        </Typography>
                                                                                        {selectedItems
                                                                                                .filter(item => item.transactionItemPrice * item.transactionItemQuantity < 0)
                                                                                                .map(item => (
                                                                                                        <div key={item.transactionItemId}>
                                                                                                                <Typography variant="subtitle1">
                                                                                                                        {item.transactionItemName}
                                                                                                                </Typography>
                                                                                                                <Typography variant="body2">
                                                                                                                        ${item.transactionItemPrice.toFixed(2)}
                                                                                                                </Typography>
                                                                                                        </div>
                                                                                                ))}
                                                                                        {/* Total Price */}
                                                                                        <div style={{ alignSelf: 'flex-end', paddingTop: '10px' }}>
                                                                                                <Typography variant="h5" style={{ fontWeight: 'bold' }}>
                                                                                                        <strong>
                                                                                                                Total Receivables: $
                                                                                                                {selectedItems
                                                                                                                        .filter(item => item.transactionItemPrice * item.transactionItemQuantity < 0)
                                                                                                                        .reduce((total, item) => total + item.transactionItemPrice * item.transactionItemQuantity, 0)
                                                                                                                        .toFixed(2)}
                                                                                                        </strong>
                                                                                                </Typography>
                                                                                        </div>
                                                                                </Paper>
                                                                        </Grid>
                                                                </Grid>
                                                        )}
                                                        <Typography align="center" variant="body1" marginTop={20} style={{ fontWeight: 'bold', color: '#e74c3c' }}>
                                                                <strong>Total Invoice Amount: $
                                                                        {selectedItems.reduce((total, item) =>
                                                                                total + item.transactionItemPrice * item.transactionItemQuantity, 0).toFixed(2)}
                                                                </strong>
                                                        </Typography>
                                                </List>
                                        </div>
                                        <ListItem
                                                sx={{
                                                        display: "flex",
                                                        justifyContent: "flex-end",
                                                        paddingRight: 2,
                                                        paddingTop: 2,
                                                }}
                                        >
                                                {selectedInvoiceDetails.transaction != null && (
                                                        <Button
                                                                style={{
                                                                        width: "120px",
                                                                        marginRight: "10px",
                                                                        marginBottom: "8px",
                                                                        // backgroundColor: 'green',
                                                                        color: "white",
                                                                }}
                                                                variant="contained"
                                                                color="primary"
                                                                onClick={() => handleOpen(selectedInvoiceDetails.transaction)}
                                                        >
                                                                View Transaction
                                                        </Button>
                                                )}
                                        </ListItem>
                                        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                                                <DialogTitle>Transaction Details</DialogTitle>
                                                <DialogContent sx={{ paddingBottom: "20px" }}>
                                                        {transactionData && (
                                                                <div>
                                                                        <p>
                                                                                <strong>Transaction ID:</strong>{" "}
                                                                                {transactionData.transactionId}
                                                                        </p>
                                                                        <p>
                                                                                <strong>Transaction Date:</strong>{" "}
                                                                                {transactionData.transactionDate}
                                                                        </p>
                                                                        <p>
                                                                                <strong>Transaction Amount:</strong> $
                                                                                {transactionData.transactionAmount}
                                                                        </p>
                                                                        <p>
                                                                                <strong>Approval Status:</strong>{" "}
                                                                                <Chip
                                                                                        label={transactionData.approvalStatusEnum}
                                                                                        color={
                                                                                                transactionData.approvalStatusEnum === "APPROVED"
                                                                                                        ? "success"
                                                                                                        : transactionData.approvalStatusEnum === "PENDING"
                                                                                                                ? "warning"
                                                                                                                : "error"
                                                                                        }
                                                                                />
                                                                        </p>
                                                                </div>
                                                        )}
                                                </DialogContent>
                                                <DialogActions>
                                                        <Button onClick={handleClose} color="primary">
                                                                Close
                                                        </Button>
                                                </DialogActions>
                                        </Dialog>
                                </DialogContent>
                                <DialogActions>
                                        <Button onClick={handleDialogClose} color="primary">
                                                Close
                                        </Button>
                                </DialogActions>
                        </Dialog>
                </DashboardLayout>
        );
}
export default Invoice;
