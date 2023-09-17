import React, { useEffect, useState} from 'react';
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import InputLabel from '@mui/material/InputLabel';
import Modal from "@mui/material/Modal";
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import moment from 'moment';
import { MenuItem } from '@mui/material';
import { getShiftName, getShiftId, getShiftTime, options, facilities } from '../utils/utils';

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

function ViewShift({open, handleClose, staff, shift, username, updateAddShift, setUpdateAddShift, facilityId}) {
    const [reqBody, setReqBody] = useState();
    const [selectedShift, setSelectedShift] = useState();
    const [selectedFacility, setSelectedFacility] = useState(facilityId ? facilityId : 1);
    const [errorMsg, setErrorMsg] = useState();
    const [shiftPref, setShiftPref] = useState(0);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const newReqBody = {
            startTime: "",
            endTime: "",
            comments: ""
        }
        const date = moment(shift.startTime, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD');
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
        newReqBody.comments = reqBody.comments;
        try {
            const response = await axios.put(`http://localhost:8080/shift/updateShift/${shift.shiftId}/${selectedFacility}`, newReqBody, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                }
            });
            setUpdateAddShift(updateAddShift+1);
            handleClose();
            setErrorMsg(null);
        } catch (error) {
            console.log(error)
            setErrorMsg(error.response.data);
        }
    }

    const handleCancel = async () => {
        try {
            const response = await axios.delete(`http://localhost:8080/shift/deleteShift/${shift.shiftId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                }
            });
            setUpdateAddShift(updateAddShift+1);
            handleClose();
        } catch (error) {
            console.log(error)
        }
    }

    const getShiftPreference = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/shiftPreference/getShiftPreference/${username}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                }
            });
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
        setReqBody(shift);
        setSelectedFacility(facilityId);
        setSelectedShift(getShiftId(moment(shift?.startTime, 'YYYY-MM-DD HH:mm:ss').format('HH:mm'), moment(shift?.endTime, 'YYYY-MM-DD HH:mm:ss').format('HH:mm')));
        getShiftPreference();
    }, [shift, facilityId])

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
                    {username ? 
                    <Grid md={12}>
                        <Typography variant="h5">Update Shift</Typography>
                        <Typography variant="h6">Staff: {staff.firstname + " " + staff.lastname}</Typography>
                        <Typography variant="h6">Date: {moment(shift?.startTime, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD')}</Typography><br/>
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
                        </Select>
                        <Typography variant="body2">
                            <i>{staff.firstname + " " + staff.lastname}'s shift preference: {shiftPref === 0 ? "No preference" 
                                : getShiftName(moment(getShiftTime(shiftPref)[0], 'HH:mm:ss').format('HH:mm'), moment(getShiftTime(shiftPref)[1], 'HH:mm:ss').format('HH:mm'))}
                            </i>
                        </Typography><br/>
                        <TextField
                            InputLabelProps={{ shrink: true }} 
                            fullWidth
                            label="Comments"
                            name="comments"
                            onChange={handleChange}
                            value={reqBody?.comments}
                        /><br/><br/>
                        <InputLabel id="facility-select-label">Facility:</InputLabel>
                        <Select
                            labelId="facility-select-label"
                            id="facility-select"
                            value={selectedFacility}
                            onChange={handleFacilityDropdownChange}
                        >
                            {facilities.map((option) => (
                                <MenuItem key={option.id} value={option.id}>
                                    {option.name}
                                </MenuItem>
                            ))}
                        </Select><br/><br/>
                        {errorMsg ? <Typography variant="h6" style={{ color: "red" }}>{errorMsg}</Typography> : <></>}
                        <Button 
                            variant="contained" 
                            onClick={handleSubmit}
                            style={{color: 'white'}}>
                            Update
                        </Button>&nbsp;&nbsp;
                        <Button 
                            variant="contained" 
                            onClick={handleCancel}
                            style={{backgroundColor: 'red', color: 'white'}}>
                            Delete
                        </Button>
                    </Grid> :
                    <Grid md={12}>
                        <Typography variant="h6">Start: {shift?.startTime}</Typography>
                        <Typography variant="h6">End: {shift?.endTime}</Typography>
                        <Typography variant="h6">Facility: {shift?.facilityBooking.facility.name}</Typography>
                        <Typography variant="h6">Comments: {shift?.comments ? shift?.comments : "NA"}</Typography><br/>
                        <Button 
                            variant="contained" 
                            onClick={handleExit}
                            style={{color: 'white'}}>
                            Close
                        </Button>
                    </Grid>}
                </Grid>
            </Box>
        </Modal>
    )
}

export default ViewShift;