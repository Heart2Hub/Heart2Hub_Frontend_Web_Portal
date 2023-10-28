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
import { IconButton, Icon, Button } from "@mui/material";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "examples/Tables/DataTable";
import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";

import { facilityApi, departmentApi, wardApi } from "api/Api";
// import { displayMessage } from "../../../store/slices/snackbarSlice";
import { inventoryApi } from "api/Api";
import { displayMessage } from "store/slices/snackbarSlice";
import SelectWrapper from "components/Select";

function ServiceManagement() {
    const [departments, setDepartments] = useState([]);
    const [wards, setWards] = useState([]);
    const [isDeleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
    const [inventoryToDeleteId, setInventoryToDeleteId] = useState(false);

    function priceFormat(num) {
        return `${num.toFixed(2)}`;
    }

    const getUnits = async () => {
        try {
            const departmentsResponse = await departmentApi.getAllDepartments("");
            const wardsResponse = await wardApi.getAllWards("");
            setDepartments(departmentsResponse.data);
            setWards(wardsResponse.data);
            console.log(departments);
            console.log(wards);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getUnits();
    }, []);



    const reduxDispatch = useDispatch();
    const [data, setData] = useState({
        columns: [
            // { Header: "No.", accessor: "inventoryItemId", width: "10%" },
            { Header: "Service Name", accessor: "inventoryItemName", width: "20%" },
            { Header: "Description", accessor: "inventoryItemDescription", width: "20%" },
            { Header: "Retail Price ($)", accessor: "retailPricePerQuantity", width: "15%" },
            { Header: "Unit", accessor: "unitId", width: "10%" },
            { Header: "Item Type", accessor: "itemTypeEnum", width: "10%" },
            {
                Header: "Actions",
                Cell: ({ row }) => (
                    <MDBox>
                        <IconButton
                            color="secondary"
                            onClick={() => handleDeleteInventory(row.original.inventoryItemId)}
                            title="Delete"
                        >
                            <Icon>delete</Icon>
                        </IconButton>
                        <IconButton
                            color="secondary"
                            title="Update"
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
            // { Header: "No.", accessor: "inventoryItemId", width: "10%" },
            { Header: "Service Name", accessor: "inventoryItemName", width: "20%" },
            { Header: "Description", accessor: "inventoryItemDescription", width: "20%" },
            { Header: "Retail Price ($)", accessor: "retailPricePerQuantity", width: "20%" },
            { Header: "Unit", accessor: "unitId", width: "10%" },
            { Header: "Item Type", accessor: "itemTypeEnum", width: "10%" },
            {
                Header: "Actions",
                Cell: ({ row }) => (
                    <MDBox>
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

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        unitId: null,
        inventoryItemName: "",
        inventoryItemDescription: "",
        itemTypeEnum: "",
        retailPricePerQuantity: "",
    });

    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [updateFormData, setUpdateFormData] = useState({
        inventoryItemId: null,
        inventoryItemName: "",
        inventoryItemDescription: "",
        itemTypeEnum: "",
        retailPricePerQuantity: "",
        unitId: null,
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

    const handleCreateServiceItem = () => {
        try {
            const { unitId, ...requestBody } = formData;
            console.log("Type:" + unitId)
            if (unitId == null) {
                setFormData({
                    unitId: null,
                    inventoryItemName: "",
                    inventoryItemDescription: "",
                    itemTypeEnum: "",
                    retailPricePerQuantity: "",
                });
                reduxDispatch(
                    displayMessage({
                        color: "error",
                        icon: "notification",
                        title: "Error Encountered",
                        content: "Unit cannot be null",
                    })
                );
                return
            }
            if (requestBody.inventoryItemName == "") {
                setFormData({
                    unitId: null,
                    inventoryItemName: "",
                    inventoryItemDescription: "",
                    itemTypeEnum: "",
                    retailPricePerQuantity: "",
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
                    unitId: null,
                    inventoryItemName: "",
                    inventoryItemDescription: "",
                    itemTypeEnum: "",
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
            if (requestBody.retailPricePerQuantity == "") {
                setFormData({
                    unitId: null,
                    inventoryItemName: "",
                    inventoryItemDescription: "",
                    itemTypeEnum: "",
                    retailPricePerQuantity: "",
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
            console.log(formData)
            inventoryApi
                .createServiceItem(unitId, requestBody)
                .then(() => {
                    fetchData();
                    setFormData({
                        inventoryItemName: "",
                        inventoryItemDescription: "",
                        itemTypeEnum: "",
                        retailPricePerQuantity: "",
                        unitId: null,
                    });
                    reduxDispatch(
                        displayMessage({
                            color: "success",
                            icon: "notification",
                            title: "Successfully Created Service!",
                            content: requestBody.inventoryItemName + " created",
                        })
                    );
                    handleCloseModal();
                })
                .catch((err) => {
                    setFormData({
                        inventoryItemName: "",
                        inventoryItemDescription: "",
                        itemTypeEnum: "",
                        retailPricePerQuantity: "",
                        unitId: null,
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
        const serviceItemToUpdate = dataRef.current.rows[0].find(
            (serviceItem) => serviceItem.inventoryItemId === inventoryItemId
        );
        console.log("update " + serviceItemToUpdate.inventoryItemName);
        if (serviceItemToUpdate) {
            setUpdateFormData({
                inventoryItemId: inventoryItemId,
                inventoryItemName: serviceItemToUpdate.inventoryItemName,
                inventoryItemDescription: serviceItemToUpdate.inventoryItemDescription,
                itemTypeEnum: serviceItemToUpdate.itemTypeEnum,
                retailPricePerQuantity: serviceItemToUpdate.retailPricePerQuantity,
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

    const handleUpdateServiceItem = () => {

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
                .updateServiceItem(inventoryItemId, requestBody)
                .then(() => {
                    fetchData();
                    setUpdateFormData({
                        inventoryItemId: null,
                        inventoryItemName: "",
                        inventoryItemDescription: "",
                        itemTypeEnum: "",
                        retailPricePerQuantity: "",
                    });
                    reduxDispatch(
                        displayMessage({
                            color: "success",
                            icon: "notification",
                            title: "Successfully Updated Service! ",
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
        setInventoryToDeleteId(inventoryItemId);
        setDeleteConfirmationOpen(true);
    };

    const handleConfirmDeleteInventory = (inventoryItemId) => {
        try {
            inventoryApi
                .deleteServiceItem(inventoryItemId)
                .then(() => {
                    fetchData();
                    setDeleteConfirmationOpen(false);
                    reduxDispatch(
                        displayMessage({
                            color: "success",
                            icon: "notification",
                            title: "Successfully Deleted Service!",
                            content: "Service Item with inventoryItemId: " + inventoryItemId + " deleted",
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
            .getAllServiceItem("")
            .then((response) => {
                const serviceItems = response.data; // Assuming 'facilities' is an array of facility objects
                console.log(response);
                // Map the fetched data to match your table structure
                const mappedRows = serviceItems.map((serviceItem) => ({
                    inventoryItemId: serviceItem.inventoryItemId,
                    inventoryItemName: serviceItem.inventoryItemName,
                    inventoryItemDescription: serviceItem.inventoryItemDescription,
                    itemTypeEnum: serviceItem.itemTypeEnum,
                    retailPricePerQuantity: priceFormat(serviceItem.retailPricePerQuantity),
                    unitId: serviceItem.unit.name,
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
                                    Service Table
                                </MDTypography>
                            </MDBox>
                            <MDBox mx={2} mt={3} px={2}>
                                <MDButton
                                    Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => setIsModalOpen(true)}
                                >
                                    Create New Service
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
                        label="Retail Price per Quantity"
                        name="retailPricePerQuantity"
                        type="float"
                        value={formData.retailPricePerQuantity}
                        onChange={handleChange}
                        margin="dense"
                    />
                    <FormControl fullWidth margin="dense">
                        <InputLabel>Unit</InputLabel>
                        <Select
                            name="unitId"
                            value={formData.unitId}
                            onChange={handleChange}
                            sx={{ lineHeight: "3em" }}>
                            <MenuItem disabled>Departments</MenuItem>
                            {departments?.map(department =>
                                <MenuItem value={department.unitId}>{department.name}</MenuItem>
                            )}
                            <MenuItem disabled>Wards</MenuItem>
                            {wards?.map(ward =>
                                <MenuItem value={ward.unitId}>{ward.name}</MenuItem>
                            )}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth margin="dense">
                        <InputLabel>Item Type</InputLabel>
                        <Select
                            name="itemTypeEnum"
                            value={formData.itemTypeEnum}
                            onChange={handleChange}
                            sx={{ lineHeight: "3em" }}
                        >
                            <MenuItem value="INPATIENT">Inpatient</MenuItem>
                            <MenuItem value="OUTPATIENT">Outpatient</MenuItem>
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <MDButton onClick={handleCloseModal} color="primary">
                        Cancel
                    </MDButton>
                    <MDButton onClick={handleCreateServiceItem} color="primary">
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
                        label="Retail Price per Quantity"
                        name="retailPricePerQuantity"
                        type="float"
                        value={updateFormData.retailPricePerQuantity}
                        onChange={handleUpdateChange}
                        margin="dense"
                    />
                    <FormControl fullWidth margin="dense">
                        <InputLabel>Item Type</InputLabel>
                        <Select
                            name="itemTypeEnum"
                            value={updateFormData.itemTypeEnum}
                            onChange={handleUpdateChange}
                            sx={{ lineHeight: "3em" }}
                        >
                            <MenuItem value="INPATIENT">Inpatient</MenuItem>
                            <MenuItem value="OUTPATIENT">Outpatient</MenuItem>
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <MDButton onClick={handleCloseUpdateModal} color="primary">
                        Cancel
                    </MDButton>
                    <MDButton onClick={handleUpdateServiceItem} color="primary">
                        Update
                    </MDButton>
                </DialogActions>
            </Dialog>
            <Dialog open={isDeleteConfirmationOpen} onClose={() => setDeleteConfirmationOpen(false)}>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    Are you sure you want to delete this item?
                </DialogContent>
                <DialogActions sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Button onClick={() => setDeleteConfirmationOpen(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={() => handleConfirmDeleteInventory(inventoryToDeleteId)} color="primary">
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>

        </DashboardLayout>
    );

}

export default ServiceManagement;