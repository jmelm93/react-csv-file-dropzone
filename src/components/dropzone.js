import { useState, useEffect, useRef } from 'react';
import * as dfd from "danfojs";
import Tooltips from './tooltips';
import UploadIcon from '../assets/uploadIcon.svg'
import cleanNumbers from '../helpers/cleanNumbers';
import { 
    Box, 
    Card, 
    CardContent, 
    CardMedia, 
    Typography, 
    Container, 
    Tooltip, 
    Grid,
    Stack 
} from "@mui/material";


export default function Dropzone({...props}) {

    const { setCsvValues, csvValues, qaHeaderList, csvFile, setCsvFile, heading, toolTipText } = props;

    const fileInputRef = useRef(); // useRef() is used to reference a DOM element -- used to reference file input 

    // ** LOCAL STATE ** //

    const [headerMismatch, setHeaderMismatch] = useState(false);
    const [duplicateFileMessage, setDuplicateFileMessage] = useState(false);


    // ** EVENT HANDLERS ** //
    
    useEffect(() => {
        if (headerMismatch) {
            setTimeout(() => {
                setHeaderMismatch(false);
            }, 10000);
        }
    }, [headerMismatch]);

    useEffect(() => {
        if (duplicateFileMessage) {
            setTimeout(() => {
                setDuplicateFileMessage(false);
            }, 10000);
        }
    }, [duplicateFileMessage]);


    // ** HELPER FUNCTIONS ** //

    const qaDuplicateFile = (inputFile) => {
        const listOfFileNames =  csvFile.length > 0 ? csvFile.map(file => file.name) : null; 
        console.log('inputfile name: ', inputFile.name);
        if (listOfFileNames) {
            if (listOfFileNames.includes(inputFile.name)) {
                setDuplicateFileMessage(`The file ${inputFile.name} was already uploaded. The file was omitted for this reason.`);
                return true;
            }
        } else {
            return false;
        }
    }

    const qaHeaderListMatch = (dfCols, fileName, qaHeaderList) => {
        if (qaHeaderList.every(item => dfCols.includes(item))) {
            return false;
        } else {
            setHeaderMismatch(`The file ${fileName} does not have the expected headers. Please upload a file with the headers [ ${qaHeaderList} ].`); // set headerMismatch to msg
            return true;
        }
    } 



    // ** DROPZONE FUNCTIONALITY ** //

    const preventDefault = (e) => {  // preventDefault obj
        e.preventDefault(); 
    }

    const dragOver = (e) => {  // using preventDefault() to prevent default behavior of file input
        preventDefault(e);
    }

    const dragEnter = (e) => { // using preventDefault() to prevent default behavior of file input
        preventDefault(e);
    }

    const dragLeave = (e) => { // using preventDefault() to prevent default behavior of file input
        preventDefault(e);
    }

    const fileDrop = (e) => { // fileDrop
        preventDefault(e);
        const files = e.dataTransfer.files; // get files from file input
        if (files.length) { // if files exist
            handleUpload(files); // handle files
        }
    }

    const filesSelected = () => { // filesSelected
        if (fileInputRef.current.files.length) { // if files exist
            handleUpload(fileInputRef.current.files); // handle files
        }
    }

    const fileInputClicked = () => { // fileInputClicked
        fileInputRef.current.click(); // open file input
    }


    // ** HANDLE FILE UPLOAD ** //

    const handleUpload = (listOfFiles) => {
        for (let i = 0; i < listOfFiles.length; i++) { // start at 0 and increment by 1 until i is no longer less than listOfFiles.length
            const file = listOfFiles[i];
            dfd.readCSV(file).then(df => { // read csv file
                console.log('index: ', i, 'File Length: ', df.values.length, 'Job File Name: ', file.name); // log index, csvValues.length, and current job file
                if (qaHeaderListMatch(df.columns, file.name, qaHeaderList) || qaDuplicateFile(file)) { // QA csv columns to ensure they match qaHeaderList and that the file has not already been uploaded
                    return;
                } else {
                    setCsvFile(prevState => prevState.concat([file])); // add file to csvFile (populates the list of file names uploaded)                        
                    let sub_df = df.loc({columns: qaHeaderList}); // subset df to only include columns in qaHeaderList - https://danfo.jsdata.org/api-reference/dataframe/danfo.dataframe.loc
                        setCsvValues(prevState => prevState.concat(sub_df.values)); // add values to csvValues
                }
            });
        }
    }


    return (
        <Grid container sx={{marginTop: '25px'}}>
            <Grid item xs={12}>
                <Box component="span"  sx={{marginBottom: '10px'}}>{ heading } </Box>
                <Box component="span" className="card-title" sx={{float: 'right'}}> <Tooltips data={ toolTipText } /> </Box>
            </Grid>
            <Grid item xs={12}>
                <Tooltip title={ toolTipText } placement="top">
                    <Container sx={{padding: '0px !important', maxWidth: '100% !important'}} onDragOver={dragOver} onDragEnter={dragEnter}  onDragLeave={dragLeave} onDrop={fileDrop}  onClick={fileInputClicked} > 
                        <input hidden ref={ fileInputRef } type="file" multiple onChange={filesSelected} />
                        <Card sx={parentCardStyles}>
                            
                            {/* CONDITIONAL UPLOAD ICON*/}
                            {csvValues.length > 0 ? null : 
                                <Box sx={noFilesBoxStyles}>
                                    <CardMedia component="img" sx={{ marginTop: "-15px", width: 30 }} image={UploadIcon} alt="file upload icon" /> 
                                    <CardContent> <Typography component="div" variant="p" sx={{fontSize: '16px', alignItems: 'center'}}>Drag & drop or{" "} <Box component="span" sx={boxSpanStyles}> choose file</Box>.</Typography> </CardContent>
                                </Box>
                            }

                            {/* CONDITIONAL FILE LIST */}
                            {csvValues.length === 0 ? null :
                                <Stack direction="column" sx={parentBoxStyles}>
                                    <Typography component="div" variant="p" sx={{fontSize: '16px', alignItems: 'center', marginBottom: '10px'}}>{csvFile.length} {csvFile.length === 1 ? "File" : "Files"} ({cleanNumbers(csvValues.length)} Rows) Processed</Typography>
                                    <Box sx={listFilesStyles}>
                                        <ol className="file-meta">{csvFile.map(item => <li key={item.name} className="file-meta-item"> <Box component={'span'} sx={cardRow} className={`file-name ${item.invalid ? 'file-error' : ''}`}>{item.name}</Box> </li>)}</ol>
                                    </Box>
                                </Stack>
                            }
                        </Card>
                    </Container>
                </Tooltip>
            </Grid>
            <Grid item xs={12} sx={belowDropzoneText}>
                {headerMismatch && <Box className="error-message"> {headerMismatch} </Box>}
                {duplicateFileMessage && <Box className="error-message"> {duplicateFileMessage} </Box>}
            </Grid>
        </Grid>
    )
}

const parentCardStyles = {
    display: "flex", 
    marginTop: "10px",
    background: "#edf6fe", 
    borderRadius: "2px",
    paddingTop: "35px", 
    paddingBottom: "30px", 
    '&:hover': {
        cursor: "pointer",
    }
}

const parentBoxStyles = {
    display: "flex",
    alignItems: "center",
    margin: "auto",
    color: "#000639",
    width: "100%",
}

const listFilesStyles = {
    display: "flex",
    // alignItems: "center",
    margin: "auto",
    color: "#000639",

    // scroll if too many files
    overflowY: "auto",
    height: "130px",
    maxHeight: "130px",
}

const noFilesBoxStyles = {
    display: "flex",
    alignItems: "center",
    margin: "auto",
    color: "#000639",
    height: "130px",
    maxHeight: "130px",
}

const boxSpanStyles = {
    textDecoration: "underline", 
    color: "#4242FF"
}

// const nonAuthDropzoneStyles = {
//     opacity: 0.5, 
//     background: '#F8F8F8 !important', 
//     padding: '0px !important'
// }


const cardRow = {
    paddingLeft: "10px",
}

const belowDropzoneText = {
    fontSize: "13px",
    color: "#000639",
    paddingTop: "10px",
    textAlign: "center",
}