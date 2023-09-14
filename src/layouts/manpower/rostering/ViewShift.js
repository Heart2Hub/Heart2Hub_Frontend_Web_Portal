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

function ViewShift({open, handleClose, shift}) {

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
                <Grid container spacing={3}>
                    <Grid md={12}>
                        <Typography variant="h6">Start: {shift?.startTime}</Typography>
                        <Typography variant="h6">End: {shift?.endTime}</Typography>
                        <Typography variant="h6">Comments: {shift?.comments}</Typography>
                
                        <Button 
                            variant="contained" 
                            onClick={handleExit}
                            style={{color: 'white'}}>
                            Close
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </Modal>
    )
}

export default ViewShift;