var nodes = [];

export function calculateAStar(mazeState) {
    nodes = [];
    const startNode = mazeState.startNode;
    const targetNode = mazeState.targetNode;
    let openList = [];
    let closedList = [];
    let pathToTarget = [];
    let searchHistory = [];
    
    buildNodeArray(mazeState);
    let nStart = nodes.find(n => (n.x === startNode.x && n.y === startNode.y));
    openList.push(nStart);
    searchHistory.push(nStart);

    while(openList.length > 0) {

        let currentNode = openList.reduce( (prev, curr) => prev.fCost < curr.fCost ? prev : curr );

        let iCurrent = openList.indexOf(currentNode);
        if (iCurrent > -1) {
            openList.splice(iCurrent, 1);
        }

        if (currentNode.x === targetNode.x && currentNode.y === targetNode.y) {
            pathToTarget.push(currentNode);
            searchHistory.push(currentNode);

            while(typeof currentNode.previousNode !== 'undefined') {
                currentNode = currentNode.previousNode;
                pathToTarget.push(currentNode);
                searchHistory.push(currentNode);
            }
            return searchHistory;
        }

        closedList.push(currentNode);
        searchHistory.push(currentNode);

        findAdjacentNodes(currentNode.x, currentNode.y).forEach ( n => {
            if (typeof closedList.find(e => e.x === n.x && e.y === n.y) === 'undefined') {
                let gCostFromCurrent = currentNode.gCost + 1.0;
                let open = openList.find(e => e.x === n.x && e.y === n.y);
                if (typeof open !== 'undefined') {
                    if (gCostFromCurrent < open.gCost) {
                        open.gCost = gCostFromCurrent;
                        open.fCost = open.gCost + open.hCost;
                        open.previousNode = currentNode;
                    }
                } else {
                    n.gCost = gCostFromCurrent;
                    n.fCost = n.gCost + n.hCost;
                    n.previousNode = currentNode;
                    openList.push(n);
                    searchHistory.push(n);
                }
            }
        });
    }
}

function buildNodeArray(mazeState) {

    mazeState.cells.forEach( (yCoord, i) => (
        yCoord.forEach((xCoord, j) => {
            let estimatedTTF = Math.abs(j - mazeState.targetNode.x) + 
                Math.abs(i - mazeState.targetNode.y);   
            
            nodes.push({x: j, y: i, isWall: xCoord.isWall ? true : false, gCost: 0.0, hCost: estimatedTTF, fCost: estimatedTTF, previousNode: undefined});
        })
    ));
}

function findAdjacentNodes(x, y) {
    let adjacent = [];
    nodes.forEach( n => {
        let xDif = n.x - x;
        let yDif = n.y - y;
        if (Math.abs(xDif) < 2 && Math.abs(yDif) < 2) {
            if ((xDif !== 0 || yDif !== 0) && !n.isWall) {
                adjacent.push({...n});
            }
        }
    });
    return adjacent;
}