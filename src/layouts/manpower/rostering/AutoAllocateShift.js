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
import Checkbox from '@mui/material/Checkbox';
import { OutlinedInput } from '@mui/material';
import { options } from '../utils/utils';
import { shiftConstraintsApi } from 'api/Api';
import { displayMessage } from "store/slices/snackbarSlice";
import { useDispatch } from "react-redux";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import updateLocale from "dayjs/plugin/updateLocale";
import FormControl from "@mui/material/FormControl";
import CircularProgress from '@mui/material/CircularProgress';

import dayjs from "dayjs";
import { shiftApi } from 'api/Api';

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

function AutoAllocateShift({open, handleClose, role, unit, monthDates}) {

    const [selectedShift, setSelectedShift] = useState(1);
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();
    const [selectedFacility, setSelectedFacility] = useState();
    const [loading, setLoading] = useState(false);
    const [shifts, setShifts] = useState([]);
    const reduxDispatch = useDispatch();
    const [maxDate, setMaxDate] = useState(dayjs())
    dayjs.extend(updateLocale);

    dayjs.updateLocale("en", {
      weekStart: 1
    });

    const handleChange = (event) => {
        const {
          target: { value },
        } = event;
        setShifts(
          typeof value === 'string' ? value.split(',') : value,
        );
    };

    function disableAllExceptSunday(date) {
        return dayjs(date).day() !== 0;
    }

    function disableAllExceptMonday(date) {
        return dayjs(date).day() !== 1;
    }

    const handleExit = () => {
        setStartDate(null);
        setEndDate(null);
        setShifts([]);
        handleClose();
    }

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const formattedStart = dayjs(startDate, 'DD/MM/YYYY').format('YYYY-MM-DD');
            const formattedEnd = dayjs(endDate, 'DD/MM/YYYY').format('YYYY-MM-DD');
            let shift1 = 0;
            let shift2 = 0;
            let shift3 = 0;

            for (let i=0; i<shifts.length; i++) {
                if (shifts[i] === 1) {
                    shift1 = 1
                }
                if (shifts[i] === 2) {
                    shift2 = 1;
                }
                if (shifts[i] === 3) {
                    shift3 = 1;
                }
            }
            const response = await shiftApi.automaticallyAllocateShifts(formattedStart, formattedEnd, role, unit, shift1, shift2, shift3);
            reduxDispatch(
                displayMessage({
                  color: "success",
                  icon: "notification",
                  title: "Success",
                  content: "Shifts have been automatically allocated from " + startDate + " to " + endDate,
                })
            );
            handleExit();
        } catch (error) {
            reduxDispatch(
                displayMessage({
                  color: "warning",
                  icon: "notification",
                  title: "Error while automatically allocating shifts",
                  content: error.response.data,
                })
              );
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        setMaxDate(dayjs(monthDates[monthDates.length-1]?.date, 'YYYY-MM-DD').endOf('week'));
    },[monthDates])

    return (
        <Modal
            open={open}
            onClose={handleExit}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <Grid container spacing={3}>
                {loading ? <Box sx={{ display: 'flex', margin: 'auto' }}>
                        <CircularProgress />
                    </Box> :
                    <Grid md={12}>
                        <Typography variant="h5">Automatically Allocate Shifts</Typography>
                        <FormControl fullWidth margin="dense">
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DemoContainer components={["DatePicker"]}>
                                    <DatePicker
                                        label="Select Start Date"
                                        format="DD/MM/YYYY"
                                        value={startDate}
                                        minDate={dayjs()}
                                        maxDate={maxDate}
                                        shouldDisableDate={disableAllExceptMonday}
                                        onChange={(newValue) => {setStartDate(newValue); setEndDate(null)}}
                                    />
                                </DemoContainer>
                            </LocalizationProvider>
                        </FormControl>
                        <FormControl fullWidth margin="dense">
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DemoContainer components={["DatePicker"]}>
                                    <DatePicker
                                        label="Select End Date"
                                        format="DD/MM/YYYY"
                                        minDate={startDate ? startDate : dayjs()}
                                        value={endDate}
                                        maxDate={maxDate}
                                        shouldDisableDate={disableAllExceptSunday}
                                        onChange={(newValue) => setEndDate(newValue)}
                                    />
                                </DemoContainer>
                            </LocalizationProvider>
                        </FormControl><br/><br/>
                        <InputLabel id="shift-select-label">Shift(s):</InputLabel>
                        <Select
                            labelId="shift-select-label"
                            id="shift-select"
                            sx={{ lineHeight: "2.5em", width: '100%', marginTop: '5px'}}
                            multiple
                            value={shifts}
                            renderValue={(selected) => selected.join(', ')}
                            input={<OutlinedInput label="Tag" />}
                            onChange={handleChange}
                        >
                            <MenuItem key={1} value={1}>
                                <Checkbox checked={shifts.indexOf(1) > -1} />
                                Shift 1 (12am - 8am)
                            </MenuItem>
                            <MenuItem key={2} value={2}>
                                <Checkbox checked={shifts.indexOf(2) > -1} />
                                Shift 2 (8am - 4pm)
                            </MenuItem>
                            <MenuItem key={3} value={3}>
                                <Checkbox checked={shifts.indexOf(3) > -1} />
                                Shift 3 (4pm - 11.59pm)
                            </MenuItem>
                        </Select><br/><br/>
                        <Button 
                            variant="contained" 
                            onClick={handleExit}
                            style={{color: 'white', backgroundColor: 'grey'}}>
                            Cancel 
                        </Button>&nbsp;&nbsp;
                        <Button 
                            variant="contained" 
                            onClick={handleSubmit}
                            style={{color: 'white', backgroundColor: 'green'}}>
                            Allocate 
                        </Button>
                    </Grid>}
                </Grid>
            </Box>
        </Modal>
    )
}

export default AutoAllocateShift;