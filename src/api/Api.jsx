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
  createStaff(staff, subDepartment) {
    return axiosFetch.post(
      `${REST_ENDPOINT}/staff/createStaff/${subDepartment}`,
      staff
    );
  },
  getStaffRoles() {
    return axiosFetch.get(`${REST_ENDPOINT}/staff/getStaffRoles`);
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
      `${REST_ENDPOINT}/sub-department/getSubDepartmentsByDepartment/${department}`
    );
  },
};
