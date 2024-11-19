import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { PaginationResult } from "../types/paginationTypes";
import { headerWithToken } from "../../utils/helpers";

interface Ticket {
  id: number;
  subject: string;
  details: string;
  status: string;
  created_at: string;
  updated_at: string;
}

interface AttachmentsState {
  [key: number]: File[];
}

interface TicketPaginationResult extends PaginationResult {
  results: Ticket[]
}

interface SupportState {
  listData: TicketPaginationResult;
  selectedTicket: Ticket | null;
  attachments: AttachmentsState;
  loading: boolean;
  error: string | { detail?: string } | null;
}

// Initial state
const initialState: SupportState = {
  listData: {
    count: 0,
    next: null,
    previous: null,
    results: []
  },
  selectedTicket: null,
  attachments: {},
  loading: false,
  error: null,
};

interface CreateTicketData {
  subject: string;
  details: string;
  status: string;
  customer: string;
  issue_type: string;
}

// Async thunk for fetching tickets
export const fetchTickets = createAsyncThunk(
  'support/fetchTickets',
  async (url: string, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(url, {
        headers: headerWithToken()
      });
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data || 'An unknown error occurred');
    }
  }
);


// Async thunk for fetching a single ticket
export const fetchTicket = createAsyncThunk(
  'support/fetchTicket',
  async (id: number, thunkAPI) => {
    try {
      const response = await axios.get(`/api/tickets/${id}/`);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data || 'An unknown error occurred');
    }
  }
);

// Async thunk for creating a ticket
export const createTicket = createAsyncThunk(
  'support/createTicket',
  async (ticketData: CreateTicketData, thunkAPI) => {
    try {
      const response = await axios.post('/api/tickets/', ticketData, { headers: headerWithToken() });
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data || 'An unknown error occurred');
    }
  }
);


// Async thunk for updating a ticket
export const updateTicket = createAsyncThunk(
  'support/updateTicket',
  async ({ id, updateData }: {
    id: number;
    updateData: Partial<Ticket>
  }, thunkAPI) => {
    try {
      const response = await axios.put(`/api/tickets/${id}/`, updateData);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data || 'An unknown error occurred');
    }
  }
);

// Async thunk for uploading attachment
export const uploadAttachment = createAsyncThunk(
  'support/uploadAttachments',
  async ({ ticketId, file }: { ticketId: number; file: File }, thunkAPI) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('ticket', ticketId.toString());

    try {
      const response = await axios.post(`/api/tickets/${ticketId}/attachments/`, formData, {
        headers: {
          ...{
            'Content-Type': 'multipart/form-data'
          },
          ...headerWithToken()
        }
      });
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data || 'An unknown error occurred');
    }
  }
);

const supportSlice = createSlice({
  name: 'support',
  initialState,
  reducers: {
    setSelectedTicket: (state, action) => {
      state.selectedTicket = action.payload;
    },
    clearSelectedTicket: (state) => {
      state.selectedTicket = null;
    },
    setAttachments: (state, action) => {
      const { ticketId, files } = action.payload;
      state.attachments[ticketId] = files;
    },
    clearAttachments: (state, action) => {
      const ticketId = action.payload;
      delete state.attachments[ticketId];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTickets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTickets.fulfilled, (state, action) => {
        state.loading = false;
        state.listData = action.payload;
      })
      .addCase(fetchTickets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchTicket.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTicket.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedTicket = action.payload;
      })
      .addCase(fetchTicket.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createTicket.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTicket.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(createTicket.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateTicket.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTicket.fulfilled, (state, action) => {
        state.loading = false;
        const updatedTicket = action.payload;
        state.listData.results = state.listData.results.map(ticket =>
          ticket.id === updatedTicket.id ? updatedTicket : ticket
        );
        if (state.selectedTicket?.id === updatedTicket.id) {
          state.selectedTicket = updatedTicket;
        }
      })
      .addCase(updateTicket.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setSelectedTicket,
  clearSelectedTicket,
  setAttachments,
  clearAttachments,
} = supportSlice.actions;

export default supportSlice.reducer;
