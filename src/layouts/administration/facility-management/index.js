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
import { IconButton, Icon, Button, Typography } from "@mui/material";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "examples/Tables/DataTable";
import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";

import { facilityApi, departmentApi, allocatedInventoryApi } from "api/Api";
import { displayMessage } from "../../../store/slices/snackbarSlice";
import { selectStaff } from "store/slices/staffSlice";
import { useSelector } from "react-redux";
import ConfirmationDialogComponent from "./confirmationDialogComponent";

function FacilityManagement() {
  const reduxDispatch = useDispatch();
  const [isInventoryDialogOpen, setIsInventoryDialogOpen] = useState(false);
  const [selectedFacilityInventory, setSelectedFacilityInventory] = useState([]);
  const [facilityInventory, setFacilityInventory] = useState([]); // State to store facility inventory  

  const [selectedFacilityId, setSelectedFacilityId] = useState(null); // State to store facility inventory  

  const [isUpdateInventoryDialogOpen, setIsUpdateInventoryDialogOpen] = useState(false);
  const [selectedInventoryItemForUpdate, setSelectedInventoryItemForUpdate] = useState(null);
  // const [selectedAllocatedInventoryId, setSelectedAllocatedInventoryId] = useState(null);
  const [newQuantity, setNewQuantity] = useState(0);
  const [minQuantity, setMinQuantity] = useState(0); // Add minQuantity state

  const [allocatedInventoryIdForUpdate, setAllocatedInventoryIdForUpdate] = useState(null);
  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] = useState(false);
  const [inventoryItemToDelete, setInventoryItemToDelete] = useState(null);
  const [isNeedRestock, setisNeedRestock] = useState(false);

  const staff = useSelector(selectStaff);
  const staffRole = staff.staffRoleEnum;
  const ADMIN_ROLE = 'ADMIN';
  const NURSE_ROLE = 'NURSE';

  const isAdmin = staffRole === ADMIN_ROLE;
  const isNurse = staffRole === NURSE_ROLE;

  const handleUpdateInventory = (inventoryItem) => {
    setSelectedInventoryItemForUpdate(inventoryItem);
    setAllocatedInventoryIdForUpdate(inventoryItem.allocatedInventoryId);
    setNewQuantity(inventoryItem.allocatedInventoryCurrentQuantity); // Initialize with the current quantity
    setMinQuantity(inventoryItem.minimumQuantityBeforeRestock);
    setIsUpdateInventoryDialogOpen(true);
  };

  const handleUpdateQuantity = () => {
    // Check if selectedInventoryItemForUpdate and newQuantity are valid
    try {
      const requestBody = {
        allocatedInventoryIdForUpdate,
        newQuantity,
        minQuantity
      }
      if (requestBody.newQuantity == "") {
        reduxDispatch(
          displayMessage({
            color: "error",
            icon: "notification",
            title: "Error Encountered",
            content: "Quantity cannot be null",
          })
        );
        return
      }
      console.log("newQuantity " + requestBody.new)
      if (requestBody.newQuantity < 0) {
        reduxDispatch(
          displayMessage({
            color: "error",
            icon: "notification",
            title: "Error Encountered",
            content: "Quantity cannot be less than 0",
          })
        );
        return
      }
      if (requestBody.minQuantity == "") {
        reduxDispatch(
          displayMessage({
            color: "error",
            icon: "notification",
            title: "Error Encountered",
            content: "Minimum quantity cannot be null",
          })
        );
        return
      }
      if (requestBody.minQuantity < 0) {
        reduxDispatch(
          displayMessage({
            color: "error",
            icon: "notification",
            title: "Error Encountered",
            content: "Minimum quantity cannot be less than 0",
          })
        );
        return
      }
      allocatedInventoryApi
        .updateAllocatedInventory(requestBody)
        .then(() => {
          fetchData();
          fetchInventoryItems();

          const updatedInventory = selectedFacilityInventory.map((item) => {
            if (item.allocatedInventoryId === allocatedInventoryIdForUpdate) {
              // Update the quantity with the new value
              return { ...item, allocatedInventoryCurrentQuantity: newQuantity, minimumQuantityBeforeRestock: minQuantity };
            }
            return item;
          });

          setSelectedFacilityInventory(updatedInventory);

          console.log("Updated: " + updatedInventory);

          reduxDispatch(
            displayMessage({
              color: "success",
              icon: "notification",
              title: "Successfully Updated Inventory Item! ",
              content: "Inventory Item with Id " + requestBody.allocatedInventoryIdForUpdate + " updated",
            })
          );

          setIsUpdateInventoryDialogOpen(false);
          setSelectedInventoryItemForUpdate(null);
          setAllocatedInventoryIdForUpdate(null);
          setNewQuantity(0);
          setMinQuantity(0);

        }).catch((err) => {
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

  const handleOpenInventoryDialog = (inventoryData, facilityId) => {
    console.log(facilityId);
    setSelectedFacilityId(facilityId); // Set the facilityId in your state
    setSelectedFacilityInventory(inventoryData);
    setIsInventoryDialogOpen(true);
  };


  // Function to close the Facility Inventory Dialog
  const handleCloseInventoryDialog = () => {
    setIsInventoryDialogOpen(false);
  };

  const [isAddInventoryDialogOpen, setIsAddInventoryDialogOpen] = useState(false);
  const [selectedInventoryItem, setSelectedInventoryItem] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [inventoryItems, setInventoryItems] = useState([]); // State to store inventory items


  const addInventoryToFacility = async (inventoryItemId, quantity, minQuantity) => {

    try {
      const requestBody = {
        inventoryItemId,
        quantity,
        minQuantity,
        selectedFacilityId
      }

      console.log(requestBody);

      allocatedInventoryApi
        .createAllocatedInventory(requestBody)
        .then(() => {
          fetchData();
          fetchInventoryItems();
          fetchInventoryItemsOfFacility(selectedFacilityId);

          const updatedFacilityInventory = [...selectedFacilityInventory]; // Make a copy
          const existingItemIndex = updatedFacilityInventory.findIndex(
            (item) => item.inventoryItemId === inventoryItemId
          );

          if (existingItemIndex !== -1) {
            // Item already exists, update the quantity and minQuantity
            updatedFacilityInventory[existingItemIndex].quantity += quantity;
            updatedFacilityInventory[existingItemIndex].minQuantity += minQuantity;
          } else {
            // Item doesn't exist, add a new entry
            updatedFacilityInventory.push({
              inventoryItemId,
              quantity,
              minQuantity,
            });
          }
          console.log(updatedFacilityInventory);

          // setSelectedFacilityInventory(updatedFacilityInventory);

          reduxDispatch(
            displayMessage({
              color: "success",
              icon: "notification",
              title: "Successfully Created Inventory Item!",
              content: "Inventory Item created",
            })
          );

        }).catch((err) => {
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

  const handleAddInventory = async (selectedFacilityId) => {
    // if (!selectedInventoryItem || quantity <= 0 || minQuantity < 0) {

    if (quantity == "") {
      reduxDispatch(
        displayMessage({
          color: "error",
          icon: "notification",
          title: "Error Encountered",
          content: "Quantity cannot be null",
        })
      );
      return
    }

    if (quantity < 0) {
      reduxDispatch(
        displayMessage({
          color: "error",
          icon: "notification",
          title: "Error Encountered",
          content: "Quantity cannot be less than 0",
        })
      );
      return
    }
    if (minQuantity == "") {
      reduxDispatch(
        displayMessage({
          color: "error",
          icon: "notification",
          title: "Error Encountered",
          content: "Minimum quantity cannot be null",
        })
      );
      return
    }
    if (minQuantity < 0) {
      reduxDispatch(
        displayMessage({
          color: "error",
          icon: "notification",
          title: "Error Encountered",
          content: "Minimum quantity cannot be less than 0",
        })
      );
      return
    }
    try {
      await addInventoryToFacility(selectedInventoryItem.inventoryItemId, quantity, minQuantity, selectedFacilityId)
        .then(() => {

          setIsAddInventoryDialogOpen(false);
          setSelectedInventoryItem("");
          setQuantity(0);
          setMinQuantity(0);
        })

    } catch (error) {
      // Handle any error that occurs during the addition process
      console.error("Error adding inventory item:", error);
    };
  };


  // Function to fetch inventory items from the API
  const fetchInventoryItems = async () => {
    try {
      const response = await facilityApi.getAllConsumableInventory()
      const items = response.data;
      console.log("fetched items:" + items);
      setInventoryItems(items);

    } catch (error) {
      console.error("Error fetching data:", error);
    };
  };

  const fetchInventoryItemsOfFacility = async (selectedFacilityId) => {
    try {
      console.log("fetching now");
      console.log(selectedFacilityId);
      const response = await allocatedInventoryApi.findAllAllocatedInventoryOfFacility(selectedFacilityId);
      const items = response.data;
      console.log("fetched items:" + items);
      setSelectedFacilityInventory(items);

    } catch (error) {
      console.error("Error fetching data:", error);
    };
  };


  const [data, setData] = useState({
    columns: [
      { Header: "Facility ID", accessor: "facilityId", width: "10%" },
      { Header: "Name", accessor: "name", width: "20%" },
      { Header: "Location", accessor: "location", width: "20%" },
      { Header: "Description", accessor: "description", width: "20%" },
      { Header: "Capacity", accessor: "capacity", width: "10%" },
      { Header: "Status", accessor: "status", width: "10%" },
      { Header: "Type", accessor: "type", width: "10%" },
      {
        Header: "Actions",
        Cell: ({ row }) => (
          <MDBox>
            <IconButton
              color="secondary"
              onClick={() => handleDeleteFacility(row.original.facilityId)}
            >
              <Icon>delete</Icon>
            </IconButton>
            <IconButton
              color="secondary"
              onClick={() => handleOpenUpdateModal(row.original.facilityId)}
            >
              <Icon>create</Icon>
            </IconButton>
          </MDBox>
        ),
        width: "10%",
      },
      {
        Header: 'Inventory',
        width: '10%',
        accessor: "inventory",
        Cell: ({ row }) => (
          <Button onClick={() => handleOpenInventoryDialog(row.original.inventory, row.original.facilityId)}>
            View Inventory
          </Button>
        ),
      },
    ],
    rows: [],
  });
  const [departments, setDepartments] = useState([]);
  const [facilityTypes, setFacilityTypes] = useState([]);

  const dataRef = useRef({
    columns: [
      { Header: "Facility ID", accessor: "facilityId", width: "10%" },
      { Header: "Name", accessor: "name", width: "20%" },
      { Header: "Location", accessor: "location", width: "20%" },
      { Header: "Description", accessor: "description", width: "20%" },
      { Header: "Capacity", accessor: "capacity", width: "10%" },
      { Header: "Status", accessor: "status", width: "10%" },
      { Header: "Type", accessor: "type", width: "10%" },
      {
        Header: "Actions",
        Cell: ({ row }) => (
          <MDBox>
            <IconButton
              color="secondary"
              onClick={() => handleDeleteFacility(row.original.facilityId)}
            >
              <Icon>delete</Icon>
            </IconButton>
            <IconButton
              color="secondary"
              onClick={() => handleOpenUpdateModal(row.original.facilityId)}
            >
              <Icon>create</Icon>
            </IconButton>
          </MDBox>
        ),
        width: "10%",
      },
      {
        Header: 'Inventory',
        width: '10%',
        accessor: "inventory",
        Cell: ({ row }) => (
          <Button onClick={() => handleOpenInventoryDialog(row.original.inventory, row.original.facilityId)}>
            View Inventory
          </Button>
        ),
      },
    ],
    rows: [],
  });


  const handleDeleteInventory = (inventoryItemId) => {
    setIsConfirmationDialogOpen(true);
    setInventoryItemToDelete(inventoryItemId);
  };

  const confirmDeletion = () => {
    const inventoryItemIdToDelete = inventoryItemToDelete;
    allocatedInventoryApi
      .deleteAllocatedInventory(inventoryItemIdToDelete)
      .then((response => {
        const updatedInventory = selectedFacilityInventory.filter(
          (item) => item.allocatedInventoryId !== inventoryItemIdToDelete
        );
        fetchData();
        setSelectedFacilityInventory(updatedInventory);
        fetchInventoryItems();

        reduxDispatch(
          displayMessage({
            color: "success",
            icon: "notification",
            title: "Successfully Deleted Allocated Inventory!",
            content: "Allocated Inventory with Id: " + inventoryItemIdToDelete + " deleted",
          })
        );
      })).catch((err) => {
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
    setIsConfirmationDialogOpen(false);
  };

  const inventoryColumns = [
    // { Header: "Item ID", accessor: "allocatedInventoryId" },
    { Header: "Name", accessor: "consumableEquipment.inventoryItemName" },
    { Header: "Description", accessor: "consumableEquipment.inventoryItemDescription" },
    { Header: "Minimum Quantity", accessor: "minimumQuantityBeforeRestock" },
    { Header: "Current Quantity", accessor: "allocatedInventoryCurrentQuantity" },
    {
      Header: 'Restock Status',
      accessor: "restockStatus",
      Cell: ({ row }) => {
        const isNeedRestock = row.original.allocatedInventoryCurrentQuantity < row.original.minimumQuantityBeforeRestock;
        const symbolColor = isNeedRestock ? 'red' : 'green';

        return (
          <div>
            <div
              style={{
                backgroundColor: symbolColor,
                width: '20px',
                height: '20px',
                display: 'inline-block',
                marginRight: '5px',
                borderRadius: '50%',
              }}
            ></div>
            {isNeedRestock ? 'Restock Needed' : 'No Restock Needed'}
          </div>
        )
      }
    },

  ];
  if (isAdmin || isNurse) {
    inventoryColumns.push({
      Header: "Actions",
      accessor: "inventoryItemId",
      Cell: ({ row }) => {
        const isAllowedToUpdate = isAdmin || isNurse;
        const isAllowedToDelete = isAdmin || isNurse;

        return (
          <div>
            {isAllowedToUpdate && (
              <IconButton
                variant="contained"
                color="secondary"
                onClick={() => handleUpdateInventory(row.original)}
              >
                <Icon>create</Icon>
              </IconButton>
            )}
            {isAllowedToDelete && (
              <IconButton
                variant="contained"
                color="secondary"
                onClick={() => handleDeleteInventory(row.original.allocatedInventoryId)}
              >
                <Icon>delete</Icon>
              </IconButton>
            )}
            <ConfirmationDialogComponent
              open={isConfirmationDialogOpen}
              onClose={() => setIsConfirmationDialogOpen(false)}
              onConfirm={confirmDeletion}
            />
          </div>
        );
      },
    });
  }


  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    departmentId: null,
    name: "",
    location: "",
    description: "",
    capacity: "",
    facilityStatusEnum: "",
    facilityTypeEnum: "",
  });
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [updateFormData, setUpdateFormData] = useState({
    facilityId: null,
    name: "",
    location: "",
    description: "",
    capacity: "",
    facilityStatusEnum: "",
    facilityTypeEnum: "",
  });

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const getDepartments = async () => {
    try {
      const response = await departmentApi.getAllDepartments("");
      console.log(response)
      setDepartments(response.data);
    } catch (error) {
      console.log(error);
    }
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCreateFacility = () => {
    try {
      const { departmentId, ...requestBody } = formData;
      console.log(departmentId);
      console.log(requestBody);
      if (departmentId == null) {
        setFormData({
          departmentId: null,
          name: "",
          location: "",
          description: "",
          capacity: "",
          facilityStatusEnum: "",
          facilityTypeEnum: "",
        });
        reduxDispatch(
          displayMessage({
            color: "error",
            icon: "notification",
            title: "Error Encountered",
            content: "Department cannot be null",
          })
        );
        return
      }
      console.log(requestBody.facilityStatusEnum)
      if (requestBody.facilityStatusEnum == "") {
        setFormData({
          departmentId: null,
          name: "",
          location: "",
          description: "",
          capacity: "",
          facilityStatusEnum: "",
          facilityTypeEnum: "",
        });
        reduxDispatch(
          displayMessage({
            color: "error",
            icon: "notification",
            title: "Error Encountered",
            content: "Facility status cannot be null",
          })
        );
        return
      }
      if (requestBody.facilityTypeEnum == "") {
        setFormData({
          departmentId: null,
          name: "",
          location: "",
          description: "",
          capacity: "",
          facilityStatusEnum: "",
          facilityTypeEnum: "",
        });
        reduxDispatch(
          displayMessage({
            color: "error",
            icon: "notification",
            title: "Error Encountered",
            content: "Facility type cannot be null",
          })
        );
        return
      }
      facilityApi
        .createFacility(departmentId, requestBody)
        .then(() => {
          fetchData();
          setFormData({
            departmentId: null,
            name: "",
            location: "",
            description: "",
            capacity: "",
            facilityStatusEnum: "",
            facilityTypeEnum: "",
          });
          reduxDispatch(
            displayMessage({
              color: "success",
              icon: "notification",
              title: "Successfully Created Facility!",
              content: requestBody.name + " created",
            })
          );
          handleCloseModal();
        })
        .catch((err) => {
          setFormData({
            departmentId: null,
            name: "",
            location: "",
            description: "",
            capacity: "",
            facilityStatusEnum: "",
            facilityTypeEnum: "",
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

  const handleOpenUpdateModal = (facilityId) => {
    // Populate update form data with the facility's current data
    console.log("Inventory " + dataRef.current.rows[0]);

    const facilityToUpdate = dataRef.current.rows[0].find(
      (facility) => facility.facilityId === facilityId
    );

    console.log("Facility: " + facilityToUpdate.name);

    if (facilityToUpdate) {
      setUpdateFormData({
        facilityId: facilityId,
        name: facilityToUpdate.name,
        location: facilityToUpdate.location,
        description: facilityToUpdate.description,
        capacity: facilityToUpdate.capacity,
        facilityStatusEnum: facilityToUpdate.status,
        facilityTypeEnum: facilityToUpdate.type,
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

  const handleUpdateFacility = () => {
    try {
      const { facilityId, ...requestBody } = updateFormData;
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
      console.log(requestBody.location)
      if (requestBody.location == "") {
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
      if (requestBody.capacity < 0) {
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
      facilityApi
        .updateFacility(facilityId, requestBody)
        .then(() => {
          fetchData();
          setUpdateFormData({
            facilityId: null,
            name: "",
            location: "",
            description: "",
            capacity: "",
            facilityStatusEnum: "",
            facilityTypeEnum: "",
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

  const handleDeleteFacility = (facilityId) => {
    try {
      facilityApi
        .deleteFacility(facilityId)
        .then(() => {
          fetchData();
          reduxDispatch(
            displayMessage({
              color: "success",
              icon: "notification",
              title: "Successfully Deleted Facility!",
              content: "Facility with facility Id: " + facilityId + " deleted",
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
    if (isAdmin) {
      facilityApi
        .getAllFacilitiesByName("")
        .then((response) => {
          const facilities = response.data; // Assuming 'facilities' is an array of facility objects

          // Map the fetched data to match your table structure
          const mappedRows = facilities.map((facility) => ({
            facilityId: facility.facilityId,
            name: facility.name,
            location: facility.location,
            description: facility.description,
            capacity: facility.capacity,
            status: facility.facilityStatusEnum,
            type: facility.facilityTypeEnum,
            inventory: facility.listOfAllocatedInventories
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
    } else {
      facilityApi
        .getAllFacilitiesByDepartmentName(staff.unit.name)
        .then((response) => {
          console.log("staff: " + staff.unit.name);
          const facilities = response.data; // Assuming 'facilities' is an array of facility objects

          // Map the fetched data to match your table structure
          const mappedRows = facilities.map((facility) => ({
            facilityId: facility.facilityId,
            name: facility.name,
            location: facility.location,
            description: facility.description,
            capacity: facility.capacity,
            status: facility.facilityStatusEnum,
            type: facility.facilityTypeEnum,
            inventory: facility.listOfAllocatedInventories
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
    }
  };


  useEffect(() => {
    fetchData();
    getDepartments();
    fetchInventoryItems();
    // fetchInventoryItemsOfFacility();
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
                  Facilities Table
                </MDTypography>
              </MDBox>
              <MDBox mx={2} mt={3} px={2}>
                <MDButton
                  Button
                  variant="contained"
                  color="primary"
                  onClick={() => setIsModalOpen(true)}
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

      <Dialog open={isModalOpen} onClose={handleCloseModal}>
        <DialogTitle>Create New Facility</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            margin="dense"
          />
          <TextField
            fullWidth
            label="Location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            margin="dense"
          />
          <TextField
            fullWidth
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            margin="dense"
          />
          <TextField
            fullWidth
            label="Capacity"
            name="capacity"
            type="number"
            value={formData.capacity}
            onChange={handleChange}
            margin="dense"
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Unit</InputLabel>
            <Select
              name="departmentId"
              value={formData.departmentId}
              onChange={handleChange}
              sx={{ lineHeight: "3em" }}
            >
              {departments?.map(department =>
                <MenuItem value={department.unitId}>{department.name}</MenuItem>
              )}
              {/* <MenuItem value={1}>Interventional Cardiology</MenuItem>
              <MenuItem value={2}>Electrophysiology (EP) Lab</MenuItem>
              <MenuItem value={3}>Cardiac Catheterization Lab</MenuItem>
              <MenuItem value={4}>Heart Failure Clinic</MenuItem>
              <MenuItem value={5}>Cardiac Rehabilitation</MenuItem>
              <MenuItem value={6}>Echocardiography Unit</MenuItem>
              <MenuItem value={7}>Nuclear Cardiology Unit</MenuItem>
              <MenuItem value={8}>Cardiac Imaging Center</MenuItem>
              <MenuItem value={9}>Cardiac Telemetry Unit</MenuItem>
              <MenuItem value={10}>
                Adult Congenital Heart Disease Clinic
              </MenuItem>
              <MenuItem value={11}>Preventive Cardiology Clinic</MenuItem> */}
              {/* Add more status options as needed */}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel>Status</InputLabel>
            <Select
              name="facilityStatusEnum"
              value={formData.facilityStatusEnum}
              onChange={handleChange}
              sx={{ lineHeight: "3em" }}
            >
              <MenuItem value="BOOKABLE">Bookable</MenuItem>
              <MenuItem value="NON_BOOKABLE">Non Bookable</MenuItem>
              {/* Add more status options as needed */}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel>Type</InputLabel>
            <Select
              name="facilityTypeEnum"
              value={formData.facilityTypeEnum}
              onChange={handleChange}
              sx={{ lineHeight: "3em" }}
            >
              {facilityTypes?.map(facilityTypes =>
                <MenuItem value={facilityTypes}>{facilityTypes}</MenuItem>
              )}
              <MenuItem value="CONSULTATION_ROOM">Consultation Room</MenuItem>
              <MenuItem value="TRIAGE_ROOM">Triage Room</MenuItem>
              <MenuItem value="OPERATING_ROOM">Operating Room</MenuItem>
              <MenuItem value="PHARMACY">Pharmacy</MenuItem>
              {/* Add more type options as needed */}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <MDButton onClick={handleCloseModal} color="primary">
            Cancel
          </MDButton>
          <MDButton onClick={handleCreateFacility} color="primary">
            Create
          </MDButton>
        </DialogActions>
      </Dialog>

      <Dialog open={isUpdateModalOpen} onClose={handleCloseUpdateModal}>
        <DialogTitle>Update Facility</DialogTitle>
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
            label="Location"
            name="location"
            value={updateFormData.location}
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
            label="Capacity"
            name="capacity"
            type="number"
            value={updateFormData.capacity}
            onChange={handleUpdateChange}
            margin="dense"
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Status</InputLabel>
            <Select
              name="facilityStatusEnum"
              value={updateFormData.facilityStatusEnum}
              onChange={handleUpdateChange}
              sx={{ lineHeight: "3em" }}
            >
              <MenuItem value="BOOKABLE">Bookable</MenuItem>
              <MenuItem value="NON_BOOKABLE">Non Bookable</MenuItem>
              {/* Refactor to pull from database */}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel>Type</InputLabel>
            <Select
              name="facilityTypeEnum"
              value={updateFormData.facilityTypeEnum}
              onChange={handleUpdateChange}
              sx={{ lineHeight: "3em" }}
            >
              <MenuItem value="CONSULTATION_ROOM">Consultation Room</MenuItem>
              <MenuItem value="TRIAGE_ROOM">Triage Room</MenuItem>
              <MenuItem value="OPERATING_ROOM">Operating Room</MenuItem>
              <MenuItem value="PHARMACY">Pharmacy</MenuItem>
              {/* Add more type options as needed */}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <MDButton onClick={handleCloseUpdateModal} color="primary">
            Cancel
          </MDButton>
          <MDButton onClick={handleUpdateFacility} color="primary">
            Update
          </MDButton>
        </DialogActions>
      </Dialog>
      <Dialog
        open={isInventoryDialogOpen}
        onClose={handleCloseInventoryDialog}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>Facility Inventory</DialogTitle>
        <DialogContent>
          {selectedFacilityInventory && selectedFacilityInventory.length > 0 ? (
            <DataTable table={{ columns: inventoryColumns, rows: selectedFacilityInventory }} />
          ) : (
            <MDTypography variant="body2" color="textSecondary">
              No inventory items found for this facility.
            </MDTypography>
          )}
          {isAdmin || isNurse ? (
            <Button
              variant="contained"
              color="primary"
              onClick={() => setIsAddInventoryDialogOpen(true)}
              style={{ color: 'white' }}
            >
              Add Inventory to Facility
            </Button>
          ) : null}
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseInventoryDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={isAddInventoryDialogOpen}
        onClose={() => setIsAddInventoryDialogOpen(false)}
      >
        <DialogTitle>Add Inventory to Facility</DialogTitle>
        <DialogContent>
          <FormControl fullWidth
            margin="dense"
          >
            <InputLabel>Select Inventory Item</InputLabel>
            <Select
              value={selectedInventoryItem}
              onChange={(e) => {
                setSelectedInventoryItem(e.target.value);
                console.log(selectedInventoryItem);
              }}
              required
              sx={{ lineHeight: "2.5em", mt: 1 }}
              margin="dense"
              fullWidth
            >
              {inventoryItems.map((item) => (
                <MenuItem key={item.id} value={item}>
                  {item.inventoryItemName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <br />
          <MDTypography variant="h6" gutterBottom>
            Quantity in Stock: {selectedInventoryItem.quantityInStock}
          </MDTypography>
          <TextField
            fullWidth
            label="Quantity"
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            margin="dense"
          />
          <br />
          <TextField
            fullWidth
            label="Minimum Quantity"
            type="number"
            value={minQuantity}
            onChange={(e) => setMinQuantity(e.target.value)}
            margin="dense"
          />
          {/* Display the cost of restock based on selectedInventoryItem and quantity */}
          {/* You can calculate and display the cost here */}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsAddInventoryDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleAddInventory} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={isUpdateInventoryDialogOpen}
        onClose={() => setIsUpdateInventoryDialogOpen(false)}
      >
        <DialogTitle>Update Inventory Quantity</DialogTitle>
        <DialogContent>
          {selectedInventoryItemForUpdate && (
            <div>
              <Typography variant="body2">
                Inventory Item: {selectedInventoryItemForUpdate.consumableEquipment.inventoryItemName}
              </Typography>
              <TextField
                fullWidth
                label="New Quantity"
                type="number"
                value={newQuantity}
                onChange={(e) => setNewQuantity(e.target.value)}
                margin="dense"
              />

              <TextField
                fullWidth
                label="Minimum Quantity"
                type="number"
                value={minQuantity}
                onChange={(e) => setMinQuantity(e.target.value)}
                margin="dense"
              />
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsUpdateInventoryDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleUpdateQuantity} color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>


    </DashboardLayout>
  );
}

export default FacilityManagement;
