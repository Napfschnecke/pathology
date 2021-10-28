var nodes = [];

/*
    calculate shortest path from start to target using either djkstra (no heuristic) or a*
    option to allow for diagonal traversal
    returns list with all registered nodes to reconstruct search process
*/
export function calculateAStar(mazeState, isDjkstra, allowDiagonals, greedy) {
    nodes = [];
    const startNode = mazeState.startNode;
    const targetNode = mazeState.targetNode;
    let openList = [];
    let closedList = [];
    let pathToTarget = [];
    let searchHistory = [];
    
    buildNodeArray(mazeState, isDjkstra);
    let nStart = nodes.find(n => (n.x === startNode.x && n.y === startNode.y));
    openList.push(nStart);
    searchHistory.push(nStart);

    while(openList.length > 0) {

        //retrieve node with lowest cost from registered nodes
        let currentNode = openList.reduce( (prev, curr) => (prev.fCost < curr.fCost ) && (greedy? prev.fCost + prev.hCost < curr.fCost + curr.hCost : true)? prev : curr );

        //remove current node to avoid circular search
        let iCurrent = openList.indexOf(currentNode);
        if (iCurrent > -1) {
            openList.splice(iCurrent, 1);
        }

        // target reached
        if (currentNode.x === targetNode.x && currentNode.y === targetNode.y) {
            pathToTarget.push(currentNode);
            searchHistory.push(currentNode);

            // backtrace through previous node attribute
            while(typeof currentNode.previousNode !== 'undefined') {
                currentNode = currentNode.previousNode;
                pathToTarget.push(currentNode);
                searchHistory.push(currentNode);
            }
            console.log(`PathLength: ${pathToTarget.length}`)
            console.log(`SearchLength: ${searchHistory.length}`)

            return searchHistory;
        }

        closedList.push(currentNode);
        searchHistory.push(currentNode);

        findAdjacentNodes(currentNode.x, currentNode.y, allowDiagonals).forEach ( n => {
            // if not already checked
            if (typeof closedList.find(e => e.x === n.x && e.y === n.y) === 'undefined') {
                let gCostFromCurrent = currentNode.gCost + 1.0;
                let open = openList.find(e => e.x === n.x && e.y === n.y);
                // if not already registered
                if (typeof open !== 'undefined') {
                    if (gCostFromCurrent < open.gCost) {
                        //update cost in case of new path being shorter
                        open.gCost = gCostFromCurrent;
                        open.fCost = open.gCost + open.hCost;
                        open.previousNode = currentNode;
                    }
                } else {
                    // register new node on openlist
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

/*
    build the array of all potential search nodes
    if djkstra is selected, ignore heuristics
*/
function buildNodeArray(mazeState, isDjkstra) {

    mazeState.cells.forEach( (yCoord, i) => (
        yCoord.forEach((xCoord, j) => {
            if (isDjkstra) {            
                nodes.push({x: j, y: i, isWall: xCoord.isWall ? true : false, gCost: 0.0, hCost: 0.0, fCost: 0.0, previousNode: undefined});
            } else {
                let estimatedTTF = Math.abs(j - mazeState.targetNode.x) + 
                Math.abs(i - mazeState.targetNode.y);   
            
                nodes.push({x: j, y: i, isWall: xCoord.isWall ? true : false, gCost: 0.0, hCost: estimatedTTF, fCost: estimatedTTF, previousNode: undefined});
            }
        })
    ));
}

/*
    find all adjacent nodes to current one
    if diagonal traversal is allowed, expand adjacent nodes by diagonal adjacents
*/
function findAdjacentNodes(x, y, allowDiagonals) {
    let adjacent = [];
    nodes.forEach( n => {
        let xDif = n.x - x;
        let yDif = n.y - y;
        if (allowDiagonals) {
            if (Math.abs(xDif) < 2 && Math.abs(yDif) < 2) {
                if ((xDif !== 0 || yDif !== 0) && !n.isWall) {
                    adjacent.push({...n});
                }
            }
        } else {
            if ((Math.abs(xDif) < 2 && Math.abs(yDif) < 2) && (Math.abs(xDif) + Math.abs(yDif) === 1)) {
                if ((xDif !== 0 || yDif !== 0) && !n.isWall) {
                    adjacent.push({...n});
                }
            }
        }
    });
    return adjacent;
}