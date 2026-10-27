
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




function Header({ doneToday, totalHabits }) {
  return (
    <div className="header">
      <h1>Habit Tracker</h1>
      <p className="counter">
        {doneToday} of {totalHabits} habits done today
      </p>
    </div>
  );
}
 
function Button({ children, className, onClick }) {
  return (
    <button className={className} onClick={onClick}>
      {children}
    </button>
  );
}
 
function AddHabitForm({ onAddHabit }) {
  const [name, setName] = useState("");
 
  function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) return;
    onAddHabit(name.trim());
    setName("");
  }
 
  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Add a new habit, e.g. Stretch for 10 minutes"
      />
      <Button className="btn-primary">Add</Button>
    </form>
  );
}
 
function WeekNav({ weekRange, onPrevWeek, onNextWeek }) {
  return (
    <div className="week-nav">
      <button onClick={onPrevWeek}>‹</button>
      <p className="week-label">{weekRange}</p>
      <button onClick={onNextWeek}>›</button>
    </div>
  );
}
 
function HabitGrid({ habits, weekDays, todayKey, onToggleDay, onDeleteHabit }) {
  if (habits.length === 0) {
    return <p className="empty">No habits yet. Add your first one above.</p>;
  }
 
  return (
    <div className="grid-scroll">
      <div className="grid">
        <div className="row row-head">
          <div className="head-label">Habit</div>
 
          {weekDays.map((day) => (
            <div
              key={day.key}
              className={`day ${day.key === todayKey ? "today" : ""}`}
            >
              <span className="day-label">{day.label}</span>
              <span className="day-num">{day.num}</span>
            </div>
          ))}
 
          <div className="head-spacer"></div>
        </div>
 
        {habits.map((habit) => (
          <HabitRow
            key={habit.id}
            habit={habit}
            weekDays={weekDays}
            todayKey={todayKey}
            onToggleDay={onToggleDay}
            onDeleteHabit={onDeleteHabit}
          />
        ))}
      </div>
    </div>
  );
}
 
function HabitRow({ habit, weekDays, todayKey, onToggleDay, onDeleteHabit }) {
  const streak = getStreak(habit.doneDates);
 
  return (
    <div className="row">
      <div className="habit-info">
        <p className="habit-name">{habit.name}</p>
        <p className="streak">🔥 {streak} day streak</p>
      </div>
 
      {weekDays.map((day) => (
        <DayCell
          key={day.key}
          isDone={habit.doneDates.includes(day.key)}
          isToday={day.key === todayKey}
          isFuture={day.key > todayKey}
          onToggle={() => onToggleDay(habit.id, day.key)}
        />
      ))}
 
      <button className="delete-btn" onClick={() => onDeleteHabit(habit.id)}>
        &times;
      </button>
    </div>
  );
}
 
function DayCell({ isDone, isToday, isFuture, onToggle }) {
  let status = "";
  if (isFuture) status = "future";
  else if (isDone) status = "done";
  else if (isToday) status = "today";
 
  return (
    <div className="cell-wrap">
      <button
        className={`cell ${status}`.trim()}
        onClick={onToggle}
        disabled={isFuture}
      >
        {isDone ? "✓" : ""}
      </button>
    </div>
  );
}function Header({ doneToday, totalHabits }) {
  return (
    <div className="header">
      <h1>Habit Tracker</h1>
      <p className="counter">
        {doneToday} of {totalHabits} habits done today
      </p>
    </div>
  );
}
 
function Button({ children, className, onClick }) {
  return (
    <button className={className} onClick={onClick}>
      {children}
    </button>
  );
}
 
function AddHabitForm({ onAddHabit }) {
  const [name, setName] = useState("");
 
  function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) return;
    onAddHabit(name.trim());
    setName("");
  }
 
  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Add a new habit, e.g. Stretch for 10 minutes"
      />
      <Button className="btn-primary">Add</Button>
    </form>
  );
}
 
function WeekNav({ weekRange, onPrevWeek, onNextWeek }) {
  return (
    <div className="week-nav">
      <button onClick={onPrevWeek}>‹</button>
      <p className="week-label">{weekRange}</p>
      <button onClick={onNextWeek}>›</button>
    </div>
  );
}
 
function HabitGrid({ habits, weekDays, todayKey, onToggleDay, onDeleteHabit }) {
  if (habits.length === 0) {
    return <p className="empty">No habits yet. Add your first one above.</p>;
  }
 
  return (
    <div className="grid-scroll">
      <div className="grid">
        <div className="row row-head">
          <div className="head-label">Habit</div>
 
          {weekDays.map((day) => (
            <div
              key={day.key}
              className={`day ${day.key === todayKey ? "today" : ""}`}
            >
              <span className="day-label">{day.label}</span>
              <span className="day-num">{day.num}</span>
            </div>
          ))}
 
          <div className="head-spacer"></div>
        </div>
 
        {habits.map((habit) => (
          <HabitRow
            key={habit.id}
            habit={habit}
            weekDays={weekDays}
            todayKey={todayKey}
            onToggleDay={onToggleDay}
            onDeleteHabit={onDeleteHabit}
          />
        ))}
      </div>
    </div>
  );
}
 
function HabitRow({ habit, weekDays, todayKey, onToggleDay, onDeleteHabit }) {
  const streak = getStreak(habit.doneDates);
 
  return (
    <div className="row">
      <div className="habit-info">
        <p className="habit-name">{habit.name}</p>
        <p className="streak">🔥 {streak} day streak</p>
      </div>
 
      {weekDays.map((day) => (
        <DayCell
          key={day.key}
          isDone={habit.doneDates.includes(day.key)}
          isToday={day.key === todayKey}
          isFuture={day.key > todayKey}
          onToggle={() => onToggleDay(habit.id, day.key)}
        />
      ))}
 
      <button className="delete-btn" onClick={() => onDeleteHabit(habit.id)}>
        &times;
      </button>
    </div>
  );
}
 
function DayCell({ isDone, isToday, isFuture, onToggle }) {
  let status = "";
  if (isFuture) status = "future";
  else if (isDone) status = "done";
  else if (isToday) status = "today";
 
  return (
    <div className="cell-wrap">
      <button
        className={`cell ${status}`.trim()}
        onClick={onToggle}
        disabled={isFuture}
      >
        {isDone ? "✓" : ""}
      </button>
    </div>
  );
}