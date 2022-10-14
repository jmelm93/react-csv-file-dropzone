import React from 'react';
import * as XLSX from 'xlsx';
import processData from './processData';


function App() {

  

  // handle file upload - Time taken to read file: 2.189 seconds
  const handleFileUpload = e => {
    const start_time = new Date().getTime(); // start timer

    const file = e.target.files[0];
    const reader = new FileReader(); // HTML5 File API to read the file
    
    reader.onload = (e) => { // on successful read - e = event
      /* Parse data */
      const bstr = e.target.result; // bstr = binary string
      const wb = XLSX.read(bstr, { type: 'binary' }); // wb = workbook (raw json objects from the file - can be multiple sheets)
      
      /* Get first worksheet */
      const wsname = wb.SheetNames[0]; // wsname = worksheet name ([0] = first sheet)
      const ws = wb.Sheets[wsname]; // ws = worksheet

      /* Convert array of arrays */
      const data = XLSX.utils.sheet_to_csv(ws, { header: 1 }); // data = array of arrays

      console.log(data)

      // end 1st timer
      const end_time = new Date().getTime();

      const processedData = processData(data);
      console.log('processedData', processedData)

      // end 2nd timer
      const end_time2 = new Date().getTime();

      // console log time taken in seconds
      console.log("Time taken to read file: " + (end_time - start_time) / 1000 + " seconds");
      console.log("Time taken to process data: " + (end_time2 - end_time) / 1000 + " seconds");
    };

    reader.readAsBinaryString(file); // read the file 
  }


  return (
    <div>
      <h3>Read CSV file in React</h3>
      <input
        type="file"
        accept=".csv,.xlsx,.xls"
        onChange={handleFileUpload}
      />
    </div>
  );
}

export default App;

// <DataTable
// pagination
// highlightOnHover
// columns={columns}
// data={data}
// />