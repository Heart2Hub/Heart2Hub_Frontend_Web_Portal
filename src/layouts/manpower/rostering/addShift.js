import React, { useEffect, useState} from 'react';
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Modal from "@mui/material/Modal";
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import moment from 'moment';

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
};

const body = {
    startTime: "",
    endTime: "",
    comments: ""
}

function AddShift({ username, open, handleClose, date }) {
    const [reqBody, setReqBody] = useState(body);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const newReqBody = reqBody;
        newReqBody.startTime = moment(date + ' ' + reqBody.startTime, 'YYYY-MM-DD HH:mm').format('YYYY-MM-DD HH:mm:ss');
        newReqBody.endTime = moment(date + ' ' + reqBody.endTime, 'YYYY-MM-DD HH:mm').format('YYYY-MM-DD HH:mm:ss');
        console.log(newReqBody)
        try {
            const response = await axios.post(`http://localhost:8080/shift/createShift/${username}`, newReqBody, {
                headers: {
                    'Authorization': `Bearer ${'eyJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6WyJET0NUT1IiXSwic3ViIjoic3RhZmYyIiwiaWF0IjoxNjk0MTAyMzQ1LCJleHAiOjE2OTQ3MDcxNDV9.z1WgASSDpdrK9JLoGywGFZlisCLeb-MDugKpO0NYVnw'}`
                }
            });
            handleClose();
        } catch (error) {
            console.error(error);
        }
    }

    const handleChange = (event) => {
        setReqBody((prevState) => ({
            ...prevState,
            [event.target.name]: event.target.value,
        }))
    };

    const handleExit = () => {
        handleClose();
    }

    return (
        <Modal
            open={open}
            onClose={handleExit}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <form autoComplete="off" noValidate onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid md={12}>
                            <Typography variant="h6">Staff: {username}</Typography>
                            <Typography variant="h6">Date: {date}</Typography>
                            {console.log(date)}
                            {/* <Typography variant="h6">Role: </Typography> */}
                            {/* <Typography variant="h6">Department: </Typography> */}
                            <br/>
                            <TextField
                                InputLabelProps={{ shrink: true }} 
                                fullWidth
                                label="Start"
                                name="startTime"
                                type="time"
                                onChange={handleChange}
                                value={reqBody.startTime}
                            /><br/><br/>
                            <TextField
                                InputLabelProps={{ shrink: true }} 
                                fullWidth
                                label="End"
                                name="endTime"
                                type="time"
                                onChange={handleChange}
                                value={reqBody.endTime}
                            /><br/><br/>
                            
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