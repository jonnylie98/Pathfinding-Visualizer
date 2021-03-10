export function astar(grid, startNode, endNode) {
    // f(n) = g(n) + h(n)
    startNode.gScore = 0;
    startNode.hScore = 0;
    startNode.fScore = 0;

    const openSet = [startNode];
    const visitedNodesInOrder = [startNode];

    while (openSet.length) {
        let lowestIndex = 0;
        for (let i = 1; i < openSet.length; i++) {
            if (openSet[lowestIndex].fScore > openSet[i].fScore) {
                lowestIndex = i;
            }
        }
        const current = openSet[lowestIndex];
        if (current === endNode) {
            visitedNodesInOrder.push(current);
            break;
        }

        openSet.splice(lowestIndex, 1);
        visitedNodesInOrder.push(current);
        current.isVisited = true;

        let neighbors = getNeighbours(current, grid);
        neighbors = neighbors.filter((n) => !n.isWall);
        for (let i = 0; i < neighbors.length; i++) {
            const neighbor = neighbors[i];
            const tempGScore = current.gScore + 1;
            if (openSet.includes(neighbor)) {
                if (tempGScore < neighbor.gScore) {
                    neighbor.gScore = tempGScore;
                }
            } else {
                neighbor.gScore = tempGScore;
                openSet.push(neighbor);
            }

            neighbor.hScore = heuristic(neighbor, endNode);
            neighbor.fScore = neighbor.gScore + neighbor.hScore;
            neighbor.previousNode = current;
        }
    }

    return visitedNodesInOrder;
}

function getNeighbours(node, grid) {
    const neighbours = [];
    const { col, row } = node;
    if (row > 0) neighbours.push(grid[row - 1][col]);
    if (row < grid.length - 1) neighbours.push(grid[row + 1][col]);
    if (col > 0) neighbours.push(grid[row][col - 1]);
    if (col < grid[0].length - 1) neighbours.push(grid[row][col + 1]);
    return neighbours.filter((neighbour) => !neighbour.isVisited);
}


function heuristic(nodeA, nodeB) {
    // find the manhattan distance
    return Math.abs(nodeA.row - nodeB.row) + Math.abs(nodeA.col - nodeB.col)
}