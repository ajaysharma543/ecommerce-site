import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null ,
    isLoggedIn: false,
    role: null,

  },
  reducers: {
    setUser: (state, action) => { 
       state.user = action.payload;
    state.isLoggedIn = true;
        state.role = action.payload.role;
    },
    logoutUser: (state) => {
        state.user = null
        state.isLoggedIn = false;
            state.role = null;

        },
  },
});
export const { setUser, logoutUser } = authSlice.actions;
export default authSlice.reducer;
