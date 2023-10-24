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
import { IconButton, Icon, FormGroup, FormControlLabel, Checkbox } from "@mui/material";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "examples/Tables/DataTable";
import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";

import { inventoryApi } from "api/Api";

import ViewMedicationDetailsDialog from "./viewMedicationDetailsDialog";
import { displayMessage } from "store/slices/snackbarSlice";


function MedicationManagement() {

    function priceFormat(num) {
        return `${num.toFixed(2)}`;
    }

    const [allergenEnums, setAllergenEnums] = useState([]);

    const reduxDispatch = useDispatch();
    const [data, setData] = useState({
        columns: [
            // { Header: "No.", accessor: "inventoryItemId", width: "10%" },
            { Header: "Medication Name", accessor: "inventoryItemName", width: "20%" },
            { Header: "Description", accessor: "inventoryItemDescription", width: "20%" },
            { Header: "Quantity", accessor: "quantityInStock", width: "10%" },
            { Header: "Restock Price ($)", accessor: "restockPricePerQuantity", width: "10%" },
            { Header: "Retail Price ($)", accessor: "retailPricePerQuantity", width: "10%" },
            {
                Header: "Actions",
                Cell: ({ row }) => (
                    <MDBox>
                        <ViewMedicationDetailsDialog inventoryItemId={row.original.inventoryItemId} />
                        <IconButton
                            color="secondary"
                            onClick={() => handleDeleteInventory(row.original.inventoryItemId)}
                            title="Delete"
                        >
                            <Icon>delete</Icon>
                        </IconButton>
                        <IconButton
                            color="secondary"
                            onClick={() => handleOpenUpdateModal(row.original.inventoryItemId)}
                            title="Update"
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
            // { Header: "No.", accessor: "inventoryItemId", width: "10%" },
            { Header: "Medication Name", accessor: "inventoryItemName", width: "20%" },
            { Header: "Description", accessor: "inventoryItemDescription", width: "20%" },
            { Header: "Quantity", accessor: "quantityInStock", width: "10%" },
            { Header: "Restock Price ($)", accessor: "restockPricePerQuantity", width: "10%" },
            { Header: "Retail Price ($)", accessor: "retailPricePerQuantity", width: "10%" },
            {
                Header: "Actions",
                Cell: ({ row }) => (
                    <MDBox>
                        <ViewMedicationDetailsDialog
                            inventoryItemId={row.original.inventoryItemId} />

                        <IconButton
                            color="secondary"
                            onClick={() => handleDeleteInventory(row.original.inventoryItemId)}
                            title="Delete"
                        >
                            <Icon>delete</Icon>
                        </IconButton>
                        <IconButton
                            color="secondary"
                            onClick={() => handleOpenUpdateModal(row.original.inventoryItemId)}
                            title="Update"
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

    useEffect(() => {
        const getAllergenEnums = async () => {
            try {
                const response = await inventoryApi.getAllergenEnums();
                setAllergenEnums(response.data);
                console.log(allergenEnums);
            } catch (error) {
                console.log(error);
            }
        };
        getAllergenEnums();
    }, []);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        inventoryItemName: "",
        inventoryItemDescription: "",
        itemTypeEnum: "MEDICINE",
        quantityInStock: "",
        restockPricePerQuantity: "",
        retailPricePerQuantity: "",
        allergenEnumList: [],
    });

    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [updateFormData, setUpdateFormData] = useState({
        inventoryItemId: null,
        inventoryItemName: "",
        inventoryItemDescription: "",
        itemTypeEnum: "MEDICINE",
        quantityInStock: "",
        restockPricePerQuantity: "",
        retailPricePerQuantity: "",
        allergenEnumList: [],
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

    const handleCreateMedication = () => {
        try {
            const { ...requestBody } = formData;
            console.log("Type:" + requestBody.itemTypeEnum)
            if (requestBody.inventoryItemName == "") {
                setFormData({
                    inventoryItemName: "",
                    inventoryItemDescription: "",
                    itemTypeEnum: "MEDICINE",
                    quantityInStock: "",
                    restockPricePerQuantity: "",
                    retailPricePerQuantity: "",
                    allergenEnumList: [],
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
                    itemTypeEnum: "MEDICINE",
                    quantityInStock: "",
                    restockPricePerQuantity: "",
                    retailPricePerQuantity: "",
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
                    itemTypeEnum: "MEDICINE",
                    quantityInStock: "",
                    restockPricePerQuantity: "",
                    retailPricePerQuantity: "",
                    allergenEnumList: [],
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
                    itemTypeEnum: "MEDICINE",
                    quantityInStock: "",
                    restockPricePerQuantity: "",
                    retailPricePerQuantity: "",
                    allergenEnumList: [],
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
            if (requestBody.retailPricePerQuantity == "") {
                setFormData({
                    inventoryItemName: "",
                    inventoryItemDescription: "",
                    itemTypeEnum: "MEDICINE",
                    quantityInStock: "",
                    restockPricePerQuantity: "",
                    retailPricePerQuantity: "",
                    allergenEnumList: [],
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
                .createMedication(requestBody)
                .then(() => {
                    fetchData();
                    setFormData({
                        inventoryItemName: "",
                        inventoryItemDescription: "",
                        itemTypeEnum: "MEDICINE",
                        quantityInStock: "",
                        restockPricePerQuantity: "",
                        retailPricePerQuantity: "",
                        allergenEnumList: [],
                    });
                    reduxDispatch(
                        displayMessage({
                            color: "success",
                            icon: "notification",
                            title: "Successfully Created MEDICINE!",
                            content: requestBody.inventoryItemName + " created",
                        })
                    );
                    handleCloseModal();
                })
                .catch((err) => {
                    setFormData({
                        inventoryItemName: "",
                        inventoryItemDescription: "",
                        itemTypeEnum: "MEDICINE",
                        quantityInStock: "",
                        restockPricePerQuantity: "",
                        retailPricePerQuantity: "",
                        allergenEnumList: [],
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
        const medicationToUpdate = dataRef.current.rows[0].find(
            (medication) => medication.inventoryItemId === inventoryItemId
        );
        console.log("update " + medicationToUpdate.inventoryItemName);
        if (medicationToUpdate) {
            setUpdateFormData({
                inventoryItemId: inventoryItemId,
                inventoryItemName: medicationToUpdate.inventoryItemName,
                inventoryItemDescription: medicationToUpdate.inventoryItemDescription,
                itemTypeEnum: medicationToUpdate.itemTypeEnum,
                quantityInStock: medicationToUpdate.quantityInStock,
                restockPricePerQuantity: medicationToUpdate.restockPricePerQuantity,
                retailPricePerQuantity: medicationToUpdate.retailPricePerQuantity,
                allergenEnumList: medicationToUpdate.allergenEnumList,
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

    const handleUpdateMedication = () => {

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
            if (requestBody.retailPricePerQuantity == "") {
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
            console.log("Request: " + requestBody.inventoryItemName);
            inventoryApi
                .updateMedication(inventoryItemId, requestBody)
                .then(() => {
                    fetchData();
                    setUpdateFormData({
                        inventoryItemId: null,
                        inventoryItemName: "",
                        inventoryItemDescription: "",
                        itemTypeEnum: "CONSUMABLE",
                        quantityInStock: "",
                        restockPricePerQuantity: "",
                        retailPricePerQuantity: "",
                        allergenEnumList: [],
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

    const handleDeleteInventory = (inventoryItemId) => {
        try {
            inventoryApi
                .deleteMedication(inventoryItemId)
                .then(() => {
                    fetchData();
                    reduxDispatch(
                        displayMessage({
                            color: "success",
                            icon: "notification",
                            title: "Successfully Deleted Medication!",
                            content: "Medication with inventoryItemId: " + inventoryItemId + " deleted",
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
            .getAllMedication("")
            .then((response) => {
                const medications = response.data; // Assuming 'facilities' is an array of facility objects
                console.log(response);
                // Map the fetched data to match your table structure
                const mappedRows = medications.map((medication) => ({
                    inventoryItemId: medication.inventoryItemId,
                    inventoryItemName: medication.inventoryItemName,
                    inventoryItemDescription: medication.inventoryItemDescription,
                    itemTypeEnum: medication.itemTypeEnum,
                    quantityInStock: medication.quantityInStock,
                    restockPricePerQuantity: priceFormat(medication.restockPricePerQuantity),
                    retailPricePerQuantity: priceFormat(medication.retailPricePerQuantity),
                    allergenEnumList: medication.allergenEnumList,
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
        <>
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
                                    Medication Table
                                </MDTypography>
                            </MDBox>
                            <MDBox mx={2} mt={3} px={2}>
                                <MDButton
                                    Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => setIsModalOpen(true)}
                                >
                                    Create New Medication
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
                        label="Restock Price per Quantity"
                        name="restockPricePerQuantity"
                        type="float"
                        value={formData.restockPricePerQuantity}
                        onChange={handleChange}
                        margin="dense"
                    />
                    <TextField
                        fullWidth
                        label="Retail Price per Quantity"
                        name="retailPricePerQuantity"
                        type="float"
                        value={formData.retailPricePerQuantity}
                        onChange={handleChange}
                        margin="dense"
                    />
                    <FormControl fullWidth margin="dense">
                        <InputLabel>Allergens</InputLabel>
                        <Select
                            name="allergenEnumList"
                            multiple
                            value={formData.allergenEnumList}
                            onChange={handleChange}
                            renderValue={(selected) => selected.join(', ')}
                            sx={{ lineHeight: "3em" }}
                        >
                            {allergenEnums?.map(allergenEnum => (
                                <MenuItem key={allergenEnum} value={allergenEnum}>
                                    <Checkbox checked={formData.allergenEnumList.includes(allergenEnum)} />
                                    {allergenEnum}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
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
                    <MDButton onClick={handleCreateMedication} color="primary">
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
                        label="Restock Price per Quantity"
                        name="restockPricePerQuantity"
                        type="float"
                        value={updateFormData.restockPricePerQuantity}
                        onChange={handleUpdateChange}
                        margin="dense"
                    />
                    <TextField
                        fullWidth
                        label="Retail Price per Quantity"
                        name="retailPricePerQuantity"
                        type="float"
                        value={updateFormData.retailPricePerQuantity}
                        onChange={handleUpdateChange}
                        margin="dense"
                    />
                    <FormControl fullWidth margin="dense">
                        <InputLabel>Allergens</InputLabel>
                        <Select
                            name="allergenEnumList"
                            multiple
                            value={updateFormData.allergenEnumList}
                            onChange={handleUpdateChange}
                            renderValue={(selected) => selected.join(', ')}
                            sx={{ lineHeight: "3em" }}
                        >
                            {allergenEnums?.map(allergenEnum => (
                                <MenuItem key={allergenEnum} value={allergenEnum}>
                                    <Checkbox checked={updateFormData.allergenEnumList.includes(allergenEnum)} />
                                    {allergenEnum}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <MDButton onClick={handleCloseUpdateModal} color="primary">
                        Cancel
                    </MDButton>
                    <MDButton onClick={handleUpdateMedication} color="primary">
                        Update
                    </MDButton>
                </DialogActions>
            </Dialog>

        </>
    );

}

export default MedicationManagement;