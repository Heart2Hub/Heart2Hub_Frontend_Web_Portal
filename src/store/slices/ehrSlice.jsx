import { createSlice } from '@reduxjs/toolkit';

const ehrSlice = createSlice({
  name: 'ehr',
  initialState: null, // Initial state is null, indicating no data is stored initially
  reducers: {
    setEHRRecord: (state, action) => {
      // Set the EHRRecord in the Redux state
      return action.payload;
    },
  },
});

export const selectEHRRecord = (state) => state.ehr.data;
export const { setEHRRecord } = ehrSlice.actions;
export default ehrSlice.reducer;