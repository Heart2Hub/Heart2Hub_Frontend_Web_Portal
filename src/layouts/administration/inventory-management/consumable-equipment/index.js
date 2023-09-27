// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { IconButton, Icon } from "@mui/material";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "examples/Tables/DataTable";
import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";

import { facilityApi, departmentApi } from "api/Api";
// import { displayMessage } from "../../../store/slices/snackbarSlice";
import { inventoryApi } from "api/Api";
import { displayMessage } from "store/slices/snackbarSlice";

function ConsumableEquipmentManagement() {
    const reduxDispatch = useDispatch();
    const [data, setData] = useState({
        columns: [
            // { Header: "No.", accessor: "number", width: "10%" },
            { Header: "Equipment Name", accessor: "name", width: "20%" },
            { Header: "Description", accessor: "description", width: "20%" },
            { Header: "Quantity", accessor: "quantity", width: "10%" },
            { Header: "Price", accessor: "price", width: "10%" },
            // { Header: "Type", accessor: "type", width: "10%" },
            {
                Header: "Actions",
                Cell: ({ row }) => (
                    <MDBox>
                        {/* <IconButton
                            color="secondary"
                            onClick={() => handleDeleteInventory(row.original.facilityId)}
                        >
                            <Icon>delete</Icon>
                        </IconButton> */}
                        <IconButton
                            color="secondary"
                            onClick={() => handleOpenUpdateModal(row.original.inventoryItemId)}
                        >
                            <Icon>create</Icon>
                        </IconButton>
                    </MDBox>
                ),
                width: "10%",
            },
        ],
        rows: [],
    });

    const dataRef = useRef({
        columns: [
            // { Header: "No.", accessor: "number", width: "10%" },
            { Header: "Equipment Name", accessor: "name", width: "20%" },
            { Header: "Description", accessor: "description", width: "20%" },
            { Header: "Quantity", accessor: "quantity", width: "10%" },
            { Header: "Price", accessor: "price", width: "10%" },
            // { Header: "Type", accessor: "type", width: "10%" },
            {
                Header: "Actions",
                Cell: ({ row }) => (
                    <MDBox>
                        {/* <IconButton
                      color="secondary"
                      onClick={() => handleDeleteInventory(row.original.facilityId)}
                    >
                      <Icon>delete</Icon>
                    </IconButton> */}
                        <IconButton
                            color="secondary"
                            onClick={() => handleOpenUpdateModal(row.original.inventoryItemId)}
                        >
                            <Icon>create</Icon>
                        </IconButton>
                    </MDBox>
                ),
                width: "10%",
            },
        ],
        rows: [],
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        quantity: "",
        price: "",
    });

    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [updateFormData, setUpdateFormData] = useState({
        inventoryItemId: null,
        name: "",
        description: "",
        quantity: "",
        price: "",
    });

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleOpenUpdateModal = (inventoryItemId) => {
        console.log("Inventory " + inventoryItemId);
        // Populate update form data with the facility's current data

        const consumableEquipmentToUpdate = dataRef.current.rows[0].find(
            (consumableEpuipment) => consumableEpuipment.inventoryItemId === inventoryItemId
        );

        if (consumableEquipmentToUpdate) {
            setUpdateFormData({
                inventoryItenId: inventoryItemId,
                name: consumableEquipmentToUpdate.inventoryItemName,
                description: consumableEquipmentToUpdate.inventoryItemDescription,
                quantity: consumableEquipmentToUpdate.quantityInStock,
                price: consumableEquipmentToUpdate.restockPricePerQuantity,
            });
        }

        setIsUpdateModalOpen(true);
    };

    const handleCloseUpdateModal = () => {
        setIsUpdateModalOpen(false);
    };

    const handleUpdateChange = (event) => {
        const { name, value } = event.target;
        setUpdateFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleUpdateConsumableEquipment = () => {
        try {
            const { inventoryItemId, ...requestBody } = updateFormData;
            console.log("Request Body:", requestBody);
            console.log(requestBody.name)
            if (requestBody.name == "") {
                reduxDispatch(
                    displayMessage({
                        color: "error",
                        icon: "notification",
                        title: "Error Encountered",
                        content: "Name cannot be null",
                    })
                );
                return
            }
            console.log(requestBody.description)
            if (requestBody.description == "") {
                reduxDispatch(
                    displayMessage({
                        color: "error",
                        icon: "notification",
                        title: "Error Encountered",
                        content: "Location cannot be null",
                    })
                );
                return
            }
            if (requestBody.quantity < 0) {
                reduxDispatch(
                    displayMessage({
                        color: "error",
                        icon: "notification",
                        title: "Error Encountered",
                        content: "Capacity cannot be less than 0",
                    })
                );
                return
            }
            if (requestBody.price < 0) {
                reduxDispatch(
                    displayMessage({
                        color: "error",
                        icon: "notification",
                        title: "Error Encountered",
                        content: "Capacity cannot be less than 0",
                    })
                );
                return
            }
            inventoryApi
                .updateConsumableEquipment(inventoryItemId, requestBody)
                .then(() => {
                    fetchData();
                    setUpdateFormData({
                        inventoryItemId: null,
                        name: "",
                        description: "",
                        quantity: "",
                        price: "",
                    });
                    reduxDispatch(
                        displayMessage({
                            color: "success",
                            icon: "notification",
                            title: "Successfully Updated Facility!",
                            content: requestBody.name + " updated",
                        })
                    );
                    handleCloseUpdateModal();
                })
                .catch((err) => {
                    reduxDispatch(
                        displayMessage({
                            color: "error",
                            icon: "notification",
                            title: "Error Encountered",
                            content: err.response.data,
                        })
                    );
                    console.log(err)
                });
        } catch (ex) {
            console.log(ex);
        }
    };

    const fetchData = async () => {
        inventoryApi
            .getAllConsumableEquipment("")
            .then((response) => {
                const consumableEpuipments = response.data; // Assuming 'facilities' is an array of facility objects
                console.log(response);
                // Map the fetched data to match your table structure
                const mappedRows = consumableEpuipments.map((consumableEpuipment) => ({
                    inventoryItemId: consumableEpuipment.inventoryItemId,
                    // number: index + 1,
                    name: consumableEpuipment.inventoryItemName,
                    description: consumableEpuipment.inventoryItemDescription,
                    quantity: consumableEpuipment.quantityInStock,
                    price: consumableEpuipment.restockPricePerQuantity,
                    // type: consumableEpuipment.itemTypeEnum,
                    // Map other columns as needed
                }));

                dataRef.current = {
                    ...dataRef.current,
                    rows: [mappedRows],
                };

                // Update the 'data' state with the mapped data
                setData((prevData) => ({
                    ...prevData,
                    rows: mappedRows,
                }));
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    };

    useEffect(() => {
        fetchData();
    }, []);

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
                                    Facilties Table
                                </MDTypography>
                            </MDBox>
                            <MDBox mx={2} mt={3} px={2}>
                                <MDButton
                                    Button
                                    variant="contained"
                                    color="primary"
                                // onClick={() => setIsModalOpen(true)}
                                >
                                    Create New Facility
                                    <Icon>add</Icon>
                                </MDButton>
                            </MDBox>
                            <MDBox pt={3}>
                                <DataTable canSearch={true} table={data} />
                            </MDBox>
                        </Card>
                    </Grid>
                </Grid>
            </MDBox>
            <Dialog open={isUpdateModalOpen} onClose={handleCloseUpdateModal}>
                <DialogTitle>Update Item</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        label="Name"
                        name="name"
                        value={updateFormData.name}
                        onChange={handleUpdateChange}
                        margin="dense"
                    />
                    <TextField
                        fullWidth
                        label="Description"
                        name="description"
                        value={updateFormData.description}
                        onChange={handleUpdateChange}
                        margin="dense"
                    />
                    <TextField
                        fullWidth
                        label="Quantity in Stock"
                        name="quantity"
                        type="number"
                        value={updateFormData.quantity}
                        onChange={handleUpdateChange}
                        margin="dense"
                    />
                    <TextField
                        fullWidth
                        label="Price per Quantity"
                        name="price"
                        type="number"
                        value={updateFormData.price}
                        onChange={handleUpdateChange}
                        margin="dense"
                    />
                </DialogContent>
                <DialogActions>
                    <MDButton onClick={handleCloseUpdateModal} color="primary">
                        Cancel
                    </MDButton>
                    <MDButton onClick={handleUpdateConsumableEquipment} color="primary">
                        Update
                    </MDButton>
                </DialogActions>
            </Dialog>

        </DashboardLayout>
    );

}

export default ConsumableEquipmentManagement;