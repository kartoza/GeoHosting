import { ReduxState, ReduxStateInit } from "../types/reduxState";
import {
  createAsyncThunk,
  createSlice,
  PayloadAction
} from "@reduxjs/toolkit";
import axios from "axios";
import { SalesOrder } from "./ordersSlice";

export interface Subscription {
  id: string,
  current_period_end: string,
  current_period_start: string,
  current_expiry_at: string,
  is_waiting_payment: boolean,
  is_active: boolean,
  payment_method: string,
}


let _lastAbortController: AbortController | null = null;
const ABORTED = 'Aborted';

interface DetailState extends ReduxState {
  data: SalesOrder | null
}

interface SubscriptionState {
  detail: DetailState;
}

// Initial state
const initialState: SubscriptionState = {
  detail: ReduxStateInit,
};

export const fetchSubscriptionDetail = createAsyncThunk(
  'subscription/fetchSubscriptionDetail',
  async (id: string, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`/api/orders/${id}/`, {
        headers: { Authorization: `Token ${token}` }
      });
      return response.data;
    } catch (error: any) {
      const errorData = error.response.data;
      return thunkAPI.rejectWithValue(errorData);
    }
  }
);

const handlePending = (state: SubscriptionState, action: PayloadAction<any>) => {
  switch (action.type) {
    case fetchSubscriptionDetail.pending.type: {
      state.detail.loading = true;
      state.detail.error = null;
      break
    }
  }
};

const handleFulfilled = (state: SubscriptionState, action: PayloadAction<any>) => {
  switch (action.type) {
    case fetchSubscriptionDetail.fulfilled.type: {
      state.detail.loading = false;
      state.detail.data = action.payload;
      break
    }
  }
};

const handleRejected = (state: SubscriptionState, action: PayloadAction<any>) => {
  switch (action.type) {
    case fetchSubscriptionDetail.rejected.type: {
      state.detail.loading = false;
      if (action.payload.detail) {
        state.detail.error = action.payload.detail as string;
      } else {
        state.detail.error = action.payload as string;
      }
      break
    }
  }
};


const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    const actions = [
      fetchSubscriptionDetail
    ];

    actions.forEach(action => {
      builder.addCase(action.pending, handlePending);
      builder.addCase(action.fulfilled, handleFulfilled);
      builder.addCase(action.rejected, handleRejected);
    });
  },
});

export default subscriptionSlice.reducer;
