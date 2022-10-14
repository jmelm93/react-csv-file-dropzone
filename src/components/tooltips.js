import React from 'react'
import Tooltip from '@mui/material/Tooltip';

import ToolTipIcon from '../assets/tool-tip.svg'

const Tooltips = ({...props}) => {
    return (
        <Tooltip id="tooltip-top" title={props.data} placement="top">
            <img src={ToolTipIcon} alt="tool-tip" />
        </Tooltip>
    )
}

export default Tooltips;