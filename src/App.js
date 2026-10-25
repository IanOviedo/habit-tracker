import { useState } from "react";


function App() {
  return (
    <div className="app" >
      <div className="card">
        <Header/> 
      <AddHabitForm/>

        {/* <Button>Button</Button> */}

      <WeekNav/>
        <HabitGrid/>
            {/* <DayCell/>  */}
      </div>
      

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
        <h1>HabitGrid</h1>
      </div>
    )
}

function WeekNav() { 
    return (
      <div>
        <h1>WeekNav</h1>
      </div>
    )
}


function HabitGrid() {
  return (
    <div className="grid-scroll">
      <div className="grid">
        <div className="row row-head">
          {/* aquí después: head-label y los días */}
        </div>

        <HabitRow />
      </div>
    </div>
  );
}

function HabitRow() {
  return (
    <div className="row">
      <div className="habit-info">
        <p className="habit-name"></p>
        <p className="streak"></p>
      </div>

      {/* <DayCell /> */}

      <button className="delete-btn">&times;</button>
    </div>
  );
}