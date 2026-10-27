
import { useState } from "react";
 
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAY_NAMES = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
 
// ===== Helpers =====
 
// "YYYY-MM-DD" in local time (no toISOString, it uses UTC)
function toKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
 
// The 7 days (Mon to Sun) of the visible week
function getWeekDays(weekOffset) {
  const today = new Date();
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((today.getDay() + 6) % 7) + weekOffset * 7);
 
  return DAY_NAMES.map((label, i) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    return { label, num: date.getDate(), key: toKey(date) };
  });
}
 
// "Oct 19 – 25, 2026"
function getWeekRange(weekOffset) {
  const today = new Date();
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((today.getDay() + 6) % 7) + weekOffset * 7);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
 
  const start = `${MONTHS[monday.getMonth()]} ${monday.getDate()}`;
  const sameMonth = monday.getMonth() === sunday.getMonth();
  const end = sameMonth ? `${sunday.getDate()}` : `${MONTHS[sunday.getMonth()]} ${sunday.getDate()}`;
  return `${start} – ${end}, ${sunday.getFullYear()}`;
}
 
// Consecutive done days going back from today (or from yesterday if today isn't done)
function getStreak(doneDates) {
  const cursor = new Date();
  if (!doneDates.includes(toKey(cursor))) {
    cursor.setDate(cursor.getDate() - 1);
  }
  let streak = 0;
  while (doneDates.includes(toKey(cursor))) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}


function App() {
  const [habits, setHabits] = useState([
    { id: 1, name: "Exercise", doneDates: [] },
    { id: 2, name: "Read 20 pages", doneDates: [] },
    { id: 3, name: "Study React", doneDates: [] },
  ]);
  const [weekOffset, setWeekOffset] = useState(0);
 
  // Derived state
  const todayKey = toKey(new Date());
  const weekDays = getWeekDays(weekOffset);
  const weekRange = getWeekRange(weekOffset);
  const totalHabits = habits.length;
  const doneToday = habits.filter((h) => h.doneDates.includes(todayKey)).length;
 
  function handleAddHabit(name) {
    setHabits((habits) => [...habits, { id: Date.now(), name, doneDates: [] }]);
  }
 
  function handleToggleDay(id, dateKey) {
    setHabits((habits) =>
      habits.map((habit) =>
        habit.id === id
          ? {
              ...habit,
              doneDates: habit.doneDates.includes(dateKey)
                ? habit.doneDates.filter((d) => d !== dateKey)
                : [...habit.doneDates, dateKey],
            }
          : habit
      )
    );
  }
 
  function handleDeleteHabit(id) {
    setHabits((habits) => habits.filter((habit) => habit.id !== id));
  }
 
  return (
    <div className="app">
      <div className="card">
        <Header doneToday={doneToday} totalHabits={totalHabits} />
        <AddHabitForm onAddHabit={handleAddHabit} />
        <WeekNav
          weekRange={weekRange}
          onPrevWeek={() => setWeekOffset((w) => w - 1)}
          onNextWeek={() => setWeekOffset((w) => w + 1)}
        />
        <HabitGrid
          habits={habits}
          weekDays={weekDays}
          todayKey={todayKey}
          onToggleDay={handleToggleDay}
          onDeleteHabit={handleDeleteHabit}
        />
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
  <div className="head-label">Habit</div>

  <div className="day">
    <span className="day-label">Mon</span>
    <span className="day-num">19</span>
  </div>

  <div className="day">
    <span className="day-label">Tue</span>
    <span className="day-num">19</span>
  </div>

  <div className="day">
    <span className="day-label">Wed</span>
    <span className="day-num">19</span>
  </div>

  <div className="day">
    <span className="day-label">Thu</span>
    <span className="day-num">19</span>
  </div>

  <div className="day">
    <span className="day-label">Fri</span>
    <span className="day-num">19</span>
  </div>
  {/* Tue, Wed, Thu, Fri */}
  <div className="day">
    <span className="day-label">Sat</span>
    <span className="day-num">24</span>
  </div>
  <div className="day today">
    <span className="day-label">Sun</span>
    <span className="day-num">25</span>
  </div>

  <div className="head-spacer"></div>
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

      <DayCell /> 
       <DayCell /> 
        <DayCell /> 
         <DayCell /> 
          <DayCell /> 
           <DayCell /> 
            <DayCell /> 

      <button className="delete-btn">&times;</button>
    </div>
    
  );
}

function DayCell() {
  return (
    <div className="cell-wrap">
      <button className="cell done">✓</button>
    </div>
  );
}
