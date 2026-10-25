import { useState } from "react";


function App() {
  return (
    <div className="app" >
      <Header/> 
      <AddHabitForm/>

        <Button>Button</Button>

      <WeekNav/>
        <HabitGrid/>
          <HabitRow/>
            <DayCell/> 

    </div>
  );
}

export default App;



function Header() { 
    return (
      <div>
        <h1>Habit Tracker</h1>
      </div>
    )
}

function AddHabitForm() { 
    return (
      <div>
        <h1>Habit Tracker</h1>
      </div>
    )
}

function Button({children}) {
  return <button>{children}</button>
  
}


function WeekNav() { 
    return (
      <div>
        <h1>Habit Tracker</h1>
      </div>
    )
}
function HabitGrid() { 
    return (
      <div>
        <h1>Habit Tracker</h1>
      </div>
    )
}
function HabitRow() { 
    return (
      <div>
        <h1>Habit Tracker</h1>
      </div>
    )
}

function DayCell() { 
    return (
      <div>
        <h1>Habit Tracker</h1>
      </div>
    )
}