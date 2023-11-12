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
  getImageFromImageServer(type, image) {
    return axiosFetch.get(`${IMAGE_SERVER}/images/${type}/${image}`, {
      responseType: "blob",
    });
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
  getStaffsWorkingInCurrentShiftAndWard(wardName) {
    return axiosFetch.get(
      `${REST_ENDPOINT}/staff/getStaffsWorkingInCurrentShiftAndWard?wardName=${wardName}`
    );
  },
  getStaffsInUnit(unit) {
    return axiosFetch.get(
      `${REST_ENDPOINT}/staff/getStaffsInUnit?&unit=${unit}`
    );
  },
};

export const departmentApi = {
  getAllDepartments() {
    return axiosFetch.get(`${REST_ENDPOINT}/department/getAllDepartments?name`);
  },
};

export const wardApi = {
  getAllWards() {
    return axiosFetch.get(`${REST_ENDPOINT}/ward/getAllWards?name`);
  },
  getAllWardsByWardClass(wardClass) {
    return axiosFetch.get(
      `${REST_ENDPOINT}/ward/getAllWardsByWardClass?wardClass=${wardClass}`
    );
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
  useAllocatedInventory(requestBody) {
    return axiosFetch.put(
      `${REST_ENDPOINT}/allocatedInventory/useAllocatedInventory`,
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
  getElectronicHealthRecordById(electronicHealthRecordId) {
    return axiosFetch.get(
      `${REST_ENDPOINT}/electronicHealthRecord/getElectronicHealthRecordById?electronicHealthRecordId=${electronicHealthRecordId}`
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
  createAllergyRecord(electronicHealthRecordId, requestBody) {
    return axiosFetch.post(
      `${REST_ENDPOINT}/problemRecord/createAllergyRecord?electronicHealthRecordId=${electronicHealthRecordId}`,
      requestBody
    );
  },
  resolveProblemRecord(electronicHealthRecordId, problemRecordId) {
    return axiosFetch.post(
      `${REST_ENDPOINT}/problemRecord/resolveProblemRecord?electronicHealthRecordId=${electronicHealthRecordId}&problemRecordId=${problemRecordId}`
    );
  },
  updateProblemRecord(problemRecordId, requestBody) {
    return axiosFetch.put(
      `${REST_ENDPOINT}/problemRecord/updateProblemRecord?&problemRecordId=${problemRecordId}`,
      requestBody
    );
  },
  deleteProblemRecord(electronicHealthRecordId, problemRecordId) {
    return axiosFetch.delete(
      `${REST_ENDPOINT}/problemRecord/deleteProblemRecord?electronicHealthRecordId=${electronicHealthRecordId}&problemRecordId=${problemRecordId}`
    );
  },
};

export const treatmentPlanRecordApi = {
  createTreatmentPlanRecord(electronicHealthRecordId, staffId, requestBody) {
    return axiosFetch.post(
      `${REST_ENDPOINT}/treatmentPlanRecord/createTreatmentPlanRecord?electronicHealthRecordId=${electronicHealthRecordId}&staffId=${staffId}`,
      requestBody
    );
  },
  updateTreatmentPlanRecord(
    electronicHealthRecordId,
    treatmentPlanRecordId,
    staffId,
    requestBody
  ) {
    return axiosFetch.put(
      `${REST_ENDPOINT}/treatmentPlanRecord/updateTreatmentPlanRecord?electronicHealthRecordId=${electronicHealthRecordId}&treatmentPlanRecordId=${treatmentPlanRecordId}&staffId=${staffId}`,
      requestBody
    );
  },
  completeTreatmentPlanRecord(
    electronicHealthRecordId,
    treatmentPlanRecordId,
    staffId
  ) {
    return axiosFetch.put(
      `${REST_ENDPOINT}/treatmentPlanRecord/completeTreatmentPlanRecord?electronicHealthRecordId=${electronicHealthRecordId}&treatmentPlanRecordId=${treatmentPlanRecordId}&staffId=${staffId}`
    );
  },
  deleteTreatmentPlanRecord(
    electronicHealthRecordId,
    treatmentPlanRecordId,
    staffId
  ) {
    return axiosFetch.delete(
      `${REST_ENDPOINT}/treatmentPlanRecord/deleteTreatmentPlanRecord?electronicHealthRecordId=${electronicHealthRecordId}&treatmentPlanRecordId=${treatmentPlanRecordId}&staffId=${staffId}`
    );
  },
  viewTreatmentPlanRecordImages(treatmentPlanRecordId) {
    return axiosFetch.get(
      `${REST_ENDPOINT}/treatmentPlanRecord/viewTreatmentPlanRecordImages?treatmentPlanRecordId=${treatmentPlanRecordId}`
    );
  },
  addImageAttachmentToTreatmentPlan(
    treatmentPlanRecordId,
    imageLink,
    createdDate,
    staffId
  ) {
    return axiosFetch.post(
      `${REST_ENDPOINT}/treatmentPlanRecord/addImageAttachmentToTreatmentPlan?treatmentPlanRecordId=${treatmentPlanRecordId}&imageLink=${imageLink}&createdDate=${createdDate}&staffId=${staffId}`
    );
  },
  getListOfInvitationsInTreatmentPlanRecord(treatmentPlanRecordId) {
    return axiosFetch.get(
      `${REST_ENDPOINT}/treatmentPlanRecord/getListOfInvitationsInTreatmentPlanRecord?treatmentPlanRecordId=${treatmentPlanRecordId}`
    );
  },
  getListOfInvitationsByStaffId(staffId) {
    return axiosFetch.get(
      `${REST_ENDPOINT}/treatmentPlanRecord/getListOfInvitationsByStaffId?staffId=${staffId}`
    );
  },
  addInvitationToTreatmentPlanRecord(
    treatmentPlanRecordId,
    staffId,
    invitedStaffId
  ) {
    return axiosFetch.post(
      `${REST_ENDPOINT}/treatmentPlanRecord/addInvitationToTreatmentPlanRecord?treatmentPlanRecordId=${treatmentPlanRecordId}&staffId=${staffId}&invitedStaffId=${invitedStaffId}`
    );
  },
  deleteInvitationToTreatmentPlanRecord(
    treatmentPlanRecordId,
    staffId,
    invitationId
  ) {
    return axiosFetch.delete(
      `${REST_ENDPOINT}/treatmentPlanRecord/deleteInvitationToTreatmentPlanRecord?treatmentPlanRecordId=${treatmentPlanRecordId}&staffId=${staffId}&invitationId=${invitationId}`
    );
  },
  setInvitationToRead(invitationId, staffId) {
    return axiosFetch.put(
      `${REST_ENDPOINT}/treatmentPlanRecord/setInvitationToRead?invitationId=${invitationId}&staffId=${staffId}`
    );
  },
  setInvitationToApproved(invitationId, staffId) {
    return axiosFetch.put(
      `${REST_ENDPOINT}/treatmentPlanRecord/setInvitationToApproved?invitationId=${invitationId}&staffId=${staffId}`
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
    return axiosFetch.get(
      `${REST_ENDPOINT}/shift/getAllShiftsFromDate/${username}?startDate=${start}&endDate=${end}`
    );
  },
  automaticallyAllocateShifts(
    start,
    end,
    role,
    department,
    shift1,
    shift2,
    shift3
  ) {
    return axiosFetch.post(
      `${REST_ENDPOINT}/shift/automaticallyCreateShifts?startDate=${start}&endDate=${end}&role=${role}&department=${department}&shift1=${shift1}&shift2=${shift2}&shift3=${shift3}`
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

export const subsidyApi = {
  getAllSubsidies(username) {
    return axiosFetch.get(
      `${REST_ENDPOINT}/subsidy/findAllSubsidiesOfPatient/${username}`
    );
  },
  findAllSubsidyOfEhr(id) {
    return axiosFetch.get(`${REST_ENDPOINT}/subsidy/findAllSubsidyOfEhr/${id}`);
  },
  getAllSubsidies() {
    return axiosFetch.get(`${REST_ENDPOINT}/subsidy/getAllSubsidies`);
  },
  createSubsidy(requestBody) {
    return axiosFetch.post(
      `${REST_ENDPOINT}/subsidy/createSubsidy`,
      requestBody
    );
    return axiosFetch.post(
      `${REST_ENDPOINT}/subsidy/createSubsidy`,
      requestBody
    );
  },
  deleteSubsidy(subsidyId) {
    return axiosFetch.delete(
      `${REST_ENDPOINT}/subsidy/deleteSubsidy/${subsidyId}`
    );
    return axiosFetch.delete(
      `${REST_ENDPOINT}/subsidy/deleteSubsidy/${subsidyId}`
    );
  },
  updateSubsidyRate(subsidyId, requestBody) {
    return axiosFetch.put(
      `${REST_ENDPOINT}/subsidy/updateSubsidyRate/${subsidyId}`,
      requestBody
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
  createReferral(
    description,
    bookedDate,
    patientUsername,
    departmentName,
    staffUsername
  ) {
    return axiosFetch.post(
      `${REST_ENDPOINT}/appointment/createReferral?description=${description}&bookedDate=${bookedDate}&patientUsername=${patientUsername}&departmentName=${departmentName}&staffUsername=${staffUsername}`
    );
  },
  viewPharmacyTickets() {
    return axiosFetch.get(`${REST_ENDPOINT}/appointment/viewPharmacyTickets`);
  },
  updateAppointmentDispensaryStatus(appointmentId, dispensaryStatus) {
    return axiosFetch.post(
      `${REST_ENDPOINT}/appointment/updateAppointmentDispensaryStatus?appointmentId=${appointmentId}&dispensaryStatus=${dispensaryStatus}`
    );
  },
  findAppointmentTimeDiff(apppointmentId) {
    return axiosFetch.get(
      `${REST_ENDPOINT}/appointment/findAppointmentTimeDiff/${apppointmentId}`
    );
  },
  createNewPharmacyTicket(
    description,
    bookedDateTime,
    priority,
    patientUsername,
    departmentName
  ) {
    return axiosFetch.post(
      `${REST_ENDPOINT}/appointment/createNewPharmacyTicket?description=${description}&bookedDateTime=${bookedDateTime}&priority=${priority}&patientUsername=${patientUsername}&departmentName=${departmentName}`
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
  getAllMedication() {
    return axiosFetch.get(`${REST_ENDPOINT}/medication/getAllMedication`);
  },
  getAllMedicationsByAllergy(pId) {
    return axiosFetch.get(
      `${REST_ENDPOINT}/medication/getAllMedicationsByAllergy/${pId}`
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
  getAllergenEnums() {
    return axiosFetch.get(`${REST_ENDPOINT}/medication/getAllergenEnums`);
  },
  findMedicationByInventoryItemId(inventoryItemId) {
    return axiosFetch.get(
      `${REST_ENDPOINT}/medication/findMedicationByInventoryItemId?inventoryItemId=${inventoryItemId}`
    );
  },
  getAllInpatientMedication() {
    return axiosFetch.get(
      `${REST_ENDPOINT}/medication/getAllInpatientMedication`
    );
  },
  getAllInpatientMedicationsByAllergy(pId) {
    return axiosFetch.get(
      `${REST_ENDPOINT}/medication/getAllInpatientMedicationsByAllergy/${pId}`
    );
  },
  getAllServiceItem(name) {
    return axiosFetch.get(
      `${REST_ENDPOINT}/serviceItem/getAllServiceItem?name=${name}`
    );
  },
  getAllServiceItemByUnit(unitId) {
    return axiosFetch.get(
      `${REST_ENDPOINT}/serviceItem/getAllServiceItemByUnit/${unitId}`
    );
  },
  updateServiceItem(inventoryItemId, requestBody) {
    console.log("Request Sent: " + requestBody.name);
    return axiosFetch.put(
      `${REST_ENDPOINT}/serviceItem/updateServiceItem?inventoryItemId=${inventoryItemId}`,
      requestBody
    );
  },
  createServiceItem(unitId, requestBody) {
    return axiosFetch.post(
      `${REST_ENDPOINT}/serviceItem/createServiceItem?unitId=${unitId}`,
      requestBody
    );
  },
  deleteServiceItem(inventoryItemId) {
    return axiosFetch.delete(
      `${REST_ENDPOINT}/serviceItem/deleteServiceItem?inventoryItemId=${inventoryItemId}`
    );
  },
};

export const transactionItemApi = {
  addToCart(patientId, requestBody) {
    return axiosFetch.post(
      `${REST_ENDPOINT}/transactionItem/addToCart/${patientId}`,
      requestBody
    );
  },
  removeFromCart(patientId, transactionItemId) {
    return axiosFetch.delete(
      `${REST_ENDPOINT}/transactionItem/removeFromCart/${patientId}/${transactionItemId}`
    );
  },
  getCartItems(patientId) {
    return axiosFetch.get(
      `${REST_ENDPOINT}/transactionItem/getCartItems/${patientId}`
    );
  },
  checkout(patientId, appointmentId) {
    return axiosFetch.post(
      `${REST_ENDPOINT}/transactionItem/checkout/${patientId}/${appointmentId}`
    );
  },
  updateTransactionItem(transactionItemId, quantity) {
    return axiosFetch.put(
      `${REST_ENDPOINT}/transactionItem/updateTransactionItem?transactionItemId=${transactionItemId}&quantity=${quantity}`
    );
  },
};

export const prescriptionRecordApi = {
  getAllPrescriptionRecord(id) {
    return axiosFetch.get(
      `${REST_ENDPOINT}/prescriptionRecord/getPrescriptionRecordsByEHRId/${id}`
    );
  },
  deletePrescriptionRecord(prescriptionRecordId) {
    return axiosFetch.delete(
      `${REST_ENDPOINT}/prescriptionRecord/deletePrescriptionRecord/${prescriptionRecordId}`
    );
  },
  updatePrescriptionRecord(id, requestBody) {
    return axiosFetch.put(
      `${REST_ENDPOINT}/prescriptionRecord/updatePrescriptionRecord/${id}`,
      requestBody
    );
  },
  createNewPrescriptionRecord(requestBody, ehrId, itemId) {
    return axiosFetch.post(
      `${REST_ENDPOINT}/prescriptionRecord/createNewPrescription/${ehrId}/${itemId}`,
      requestBody
    );
  },
  checkOutPrescriptionRecord(prescriptionId, ehrId) {
    return axiosFetch.post(
      `${REST_ENDPOINT}/prescriptionRecord/checkOutPrescription/${prescriptionId}/${ehrId}`
    );
  },
  getPrescriptionRecordByNric(nric) {
    return axiosFetch.get(
      `${REST_ENDPOINT}/prescriptionRecord/getPrescriptionRecordsByNric?nric=${nric}`
    );
  },
};

export const stripeApi = {
  createPaymentLink(requestBody) {
    return axiosFetch.post(
      `${REST_ENDPOINT}/stripe/create-payment-link`,
      requestBody
    );
  },
};

export const transactionApi = {
  getAllTransactions() {
    return axiosFetch.get(`${REST_ENDPOINT}/transaction/getAllTransactions`);
  },
  getAllTransactionsOfPatient(id) {
    return axiosFetch.get(
      `${REST_ENDPOINT}/transaction/getAllTransactionsOfPatient/${id}`
    );
  },
  createPaymentLink(id, requestBody) {
    return axiosFetch.post(
      `${REST_ENDPOINT}/transaction/createTransaction/${id}`,
      requestBody
    );
  },
  getTotalSumOfTransactionsForCurrentYearByMonth() {
    return axiosFetch.get(
      `${REST_ENDPOINT}/transaction/getTotalSumOfTransactionsForCurrentYearByMonth/`
    );
  },
};

export const invoiceApi = {
  getAllInvoices() {
    return axiosFetch.get(`${REST_ENDPOINT}/invoice/getAllInvoices`);
  },
  findInvoice(id) {
    return axiosFetch.get(`${REST_ENDPOINT}/invoice/findInvoice/${id}`);
  },
  getInvoicesByPatientId(id) {
    return axiosFetch.get(
      `${REST_ENDPOINT}/invoice/getInvoicesByPatientId/${id}`
    );
  },
  findPatientOfInvoice(id) {
    return axiosFetch.get(
      `${REST_ENDPOINT}/invoice/findPatientOfInvoice/${id}`
    );
  },
  findItemsOfInvoice(id) {
    return axiosFetch.get(`${REST_ENDPOINT}/invoice/findItemsOfInvoice/${id}`);
  },
  createInsuranceClaim(invoiceId, requestBody) {
    return axiosFetch.post(
      `${REST_ENDPOINT}/invoice/createInsuranceClaim/${invoiceId}`,
      requestBody
    );
  },
  createMedishieldClaim(invoiceId, requestBody) {
    return axiosFetch.post(
      `${REST_ENDPOINT}/invoice/createMedishieldClaim/${invoiceId}`,
      requestBody
    );
  },
  deleteInsuranceClaim(claimId, invoiceId) {
    return axiosFetch.delete(
      `${REST_ENDPOINT}/invoice/deleteInsuranceClaim/${claimId}/${invoiceId}`
    );
  },
  deleteMedishieldClaim(claimId, invoiceId) {
    return axiosFetch.delete(
      `${REST_ENDPOINT}/invoice/deleteMedishieldClaim/${claimId}/${invoiceId}`
    );
  },
  approveMedishieldClaim(claimId, invoiceId) {
    return axiosFetch.put(
      `${REST_ENDPOINT}/invoice/approveMedishieldClaim/${claimId}/${invoiceId}`
    );
  },
  rejectMedishieldClaim(claimId) {
    return axiosFetch.put(
      `${REST_ENDPOINT}/invoice/rejectMedishieldClaim/${claimId}`
    );
  },
  findProfitByInventoryItem() {
    return axiosFetch.get(`${REST_ENDPOINT}/invoice/findProfitByInventoryItem`);
  },
  findProfitByServiceItem() {
    return axiosFetch.get(`${REST_ENDPOINT}/invoice/findProfitByServiceItem`);
  },
  findProfitByMedication() {
    return axiosFetch.get(`${REST_ENDPOINT}/invoice/findProfitByMedication`);
  },
  findInvoiceUsingTransaction(id) {
    return axiosFetch.get(
      `${REST_ENDPOINT}/invoice/findInvoiceUsingTransaction/${id}`
    );
  },
};

export const admissionApi = {
  createAdmission(duration, reason, patientId, doctorId) {
    return axiosFetch.post(
      `${REST_ENDPOINT}/admission/createAdmission?duration=${duration}&reason=${reason}&patientId=${patientId}&doctorId=${doctorId}`
    );
  },
  scheduleAdmission(admissionId, wardAvailabilityId, admission, discharge) {
    return axiosFetch.put(
      `${REST_ENDPOINT}/admission/scheduleAdmission?admissionId=${admissionId}&wardAvailabilityId=${wardAvailabilityId}&admission=${admission}&discharge=${discharge}`
    );
  },
  getAdmissionsForWard(name) {
    return axiosFetch.get(
      `${REST_ENDPOINT}/admission/getAdmissionsForWard?wardName=${name}`
    );
  },
  getAdmissionsForStaff(id) {
    return axiosFetch.get(
      `${REST_ENDPOINT}/admission/getAdmissionsForStaff?staffId=${id}`
    );
  },
  assignAdmissionToStaff(admissionId, toStaffId) {
    return axiosFetch.put(
      `${REST_ENDPOINT}/admission/assignAdmissionToStaff?admissionId=${admissionId}&toStaffId=${toStaffId}`
    );
  },
  updateAdmissionArrival(admissionId, arrivalStatus, staffId) {
    return axiosFetch.put(
      `${REST_ENDPOINT}/admission/updateAdmissionArrival?admissionId=${admissionId}&arrivalStatus=${arrivalStatus}&staffId=${staffId}`
    );
  },
  updateAdmissionComments(admissionId, comments, staffId) {
    return axiosFetch.put(
      `${REST_ENDPOINT}/admission/updateAdmissionComments?admissionId=${admissionId}&comments=${comments}&staffId=${staffId}`
    );
  },
  cancelAdmission(admissionId, wardId) {
    return axiosFetch.put(
      `${REST_ENDPOINT}/admission/cancelAdmission?admissionId=${admissionId}&wardId=${wardId}`
    );
  },
  handleDischarge(date) {
    return axiosFetch.put(
      `${REST_ENDPOINT}/admission/handleDischarge?date=${date}`
    );
  },
  handleAllocateIncoming(date) {
    return axiosFetch.put(
      `${REST_ENDPOINT}/admission/handleAllocateIncoming?date=${date}`
    );
  },
  updateDischargeDate(admissionId, dischargeDate) {
    return axiosFetch.put(
      `${REST_ENDPOINT}/admission/updateDischargeDate?admissionId=${admissionId}&dischargeDate=${dischargeDate}`
    );
  },
  getAdmissionByAdmissionId(admissionId) {
    return axiosFetch.get(
      `${REST_ENDPOINT}/admission/getAdmissionByAdmissionId?admissionId=${admissionId}`
    );
  },
  addImageAttachment(admissionId, imageLink, createdDate) {
    return axiosFetch.put(
      `${REST_ENDPOINT}/admission/addImageAttachment?admissionId=${admissionId}&imageLink=${imageLink}&createdDate=${createdDate}`
    );
  },
  viewImageAttachments(admissionId) {
    return axiosFetch.get(
      `${REST_ENDPOINT}/admission/viewImageAttachments?admissionId=${admissionId}`
    );
  },
};

export const medicationOrderApi = {
  createMedicationOrder(medicationId, admissionId, requestBody) {
    return axiosFetch.post(
      `${REST_ENDPOINT}/medicationOrder/createMedicationOrder?medicationId=${medicationId}&admissionId=${admissionId}`,
      requestBody
    );
  },

  deleteMedicationOrder(medicationOrderId, admissionId) {
    return axiosFetch.delete(
      `${REST_ENDPOINT}/medicationOrder/deleteMedicationOrder?medicationOrderId=${medicationOrderId}&admissionId=${admissionId}`
    );
  },
  getAllMedicationOrdersOfAdmission(admissionId) {
    return axiosFetch.get(
      `${REST_ENDPOINT}/medicationOrder/getAllMedicationOrdersOfAdmission?admissionId=${admissionId}`
    );
  },
  getAllMedicationOrders() {
    return axiosFetch.get(
      `${REST_ENDPOINT}/medicationOrder/getAllMedicationOrders`
    );
  },
  getMedicationOrderById(id) {
    return axiosFetch.get(
      `${REST_ENDPOINT}/medicationOrder/getMedicationOrderById?medicationOrderId=${id}`
    );
  },
  updateComplete(medicationOrderId, admissionId, isCompleted) {
    return axiosFetch.put(
      `${REST_ENDPOINT}/medicationOrder/updateComplete?medicationOrderId=${medicationOrderId}&admissionId=${admissionId}&isCompleted=${isCompleted}`
    );
  },
};

export const inpatientTreatmentApi = {
  createInpatientTreatment(serviceItemId, admissionId, staffId, requestBody) {
    return axiosFetch.post(
      `${REST_ENDPOINT}/inpatientTreatment/createInpatientTreatment?serviceItemId=${serviceItemId}&admissionId=${admissionId}&staffId=${staffId}`,
      requestBody
    );
  },
  getInpatientTreatmentById(id) {
    return axiosFetch.get(
      `${REST_ENDPOINT}/inpatientTreatment/getInpatientTreatmentById?inpatientTreatmentId=${id}`
    );
  },
  updateArrival(id, arrived) {
    return axiosFetch.put(
      `${REST_ENDPOINT}/inpatientTreatment/updateArrival?inpatientTreatmentId=${id}&arrivalStatus=${arrived}`
    );
  },
  updateComplete(inpatientTreatmentId, admissionId) {
    return axiosFetch.put(
      `${REST_ENDPOINT}/inpatientTreatment/updateComplete?inpatientTreatmentId=${inpatientTreatmentId}&admissionId=${admissionId}`
    );
  },
  deleteInpatientTreatment(inpatientTreatmentId, admissionId) {
    return axiosFetch.delete(
      `${REST_ENDPOINT}/inpatientTreatment/deleteInpatientTreatment?inpatientTreatmentId=${inpatientTreatmentId}&admissionId=${admissionId}`
    );
  },
};

export const postApi = {
  getAllPosts() {
    return axiosFetch.get(`${REST_ENDPOINT}/post/getAllPosts`);
  },
  getPostById(id) {
    return axiosFetch.get(`${REST_ENDPOINT}/post/getPostById/${id}`);
  },
  findPostAuthor(id) {
    return axiosFetch.get(`${REST_ENDPOINT}/post/findPostAuthor/${id}`);
  },
  deletePost(id) {
    return axiosFetch.delete(`${REST_ENDPOINT}/post/deletePost/${id}`);
  },
  createPost(id, requestBody) {
    return axiosFetch.post(
      `${REST_ENDPOINT}/post/createPost/${id}`,
      requestBody
    );
  },
  addImageToPost(id, requestBody) {
    return axiosFetch.post(`${REST_ENDPOINT}/post/addImage/${id}`, requestBody);
  },
  removeImage(id, requestBody) {
    return axiosFetch.post(
      `${REST_ENDPOINT}/post/removeImage/${id}`,
      requestBody
    );
  },
  updatePost(id, requestBody) {
    return axiosFetch.put(
      `${REST_ENDPOINT}/post/updatePost/${id}`,
      requestBody
    );
  },
};

export const chatApi = {
  getStaffConversations(staffId) {
    return axiosFetch.get(
      `${REST_ENDPOINT}/conversation/getStaffConversations?staffId=${staffId}`
    );
  },
  getStaffChatDTO(staffId) {
    return axiosFetch.get(
      `${REST_ENDPOINT}/conversation/getStaffChatDTO?staffId=${staffId}`
    );
  },
  createStaffConversation(from, to) {
    return axiosFetch.post(
      `${REST_ENDPOINT}/conversation/createStaffConversation?staffId1=${from}&staffId2=${to}`
    );
  },
};
