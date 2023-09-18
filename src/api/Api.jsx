import axios from "axios";
import { REST_ENDPOINT } from "../constants/RestEndPoint";

let axiosFetch = axios.create();

if (localStorage.getItem("accessToken")) {
  axiosFetch.defaults.headers.common["Authorization"] =
    "Bearer " + localStorage.getItem("accessToken");
}

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
  createStaff(staff, subDepartment) {
    return axiosFetch.post(
      `${REST_ENDPOINT}/staff/createStaff/${subDepartment}`,
      staff
    );
  },
  updateStaff(staff, subDepartment) {
    return axiosFetch.put(
      `${REST_ENDPOINT}/staff/updateStaff/${subDepartment}`,
      staff
    );
  },
  disableStaff(username) {
    return axiosFetch.put(`${REST_ENDPOINT}/staff/disableStaff/${username}`);
  },
};

export const departmentApi = {
  getAllDepartments() {
    return axiosFetch.get(`${REST_ENDPOINT}/department/getAllDepartments`);
  },
};

export const subDepartmentApi = {
  getSubDepartmentsByDepartment(department) {
    return axiosFetch.get(
      `${REST_ENDPOINT}/subDepartment/getSubDepartmentsByDepartment/${department}`
    );
  },
};

export const facilityApi = {
  getAllFacilitiesByStatus(status){
    return axiosFetch.get(
      `${REST_ENDPOINT}/facility/getAllFacilitiesByFacilityStatus?facilityStatus=${status}`
    );
  },
  getAllFacilitiesByName(name){
    return axiosFetch.get(
      `${REST_ENDPOINT}/facility/getAllFacilitiesByName?name=${name}`
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
  }
};

export const patientApi = {
  getAllPatientsWithElectronicHealthRecordSummaryByName(name) {
    return axiosFetch.get(
      `${REST_ENDPOINT}/patient/getAllPatientsWithElectronicHealthRecordSummaryByName?name=${name}`
    );
  },
};

export const ehrApi = {
  getElectronicHealthRecordByIdAndDateOfBirth(electronicHealthRecordId,dateOfBirth) {
    return axiosFetch.get(
      `${REST_ENDPOINT}/electronicHealthRecord/getElectronicHealthRecordByIdAndDateOfBirth?electronicHealthRecordId=${electronicHealthRecordId}&dateOfBirth=${dateOfBirth}`
    );
  },
};
