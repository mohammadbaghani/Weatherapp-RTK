import * as React from 'react';
import { useState, useEffect } from "react";
import Icon from "react-icons-kit";
import { search } from "react-icons-kit/feather/search";
import { activity } from "react-icons-kit/feather/activity";
import { useDispatch, useSelector } from "react-redux";
import { get5DaysForecast, getCityData, cityByLocation ,get5DaysbyLocation} from "./Store/Slices/WeatherSlice.js";
import Box from '@mui/material/Box';
import { Button, Container, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid2';

function App() {

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    ...theme.applyStyles('dark', {
      backgroundColor: '#1A2027',
    }),
  }));

  const {
    citySearchLoading,
    citySearchData,
    forecastLoading,
    forecastData,
    cityByLocation
  } = useSelector((state) => state.weather);

  const [loadings, setLoadings] = useState(true);

  const allLoadings = [citySearchLoading, forecastLoading];

  useEffect(() => {
    const isAnyChildLoading = allLoadings.some((state) => state);
    setLoadings(isAnyChildLoading);
  }, [allLoadings]);

  const [city, setCity] = useState("tehran");
  const [unit, setUnit] = useState("metric");
  const [lat, setLan] = useState("");
  const [lang, setLang] = useState("");

  const dispatch = useDispatch();

  const fetchData = () => {
    dispatch(
      getCityData({
        city,
        unit,
      })
    ).then((res) => {
      if (!res.payload.error) {
        dispatch(
          get5DaysForecast({
            lat: res.payload.data.coord.lat,
            lon: res.payload.data.coord.lon,
            unit,
          })
        );
      }
    });
  };


  const fetchDataLocation = () => {
    dispatch(
      cityByLocation({
        unit,
        lat,
        lang
      })
    ).then((res) => {
      if (!res.payload.error) {
        dispatch(
          get5DaysbyLocation({
            lat: lat,
            lon: lang,
            unit,
          })
        );
      }
    });
  };

  useEffect(() => {
    fetchData();
  }, [unit]);


  const handleCitySearch = (e) => {
    e.preventDefault();
    setLoadings(true);
    fetchData();
  };


  const handleCityLocation = () => {
    async function success(position) {
      setLang(position.coords.longitude)
      setLan(position.coords.latitude)
      alert(lat)
      alert(lang)
      fetchDataLocation(lat, lang)
    }
    function error() {
      alert(`دریافت نشد`);
    }
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, error);
    } else {
      alert('خطا');
    }
  }

  const filterForecastByFirstObjTime = (forecastData) => {
    if (!forecastData) {
      return [];
    }

    const firstObjTime = forecastData[0].dt_txt.split(" ")[1];
    return forecastData.filter((data) => data.dt_txt.endsWith(firstObjTime));
  };
  const filteredForecast = filterForecastByFirstObjTime(forecastData?.list);
  return (
    <Container style={{ marginTop: 25 }}>
      <div className="background">
        <form autoComplete="off" onSubmit={handleCitySearch}>
          <label>
            <Icon icon={search} size={20} />
          </label>

          <input
            type="text"
            className="city-input"
            placeholder="Enter City"
            required
            value={city}
            onChange={(e) => setCity(e.target.value)}
            readOnly={loadings}
          />
          <Button variant="contained" type="submit">Search</Button>
          <Button variant="contained" onClick={handleCityLocation}>Location</Button>
        </form>



        <div className="current-weather-details-box">

          {citySearchData && citySearchData.data ? (
            <>
              <Box sx={{ flexGrow: 1 }} align='center'>
                <Grid container spacing={2} size={{ xs: 12, lg: 4, sm: 6 }} xsOffset={1} lgOffset={4} smOffset={3} className="but" align='center'>


                  <Grid container size={{ xs: 6 }} className='nim'>
                    <div className="details">
                      <h4 className="city-name">
                        {citySearchData.data.name}
                      </h4>
                      <div className="icon-and-temp">
                        <img
                          src={`https://openweathermap.org/img/wn/${citySearchData.data.weather[0].icon}@2x.png`}
                          alt="icon"
                        />
                      </div>

                      <h4 className="description">
                        {citySearchData.data.weather[0].description}
                      </h4>
                    </div>


                    <div className="metrices">
                      <div className="key-value-box">
                        <div className="key">
                          <Icon
                            icon={activity}
                            size={20}
                            className="icon"
                          />
                        </div>
                      </div>
                    </div>
                  </Grid>



                  <Grid container size={{ xs: 6 }} className='nim'>
                    <h1>{citySearchData.data.main.temp}°</h1>
                  </Grid>


                </Grid>
              </Box>

            </>

          ) : (



            <Box sx={{ flexGrow: 1 }} align='center'>
              <Grid container spacing={2} size={{ xs: 12, lg: 4, sm: 6 }} xsOffset={1} lgOffset={4} smOffset={3} className="but" align='center'>

                <div className="error-msg">No Data Found</div>


              </Grid>
            </Box>




          )}



        </div>





        <Box sx={{ flexGrow: 1 }} align='center'>
          <Grid container spacing={2} size={{ xs: 12, lg: 4, sm: 6 }} xsOffset={1} lgOffset={4} smOffset={3} className="but" align='center'>
            {filteredForecast.length > 0 ? (
              <div className="extended-forecasts-container">
                {filteredForecast.map((data, index) => {
                  const date = new Date(data.dt_txt);
                  const day = date.toLocaleDateString("en-US", {
                    weekday: "short",
                  });
                  return (
                    <>
                      <Grid container size={{ xs: 2 }} className='nim'>
                        <div key={index}>
                          <h5>{day}</h5>
                          <img
                            src={`https://openweathermap.org/img/wn/${data.weather[0].icon}.png`}
                            alt="icon"
                          />
                          <h5>{data.weather[0].description}</h5>
                          <h5 className="min-max-temp">
                            {data.main.temp_max}&deg; /{" "}
                            {data.main.temp_min}&deg;
                          </h5>
                        </div>
                      </Grid>
                    </>

                  );
                })}
              </div>
            ) : (
              <div className="error-msg">No Data Found</div>
            )}
          </Grid>
        </Box>








      </div>
    </Container>
  );
}

export default App;
