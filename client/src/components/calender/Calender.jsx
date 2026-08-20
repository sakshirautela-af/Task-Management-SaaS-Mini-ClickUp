import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./Calender.css";
export default function CalenderFun() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  return (
    <div className="calendar-page-only-container">
      <div className="calendar-card-only">
        <Calendar
          onChange={setSelectedDate}
          value={selectedDate}
          prev2Label={null}
          next2Label={null}
        />
      </div>
    </div>
  );
}
