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
      <div className="header">
        <h1>Habit Tracker</h1>

        <p className="counter">3 of 5 habits done today</p>

      </div>
    )
}

function AddHabitForm() { 
    return (
      <form className="add-form">
      
          <input type="text" value={""} onChange={""} placeholder="Add a new habit , e.g. stretch for 10 minutes"/>

          <button className="btn-primary"> Add </button>
      </form>
    )
}

function WeekNav() { 
    return (
      <div className="week-nav">
        <button> ‹  </button>
        <p className="week-label">Oct 19 – 25, 2026</p>
        <button>  › </button>
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
        <HabitRow />
        <HabitRow />
        <HabitRow />
        <HabitRow />
        
      </div>
    </div>
  );
}

function HabitRow() {
  return (
    <div className="row">
      <div className="habit-info">
        <p className="habit-name">Working out</p>
        <p className="streak">{"🔥"}3 day streak</p>
      </div>

      {/* <DayCell /> */}

      <button className="delete-btn">&times;</button>
    </div>
    
  );
}


