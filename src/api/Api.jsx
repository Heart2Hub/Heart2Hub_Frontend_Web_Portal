import axios from "axios";
import { REST_ENDPOINT, IMAGE_SERVER } from "../constants/RestEndPoint";

let axiosFetch = axios.create();

if (localStorage.getItem("accessToken")) {
  axiosFetch.defaults.headers.common["Authorization"] =
    "Bearer " + localStorage.getItem("accessToken");
}

export const imageServerApi = {
  uploadProfilePhoto(type, image) {
    return axiosFetch.post(`${IMAGE_SERVER}/upload/${type}`, image);
  },
};

export const authApi = {
  login(username, password) {
    return axiosFetch.post(
      `${REST_ENDPOINT}/staff/staffLogin?username=${username}&password=${password}`
    );
  },
  updateAccessToken(accessToken) {
    axiosFetch.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${accessToken}`;
  },
  changePassword(username, oldPassword, newPassword) {
    return axiosFetch.put(
      `${REST_ENDPOINT}/staff/changePassword?username=${username}&oldPassword=${oldPassword}&newPassword=${newPassword}`
    );
  },
};

export const staffApi = {
  getAllStaff() {
    return axiosFetch.get(`${REST_ENDPOINT}/staff/getAllStaff`);
  },
  getStaffByUsername(username) {
    return axiosFetch.get(
      `${REST_ENDPOINT}/staff/getStaffByUsername?username=${username}`
    );
  },
  getStaffRoles() {
    return axiosFetch.get(`${REST_ENDPOINT}/staff/getStaffRoles`);
  },
  createStaff(requestBody, subDepartment) {
    return axiosFetch.post(
      `${REST_ENDPOINT}/staff/createStaffWithImage/${subDepartment}`,
      requestBody
    );
  },
  updateStaff(staff, subDepartment) {
    return axiosFetch.put(
      `${REST_ENDPOINT}/staff/updateStaff/${subDepartment}`,
      staff
    );
  },
  updateStaffWithImage(requestBody, subDepartment) {
    return axiosFetch.put(
      `${REST_ENDPOINT}/staff/updateStaffWithImage/${subDepartment}`,
      requestBody
    );
  },
  disableStaff(username) {
    return axiosFetch.put(`${REST_ENDPOINT}/staff/disableStaff/${username}`);
  },
  getStaffListByRole(role, unit) {
    return axiosFetch.get(
      `${REST_ENDPOINT}/staff/getStaffByRole?role=${role}&unit=${unit}`
    );
  },
};

export const departmentApi = {
  getAllDepartments(name) {
    return axiosFetch.get(
      `${REST_ENDPOINT}/department/getAllDepartments?name=${name}`
    );
  },
};

export const wardApi = {
  getAllWards(name) {
    return axiosFetch.get(`${REST_ENDPOINT}/ward/getAllWards?name=${name}`);
  },
};

export const subDepartmentApi = {
  getAllSubDepartments(name) {
    return axiosFetch.get(
      `${REST_ENDPOINT}/subDepartment/getAllSubDepartments?name=${name}`
    );
  },
};

export const facilityApi = {
  getAllFacilitiesByStatus(status) {
    return axiosFetch.get(
      `${REST_ENDPOINT}/facility/getAllFacilitiesByFacilityStatus?facilityStatus=${status}`
    );
  },
  getAllFacilitiesByName(name) {
    return axiosFetch.get(
      `${REST_ENDPOINT}/facility/getAllFacilitiesByName?name=${name}`
    );
  },
  getAllFacilitiesByDepartmentName(name) {
    return axiosFetch.get(
      `${REST_ENDPOINT}/facility/getAllFacilitiesByDepartmentName?name=${name}`
    );
  },
  createFacility(subDepartmentId, requestBody) {
    return axiosFetch.post(
      `${REST_ENDPOINT}/facility/createFacility?subDepartmentId=${subDepartmentId}`,
      requestBody
    );
  },
  deleteFacility(facilityId) {
    return axiosFetch.delete(
      `${REST_ENDPOINT}/facility/deleteFacility?facilityId=${facilityId}`
    );
  },
  updateFacility(facilityId, requestBody) {
    return axiosFetch.put(
      `${REST_ENDPOINT}/facility/updateFacility?facilityId=${facilityId}`,
      requestBody
    );
  },
};

export const patientApi = {
  getAllPatientsWithElectronicHealthRecordSummaryByName(name) {
    return axiosFetch.get(
      `${REST_ENDPOINT}/patient/getAllPatientsWithElectronicHealthRecordSummaryByName?name=${name}`
    );
  },
};

export const ehrApi = {
  getElectronicHealthRecordByIdAndDateOfBirth(
    electronicHealthRecordId,
    dateOfBirth
  ) {
    return axiosFetch.get(
      `${REST_ENDPOINT}/electronicHealthRecord/getElectronicHealthRecordByIdAndDateOfBirth?electronicHealthRecordId=${electronicHealthRecordId}&dateOfBirth=${dateOfBirth}`
    );
  },
};

export const leaveApi = {
  getAllManagedLeaves(staffId) {
    console.log(staffId);
    return axiosFetch.get(
      `${REST_ENDPOINT}/leave/getAllManagedLeaves?staffId=${staffId}`
    );
  },
  getAllStaffLeaves(staffId) {
    return axiosFetch.get(
      `${REST_ENDPOINT}/leave/getAllStaffLeaves/${staffId}`
    );
  },
  getLeaveBalance(staffId) {
    console.log(staffId);
    return axiosFetch.get(
      `${REST_ENDPOINT}/leave/getLeaveBalance?staffId=${staffId}`
    );
  },
  approveLeaveDate(leaveId) {
    console.log(leaveId);
    return axiosFetch.put(
      `${REST_ENDPOINT}/leave/approveLeaveDate?leaveId=${leaveId}`
    );
  },
  rejectLeaveDate(leaveId) {
    console.log(leaveId);
    return axiosFetch.put(
      `${REST_ENDPOINT}/leave/rejectLeaveDate?leaveId=${leaveId}`
    );
  },
};

export const shiftApi = {
  viewWeeklyRoster(username, date) {
    return axiosFetch.get(
      `${REST_ENDPOINT}/shift/viewWeeklyRoster/${username}?date=${date}`
    );
  },
  viewMonthlyRoster(username, year, month) {
    return axiosFetch.get(
      `${REST_ENDPOINT}/shift/viewMonthlyRoster/${username}?year=${year}&month=${month}`
    );
  },
  viewOverallRoster(username) {
    return axiosFetch.get(
      `${REST_ENDPOINT}/shift/viewOverallRoster/${username}`
    );
  },
  createShift(username, facility, requestBody) {
    return axiosFetch.post(
      `${REST_ENDPOINT}/shift/createShift/${username}/${facility}`,
      requestBody
    );
  },
  updateShift(shiftId, facility, requestBody) {
    return axiosFetch.put(
      `${REST_ENDPOINT}/shift/updateShift/${shiftId}/${facility}`,
      requestBody
    );
  },
  deleteShift(shiftId) {
    return axiosFetch.delete(`${REST_ENDPOINT}/shift/deleteShift/${shiftId}`);
  },
  getAllShiftsFromDate(username, start, end) {
    console.log(
      `${REST_ENDPOINT}/shift/getAllShiftsFromDate/${username}?startDate=${start}&endDate=${end}`
    );
    return axiosFetch.get(
      `${REST_ENDPOINT}/shift/getAllShiftsFromDate/${username}?startDate=${start}&endDate=${end}`
    );
  },
};

export const shiftConstraintsApi = {
  getAllShiftConstraints(role, department) {
    return axiosFetch.get(
      `${REST_ENDPOINT}/shiftConstraints/getAllShiftConstraints/${role}?department=${department}`
    );
  },
  checkIsValidWorkDay(role, date, department) {
    return axiosFetch.get(
      `${REST_ENDPOINT}/shiftConstraints/checkIsValidWorkday?role=${role}&date=${date}&department=${department}`
    );
  },
  createShiftConstraints(requestBody, facilityName) {
    return axiosFetch.post(
      `${REST_ENDPOINT}/shiftConstraints/createShiftConstraints?facilityName=${facilityName}`,
      requestBody
    );
  },
  updateShiftConstraints(id, requestBody, facilityName) {
    return axiosFetch.put(
      `${REST_ENDPOINT}/shiftConstraints/updateShiftConstraints/${id}?facilityName=${facilityName}`,
      requestBody
    );
  },
  deleteShiftConstraints(id) {
    return axiosFetch.delete(
      `${REST_ENDPOINT}/shiftConstraints/deleteShiftConstraints/${id}`
    );
  },
};

export const shiftPreferenceApi = {
  getShiftPreference(username) {
    return axiosFetch.get(
      `${REST_ENDPOINT}/shiftPreference/getShiftPreference/${username}`
    );
  },
  createShiftPreference(requestBody) {
    return axiosFetch.post(
      `${REST_ENDPOINT}/shiftPreference/createShiftPreference`,
      requestBody
    );
  },
  deleteShiftPreference(id) {
    return axiosFetch.delete(
      `${REST_ENDPOINT}/shiftPreference/deleteShiftPreference/${id}`
    );
  },
};

export const appointmentApi = {
  viewAllAppointmentsByRange(
    startDay,
    startMonth,
    startYear,
    endDay,
    endMonth,
    endYear,
    departmentName
  ) {
    return axiosFetch.get(
      `${REST_ENDPOINT}/appointment/viewAllAppointmentsByRange?startDay=${startDay}&startMonth=${startMonth}&startYear=${startYear}&endDay=${endDay}&endMonth=${endMonth}&endYear=${endYear}&departmentName=${departmentName}`
    );
  },
};
