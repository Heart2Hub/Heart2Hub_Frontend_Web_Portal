import React, { useEffect, useState} from 'react';
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import InputLabel from '@mui/material/InputLabel';
import Modal from "@mui/material/Modal";
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import moment from 'moment';
import { MenuItem } from '@mui/material';
import { getShiftName, getShiftId, getShiftTime, options } from '../utils/utils';
import { shiftApi, shiftPreferenceApi, facilityApi } from 'api/Api';
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

const body = {
    startTime: "",
    endTime: "",
    comments: ""
}

function AddShift({ username, open, staff, handleClose, date, updateAddShift, setUpdateAddShift, facilities }) {
    const [reqBody, setReqBody] = useState(body);
    const [selectedShift, setSelectedShift] = useState(1);
    const [selectedFacility, setSelectedFacility] = useState(1);
    const [errorMsg, setErrorMsg] = useState();
    const [shiftPref, setShiftPref] = useState(0);
    const reduxDispatch = useDispatch();

    const handleSubmit = async (event) => {
        event.preventDefault();
        const newReqBody = reqBody;
        let start;
        let end;
        if (selectedShift === 1) {
            start = date + ' ' + "00:00";
            end = date + ' ' + "08:00";
        } else if (selectedShift === 2) {
            start = date + ' ' + "08:00";
            end = date + ' ' + "16:00";
        } else if (selectedShift === 3) {
            start = date + ' ' + "16:00";
            end = date + ' ' + "23:59";
        } else {
            start = date + ' ' + "00:00";
            end = date + ' ' + "23:59";
        }
        newReqBody.startTime = moment(start, 'YYYY-MM-DD HH:mm').format('YYYY-MM-DD HH:mm:ss');
        newReqBody.endTime = moment(end, 'YYYY-MM-DD HH:mm').format('YYYY-MM-DD HH:mm:ss');
        try {
            const response = await shiftApi.createShift(username, selectedFacility, newReqBody);
            setUpdateAddShift(updateAddShift+1);
            handleClose();
            setErrorMsg(null);
            reduxDispatch(
                displayMessage({
                  color: "success",
                  icon: "notification",
                  title: "Shift successfully created!",
                  content: "Shift has been created for " + staff.firstname + " " + staff.lastname + "!",
                })
              );
        } catch (error) {
            console.log(error);
            reduxDispatch(
                displayMessage({
                  color: "warning",
                  icon: "notification",
                  title: "Error creating shift!",
                  content: error.response.data,
                })
              );
            setErrorMsg(error.response.data);
        }
    }

    const getShiftPreference = async () => {
        try {
            const response = await shiftPreferenceApi.getShiftPreference(username);
            if (response.data) {
                setShiftPref(getShiftId(moment(response.data.startTime, 'HH:mm:ss').format('HH:mm'), moment(response.data.endTime, 'HH:mm:ss').format('HH:mm')))
            } else {
                setShiftPref(0);
            }
        } catch (error) {
            console.error(error);
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
        setErrorMsg(null);
    }

    useEffect(() => {
        getShiftPreference();
    }, [])

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
                <form autoComplete="off" noValidate onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid md={12}>
                            <Typography variant="h5">Add Shift</Typography>
                            <Typography variant="h6">Staff: {staff.firstname + " " + staff.lastname}</Typography>
                            <Typography variant="h6">Date: {date}</Typography>
                            <br/>
                            <InputLabel id="shift-select-label">Select shift:</InputLabel>
                            <Select
                                labelId="shift-select-label"
                                id="shift-select"
                                value={selectedShift}
                                onChange={handleDropdownChange}
                                sx={{ lineHeight: "2.5em"}}
                            >
                                {options.map((option) => (
                                    <MenuItem key={option.id} value={option.id}>
                                        {option.shift}
                                    </MenuItem>
                                ))}
                            </Select>
                            <Typography variant="body2">
                                <i>Shift preference: {shiftPref === 0 ? "No preference" 
                                    : getShiftName(moment(getShiftTime(shiftPref)[0], 'HH:mm:ss').format('HH:mm'), moment(getShiftTime(shiftPref)[1], 'HH:mm:ss').format('HH:mm'))}
                                </i>
                            </Typography><br/>
                            <TextField
                                InputLabelProps={{ shrink: true }} 
                                fullWidth
                                label="Comments"
                                name="comments"
                                onChange={handleChange}
                                value={reqBody.comments}
                            /><br/><br/>
                            <InputLabel id="facility-select-label">Select facility:</InputLabel>
                            <Select
                                labelId="facility-select-label"
                                id="facility-select"
                                value={selectedFacility}
                                onChange={handleFacilityDropdownChange}
                                sx={{ lineHeight: "2.5em"}}
                            >
                                {facilities?.map((option) => (
                                    <MenuItem key={option.facilityId} value={option.facilityId}>
                                        {option.name}
                                    </MenuItem>
                                ))}
                            </Select><br/><br/>
                            {/* {errorMsg ? <Typography variant="h6" style={{ color: "red" }}>{errorMsg}</Typography> : <></>} */}
                            <Button 
                                variant="contained" 
                                onClick={handleSubmit}
                                style={{color: 'white'}}>
                                Ok
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Box>
        </Modal>
    )
}

export default AddShift;