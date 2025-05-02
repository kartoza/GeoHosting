/**
 * TODO:
 *  We need to create abstract async thunk
 *  As our API are all generic
 * Create an async thunk for generic API
 */
// Async thunk
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { headerWithToken } from "../utils/helpers";
import { ReduxStateInit } from "./types/reduxState";

const ABORTED = 'Aborted';

interface RequestProps {
  list: boolean;
  create: boolean;
  detail: boolean;
  update: boolean;
  delete: boolean;
}

interface LastRequestProps {
  list: AbortController | null;
  create: AbortController | null;
  detail: AbortController | null;
  update: AbortController | null;
  delete: AbortController | null;
}

interface RequestThunkProps {
  list: AsyncThunk | null;
  create: AsyncThunk | null;
  detail: AsyncThunk | null;
  update: AsyncThunk | null;
  delete: AsyncThunk | null;
}

// Initial state
const initialState = {
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
  delete: ReduxStateInit
};

class AsyncThunk {
  /** AsyncThunk gobal API **/

  private name: string;
  private url: string;
  private requests: RequestProps;
  private lastRequest: LastRequestProps = {
    list: null,
    create: null,
    detail: null,
    update: null,
    delete: null
  };
  private requestsThunk: RequestThunkProps = {
    list: null,
    create: null,
    detail: null,
    update: null,
    delete: null
  };


  constructor(name: string, url: string, requests: RequestProps) {
    this.name = name;
    this.url = url;
    this.requests = requests;

    const self = this;
    if (requests.list) {
      // Async thunk to fetch sales order
      // @ts-ignore
      this.requestsThunk.list = createAsyncThunk(
        name + '/List',
        async (url: string, thunkAPI) => {
          try {
            if (self.lastRequest.list) {
              self.lastRequest.list.abort();
            }
            const abortController = new AbortController();
            self.lastRequest.list = abortController;

            const response = await axios.get(url, {
              headers: headerWithToken(),
              signal: abortController.signal,
            });
            return response.data;
          } catch (error: any) {
            // Handle cancel errors
            if (axios.isCancel(error)) {
              return thunkAPI.rejectWithValue(ABORTED);
            }

            const errorData = error.response.data;
            return thunkAPI.rejectWithValue(errorData);
          }
        }
      );
    }
    if (requests.detail) {
      // @ts-ignore
      this.requestsThunk.detail = createAsyncThunk(
        name + '/detail',
        async (id: string, thunkAPI) => {

          try {
            if (self.lastRequest.detail) {
              self.lastRequest.detail.abort();
            }
            const abortController = new AbortController();
            self.lastRequest.detail = abortController;

            const response = await axios.get(url + '/' + id + '/', {
              headers: headerWithToken(),
              signal: abortController.signal,
            });
            return response.data;
          } catch (error: any) {
            // Handle cancel errors
            if (axios.isCancel(error)) {
              return thunkAPI.rejectWithValue(ABORTED);
            }

            const errorData = error.response.data;
            return thunkAPI.rejectWithValue(errorData);
          }
        }
      );
    }
  }
}