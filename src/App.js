import { useState, useEffect } from 'react';
import ColorPalette from './Components/ColorPalette';
import DrawBoard from './Components/DrawBoard';
import Header from './Components/Header';
import Size from './Components/Size';
import CreateIcon from '@material-ui/icons/Create';
import ClearIcon from '@material-ui/icons/Clear';
import ClearAllIcon from '@material-ui/icons/ClearAll';
import './App.scss';
const { ipcRenderer } = window.require('electron');

function App() {
  const [size, setSize] = useState([10, 10]);
  const [data, setData] = useState([[]]);
  const [selected, setSelected] = useState(-1);
  const [selectedColor, setSelectedColor] = useState(["0xFF", "#FFFFFF"]);

  useEffect(() => {
    setData(oldData => {
      let newArr = new Array(size[0]);
      for (let i = 0; i < size[0]; i++) {
        newArr[i] = new Array(size[1]);
        for (let j = 0; j < size[1]; j++) {
          newArr[i][j] = ["0xFF", "#FFFFFF"];
        }
      }
      for (let i = 0; i < oldData.length && i < newArr.length; i++) {
        for (let j = 0; j < oldData[i].length && j < newArr[i].length; j++) {
          newArr[i][j] = oldData[i][j];
        }
      }
      return newArr;
    });
  }, [size, setData]);

  useEffect(() => {
    ipcRenderer.on('clearAll', () => {
      setSize([10, 10]);
      let newArr = new Array(10);
      for (let i = 0; i < 10; i++) {
        newArr[i] = new Array(10);
        for (let j = 0; j < 10; j++) {
          newArr[i][j] = ["0xFF", "#FFFFFF"];
        }
      }
      setData(newArr);
    });

    ipcRenderer.on('openData', (e, colorData) => {
      setSize([colorData['size'][0], colorData['size'][1]]);
      setData(colorData['data']);
    });

    return () => {
      ipcRenderer.removeAllListeners('clearAll');
      ipcRenderer.removeAllListeners('openData');
    }
  }, [setSize, setData]);


  useEffect(() => {
    ipcRenderer.on('saveData', (event) => {
      console.log("asfd");
      event.sender.send('saveDataReply', {
        'size': size,
        'data': data
      });
    });

    return () => {
      ipcRenderer.removeAllListeners('saveData');
    }
  }, [size, data]);

  const colorPalette = [
    ["0x00", "#000000"],
    ["0x01", "#0000a8"],
    ["0x02", "#00a800"],
    ["0x03", "#00a8a8"],
    ["0x04", "#a80000"],
    ["0x05", "#a800a8"],
    ["0x06", "#a8a800"],
    ["0x07", "#a8a8a8"],
    ["0x08", "#000057"],
    ["0x09", "#0000ff"],
    ["0x0A", "#00a857"],
    ["0x0B", "#00a8ff"],
    ["0x0C", "#a80057"],
    ["0x0D", "#a800ff"],
    ["0x0E", "#a8a857"],
    ["0x0F", "#a8a8ff"],
    ["0x10", "#005700"],
    ["0x11", "#0057a8"],
    ["0x12", "#00ff00"],
    ["0x13", "#00ffa8"],
    ["0x14", "#a85700"],
    ["0x15", "#a857a8"],
    ["0x16", "#a8ff00"],
    ["0x17", "#a8ffa8"],
    ["0x18", "#005757"],
    ["0x19", "#0057ff"],
    ["0x1A", "#00ff57"],
    ["0x1B", "#00ffff"],
    ["0x1C", "#a85757"],
    ["0x1D", "#a857ff"],
    ["0x1E", "#a8ff57"],
    ["0x1F", "#a8ffff"],
    ["0x20", "#570000"],
    ["0x21", "#5700a8"],
    ["0x22", "#57a800"],
    ["0x23", "#57a8a8"],
    ["0x24", "#ff0000"],
    ["0x25", "#ff00a8"],
    ["0x26", "#ffa800"],
    ["0x27", "#ffa8a8"],
    ["0x28", "#570057"],
    ["0x29", "#5700ff"],
    ["0x2A", "#57a857"],
    ["0x2B", "#57a8ff"],
    ["0x2C", "#ff0057"],
    ["0x2D", "#ff00ff"],
    ["0x2E", "#ffa857"],
    ["0x2F", "#ffa8ff"],
    ["0x30", "#575700"],
    ["0x31", "#5757a8"],
    ["0x32", "#57ff00"],
    ["0x33", "#57ffa8"],
    ["0x34", "#ff5700"],
    ["0x35", "#ff57a8"],
    ["0x36", "#ffff00"],
    ["0x37", "#ffffa8"],
    ["0x38", "#575757"],
    ["0x39", "#5757ff"],
    ["0x3A", "#57ff57"],
    ["0x3B", "#57ffff"],
    ["0x3C", "#ff5757"],
    ["0x3D", "#ff57ff"],
    ["0x3E", "#ffff57"],
    ["0x3F", "#ffffff"],
  ];

  return (
    <div className="App">
      <Header />
      <Size size={size} setSize={setSize} />
      <div className="main">
        <div className="tools">
          <CreateIcon
            className={`toolIcon ${selected === 0 ? 'toolSelected' : ''}`}
            onClick={() => setSelected(0)} />
          <ClearIcon
            className={`toolIcon ${selected === 1 ? 'toolSelected' : ''}`}
            onClick={() => setSelected(1)} />
          <ClearAllIcon
            className={`toolIcon ${selected === 2 ? 'toolSelected' : ''}`}
            onClick={() => {
              setSelected(-1);
              setData(oldData => {
                let newData = oldData.map(row => row.map(col => ["0xFF", "#FFFFFF"]));
                return newData;
              });
            }} />
        </div>
        <ColorPalette
          colorPalette={colorPalette}
          selectedColor={selectedColor}
          setSelectedColor={setSelectedColor}
          setSelected={setSelected} />
        <DrawBoard size={size} data={data} onClick={(i, j) => {
          if (selected === 0) {
            setData(oldData => {
              let newData = oldData.map(row => row.map(col => [col[0], col[1]]))
              newData[i][j] = selectedColor;
              return newData;
            });
          }
          if (selected === 1) {
            setData(oldData => {
              let newData = oldData.map(row => row.map(col => [col[0], col[1]]))
              newData[i][j] = ["0xFF", "#FFFFFF"];
              return newData;
            });
          }
        }} />
      </div>
    </div>
  );
}

export default App;
