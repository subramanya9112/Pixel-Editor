import React from 'react';
import './index.scss';

export default function Index({ colorPalette, selectedColor, setSelected }) {
    return (
        <div className="colorPalette">
            {colorPalette.map((color, index) => (
                <div
                    key={index}
                    className="colorPaletteItem tooltip"
                    style={{ backgroundColor: color[1] }}
                    onClick={() => {
                        selectedColor(color);
                        setSelected(0);
                    }}>
                    <span className="toolTipText">{color[1]}</span>
                </div>
            ))}
        </div>
    )
}
