import { facilityApi } from 'api/Api';
import moment from 'moment';

export const options = [
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

export const getShiftNameWithTime = (startTime, endTime) => {
    let start = moment(startTime, 'YYYY-MM-DD, HH:mm:ss').format('HH:mm');
    let end = moment(endTime, 'YYYY-MM-DD, HH:mm:ss').format('HH:mm');
    if (start == "00:00" && end == "08:00") {
        return "Shift 1 (12am - 8am)";
    } else if (start == "08:00" && end == "16:00") {
        return "Shift 2 (8am - 4pm)";
    } else if (start == "16:00" && end == "23:59") {
        return "Shift 3 (4pm - 11.59pm)";
    }
    return "24-hour Shift (12am - 11.59pm)";
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

export const getColor = (startTime, endTime) => {
    if (getTime(startTime) == "00:00" && getTime(endTime) == "08:00") {
        return "#ffdc7a";
    } else if (getTime(startTime) == "08:00" && getTime(endTime) == "16:00") {
        return "#baffb3";
    } else if (getTime(startTime) == "16:00" && getTime(endTime) == "23:59") {
        return "#b3ccff";
    } else {
        return "#ffb5b3";
    }
}

export const getColorLeave = (status) => {
    if (status === "APPROVED") {
        return "#5e5e5e";
    } else if (status === "PENDING") {
        return "#c2c2c2";
    }
}
