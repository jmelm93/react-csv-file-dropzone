import { useState, useEffect } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

export default function ProgressCircle(status) {
    const [active, setActive] = useState(false);
    
    useEffect(() => {
        setActive(status);
    }
    , [status]);

    return (
        <Box sx={{ display: 'flex' }}>
            {active ? <CircularProgress /> : null}
        </Box>
    );
}