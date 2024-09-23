import { createAsyncThunk, createSlice, SerializedError } from '@reduxjs/toolkit';

interface ProfileState {
  user: any;
  loading: boolean;
  error: SerializedError | null;
}

const initialState: ProfileState = {
  user: null,
  loading: false,
  error: null,
};

export const fetchUserProfile = createAsyncThunk(
  'profile/fetchUserProfile',
  async () => {
    const response = await fetch('/api/user/profile');
    return response.json();
  }
);

export const updateUserProfile = createAsyncThunk(
  'profile/updateUserProfile',
  async (profileData: any) => {
    const response = await fetch('/api/user/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
    return response.json();
  }
);

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error as SerializedError;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error as SerializedError;
      });
  },
});

export default profileSlice.reducer;
