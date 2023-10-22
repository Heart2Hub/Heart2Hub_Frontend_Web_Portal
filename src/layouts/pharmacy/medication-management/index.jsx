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
import { IconButton, Icon, FormGroup, FormControlLabel, Checkbox, MenuProps, Autocomplete } from "@mui/material";
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

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
    const [drugRestrictions, setDrugRestrictions] = useState([]);
    const [drugs, setDrugs] = useState([]);

    // const [searchTerm, setSearchTerm] = useState('');

    // const handleSearchChange = (event) => {
    //     setSearchTerm(event.target.value);
    // };

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

    const getAllergenEnums = async () => {
        try {
            const response = await inventoryApi.getAllergenEnums();
            setAllergenEnums(response.data);
            console.log(allergenEnums);
        } catch (error) {
            console.log(error);
        }
    };

    const getDrugRestrictions = async () => {
        try {
            const response = await inventoryApi.getAllMedication();
            const medications = response.data;
            const restrictions = medications.map((drug) => drug.drugRestrictions)
            console.log(restrictions)
            setDrugs(medications.map((drug) => drug.drugRestrictions));
            console.log("med" + drugs);

            const mapDrugs = medications.map((drug) => drug.inventoryItemName);
            setDrugRestrictions(mapDrugs);
            console.log(" drug" + mapDrugs);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getAllergenEnums();
        getDrugRestrictions();
    }, [])

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        inventoryItemName: "",
        inventoryItemDescription: "",
        itemTypeEnum: "MEDICINE",
        quantityInStock: "",
        restockPricePerQuantity: "",
        retailPricePerQuantity: "",
        allergenEnumList: [],
        comments: "",
        drugRestrictions: [],
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
        comments: "",
        drugRestrictions: [],
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
            console.log("Type:" + requestBody.allergenEnumList)
            if (requestBody.inventoryItemName == "") {
                setFormData({
                    inventoryItemName: "",
                    inventoryItemDescription: "",
                    itemTypeEnum: "MEDICINE",
                    quantityInStock: "",
                    restockPricePerQuantity: "",
                    retailPricePerQuantity: "",
                    allergenEnumList: [],
                    comments: "",
                    drugRestrictions: [],
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
                    comments: "",
                    drugRestrictions: [],
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
                    comments: "",
                    drugRestrictions: [],
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
                    comments: "",
                    drugRestrictions: [],
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
                    comments: "",
                    drugRestrictions: [],
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
                        comments: "",
                        drugRestrictions: [],
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
                        comments: "",
                        drugRestrictions: [],
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
        // console.log("update " + medicationToUpdate.drugRestrictions);
        // // const meds = medicationToUpdate.drugRestrictions;
        // // setDrugs(meds.map((drug) => drug.drugName));
        // console.log("DRUGS " + drugs)
        // console.log("UPDATE" + updateFormData.drugRestrictions)
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
                comments: medicationToUpdate.comments,
                drugRestrictions: medicationToUpdate.drugRestrictions.map((drug) => drug.drugName),
            });
            console.log(drugRestrictions)
            console.log(updateFormData.drugRestrictions)
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
                        comments: "",
                        drugRestrictions: [],
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
                    comments: medication.comments,
                    drugRestrictions: medication.drugRestrictions,
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

    const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
    const checkedIcon = <CheckBoxIcon fontSize="small" />;

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
                        <Autocomplete
                            multiple
                            id="allergenEnumsList"
                            options={allergenEnums}
                            disableCloseOnSelect
                            getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
                            renderOption={(props, option, { selected }) => (
                                <li {...props}>
                                    <Checkbox
                                        icon={icon}
                                        checkedIcon={checkedIcon}
                                        style={{ marginRight: 8 }}
                                        checked={selected}
                                    />
                                    {option}
                                </li>
                            )}
                            // name="allergenEnumList"
                            // value={formData.allergenEnumList}
                            onChange={(event, newValue) => {
                                const newAllergenEnumList = newValue.map((item) => item);
                                console.log("allerger " + newAllergenEnumList)
                                setFormData((prevData) => ({
                                    ...prevData,
                                    allergenEnumList: newAllergenEnumList,
                                }));
                            }}
                            renderInput={(params) => (
                                <TextField {...params}
                                    label="Allergens"
                                />
                            )}
                        />
                    </FormControl>
                    <FormControl fullWidth margin="dense">
                        <Autocomplete
                            multiple
                            id="drugRestrictions"
                            options={drugRestrictions}
                            disableCloseOnSelect
                            getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
                            renderOption={(props, option, { selected }) => (
                                <li {...props}>
                                    <Checkbox
                                        icon={icon}
                                        checkedIcon={checkedIcon}
                                        style={{ marginRight: 8 }}
                                        checked={selected}
                                    />
                                    {option}
                                </li>
                            )}
                            // style={{ width: 500 }}
                            onChange={(event, newValue) => {
                                const newDrugRestrictions = newValue.map((item) => item);
                                setFormData((prevData) => ({
                                    ...prevData,
                                    drugRestrictions: newDrugRestrictions,
                                }));
                            }}
                            renderInput={(params) => (
                                <TextField {...params}
                                    label="Drug Restrictions"
                                />
                            )}
                        />
                    </FormControl>
                    <TextField
                        fullWidth
                        label="Comments"
                        name="comments"
                        type="textarea"
                        value={formData.comments}
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
                        <Autocomplete
                            multiple
                            id="allergenEnumsList"
                            options={allergenEnums}
                            disableCloseOnSelect
                            getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
                            renderOption={(props, option, { selected }) => (
                                <li {...props}>
                                    <Checkbox
                                        icon={icon}
                                        checkedIcon={checkedIcon}
                                        style={{ marginRight: 8 }}
                                        checked={selected}
                                    />
                                    {option}
                                </li>
                            )}
                            value={updateFormData.allergenEnumList}
                            onChange={(event, newValue) => {
                                const newAllergenEnumList = newValue.map((item) => item);
                                console.log("allerger " + newAllergenEnumList)
                                setUpdateFormData((prevData) => ({
                                    ...prevData,
                                    allergenEnumList: newAllergenEnumList,
                                }));
                            }}
                            renderInput={(params) => (
                                <TextField {...params}
                                    label="Allergens"
                                />
                            )}
                        />
                    </FormControl>
                    <FormControl fullWidth margin="dense">
                        <Autocomplete
                            multiple
                            id="drugRestrictions"
                            options={drugRestrictions}
                            disableCloseOnSelect
                            getOptionDisabled={(option) =>
                                option === updateFormData.inventoryItemName
                            }
                            getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
                            renderOption={(props, option, { selected }) => (
                                <li {...props}>
                                    <Checkbox
                                        icon={icon}
                                        checkedIcon={checkedIcon}
                                        style={{ marginRight: 8 }}
                                        checked={selected}
                                    />
                                    {option}
                                </li>
                            )}
                            value={updateFormData.drugRestrictions}
                            // value={updateFormData.drugRestrictions.map((drug) => drug.drugName)}
                            onChange={(event, newValue) => {
                                const newDrugRestrictions = newValue.map((item) => item);
                                console.log("allerger " + newDrugRestrictions)

                                setUpdateFormData((prevData) => ({
                                    ...prevData,
                                    drugRestrictions: newDrugRestrictions,
                                }));
                            }}
                            renderInput={(params) => (
                                <TextField {...params}
                                    label="Drug Restrictions"
                                />
                            )}
                        />
                    </FormControl>
                    <TextField
                        fullWidth
                        label="Comments"
                        name="comments"
                        value={updateFormData.comments}
                        onChange={handleUpdateChange}
                        margin="dense"
                    />
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

        </DashboardLayout>
    );

}

export default MedicationManagement;