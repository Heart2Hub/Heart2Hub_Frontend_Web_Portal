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
import React, { useState, useEffect } from "react";

import { facilityApi } from "api/Api";

function FacilityManagement() {
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    subDepartmentId: 0,
    name: "",
    location: "",
    description: "",
    capacity: "",
    facilityStatusEnum: "AVAILABLE",
    facilityTypeEnum: "WARD_BED",
  });
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [updateFormData, setUpdateFormData] = useState({
    facilityId: 0,
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
      facilityApi.createFacility(subDepartmentId, requestBody).then(() => {
        fetchData();
        handleCloseModal();
      });
    } catch (ex) {
      console.log(ex);
    }
  };

  const handleOpenUpdateModal = (facilityId) => {
    // Populate update form data with the facility's current data
    
    // console.log(data);

    // const facilityToUpdate = data.rows.find(
    //   (facility) => facility.facilityId === facilityId
    // );

    setUpdateFormData({
      facilityId: facilityId,
      // name: facilityToUpdate.name,
      // location: facilityToUpdate.location,
      // description: facilityToUpdate.description,
      // capacity: facilityToUpdate.capacity,
      // facilityStatusEnum: facilityToUpdate.status,
      // facilityTypeEnum: facilityToUpdate.type,
    });

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
      console.log(facilityId);
      console.log(updateFormData);
      facilityApi.updateFacility(facilityId,requestBody).then(() => {
        fetchData();
        handleCloseUpdateModal();
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
        })
        .catch((ex) => {
          console.error(ex);
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
            >
              <MenuItem value={1}>Cardiology</MenuItem>
              {/* Add more status options as needed */}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel>Status</InputLabel>
            <Select
              name="facilityStatusEnum"
              value={formData.facilityStatusEnum}
              onChange={handleChange}
            >
              <MenuItem value="AVAILABLE">Available</MenuItem>
              <MenuItem value="UNAVAILABLE">Unavailable</MenuItem>
              {/* Add more status options as needed */}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel>Type</InputLabel>
            <Select
              name="facilityTypeEnum"
              value={formData.facilityTypeEnum}
              onChange={handleChange}
            >
              <MenuItem value="WARD_BED">Ward Bed</MenuItem>
              <MenuItem value="CONSULTATION_ROOM">Consultation Room</MenuItem>
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
            <InputLabel>Sub Department</InputLabel>
            <Select
              name="subDepartmentId"
              value={updateFormData.subDepartmentId}
              onChange={handleUpdateChange}
            >
              <MenuItem value={1}>Cardiology</MenuItem>
              {/* Add more status options as needed */}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel>Status</InputLabel>
            <Select
              name="facilityStatusEnum"
              value={updateFormData.facilityStatusEnum}
              onChange={handleUpdateChange}
            >
              <MenuItem value="AVAILABLE">Available</MenuItem>
              <MenuItem value="UNAVAILABLE">Unavailable</MenuItem>
              {/* Add more status options as needed */}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel>Type</InputLabel>
            <Select
              name="facilityTypeEnum"
              value={updateFormData.facilityTypeEnum}
              onChange={handleUpdateChange}
            >
              <MenuItem value="WARD_BED">Ward Bed</MenuItem>
              <MenuItem value="CONSULTATION_ROOM">Consultation Room</MenuItem>
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
