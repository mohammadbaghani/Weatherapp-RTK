import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { appId, hostName } from "../../API/config";

export const getCityData = createAsyncThunk("city", async (obj) => {
  try {
    const request = await axios.get(
      `${hostName}/data/2.5/weather?q=${obj.city}&units=${obj.unit}&APPID=${appId}`
    );
    const response = await request.data;
    return {
      data: response,
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: error.response.data.message,
    };
  }
});

export const cityByLocation= createAsyncThunk("city", async (obj) => {
  try {
    const request = await axios.get( 
      `${hostName}/data/2.5/weather?lat=${obj.lat}&lon=${obj.lang}&APPID=${appId}&units=${obj.unit}`);   
    const response = await request.data;
    return {
      data: response,
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: error.response.data.message,
    };
  }
});

export const get5DaysForecast = createAsyncThunk("5days", async (obj) => {
  const request = await axios.get(
    `${hostName}/data/2.5/forecast?lat=${obj.lat}&lon=${obj.lon}&units=${obj.unit}&APPID=${appId}`
  );
  const response = await request.data;
  return response;
});

export const get5DaysbyLocation = createAsyncThunk("5days", async (obj) => {
  const request = await axios.get(
    `${hostName}/data/2.5/forecast?lat=${obj.lat}&lon=${obj.lon}&units=${obj.unit}&APPID=${appId}`
  );
  const response = await request.data;
  return response;
});


const weatherSlice = createSlice({
  name: "weather",
  initialState: {
    citySearchLoading: false,
    citySearchData: null,

    forecastLoading: false,
    forecastData: null,
    forecastError: null,

  cityByLocation: null,
cityByLocationLoading: false,  


  },
  extraReducers: (builder) => {
    builder
      .addCase(getCityData.pending, (state) => {
        state.citySearchLoading = true;
        state.citySearchData = null;
      })
      .addCase(getCityData.fulfilled, (state, action) => {
        state.citySearchLoading = false;
        state.citySearchData = action.payload;
      })



    // .addCase(cityByLocation.pending, (state) => {
    // state.cityByLocationLoading= true;
    // state.forecastLoading = true;
    //    state.cityByLocation= null;
    //    })
    //  .addCase(cityByLocation.fulfilled, (state, action) => {
    //   state.cityByLocation= action.payload;
    //     state.cityByLocationLoading =false;
    
    //   })


    //  .addCase(get5DaysbyLocation.pending, (state) => {
    //     state.forecastLoading = true;
    //     state.forecastData = null;
    //     state.forecastError = null;
    //   })
    //   .addCase(get5DaysbyLocation.fulfilled, (state, action) => {
    //     state.forecastLoading = false;
    //     state.forecastData = action.payload;
    //     state.forecastError = null;
    //   })

    //   .addCase(get5DaysbyLocation.rejected, (state, action) => {
    //     state.forecastLoading = false;
    //     state.forecastData = null;
    //     state.forecastError = action.error.message;
    //   })


      .addCase(get5DaysForecast.pending, (state) => {
        state.forecastLoading = true;
        state.forecastData = null;
        state.forecastError = null;
      })
      .addCase(get5DaysForecast.fulfilled, (state, action) => {
        state.forecastLoading = false;
        state.forecastData = action.payload;
        state.forecastError = null;
      })
      .addCase(get5DaysForecast.rejected, (state, action) => {
        state.forecastLoading = false;
        state.forecastData = null;
        state.forecastError = action.error.message;
      });
  },
});

export default weatherSlice.reducer;
