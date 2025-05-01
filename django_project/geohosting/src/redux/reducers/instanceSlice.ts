import {
  createAsyncThunk,
  createSlice,
  PayloadAction
} from '@reduxjs/toolkit';
import axios from 'axios';
import { PaginationResult } from "../types/paginationTypes";
import { ReduxState, ReduxStateInit } from "../types/reduxState";
import { headerWithToken } from "../../utils/helpers";
import { Package, Product } from "./productsSlice";
import { SalesOrder, Subscription } from "./ordersSlice";

let _lastAbortController: AbortController | null = null;
const ABORTED = 'Aborted';

export interface Instance {
  id: number,
  url: string,
  name: string,
  status: string,
  price: number,
  cluster: number,
  owner: number,
  product: Product,
  package: Package,
  created_at: string,
  subscription?: Subscription
}

interface InstancePaginationResult extends PaginationResult {
  results: Instance[]
}

interface ListState extends ReduxState {
  data: InstancePaginationResult | null
}

interface NonReturnState extends ReduxState {
  data: null
}

interface DetailState extends ReduxState {
  data: Instance | null
}


interface InstanceState {
  list: ListState;
  create: NonReturnState;
  detail: DetailState;
  update: DetailState;
  delete: NonReturnState;
}

// Initial state
const initialState: InstanceState = {
  list: {
    data: {
      count: 0,
      next: null,
      previous: null,
      results: []
    },
    loading: false,
    error: null,
  },
  create: ReduxStateInit,
  update: ReduxStateInit,
  detail: ReduxStateInit,
  delete: ReduxStateInit,
};

// Async thunk to fetch user instances
export const fetchUserInstances = createAsyncThunk(
  'instance/fetchUserInstances',
  async (url: string, thunkAPI) => {
    try {
      if (_lastAbortController) {
        _lastAbortController.abort();
      }
      const abortController = new AbortController();
      _lastAbortController = abortController;

      const response = await axios.get(url, {
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
export const fetchUserInstanceDetail = createAsyncThunk(
  'instance/fetchUserInstancesDetail',
  async (id: string, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`/api/instances/${id}/`, {
        headers: { Authorization: `Token ${token}` }
      });
      return response.data;
    } catch (error: any) {
      const errorData = error.response.data;
      return thunkAPI.rejectWithValue(errorData);
    }
  }
);

const handlePending = (state: InstanceState, action: PayloadAction<any>) => {
  switch (action.type) {
    case fetchUserInstances.pending.type: {
      state.list.loading = true;
      state.list.error = null;
      break
    }
    case fetchUserInstanceDetail.pending.type: {
      state.detail.loading = true;
      state.detail.error = null;
      break
    }
  }
};

const handleFulfilled = (state: InstanceState, action: PayloadAction<any>) => {
  switch (action.type) {
    case fetchUserInstances.fulfilled.type: {
      state.list.loading = false;
      state.list.data = action.payload;
      break
    }
    case fetchUserInstanceDetail.fulfilled.type: {
      state.detail.loading = false;
      state.detail.data = action.payload;
      break
    }
  }
};

const handleRejected = (state: InstanceState, action: PayloadAction<any>) => {
  switch (action.type) {
    case fetchUserInstances.rejected.type: {
      if (action.payload === ABORTED) {
        return
      }
      state.list.loading = false;
      state.list.error = action.payload as string;
      break
    }
    case fetchUserInstanceDetail.rejected.type: {
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

const instanceSlice = createSlice({
  name: 'instance',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    const actions = [
      fetchUserInstances,
      fetchUserInstanceDetail
    ];

    actions.forEach(action => {
      builder.addCase(action.pending, handlePending);
      builder.addCase(action.fulfilled, handleFulfilled);
      builder.addCase(action.rejected, handleRejected);
    });
  },
});

export default instanceSlice.reducer;
