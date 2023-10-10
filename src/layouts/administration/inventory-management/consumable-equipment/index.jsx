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

    function priceFormat(num) {
        return `${num.toFixed(2)}`;
    }

    const reduxDispatch = useDispatch();
    const [data, setData] = useState({
        columns: [
            { Header: "No.", accessor: "inventoryItemId", width: "10%" },
            { Header: "Equipment Name", accessor: "inventoryItemName", width: "20%" },
            { Header: "Description", accessor: "inventoryItemDescription", width: "20%" },
            { Header: "Quantity", accessor: "quantityInStock", width: "10%" },
            { Header: "Price ($)", accessor: "restockPricePerQuantity", width: "10%" },
            {
                Header: "Actions",
                Cell: ({ row }) => (
                    <MDBox>
                        <IconButton
                            color="secondary"
                            onClick={() => handleDeleteInventory(row.original.inventoryItemId)}
                        >
                            <Icon>delete</Icon>
                        </IconButton>
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
            { Header: "No.", accessor: "inventoryItemId", width: "10%" },
            { Header: "Equipment Name", accessor: "inventoryItemName", width: "20%" },
            { Header: "Description", accessor: "inventoryItemDescription", width: "20%" },
            { Header: "Quantity", accessor: "quantityInStock", width: "10%" },
            { Header: "Price ($)", accessor: "restockPricePerQuantity", width: "10%" },
            {
                Header: "Actions",
                Cell: ({ row }) => (
                    <MDBox>
                        <IconButton
                            color="secondary"
                            onClick={() => handleDeleteInventory(row.original.inventoryItemId)}
                        >
                            <Icon>delete</Icon>
                        </IconButton>
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
        inventoryItemName: "",
        inventoryItemDescription: "",
        itemTypeEnum: "CONSUMABLE",
        quantityInStock: "",
        restockPricePerQuantity: "",
    });

    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [updateFormData, setUpdateFormData] = useState({
        inventoryItemId: null,
        inventoryItemName: "",
        inventoryItemDescription: "",
        itemTypeEnum: "CONSUMABLE",
        quantityInStock: "",
        restockPricePerQuantity: "",
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

    const handleCreateConsumableEquipment = () => {
        try {
            const { ...requestBody } = formData;
            console.log("Type:" + requestBody.itemTypeEnum)
            if (requestBody.inventoryItemName == "") {
                setFormData({
                    inventoryItemName: "",
                    inventoryItemDescription: "",
                    itemTypeEnum: "CONSUMABLE",
                    quantityInStock: "",
                    restockPricePerQuantity: "",
                });
                reduxDispatch(
                    displayMessage({
                        color: "error",
                        icon: "notification",
                        title: "Error Encountered",
                        content: "Item name cannot be null",
                    })
                );
                return
            }
            if (requestBody.inventoryItemDescription == "") {
                setFormData({
                    inventoryItemName: "",
                    inventoryItemDescription: "",
                    itemTypeEnum: "CONSUMABLE",
                    quantityInStock: "",
                    restockPricePerQuantity: "",
                });
                reduxDispatch(
                    displayMessage({
                        color: "error",
                        icon: "notification",
                        title: "Error Encountered",
                        content: "Item description cannot be null",
                    })
                );
                return
            }
            if (requestBody.quantityInStock == "") {
                setFormData({
                    inventoryItemName: "",
                    inventoryItemDescription: "",
                    itemTypeEnum: "CONSUMABLE",
                    quantityInStock: "",
                    restockPricePerQuantity: "",
                });
                reduxDispatch(
                    displayMessage({
                        color: "error",
                        icon: "notification",
                        title: "Error Encountered",
                        content: "Item quantity cannot be null",
                    })
                );
                return
            }
            if (requestBody.restockPricePerQuantity == "") {
                setFormData({
                    inventoryItemName: "",
                    inventoryItemDescription: "",
                    itemTypeEnum: "CONSUMABLE",
                    quantityInStock: "",
                    restockPricePerQuantity: "",
                });
                reduxDispatch(
                    displayMessage({
                        color: "error",
                        icon: "notification",
                        title: "Error Encountered",
                        content: "Item price cannot be null",
                    })
                );
                return
            }
            inventoryApi
                .createConsumableEquipment(requestBody)
                .then(() => {
                    fetchData();
                    setFormData({
                        inventoryItemName: "",
                        inventoryItemDescription: "",
                        itemTypeEnum: "CONSUMABLE",
                        quantityInStock: "",
                        restockPricePerQuantity: "",
                    });
                    reduxDispatch(
                        displayMessage({
                            color: "success",
                            icon: "notification",
                            title: "Successfully Created Facility!",
                            content: requestBody.inventoryItemName + " created",
                        })
                    );
                    handleCloseModal();
                })
                .catch((err) => {
                    setFormData({
                        inventoryItemName: "",
                        inventoryItemDescription: "",
                        itemTypeEnum: "CONSUMABLE",
                        quantityInStock: "",
                        restockPricePerQuantity: "",
                    });
                    // Weird functionality here. If allow err.response.detail when null whle react application breaks cause error is stored in the state. Must clear cache. Something to do with the state.
                    if (err.response.data.detail) {
                        reduxDispatch(
                            displayMessage({
                                color: "error",
                                icon: "notification",
                                title: "Error Encountered",
                                content: err.response.data.detail,
                            })
                        );
                    } else {
                        reduxDispatch(
                            displayMessage({
                                color: "error",
                                icon: "notification",
                                title: "Error Encountered",
                                content: err.response.data,
                            })
                        );
                    }
                    console.log(err.response.data.detail)
                });
        } catch (ex) {
            console.log(ex);
        }
    };

    const handleOpenUpdateModal = (inventoryItemId) => {
        console.log("Inventory " + inventoryItemId);
        // Populate update form data with the facility's current data
        // const { inventoryItemId, name, description, quantity, price } = rowData;
        const consumableEquipmentToUpdate = dataRef.current.rows[0].find(
            (consumableEquipment) => consumableEquipment.inventoryItemId === inventoryItemId
        );
        console.log("update " + consumableEquipmentToUpdate.inventoryItemName);
        if (consumableEquipmentToUpdate) {
            setUpdateFormData({
                inventoryItemId: inventoryItemId,
                inventoryItemName: consumableEquipmentToUpdate.inventoryItemName,
                inventoryItemDescription: consumableEquipmentToUpdate.inventoryItemDescription,
                itemTypeEnum: consumableEquipmentToUpdate.itemTypeEnum,
                quantityInStock: consumableEquipmentToUpdate.quantityInStock,
                restockPricePerQuantity: consumableEquipmentToUpdate.restockPricePerQuantity,
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
            console.log("updateFormData:", updateFormData);
            console.log("Request Body:", requestBody);
            console.log(requestBody.inventoryItemId)
            if (requestBody.inventoryItemName == "") {
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
            console.log(requestBody.inventoryItemDescription)
            if (requestBody.inventoryItemDescription == "") {
                reduxDispatch(
                    displayMessage({
                        color: "error",
                        icon: "notification",
                        title: "Error Encountered",
                        content: "Description cannot be null",
                    })
                );
                return
            }
            console.log(requestBody.quantityInStock)

            if (requestBody.quantityInStock == "") {
                reduxDispatch(
                    displayMessage({
                        color: "error",
                        icon: "notification",
                        title: "Error Encountered",
                        content: "Item quantity cannot be null",
                    })
                );
                return
            }
            console.log(requestBody.restockPricePerQuantity)
            if (requestBody.restockPricePerQuantity == "") {
                reduxDispatch(
                    displayMessage({
                        color: "error",
                        icon: "notification",
                        title: "Error Encountered",
                        content: "Item price cannot be null",
                    })
                );
                return
            }
            console.log("Request: " + requestBody.quantityInStock);
            inventoryApi
                .updateConsumableEquipment(inventoryItemId, requestBody)
                .then(() => {
                    fetchData();
                    setUpdateFormData({
                        inventoryItemId: null,
                        inventoryItemName: "",
                        inventoryItemDescription: "",
                        itemTypeEnum: "CONSUMABLE",
                        quantityInStock: "",
                        restockPricePerQuantity: "",
                    });
                    reduxDispatch(
                        displayMessage({
                            color: "success",
                            icon: "notification",
                            title: "Successfully Updated Consumable Equipment! ",
                            content: requestBody.inventoryItemName + " updated",
                        })
                    );
                    handleCloseUpdateModal();
                })
                .catch((err) => {
                    if (err.response.data.detail) {
                        reduxDispatch(
                            displayMessage({
                                color: "error",
                                icon: "notification",
                                title: "Error Encountered",
                                content: err.response.data.detail,
                            })
                        );
                    } else {
                        reduxDispatch(
                            displayMessage({
                                color: "error",
                                icon: "notification",
                                title: "Error Encountered",
                                content: err.response.data,
                            })
                        );
                    }
                    console.log(err.response.data.detail)
                });
        } catch (ex) {
            console.log(ex);
        }
    };

    const handleDeleteInventory = (inventoryItemId) => {
        try {
            inventoryApi
                .deleteConsumableEquipment(inventoryItemId)
                .then(() => {
                    fetchData();
                    reduxDispatch(
                        displayMessage({
                            color: "success",
                            icon: "notification",
                            title: "Successfully Deleted Consumable Equipment!",
                            content: "Consumable Equipment with inventoryItemId: " + inventoryItemId + " deleted",
                        })
                    );
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
                    console.log(err);
                });
        } catch (ex) {
            console.error(ex);
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
                    inventoryItemName: consumableEpuipment.inventoryItemName,
                    inventoryItemDescription: consumableEpuipment.inventoryItemDescription,
                    itemTypeEnum: consumableEpuipment.itemTypeEnum,
                    quantityInStock: consumableEpuipment.quantityInStock,
                    restockPricePerQuantity: priceFormat(consumableEpuipment.restockPricePerQuantity),
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
                                    Consumable Equipment Table
                                </MDTypography>
                            </MDBox>
                            <MDBox mx={2} mt={3} px={2}>
                                <MDButton
                                    Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => setIsModalOpen(true)}
                                >
                                    Create New Equipment
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
            <Dialog open={isModalOpen} onClose={handleCloseModal}>
                <DialogTitle>Create New Item</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        label="Name"
                        name="inventoryItemName"
                        value={formData.inventoryItemName}
                        onChange={handleChange}
                        margin="dense"
                    />
                    <TextField
                        fullWidth
                        label="Description"
                        name="inventoryItemDescription"
                        value={formData.inventoryItemDescription}
                        onChange={handleChange}
                        margin="dense"
                    />
                    <TextField
                        fullWidth
                        label="Quantity"
                        name="quantityInStock"
                        type="number"
                        value={formData.quantityInStock}
                        onChange={handleChange}
                        margin="dense"
                    />
                    <TextField
                        fullWidth
                        label="Price"
                        name="restockPricePerQuantity"
                        type="number"
                        value={formData.restockPricePerQuantity}
                        onChange={handleChange}
                        margin="dense"
                    />
                    <TextField
                        fullWidth
                        label="Type"
                        name="itemTypeEnum"
                        value={formData.itemTypeEnum}
                        margin="dense"
                    />
                </DialogContent>
                <DialogActions>
                    <MDButton onClick={handleCloseModal} color="primary">
                        Cancel
                    </MDButton>
                    <MDButton onClick={handleCreateConsumableEquipment} color="primary">
                        Create
                    </MDButton>
                </DialogActions>
            </Dialog>
            <Dialog open={isUpdateModalOpen} onClose={handleCloseUpdateModal}>
                <DialogTitle>Update Item</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        label="Name"
                        name="inventoryItemName"
                        value={updateFormData.inventoryItemName}
                        onChange={handleUpdateChange}
                        margin="dense"
                    />
                    <TextField
                        fullWidth
                        label="Description"
                        name="inventoryItemDescription"
                        value={updateFormData.inventoryItemDescription}
                        onChange={handleUpdateChange}
                        margin="dense"
                    />
                    <TextField
                        fullWidth
                        label="Quantity in Stock"
                        name="quantityInStock"
                        type="number"
                        value={updateFormData.quantityInStock}
                        onChange={handleUpdateChange}
                        margin="dense"
                    />
                    <TextField
                        fullWidth
                        label="Price per Quantity"
                        name="restockPricePerQuantity"
                        type="float"
                        value={updateFormData.restockPricePerQuantity}
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