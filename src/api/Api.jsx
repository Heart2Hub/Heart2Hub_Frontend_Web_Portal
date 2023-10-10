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
  getStaffByStaffId(staffId) {
    return axiosFetch.get(
      `${REST_ENDPOINT}/staff/getStaffByStaffId?staffId=${staffId}`
    );
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
  getStaffsWorkingInCurrentShiftAndDepartment(departmentName) {
    return axiosFetch.get(
      `${REST_ENDPOINT}/staff/getStaffsWorkingInCurrentShiftAndDepartment?departmentName=${departmentName}`
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
  createFacility(departmentId, requestBody) {
    return axiosFetch.post(
      `${REST_ENDPOINT}/facility/createFacility?departmentId=${departmentId}`,
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
  findAllFacility() {
    return axiosFetch.get(`${REST_ENDPOINT}/facility/findAllFacility`);
  },
  findAllBookingsOfAFacility(id) {
    return axiosFetch.get(
      `${REST_ENDPOINT}/facilityBooking/getAllBookingsOfAFacility/${id}`
    );
  },
  deleteFacilityBooking(id) {
    return axiosFetch.delete(
      `${REST_ENDPOINT}/facilityBooking/deleteFacilityBooking/${id}`
    );
  },
  createFacilityBooking(requestBody) {
    return axiosFetch.post(
      `${REST_ENDPOINT}/facilityBooking/createFacilityBooking`,
      requestBody
    );
  },
  getAllBookingsOfAStaff(username) {
    return axiosFetch.get(
      `${REST_ENDPOINT}/facilityBooking/getAllBookingsOfAStaff/${username}`
    );
  },
  updateFacilityBooking(requestBody) {
    return axiosFetch.put(
      `${REST_ENDPOINT}/facilityBooking/updateFacilityBooking`,
      requestBody
    );
  },
  getAllConsumableInventory() {
    return axiosFetch.get(
      `${REST_ENDPOINT}/consumableEquipment/getAllConsumableEquipment`
    );
  },
};

export const allocatedInventoryApi = {
  deleteAllocatedInventory(id) {
    return axiosFetch.delete(
      `${REST_ENDPOINT}/allocatedInventory/deleteAllocatedInventory/${id}`
    );
  },
  updateAllocatedInventory(requestBody) {
    return axiosFetch.put(
      `${REST_ENDPOINT}/allocatedInventory/updateAllocatedInventory`,
      requestBody
    );
  },
  createAllocatedInventory(requestBody) {
    return axiosFetch.post(
      `${REST_ENDPOINT}/allocatedInventory/createAllocatedInventory`,
      requestBody
    );
  },
  findAllAllocatedInventoryOfFacility(id) {
    return axiosFetch.get(
      `${REST_ENDPOINT}/allocatedInventory/findAllAllocatedInventoryOfFacility/${id}`
    );
  },
};

export const patientApi = {
  getAllPatientsWithElectronicHealthRecordSummaryByName(name) {
    return axiosFetch.get(
      `${REST_ENDPOINT}/patient/getAllPatientsWithElectronicHealthRecordSummaryByName?name=${name}`
    );
  },
  getAllPatientUsername() {
    return axiosFetch.get(`${REST_ENDPOINT}/patient/findAllPatientsUsername`);
  },
  getAllPatients() {
    return axiosFetch.get(
      `${REST_ENDPOINT}/electronicHealthRecord/getAllElectronicHealthRecords`
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
  getElectronicHealthRecordByNric(nric) {
    return axiosFetch.get(
      `${REST_ENDPOINT}/electronicHealthRecord/getElectronicHealthRecordByNric?nric=${nric}`
    );
  },
};

export const problemRecordApi = {
  createProblemRecord(electronicHealthRecordId, requestBody) {
    return axiosFetch.post(
      `${REST_ENDPOINT}/problemRecord/createProblemRecord?electronicHealthRecordId=${electronicHealthRecordId}`,
      requestBody
    );
  },
  resolveProblemRecord(electronicHealthRecordId, problemRecordId) {
    return axiosFetch.post(
      `${REST_ENDPOINT}/problemRecord/resolveProblemRecord?electronicHealthRecordId=${electronicHealthRecordId}&problemRecordId=${problemRecordId}`
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
    departmentName,
    selectStaffId
  ) {
    return axiosFetch.get(
      `${REST_ENDPOINT}/appointment/viewAllAppointmentsByRange?startDay=${startDay}&startMonth=${startMonth}&startYear=${startYear}&endDay=${endDay}&endMonth=${endMonth}&endYear=${endYear}&departmentName=${departmentName}&selectStaffId=${selectStaffId}`
    );
  },
  updateAppointmentArrival(appointmentId, arrivalStatus, staffId) {
    return axiosFetch.post(
      `${REST_ENDPOINT}/appointment/updateAppointmentArrival?appointmentId=${appointmentId}&arrivalStatus=${arrivalStatus}&staffId=${staffId}`
    );
  },
  updateAppointmentComments(appointmentId, comments, staffId) {
    return axiosFetch.post(
      `${REST_ENDPOINT}/appointment/updateAppointmentComments?appointmentId=${appointmentId}&comments=${comments}&staffId=${staffId}`
    );
  },
  updateAppointmentSwimlaneStatus(appointmentId, swimlaneStatus) {
    return axiosFetch.post(
      `${REST_ENDPOINT}/appointment/updateAppointmentSwimlaneStatus?appointmentId=${appointmentId}&swimlaneStatus=${swimlaneStatus}`
    );
  },
  assignAppointmentToStaff(appointmentId, toStaffId, fromStaffId) {
    return axiosFetch.post(
      `${REST_ENDPOINT}/appointment/assignAppointmentToStaff?appointmentId=${appointmentId}&toStaffId=${toStaffId}&fromStaffId=${fromStaffId}`
    );
  },
  createNewAppointment(
    description,
    // actualDateTime,
    bookedDateTime,
    priority,
    patientUsername,
    departmentName
  ) {
    return axiosFetch.post(
      // `${REST_ENDPOINT}/appointment/createNewAppointment?description=${description}&actualDateTime=${actualDateTime}&bookedDateTime=${bookedDateTime}&priority=${priority}&patientUsername=${patientUsername}&departmentName=${departmentName}`
      `${REST_ENDPOINT}/appointment/createNewAppointment?description=${description}&bookedDateTime=${bookedDateTime}&priority=${priority}&patientUsername=${patientUsername}&departmentName=${departmentName}`
    );
  },
  createNewAppointmentOnWeb(
    description,
    actualDateTime,
    bookedDateTime,
    priority,
    patientUsername,
    departmentName
  ) {
    return axiosFetch.post(
      `${REST_ENDPOINT}/appointment/createNewAppointmentOnWeb?description=${description}&actualDateTime=${actualDateTime}&bookedDateTime=${bookedDateTime}&priority=${priority}&patientUsername=${patientUsername}&departmentName=${departmentName}`
    );
  },
  addImageAttachmentToAppointment(
    appointmentId,
    imageLink,
    createdDate,
    staffId
  ) {
    return axiosFetch.post(
      `${REST_ENDPOINT}/appointment/addImageAttachmentToAppointment?appointmentId=${appointmentId}&imageLink=${imageLink}&createdDate=${createdDate}&staffId=${staffId}`
    );
  },
  viewAppointmentAttachments(appointmentId) {
    return axiosFetch.get(
      `${REST_ENDPOINT}/appointment/viewAppointmentAttachments?appointmentId=${appointmentId}`
    );
  },
  viewPatientAppointments(patientUsername) {
    return axiosFetch.get(
      `${REST_ENDPOINT}/appointment/viewPatientAppointments?patientUsername=${patientUsername}`
    );
  },
};

export const inventoryApi = {
  getAllConsumableEquipment(name) {
    return axiosFetch.get(
      `${REST_ENDPOINT}/consumableEquipment/getAllConsumableEquipment?name=${name}`
    );
  },
  updateConsumableEquipment(inventoryItemId, requestBody) {
    console.log("Request Sent: " + requestBody.name);
    return axiosFetch.put(
      `${REST_ENDPOINT}/consumableEquipment/updateConsumableEquipment?inventoryItemId=${inventoryItemId}`,
      requestBody
    );
  },
  createConsumableEquipment(requestBody) {
    return axiosFetch.post(
      `${REST_ENDPOINT}/consumableEquipment/createConsumableEquipment`,
      requestBody
    );
  },
  deleteConsumableEquipment(inventoryItemId) {
    return axiosFetch.delete(
      `${REST_ENDPOINT}/consumableEquipment/deleteConsumableEquipment?inventoryItemId=${inventoryItemId}`
    );
  },
  getAllMedication(name) {
    return axiosFetch.get(
      `${REST_ENDPOINT}/medication/getAllMedication?name=${name}`
    );
  },
  updateMedication(inventoryItemId, requestBody) {
    console.log("Request Sent: " + requestBody.name);
    return axiosFetch.put(
      `${REST_ENDPOINT}/medication/updateMedication?inventoryItemId=${inventoryItemId}`,
      requestBody
    );
  },
  createMedication(requestBody) {
    return axiosFetch.post(
      `${REST_ENDPOINT}/medication/createMedication`,
      requestBody
    );
  },
  deleteMedication(inventoryItemId) {
    return axiosFetch.delete(
      `${REST_ENDPOINT}/medication/deleteMedication?inventoryItemId=${inventoryItemId}`
    );
  },
  getAllServiceItem(name) {
    return axiosFetch.get(
      `${REST_ENDPOINT}/serviceItem/getAllServiceItem?name=${name}`
    );
  },
  updateServiceItem(inventoryItemId, requestBody) {
    console.log("Request Sent: " + requestBody.name);
    return axiosFetch.put(
      `${REST_ENDPOINT}/serviceItem/updateServiceItem?inventoryItemId=${inventoryItemId}`,
      requestBody
    );
  },
  createServiceItem(requestBody) {
    return axiosFetch.post(
      `${REST_ENDPOINT}/serviceItem/createServiceItem`,
      requestBody
    );
  },
  deleteServiceItem(inventoryItemId) {
    return axiosFetch.delete(
      `${REST_ENDPOINT}/serviceItem/deleteServiceItem?inventoryItemId=${inventoryItemId}`
    );
  },
};
