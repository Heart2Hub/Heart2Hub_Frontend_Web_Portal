import moment from 'moment';

export const getDay = (index) => {
    switch (index){
        case 0:
            return "Monday";
        case 1:
            return "Tuesday";
        case 2:
            return "Wednesday";
        case 3:
            return "Thursday";
        case 4:
            return "Friday";
        case 5:
            return "Saturday";
        case 6:
            return "Sunday";
    }
}

export const getShiftName = (startTime, endTime) => {
    if (startTime == "00:00" && endTime == "08:00") {
        return "Shift 1";
    } else if (startTime == "08:00" && endTime == "16:00") {
        return "Shift 2";
    } else if (startTime == "16:00" && endTime == "23:59") {
        return "Shift 3";
    }
    return "24-hour Shift";
}

export const getShiftId = (startTime, endTime) => {
    if (startTime == "00:00" && endTime == "08:00") {
        return 1;
    } else if (startTime == "08:00" && endTime == "16:00") {
        return 2;
    } else if (startTime == "16:00" && endTime == "23:59") {
        return 3;
    }
    return 4;
}

export const getShiftTime = (id) => {
    if (id == 1) {
        return ["00:00:00", "08:00:00"];
    } else if (id == 2) {
        return ["08:00:00", "16:00:00"];
    } else if (id == 3) {
        return ["16:00:00", "23:59:00"];
    } else {
        return ["00:00:00", "23:59:00"];
    }
}

export const getTime = (dateTime) => {
    return moment(dateTime).format('HH:mm');
}
