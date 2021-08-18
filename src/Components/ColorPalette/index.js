import React from 'react';
import './index.scss';

export default function Index({ colorPalette, selectedColor, setSelectedColor, setSelected }) {
    return (
        <div className="colorPalette">
            {colorPalette.map((color, index) => (
                <div
                    key={index}
                    className={`colorPaletteItem tooltip ${color[0] === selectedColor[0] ? "selected" : ""}`}
                    style={{ backgroundColor: color[1] }}
                    onClick={() => {
                        setSelectedColor(color);
                        setSelected(0);
                    }}>
                    <span className="toolTipText">{color[1]}</span>
                </div>
            ))}
        </div>
    )
}
