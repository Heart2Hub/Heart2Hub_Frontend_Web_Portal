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

import { facilityApi } from "api/Api";
import { displayMessage } from "../../../store/slices/snackbarSlice";

function FacilityManagement() {
  const reduxDispatch = useDispatch();
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
    ],
    rows: [],
  });
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
    ],
    rows: [],
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    subDepartmentId: null,
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

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCreateFacility = () => {
    try {
      const { subDepartmentId, ...requestBody } = formData;
      if (subDepartmentId == null) {
        setFormData({
          subDepartmentId: null,
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
            content: "Sub department cannot be null",
          })
        );
      return
      }
      console.log(requestBody.facilityStatusEnum)
      if (requestBody.facilityStatusEnum == "") {
        setFormData({
          subDepartmentId: null,
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
          subDepartmentId: null,
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
        .createFacility(subDepartmentId, requestBody)
        .then(() => {
          fetchData();
          setFormData({
            subDepartmentId: null,
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
            subDepartmentId: null,
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

    const facilityToUpdate = dataRef.current.rows[0].find(
      (facility) => facility.facilityId === facilityId
    );

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
            <InputLabel>Sub Department</InputLabel>
            <Select
              name="subDepartmentId"
              value={formData.subDepartmentId}
              onChange={handleChange}
              sx={{ lineHeight: "3em" }}
            >
              <MenuItem value={1}>Interventional Cardiology</MenuItem>
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
              <MenuItem value={11}>Preventive Cardiology Clinic</MenuItem>
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
              <MenuItem value="AVAILABLE">Available</MenuItem>
              <MenuItem value="UNAVAILABLE">Unavailable</MenuItem>
              <MenuItem value="MAINTENANCE">Maintenance</MenuItem>
              <MenuItem value="CLOSED">Closed</MenuItem>
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
              <MenuItem value="WARD_BED">Ward Bed</MenuItem>
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
              <MenuItem value="AVAILABLE">Available</MenuItem>
              <MenuItem value="UNAVAILABLE">Unavailable</MenuItem>
              <MenuItem value="MAINTENANCE">Maintenance</MenuItem>
              <MenuItem value="CLOSED">Closed</MenuItem>
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
              <MenuItem value="WARD_BED">Ward Bed</MenuItem>
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
    </DashboardLayout>
  );
}

export default FacilityManagement;
