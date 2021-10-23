import React from 'react';
import {Table} from  "react-bootstrap";
import {FormControl, FormControlLabel, Radio, RadioGroup} from "@mui/material";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./VisTable.css"
import { calculateAStar } from '../../Utils/astar';

var mouseDown = false;
document.body.onmousedown = function() { 
  mouseDown = true;
}
document.body.onmouseup = function() {
  mouseDown = false;
  
}

class VisTable extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            startNode: {x: -1, y: -1},
            targetNode: {x: -1, y: -1},
            mode: "start",
            cells : [...Array(30)].map( e => Array(40).fill({visited: false, isStart: false, isTarget: false, isPath: false, isWall: false, registered: false}))
        };
      }

    render()  {

        const cells = this.state.cells;

        return (
            <>
                <div className="Radio-buttons" style={{textAlign: 'center'}}>
                        <FormControl component="fieldset">
                            <RadioGroup row aria-label="elements" name="elements" onChange={this.setMode} defaultChecked="start" defaultValue="start">
                                <FormControlLabel value="start"
                                control={
                                <Radio sx={{
                                    color: '#fff',
                                    '&.Mui-checked': {
                                      color: '#36BCEE',
                                    },
                                  }}
                                  />} 
                                  label="Start Node"
                                  sx={{
                                    color: '#fff',
                                  }}/>

                                <FormControlLabel value="target" 
                                control={
                                <Radio sx={{
                                    color: '#fff',
                                    '&.Mui-checked': {
                                      color: '#36BCEE',
                                    },
                                  }}
                                  />} 
                                  label="Target Node"
                                  sx={{
                                    color: '#fff',
                                  }}/>

                                <FormControlLabel value="wall" 
                                control={
                                <Radio sx={{
                                    color: '#fff',
                                    '&.Mui-checked': {
                                      color: '#36BCEE',
                                    },
                                  }}
                                  />} 
                                  label="Walls"
                                  sx={{
                                    color: '#fff',
                                  }}/>
                            </RadioGroup>
                        </FormControl>
                        <button onClick={() => this.clearWalls() } className="buttonClear">Clear Walls</button>
                        <button onClick={() => this.reset() } className="buttonClear">Reset</button>
                        <button onClick={() => this.startAStar()} className="buttonVisualize">Visualize</button>

                </div>
                <Table variant="dark">
                    <tbody>
                        {cells.map((row, rInd) => (
                            <tr key={"row" + rInd}>
                                {row.map( (col, cInd) => (
                                <td key={"col" + cInd} className={`gridCell ${col.isStart ? "startNode" : "defaultNode"} 
                                ${col.isTarget ? "targetNode" : "defaultNode"}
                                ${col.isPath ? "pathNode" : "defaultNode"}
                                ${col.visited ? "visitedNode" : "defaultNode"}
                                ${col.registered ? "registeredNode" : "defaultNode"}
                                ${col.isWall ? "wallNode" : "defaultNode"}`}
                                onClick={() => this.asignEndNodes(cInd, rInd)}
                                onMouseOver={() => this.addWall(cInd, rInd)}></td>
                            ))}
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </>
        )

    }

    clearWalls = () => {
        this.setState(state => ({
            ...state,
            cells: state.cells.map((col, j) => col.map((row, i) => {
                return {...row, isWall: false}
            }))
        }))
    }

    reset = () => {
        this.setState(state => ({
            startNode: {x: -1, y: -1},
            targetNode: {x: -1, y: -1},
            mode: "start",
            cells : [...Array(30)].map( e => Array(40).fill({visited: false, isStart: false, isTarget: false, isPath: false, isWall: false, registered: false}))
        }))
    }

    startAStar = () => {
        let result = calculateAStar(this.state);
        
        result.forEach ( regNode => {
            setTimeout( () => (
                this.setState(state => ({
                    ...state,
                    cells: state.cells.map((yCoord, i) => yCoord.map((xCoord, j) => {
                        let isPath = xCoord.isPath;
                        let visited = xCoord.visited;
                        let registered = xCoord.registered;
                        if (regNode.x === j && regNode.y === i) {
                            if (xCoord.registered) {
                                registered = false;
                                visited = true;
                            } else if (xCoord.visited) {
                                registered = false;
                                visited = false;
                                isPath = true;
                            } else {
                                registered = true;
                            }

                        }
                
                        return {...xCoord, isPath: isPath, visited: visited, registered: registered};
                    }))
                }))
            , 5));
        })

        
        
        
    }

    setMode = v => {
        this.setState(state => ({
            ...state, 
            mode: v.target.value
        }));
    }

    asignEndNodes(x, y){
        if (this.state.mode === "start") {
            this.setState(state => ({
                ...state,
                startNode: {x: x, y: y},
                cells: state.cells.map((yCoord, i) => yCoord.map((xCoord, j) => {
                    if (i === y && j === x) {
                        return {...xCoord, isStart: true}
                    }
                    return {...xCoord, isStart: false}
                }))
            }));
            console.log(`StartNode set to (${x},${y})`);
            return;
        } else if (this.state.mode === "target") {
            this.setState(state => ({
                ...state,
                targetNode: {x: x, y: y},
                cells: state.cells.map((yCoord, i) => yCoord.map((xCoord, j) => {
                    if (i === y && j === x) {
                        return {...xCoord, isTarget: true}
                    }
                    return {...xCoord, isTarget: false}
                }))
            }));
            console.log(`TargetNode set to (${x},${y})`);
            return;
        }
    }

    addWall(x, y){
        if (mouseDown && this.state.mode === "wall") {
            this.setState(state => ({
                ...state,
                cells: state.cells.map((yCoord, i) => yCoord.map((xCoord, j) => {
                    if ((i === y && j === x) && !xCoord.isStart && !xCoord.isTarget) {
                        return {...xCoord, isWall: true}
                    }
                    return xCoord
                }))
            }));
            console.log(`Wall set at (${x},${y})`);
        }
    }
}

export default VisTable