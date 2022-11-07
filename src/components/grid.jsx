import { useEffect, useRef, useState } from "react"

const Grid = ({rows, columns}) => {
  const [dataGrid,setDataGrid] = useState([...Array(rows)].map(_=>Array(columns).fill(0))) 
  const [totalClicked, setTotalClicked] = useState(0)

  const handleClick = (r,c) =>{
    const newGrid = [...dataGrid]
    newGrid[r][c] = 15
    setDataGrid(newGrid)
  }

  const createGrid = () => {
    const newGrid = []
    
    for (let c = 0; c < columns; c ++){
      const newRow = []
      for (let r = 0; r < rows; r++){
        const val = dataGrid[r][c]
        newRow.push(<Square key={r.toString()+ ','+c.toString()} value={val} handleClick={()=>handleClick(r,c)}/>)
      }
      newGrid.push(<div className="row" key={c}>{newRow}</div>)
    }
    return newGrid
  }
  const traverseGrid = () => {
    // debugger
    let count = 0
    for(let r = 0; r < dataGrid.length; r++){
      for(let c = 0; c < dataGrid[0].length; c++){
        if (dataGrid[r][c] === 15) count += 1
        
      }
    }
    setTotalClicked(count)
  }

  const disGrid = createGrid()
  return(
    <>
      <div className="grid">{disGrid}</div>
      <h2>Total Clicked: {totalClicked}</h2>
      <button onClick={()=>traverseGrid()}>Traverse</button>
    </>
  )
}

export default Grid

const Square = ({value, handleClick}) => {
  return(
    <div className="square" onClick={handleClick}>{value}</div>
  )
}