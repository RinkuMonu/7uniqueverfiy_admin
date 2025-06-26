import axiosInstance from "@/components/service/axiosInstance";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const AdminSlice = createSlice({
    name: 'admin',
    initialState: {
        admin: null,
        token: null
    },
    reducers: {
        login(state, { payload }) {
            state.token = payload.token
            if (typeof window !== 'undefined') {
                localStorage.setItem('token', payload.token);
            }
        },
        logout(state) {
            state.token = null
            if (typeof window !== 'undefined') {
                localStorage.removeItem('token');
            }
        },
        lsTokenData(state) {
            let token = localStorage.getItem('token');
            state.token = token;
        }
    },
    extraReducers(builder) {
        builder.addCase(fetchAdminDetails.fulfilled, (state, action) => {
            state.admin = action.payload;
        })
    },
})

export const fetchAdminDetails = createAsyncThunk(
    "admin/fetchAdminDetails",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get("/user/details");            
            return response.data.user;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Error fetching admin details");
        }
    }
);

export const { login, lsTokenData, logout } = AdminSlice.actions;
export default AdminSlice.reducer