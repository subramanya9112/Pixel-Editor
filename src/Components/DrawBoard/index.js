import React from 'react';
import './index.scss';

export default function Index({ data, onClick }) {
    return (
        <div className="drawBoard">
            {data.map((value, rowIndex) => {
                return <div
                    key={rowIndex}
                    className="row"
                >
                    {value.map((color, colIndex) => {
                        return <div
                            className="column"
                            draggable="false"
                            style={{ backgroundColor: color[1] }}
                            key={colIndex}
                            onMouseMove={e => {
                                if (e.buttons === 1)
                                    onClick(rowIndex, colIndex);
                            }}
                            onClick={e => onClick(rowIndex, colIndex)}
                        ></div>;
                    })}
                </div>;
            })}
        </div>
    )
}
