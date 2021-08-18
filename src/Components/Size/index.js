import React from 'react';
import { TextField } from '@material-ui/core';
import './index.scss';

export default function Index({ size, setSize }) {
    return (
        <div className="sizeBox">
            <TextField
                label="Height"
                id="standard-size-small"
                defaultValue={size[0]}
                type="number"
                onChange={e => setSize([parseInt(e.target.value), size[1]])} />
            <TextField
                label="Width"
                id="standard-size-small"
                defaultValue={size[1]}
                type="number"
                onChange={e => setSize([size[0], parseInt(e.target.value)])} />
        </div>
    )
}
