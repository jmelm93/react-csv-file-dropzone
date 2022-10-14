import { useState } from 'react';
import { Button, Grid, Typography, Box } from "@mui/material";

import axios from "axios";

import Dropzone from './components/dropzone';
import ProgressCircle from './components/progress';


export default function App() {

  // Headers that need to be in upload files to be valid
  const qaHeaderListTop = ['Keyword', 'Position', 'Search Volume', 'URL'];
  const qaHeaderListBottom = ['Keyword', 'Position', 'Search Volume', 'URL'];

  const [csvFileTop, setCsvFileTop] = useState([]);
  const [csvFileBottom, setCsvFileBottom] = useState([]);
  const [csvValuesTop, setCsvValuesTop] = useState([]);
  const [csvValuesBottom, setCsvValuesBottom] = useState([]);

  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleClear = () => {
    setCsvFileTop([]);
    setCsvFileBottom([]);
    setCsvValuesTop([]);
    setCsvValuesBottom([]);
  }

  // handleSubmit useAxiosPost hook to send data to server
  const handleSubmit = async () => {
    setLoading(true);
    const url = "http://localhost:5000/test-endpoint";
    const payload = { 
      'topHeaders': qaHeaderListTop,
      'bottomHeaders': qaHeaderListBottom,
      'topValues': csvValuesTop,
      'bottomValues': csvValuesBottom,
    };
    
    // check mb of the payload
    const mb = JSON.stringify(payload).length / 1000000;
    console.log('Request payload size: ', mb, 'MB');

    axios.post(url, payload)
      .then((response) => {
        console.log("response: ", response);
        setData(response.data);
        
      })
      .catch((error) => {
        console.log("error: ", error);
        setError(error);
      })
      .finally(() => { // always executed
        setLoading(false);
        setTimeout(() => { // after 10 seconds, clear data and error
          setData(null);
          setError("");
        }
        , 10000); 
      });
  };
  
  const bottomDropzone = (
    <Dropzone 
      setCsvValues={setCsvValuesBottom}
      csvValues={csvValuesBottom}
      qaHeaderList={qaHeaderListBottom}
      csvFile={csvFileBottom}
      setCsvFile={setCsvFileBottom}
      heading="Bottom Dropzone"
      toolTipText="Import CSV files for the bottom section of the report"
    />
  );

  const topDropzone = (
    <Dropzone 
      setCsvValues={setCsvValuesTop}
      csvValues={csvValuesTop}
      qaHeaderList={qaHeaderListTop}
      csvFile={csvFileTop}
      setCsvFile={setCsvFileTop}
      heading="Top Dropzone"
      toolTipText="Import CSV files for the top section of the report"
    />
  );

  return (
    <Grid container spacing={2}>
      {error && <Typography component="div" className="error">{error}</Typography>}
      {data && <Typography component="div">{data.message}</Typography>}
      {loading && <ProgressCircle /> ? 
        <ProgressCircle /> :  
        <Box sx={{ width: '100%' }}> 
          <Box>{topDropzone}</Box> 
          <Box>{bottomDropzone}</Box>
          <Button sx={submitStyles} variant="contained" onClick={() => handleSubmit()}>Submit</Button>
          <Button sx={clearButtonStyles} variant="contained" onClick={() => handleClear()}>Clear</Button>
        </Box> 
      }
    </Grid>
  );
}

const submitStyles = {
  padding: '10px',
  width: '300px',
  height: '50px',
  fontSize: '1.5rem',
  fontWeight: 'bold',
  color: 'white',
  backgroundColor: '#3f51b5',
  borderRadius: '5px',
  '&:hover': { backgroundColor: '#303f9f' }
}

const clearButtonStyles = {
  marginLeft: '20px',
  padding: '10px',
  width: '300px',
  height: '50px',
  fontSize: '1.5rem',
  fontWeight: 'bold',
  color: 'white',
  backgroundColor: '#d32f2f',
  borderRadius: '5px',
  '&:hover': { backgroundColor: '#b71c1c' }
}

  // // if state changes, console log full state
  // useEffect(() => {
  //   console.log("csvValuesTop: ", csvValuesTop);
  // }, [csvValuesTop]);

  // useEffect(() => {
  //   console.log("csvValuesBottom: ", csvValuesBottom);
  // }, [csvValuesBottom]);
