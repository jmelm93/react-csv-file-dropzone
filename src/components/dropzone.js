import { useState, useEffect, useRef } from 'react';
import * as dfd from "danfojs";
import Tooltips from './tooltips';
import UploadIcon from '../assets/uploadIcon.svg'
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

    const qaDuplicateFile = (fileName) => {
        const listOfFileNames =  csvFile.length > 0 ? csvFile.map(file => file.name) : null; 
        if (listOfFileNames) {
            if (listOfFileNames.includes(fileName)) {
                const msg = `The file ${fileName} was already uploaded. The file was omitted for this reason.`;
                setDuplicateFileMessage(msg);
                // console.log(msg);
                return true;
            }
        } else {
            return false;
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
            const fileName = file.name;
            console.log('index: ', i, 'csvValues.length: ', csvValues.length, 'current job file: ', fileName); // log index, csvValues.length, and current job file
            dfd.readCSV(file).then(df => { // read csv file
                if (!qaHeaderList.every(item => df.columns.includes(item))) { // QA csv columns to ensure they match qaHeaderList
                    setHeaderMismatch(`The file ${fileName} does not have the expected headers. Please upload a file with the headers [ ${qaHeaderList} ].`); // set headerMismatch to msg
                } else {                        
                    let sub_df = df.loc({columns: qaHeaderList}); // subset df to only include columns in qaHeaderList - https://danfo.jsdata.org/api-reference/dataframe/danfo.dataframe.loc
                        setCsvValues(prevState => prevState.concat(sub_df.values)); // add values to csvValues
                        if (!qaDuplicateFile(fileName)) {
                            setCsvFile(prevState => prevState.concat([file])); // add file to csvFile (populates the list of file names uploaded)
                        }
                    }
                }
            );
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
                            {csvFile.length > 0 ? null : 
                                <Box sx={noFilesBoxStyles}>
                                    <CardMedia component="img" sx={{ marginTop: "-15px", width: 30 }} image={UploadIcon} alt="file upload icon" /> 
                                    <CardContent> <Typography component="div" variant="p" sx={{fontSize: '16px', alignItems: 'center'}}>Drag & drop or{" "} <Box component="span" sx={boxSpanStyles}> choose file</Box>.</Typography> </CardContent>
                                </Box>
                            }

                            {/* CONDITIONAL FILE LIST */}
                            {csvValues.length === 0 ? null :
                                <Stack sx={parentBoxStyles} direction="column">
                                    <Typography component="div" variant="p" sx={{fontSize: '16px', alignItems: 'center', marginBottom: '10px'}}>{csvValues.length} Rows & {csvFile.length} {csvFile.length === 1 ? "File" : "Files"} Uploaded</Typography>
                                    <ol className="file-meta">{csvFile.map(item => <li key={item.name} className="file-meta-item"> <Box component={'span'} sx={cardRow} className={`file-name ${item.invalid ? 'file-error' : ''}`}>{item.name}</Box> </li>)}</ol>
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
    // on hover pointer
    '&:hover': {
        cursor: "pointer",
    }
}

const parentBoxStyles = {
    display: "flex",
    alignItems: "center",
    margin: "auto",
    color: "#000639",

    // scroll if too many files
    overflowY: "auto",
    height: "130px",
    maxHeight: "130px",
    width: "100%",
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