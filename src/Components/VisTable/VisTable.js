import React from 'react';
import {Table, ToggleButton, ButtonGroup} from  "react-bootstrap";
import {FormControl, FormControlLabel, FormGroup, Radio, RadioGroup, Switch} from "@mui/material";
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
const timer = ms => new Promise(res => setTimeout(res, ms))


class VisTable extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            startNode: {x: -1, y: -1},
            targetNode: {x: -1, y: -1},
            selectedAlgorithm: 'a*',
            mode: "start",
            diagonals: true,
            greedy: false,
            cells : [...Array(30)].map( e => Array(40).fill({visited: false, isStart: false, isTarget: false, isPath: false, isWall: false, registered: false}))
        };
      }

    render()  {

        const cells = this.state.cells;
        const algoState = this.state.selectedAlgorithm;
        const algos = [{name: 'A*', value: 'a*'}, {name: 'Djkstra', value: 'djkstra'}];
        const diagonals = this.state.diagonals;
        const greedy = this.state.greedy;

        return (
            <>
                <div className="Radio-buttons" style={{textAlign: 'center'}}>

                        <ButtonGroup className="mb-2 algoSelection">
                            {algos.map((alg, idx) => (
                                <ToggleButton
                                    className="algoButton"
                                    key={idx}
                                    id={`algo-${idx}`}
                                    type="radio"
                                    variant="outline-primary"
                                    name="radio"
                                    value={alg.value}
                                    checked={algoState === alg.value}
                                    onChange={(e) => this.setAlgorithm(e.currentTarget.value)}
                                >
                                    {alg.name}
                                </ToggleButton>
                            ))}
                        </ButtonGroup>
                        <FormGroup className={'switchGroup'}
                            sx={{ '&.MuiFormGroup-root': {
                                    display: 'inline-flex',
                                    height: '100px'
                            }
                            }}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        color="primary"
                                        checked={diagonals}
                                        onChange={(e) => this.toggleDiagonals(e.target.value)}
                                    />
                                }
                                label={`Diagonals`}
                                labelPlacement="start"
                                sx={{
                                    color: '#fff',
                                    marginRight: '20px'
                                }}
                            />
                            {algoState === 'a*' ? <FormControlLabel
                                className={'optionalForm'}
                                control={
                                    <Switch
                                        color="primary"
                                        checked={greedy}
                                        onChange={(e) => this.toggleGreedy(e.target.value)}
                                    />
                                }
                                label={`Greedy`}
                                labelPlacement="start"
                                disabled={algoState !== 'a*'}
                                sx={{
                                    color: '#fff',
                                    marginRight: '20px'
                                }}
                            /> : <></>}
                        </FormGroup>


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
                        <button onClick={() => this.startPathfinding()} className="buttonVisualize">Visualize</button>

                </div>
                <Table variant="dark">
                    <tbody>
                        {cells.map((row, rInd) => (
                            <tr key={"row" + rInd}>
                                {row.map( (col, cInd) => (
                                <td key={"col" + cInd} 
                                    className={`gridCell ${this.resolveNodeColor(col)}`}
                                    onClick={() => this.asignEndNodes(cInd, rInd)}
                                    onMouseOver={() => this.addWall(cInd, rInd)}>
                                </td>
                            ))}
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </>
        )

    }

     /*
        toggle diagonal traversal
    */
    toggleDiagonals() {
        console.log(`Diagonals set to: ${!this.state.diagonals}`)
        this.setState(state => ({
            ...state,
            diagonals: !this.state.diagonals
        }));
    }

    /*
        toggle greedy search
    */
    toggleGreedy() {
        console.log(`Greedy set to: ${!this.state.greedy}`)
        this.setState(state => ({
            ...state,
            greedy: !this.state.greedy
        }));
    }


    /*
        set algorithm to use
    */
    setAlgorithm(selection){
        console.log(`Alg set to: ${selection}`)
        this.setState(state => ({
            ...state,
            selectedAlgorithm: selection
        }));
    }

    /*
    assign class according to node state
    */
    resolveNodeColor(node) {
        if (node.isStart) {
            return 'startNode';
        } else if (node.isTarget) {
            return 'targetNode';
        }else if (node.registered) {
            return 'registeredNode';
        }else if (node.visited) {
            return 'visitedNode';
        }else if (node.isPath) {
            return 'pathNode';
        }else if (node.isWall) {
            return 'wallNode';
        }else {
            return 'defaultNode';
        }
    }

    /*
        remove all placed walls
    */
    clearWalls = () => {
        this.setState(state => ({
            ...state,
            cells: state.cells.map((col, j) => col.map((row, i) => {
                return {...row, isWall: false}
            }))
        }))
    }

    /*
        reset the whole board
    */
    reset = () => {
        this.setState(state => ({
            ...state, 
            startNode: {x: -1, y: -1},
            targetNode: {x: -1, y: -1},
            cells : [...Array(30)].map( e => Array(40).fill({visited: false, isStart: false, isTarget: false, isPath: false, isWall: false, registered: false}))
        }))
    }

    /*
        switch node-placing mode
    */
    setMode = v => {
        this.setState(state => ({
            ...state, 
            mode: v.target.value
        }));
    }

    /*
        select and start pathfinding according to selected algorithm
    */
    startPathfinding = () => {
        let result = [];
        switch(this.state.selectedAlgorithm) {
            case 'a*': result = calculateAStar(this.state, false, this.state.diagonals, this.state.greedy); break;
            case 'djkstra': result = calculateAStar(this.state, true, this.state.diagonals, false); break;
            default: result = calculateAStar(this.state, false, this.state.diagonals, this.state.greedy);
        }
        
        this.animateResult(result);
    }

    /*
        animate the searchresults
    */
    async animateResult(result) {
        let speed = 10;
        for (let i = 0; i < result.length; i += speed) {
            if ((result.length - i) < 10) {
                speed = result.length - i;
            }
            let toUpdate = [];
            for (let k = i; k < i + speed; k++) {
                toUpdate.push(result[k])
            }

            this.setState(state => ({
                ...state,
                cells: this.batchUpdateMaze(state.cells, toUpdate)
            }))
            await timer(5);
        }
    }

    batchUpdateMaze(cells, nodes) {

        nodes.forEach( n => {
            let targetCell = cells[n.y][n.x];
            let visited = targetCell.visited;
            let registered = targetCell.registered;

            if (registered) {
                targetCell.visited = true;
                targetCell.registered = false;
            } else if (visited) {
                targetCell.registered = false;
                targetCell.visited = false;
                targetCell.isPath = true;
            } else {
                targetCell.registered = true;
            }
            cells[n.y][n.x] = targetCell;
        })
        return cells;
    }

    /*
        assign start or end node
    */
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

    /*
        place walls by dragging clicked mouse over
    */
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