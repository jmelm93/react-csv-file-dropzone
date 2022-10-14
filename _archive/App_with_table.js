import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import DataTable from 'react-data-table-component';

function App() {

  const [columns, setColumns] = useState([]);
  const [data, setData] = useState([]);

  // process CSV data
  const processData = dataString => {
    const dataStringLines = dataString.split(/\r\n|\n/);
    const headers = dataStringLines[0].split(/,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/);
    
    const list = [];
    for (let i = 1; i < dataStringLines.length; i++) {
      const row = dataStringLines[i].split(/,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/);
      if (headers && row.length === headers.length) {
        const obj = {};
        for (let j = 0; j < headers.length; j++) {
          let d = row[j];
          if (d.length > 0) {
            if (d[0] === '"')
              d = d.substring(1, d.length - 1);
            if (d[d.length - 1] === '"')
              d = d.substring(d.length - 2, 1);
          }
          if (headers[j]) {
            obj[headers[j]] = d;
          }
        }

        // remove the blank rows
        if (Object.values(obj).filter(x => x).length > 0) {
          list.push(obj);
        }
      }
    }
    
    // prepare columns list from headers
    const columns = headers.map(c => ({
      name: c,
      selector: c,
    }));

    setData(list);
    setColumns(columns);
  }

  // handle file upload
  const handleFileUpload = e => {
    const file = e.target.files[0];
    const reader = new FileReader(); // HTML5 File API to read the file
    
    reader.onload = (e) => { // on successful read - e = event
      /* Parse data */
      const bstr = e.target.result; // bstr = binary string
      const wb = XLSX.read(bstr, { type: 'binary' }); // wb = workbook (raw json objects from the file - can be multiple sheets)
      
      /* Get first worksheet */
      const wsname = wb.SheetNames[0]; // wsname = worksheet name ([0] = first sheet)
      const ws = wb.Sheets[wsname]; // ws = worksheet

      // console.log(ws)

      /* Convert array of arrays */
      const data = XLSX.utils.sheet_to_csv(ws, { header: 1 }); // data = array of arrays

      console.log(data)

      processData(data);
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

      <DataTable
        pagination
        highlightOnHover
        columns={columns}
        data={data}
      />
    </div>
  );
}

export default App;
