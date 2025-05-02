import { ReduxState, ReduxStateInit } from "../types/reduxState";
import {
  createAsyncThunk,
  createSlice,
  PayloadAction
} from "@reduxjs/toolkit";
import axios from "axios";
import { headerWithToken } from "../../utils/helpers";

export interface AddressDetail {
  city: string,
  country: string,
  line1: string,
  line2: string,
  postal_code: string,
  state: string
}

export interface CardDetail {
  brand: "visa",
  exp_month: number,
  exp_year: number,
  last4: string
}

export interface BillingDetail {
  email: string,
  name: string,
  address?: AddressDetail
  card?: CardDetail,
}

export interface AbstractSubscriptionDetail {
  current_period_end: string,
  current_period_start: string,
  current_expiry_at: string,
  is_active: boolean,
}

export interface SubscriptionDetail extends AbstractSubscriptionDetail {
  billing_detail: BillingDetail,
  is_waiting_payment: boolean,
  amount: number,
  currency: string,
  period: string
  billing_type: string
}

export interface Subscription extends AbstractSubscriptionDetail {
  id: string,
  is_waiting_payment: boolean,
  payment_method: string,
  detail?: SubscriptionDetail,
}


let _lastAbortController: AbortController | null = null;
const ABORTED = 'Aborted';

interface DetailState extends ReduxState {
  data: Subscription | null
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
      if (_lastAbortController) {
        _lastAbortController.abort();
      }
      const abortController = new AbortController();
      _lastAbortController = abortController;

      const response = await axios.get(`/api/subscription/${id}/`, {
        headers: headerWithToken(),
        signal: abortController.signal
      });
      return response.data;
    } catch (error: any) {

      // Handle cancel errors
      if (axios.isCancel(error)) {
        return thunkAPI.rejectWithValue(ABORTED);
      }

      return thunkAPI.rejectWithValue(
        error.response?.data || 'An error occurred while fetching instances'
      );
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
