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
import { getShiftId } from '../utils/utils';

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

const options = [
    {
        id: 1,
        shift: "Shift 1 (12am - 8am)"
    },
    {
        id: 2,
        shift: "Shift 2 (8am - 4pm)"
    },
    {
        id: 3,
        shift: "Shift 3 (4pm - 12am)"
    },
    {
        id: 4,
        shift: "24 Hour Shift (12am - 11.59pm)"
    },
]

const body = {
    startTime: "",
    endTime: "",
    minPax: 0,
    roleEnum: "DOCTOR"
}

function AddShiftConstraint({open, handleClose}) {
    const [reqBody, setReqBody] = useState(body);
    const [selectedShift, setSelectedShift] = useState(1);
    const [errorMsg, setErrorMsg] = useState();

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
            const response = await axios.post(`http://localhost:8080/shiftConstraints/createShiftConstraints`, newReqBody, {
                headers: {
                    'Authorization': `Bearer ${'eyJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6WyJET0NUT1IiXSwic3ViIjoic3RhZmYyIiwiaWF0IjoxNjk0NzA3Mjg5LCJleHAiOjE2OTUzMTIwODl9.QXMJSDpR68FLpjwlm49aU9CZlHemJhpBqsllDIt0Kuo'}`
                }
            });
            handleClose();
            setErrorMsg(null);
        } catch (error) {
            console.log(error)
            setErrorMsg(error.response.data);
        }
    }

    const handleDropdownChange = (event) => {
        setSelectedShift(event.target.value);
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

    return (
        <Modal
            open={open}
            onClose={handleExit}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <Grid container spacing={3}>
                    {/* if is rosterer */}
                    <Grid md={12}>
                        <Typography variant="h5">Add Shift Constraint</Typography>
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
                        <Typography variant="h6">Role: {reqBody.roleEnum}</Typography><br/><br/>
                        {errorMsg ? <Typography variant="h6" style={{ color: "red" }}>{errorMsg}</Typography> : <></>}
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