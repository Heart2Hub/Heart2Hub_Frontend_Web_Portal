import { createSlice } from "@reduxjs/toolkit";

const ehrSlice = createSlice({
  name: "ehr",
  initialState: {}, // Initial state is null, indicating no data is stored initially
  reducers: {
    setEHRRecord: (state, action) => {
      // // Set the EHRRecord in the Redux state
      // return action.payload;

      const ehrData = action.payload;
      const necessaryData = {
        electronicHealthRecordId: ehrData.electronicHealthRecordId,
        nric: ehrData.nric,
        firstName: ehrData.firstName,
        lastName: ehrData.lastName,
        dateOfBirth: ehrData.dateOfBirth,
        placeOfBirth: ehrData.placeOfBirth,
        sex: ehrData.sex,
        race: ehrData.race,
        nationality: ehrData.nationality,
        address: ehrData.address,
        contactNumber: ehrData.contactNumber,
        listOfSubsidies: ehrData.listOfSubsidies,
        listOfNextOfKinRecords: ehrData.listOfNextOfKinRecords || [],
        listOfPrescriptionRecords: ehrData.listOfPrescriptionRecords || [],
        listOfProblemRecords: ehrData.listOfProblemRecords || [],
        listOfMedicalHistoryRecords: ehrData.listOfMedicalHistoryRecords || [],
        listOfTreatmentPlanRecords: ehrData.listOfTreatmentPlanRecords || [],
        username: ehrData.username,
        profilePicture: ehrData.profilePicture,
      };
      state.data = necessaryData;
    },
    updateEHRRecord: (state, action) => {
      // Update specific properties of the EHR record based on the action payload
      // return {
      //   ...state,
      //   ...action.payload,
      // };
      state.data = Object.assign({}, state.data, action.payload);
    },
  },
});

export const selectEHRRecord = (state) => state.ehr.data;
export const { setEHRRecord, updateEHRRecord } = ehrSlice.actions;
export default ehrSlice.reducer;
