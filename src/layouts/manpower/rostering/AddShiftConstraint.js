import React, { useEffect, useState} from 'react';
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import InputLabel from '@mui/material/InputLabel';
import Modal from "@mui/material/Modal";
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { options } from '../utils/utils';
import { shiftConstraintsApi } from 'api/Api';
import { displayMessage } from "store/slices/snackbarSlice";
import { useDispatch } from "react-redux";

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 1,
    borderRadius: 2,
    p: 5,
};

function AddShiftConstraint({open, handleClose, role, facilities, unit}) {
    const body = {
        startTime: "",
        endTime: "",
        minPax: 1,
        staffRoleEnum: ""
    }

    const [reqBody, setReqBody] = useState(body);
    const [selectedShift, setSelectedShift] = useState(1);
    const [selectedFacility, setSelectedFacility] = useState();
    const [errorMsg, setErrorMsg] = useState();
    const reduxDispatch = useDispatch();

    const handleSubmit = async (event) => {
        event.preventDefault();
        const newReqBody = reqBody;
        let start;
        let end;
        if (selectedShift === 1) {
            start = "00:00:00";
            end = "08:00:00";
        } else if (selectedShift === 2) {
            start = "08:00:00";
            end = "16:00:00";
        } else if (selectedShift === 3) {
            start = "16:00:00";
            end = "23:59:00";
        } else {
            start = "00:00:00";
            end = "23:59:00";
        }
        newReqBody.startTime = start;
        newReqBody.endTime = end;
        try {
            if (role === "NURSE") {
                const response = await shiftConstraintsApi.createShiftConstraints(newReqBody, unit);
            } else {
                const response = await shiftConstraintsApi.createShiftConstraints(newReqBody, selectedFacility);
            }
            handleClose();
            setErrorMsg(null);
            reduxDispatch(
                displayMessage({
                  color: "success",
                  icon: "notification",
                  title: "Shift constraints successfully created!",
                  content: "Shift constraints from " + start + " to " + end + " for " + newReqBody.minPax + " PAX created!",
                })
              );
        } catch (error) {
            console.log(error)
            reduxDispatch(
                displayMessage({
                  color: "warning",
                  icon: "notification",
                  title: "Error creating shift constraints!",
                  content: error.response.data
                })
              );
            setErrorMsg(error.response.data);
        }
    }

    const handleDropdownChange = (event) => {
        setSelectedShift(event.target.value);
    }

    const handleFacilityDropdownChange = (event) => {
        setSelectedFacility(event.target.value);
    }

    const handleChange = (event) => {
        setReqBody((prevState) => ({
            ...prevState,
            [event.target.name]: event.target.value,
        }))
    };

    const handleExit = () => {
        handleClose();
        let temp = body;
        temp.staffRoleEnum = role;
        setReqBody(temp);
        setErrorMsg(null);
    }

    useEffect(() => {
        let temp = body;
        temp.staffRoleEnum = role;
        setReqBody(temp);
        setSelectedFacility(facilities[0]?.name)
    }, [role, facilities])

    return (
        <Modal
            open={open}
            onClose={handleExit}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            slotProps={{
                backdrop: {
                  sx: {
                    backgroundColor: 'rgba(0, 0, 0, 0.4)',
                  },
                },
              }}
        >
            <Box sx={style}>
                <Grid container spacing={3}>
                    {/* if is rosterer */}
                    <Grid md={12}>
                        <Typography variant="h5">Add Shift Constraint</Typography><br/>
                        <InputLabel id="shift-select-label">Shift:</InputLabel>
                        <Select
                            labelId="shift-select-label"
                            id="shift-select"
                            value={selectedShift}
                            onChange={handleDropdownChange}
                        >
                            {options.map((option) => (
                                <MenuItem key={option.id} value={option.id}>
                                    {option.shift}
                                </MenuItem>
                            ))}
                        </Select><br/><br/>
                        <TextField
                            InputLabelProps={{ shrink: true }} 
                            fullWidth
                            label="Min. Pax Working"
                            name="minPax"
                            type="number"
                            onChange={handleChange}
                            value={reqBody.minPax}
                        /><br/><br/>
                        {role === "NURSE" ? 
                        <>
                            <Typography variant="h6">Ward: {unit}</Typography>
                        </> :
                        <>
                            <InputLabel id="shift-select-label">Facility:</InputLabel>
                            <Select
                                labelId="facility-select-label"
                                id="facility-select"
                                value={selectedFacility}
                                onChange={handleFacilityDropdownChange}
                            >
                                {facilities.map((facility) => (
                                    <MenuItem key={facility.facilityId} value={facility.name}>
                                        {facility?.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </>}
                        <Typography variant="h6">Role: {reqBody.staffRoleEnum}</Typography><br/>
                        {/* {errorMsg ? <Typography variant="h6" style={{ color: "red" }}>{errorMsg}</Typography> : <></>} */}
                        <Button 
                            variant="contained" 
                            onClick={handleSubmit}
                            style={{color: 'white'}}>
                            Create
                        </Button>&nbsp;&nbsp;
                    </Grid>
                </Grid>
            </Box>
        </Modal>
    )
}

export default AddShiftConstraint;