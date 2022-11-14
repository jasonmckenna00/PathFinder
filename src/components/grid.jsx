import { useState } from "react"
import { act } from "react-dom/test-utils"
const START = 'start'
const PATH = 'path'
const FINISH = 'finish'
const EMPTY = 'empty'
const VISITED = 'visited'
const WALL = 'wall'

const Grid = ({rows, columns}) => {
  const [dataGrid,setDataGrid] = useState([...Array(rows)].map(_=>Array(columns).fill(EMPTY))) 
  const [totalClicked, setTotalClicked] = useState(0)
  const [startPosition, setStartPosition] = useState([])
  const [finishPosition, setFinishPosition] = useState([])
  const [activeButton, setActiveButton] = useState('empty')
  const [errorMessage, setErrorMessage] = useState('')
  const [discoveredPath, setDiscoveredPath] = useState([])

  const handleClick = (r,c,activeButton) =>{
    const newGrid = [...dataGrid]
    const pos = JSON.stringify([r,c])
    if (JSON.stringify(startPosition) === pos || JSON.stringify(finishPosition) === pos){
      return
    }
    if (activeButton === START){
      if (startPosition.length) newGrid[startPosition[0]][startPosition[1]] = EMPTY
      setStartPosition([r,c])
    } 
    else if (activeButton === FINISH){
      if (finishPosition.length) newGrid[finishPosition[0]][finishPosition[1]] = EMPTY
      setFinishPosition([r,c])
    }
    else if (activeButton === WALL){
      //do something, not sure if needed. Logic can be elsewhere
    }


    newGrid[r][c] = activeButton
    setDataGrid(newGrid)
  }
  


  const createGrid = () => {
    const newGrid = []
    
    for (let c = 0; c < columns; c ++){
      const newCol = []
      for (let r = 0; r < rows; r++){
        const square = <Square 
          key={r.toString()+ ','+c.toString()} 
          state={dataGrid[r][c]} 
          handleClick={()=>handleClick(r,c,activeButton)}
        />
        newCol.push(square)
      }
      newGrid.push(<div className="column" key={c}>{newCol}</div>)
    }
    return newGrid
  }

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  function animateGraph(row,col,time){

    // for (let row = 0; row < 3; row++){
    //   for (let col = 0; col < 3; col++){
    //     newGrid[row][col] = WALL
    //     console.log(row, col, 'delayed')
    //     await sleep(1500)
    //     setDataGrid(newGrid)
    //     console.log(dataGrid)
    //     delay += 1
    //   }
    // }
  }

  function pathExists(start, finish, neighbors){
    const visited = new Set()
    const queue = [[start[0], start[1],[] ,0]]
    const fin = finish[0] + ',' + finish[1]
    
    const neighborMap = createNeighborMap(neighbors)
    while(queue.length){
      const [row, col, path] = queue.shift()
      const pos = row + ',' + col
      if (pos === fin) return true

      for (let neighbor of neighbors){
        const [r,c] = neighbor
        const neighborPos = r + ',' + c
        const newRow = row + r
        const newCol = col + c
        const inBoundsRow = newRow >= 0 && newRow < dataGrid.length
        const inBoundsCol = newCol >= 0 && newCol < dataGrid[0].length
        const newPos = newRow + ',' + newCol
        if (!(inBoundsCol && inBoundsRow) || visited.has(newPos)) continue
        visited.add(newPos)
        if (dataGrid[newRow][newCol] === WALL) continue
        if (newPos === fin){
          setDiscoveredPath(path)
          return true
        }
        
        queue.push([newRow, newCol,[...path,neighborMap.indexOf(neighborPos)]])
      }
    }
    console.log('cant find, visited: ', visited.size, 'nodes')
    return false
  }

  function createNeighborMap(neighbors){
    const positions = []
    for (let neighbor of neighbors){
      positions.push(neighbor[0] + ',' + neighbor[1])
    }
    return positions
  }

  function recreatePath(neighbors, pathCodes){
    const path = []
    let currentPosition = startPosition
    for (let code of pathCodes){
      const [row, col] = neighbors[code]
      const nextPos = [currentPosition[0] + row, currentPosition[1] + col]
      path.push([nextPos])
    }
    return path
  }

  async function traverseGrid(){
    // setErrorMessage('')
    // if (!startPosition.length || !finishPosition.length){
    //   setErrorMessage('Must have starting and finish position')
    // }
    // let newGrid = [...dataGrid]
    // let delay = 0
    const neighbors = [
      [-1,0], 
     [0,-1],  [0,1],
     [1,0], 
   ]
    const visited = new Set()
    const pathExist = pathExists(startPosition, finishPosition, neighbors)
    if (pathExist){
      const path = recreatePath(neighbors,discoveredPath)
      console.log(path)

    }
  }

  // const addItemToGrid = (item) => {
  //   if (item === START) {
  //     setActiveButton(START)
  //   }
  //   else if (item === FINISH) {
  //     setActiveButton(FINISH)
  //   }
  //   else if (item === WALL){
  //     setActiveButton(WALL)
  //   }
  //   // if (item === 'wall') return

  // }





  const pickOrMove = (placement) => {
    if (placement === START && startPosition.length) return "Move"
    else if (placement === FINISH && finishPosition.length) return "Move"
    return 'Pick'
  }

  const disGrid = createGrid()
  const srtBtn = pickOrMove(START)
  const finBtn = pickOrMove(FINISH)
  return(
    <>
      <h2>{activeButton}, Start: {startPosition}, Finish; {finishPosition}</h2>
      <button onClick={() => setActiveButton(START)}>{srtBtn} Start Position</button>
      <button onClick={() => setActiveButton(FINISH)}>{finBtn} Finish Position</button>
      <button onClick={() => setActiveButton(WALL)}>Add Wall</button>
      <button onClick={() => setActiveButton(EMPTY)}>Remove Wall</button>

      <div className="grid">{disGrid}</div>
      <h2>Total Clicked: {totalClicked}</h2>
      {discoveredPath.length && <h2>Path Length: {discoveredPath.length + 1}</h2>}
      <button onClick={()=>traverseGrid()}>Traverse</button>
      <h2>Error Message: {errorMessage}</h2>
    </>
  )
}

export default Grid

const Square = ({state, handleClick}) => {
  // state = 0, 1, 2, 3  0=blank(untouched), 1 = green(start/path), 2=checkered(finish), 3=gray(visited) 
  // const getColor = () =>{
  //   switch(state){
  //     // case(1): return 'Green';
  //     // case(2): return 'Checkered';
  //     // case(3): return 'Blue';
  //     // case(4): return 'Gray';
  //     case(1): return 'path';
  //     case(2): return 'finish';
  //     case(3): return 'visited';
  //     default: return 'white'
  //   }
  // }

  // const color = getColor()
  return(
    <div className={`square ${state}`} onClick={handleClick}>{state}</div>
  )
}