export default function processData(dataString) {

    const dataStringLines = dataString.split(/\r\n|\n/); // split the data into lines
    const headers = dataStringLines[0].split(/,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/); // split the first line into headers
    
    const list = []; // create an empty list
    for (let i = 1; i < dataStringLines.length; i++) { // loop through the lines
        const row = dataStringLines[i].split(/,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/); // split the line into columns
        if (headers && row.length === headers.length) { // if the number of columns is the same as the number of headers
            const obj = {}; // create an empty object
            for (let j = 0; j < headers.length; j++) { // loop through the columns
                let d = row[j]; // get the column
                if (d.length > 0) { // if the column is not empty
                    if (d[0] === '"') // if the first character is a double quote
                        d = d.substring(1, d.length - 1); // remove the first and last characters
                    if (d[d.length - 1] === '"') // if the last character is a double quote
                        d = d.substring(d.length - 2, 1); // remove the last character
                }
                if (headers[j]) { // if the header is not empty
                    obj[headers[j]] = d; // add the column to the object
                }
            }
            
            // remove the blank rows
            if (Object.values(obj).filter(x => x).length > 0) { // if the object has any values
                list.push(obj); // add the object to the list   
            }
        }
    }
        
    // return data and headers
    return {list, headers};
}
