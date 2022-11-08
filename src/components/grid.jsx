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
  const [activeButton, setActiveButton] = useState('')

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
      const newRow = []
      for (let r = 0; r < rows; r++){
        const square = <Square 
          key={r.toString()+ ','+c.toString()} 
          state={dataGrid[r][c]} 
          handleClick={()=>handleClick(r,c,activeButton)}
        />
        newRow.push(square)
      }
      newGrid.push(<div className="row" key={c}>{newRow}</div>)
    }
    return newGrid
  }

  const traverseGrid = () => {

    let count = 0
    for(let r = 0; r < dataGrid.length; r++){
      for(let c = 0; c < dataGrid[0].length; c++){
        if (dataGrid[r][c] === 15) count += 1
      }
    }
    setTotalClicked(count)
  }

  const addItemToGrid = (item) => {
    if (item === START) {
      setActiveButton(START)
    }
    else if (item === FINISH) {
      setActiveButton(FINISH)
    }
    else if (item === WALL){
      setActiveButton(WALL)
    }
    // if (item === 'wall') return

  }





  const disGrid = createGrid()
  return(
    <>
      <h2>{activeButton}, Start: {startPosition}, Finish; {finishPosition}</h2>
      <button onClick={() => addItemToGrid(START)}>Pick Start</button>
      <button onClick={() => addItemToGrid(FINISH)}>Pick Finish</button>
      <button onClick={() => addItemToGrid(WALL)}>Add Wall</button>
      <button onClick={() => setActiveButton(EMPTY)}>Remove Wall</button>

      <div className="grid">{disGrid}</div>
      <h2>Total Clicked: {totalClicked}</h2>
      <button onClick={()=>traverseGrid()}>Traverse</button>
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