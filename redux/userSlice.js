import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
  name: 'user',
  initialState: {},
  reducers: {
    // cacheUser: (state, action) => {
    //   state[action.payload.userId] = action.payload.userData;
    // }
  }
});

export const { cacheUser } = userSlice.actions;

export const selectUser = (state, userId) => state.user[userId];

export default userSlice.reducer;
