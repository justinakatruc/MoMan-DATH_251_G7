'use client';

import Topbar from "@/app/components/Topbar";
import { NativeSelect, NativeSelectOption } from "@/app/components/ui/native-select";
import { EventType } from "@/app/model";
import { useState } from "react";
import { useUserStore } from "../store/useUserStore";
import { redirect } from "next/navigation";

export default function Scheduler() {
    const { user } = useUserStore();
    if (!user) redirect("/login");

    const today = new Date();
    const [currentMonth, setCurrentMonth] = useState(today.getMonth());
    const [currentYear, setCurrentYear] = useState(today.getFullYear());
    const [selectedDate, setSelectedDate] = useState(today.getDate());
    const [events, setEvents] = useState<
                EventType[]
                    >([
                        { date: new Date(currentYear, currentMonth, today.getDate()), title: "Team Meeting", time: "10:00 AM"},
                        { date: new Date(currentYear, currentMonth, today.getDate()), title: "Deadline", time: "10:00 AM"},
                        { date: new Date(currentYear, currentMonth, today.getDate()), title: "Lunch with friends", time: "10:00 AM"},
                        { date: new Date(currentYear, currentMonth, today.getDate()), title: "Doctor Appointment", time: "10:00 AM"},
                        { date: new Date(currentYear, currentMonth, today.getDate()), title: "Company Workshop", time: "10:00 AM"},
                    ]);
    const [eventName, setEventName] = useState("");
    const [eventTime, setEventTime] = useState("");
    const [selectedEvent, setSelectedEvent] = useState<EventType | null>(null);

    
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    
    const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
    
    const startDay = (firstDayOfMonth.getDay() + 6) % 7;
    const totalDays = lastDayOfMonth.getDate();
    
    const lastDayPrevMonth = new Date(currentYear, currentMonth, 0).getDate();
    
    const totalCells = 42;
    const days = Array.from({ length: totalCells}, (_, i) => {
        const dayNum = i - startDay + 1;
    
        if  (dayNum <= 0) {
            return {
                day: lastDayPrevMonth + dayNum,
                type: "prev",
            };
        } else if (dayNum > totalDays) {
            return {
                day: dayNum - totalDays,
                type: "next",
            };
        } else {
            return {
                day: dayNum,
                type: "current",
            };
        }
    });
    
    const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setCurrentMonth(parseInt(e.target.value));
    };
      
    const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setCurrentYear(parseInt(e.target.value));
    };

    const displayDate = selectedDate || today.getDate();

    const selectedEvents = events.filter(
        (event) =>
            event.date.getDate() === displayDate &&
            event.date.getMonth() === currentMonth &&
            event.date.getFullYear() === currentYear
    );
    
    const monthlyEvents = events.filter(
        (event) =>
            event.date.getMonth() === currentMonth &&
            event.date.getFullYear() === currentYear
    );

    const addEvent = () => {
        if (!eventName.trim() || !eventTime.trim()) return;
        const newEvent = {
        date: new Date(currentYear, currentMonth, displayDate),
        title: eventName,
        time: eventTime,
        };
        setEvents([...events, newEvent]);
        setEventName("");
        setEventTime("");
    };
    const deleteEvent = () => {
        if (!selectedEvent) return;

        setEvents(
            events.filter(
            e =>
                !(
                e.title === selectedEvent.title &&
                e.time === selectedEvent.time &&
                e.date.getTime() === selectedEvent.date.getTime()
                )
            )
        );

        setSelectedEvent(null);
    };

    return(
        <>
        {/* PC */}
        <div className="hidden lg:block min-h-screen bg-[#F4F7FD]">
            <div className="space-y-4 flex flex-col">
                {/* Header */}
                <Topbar />

                {/* Body */}
                <div className="flex flex-row gap-x-10 items-top mt-4 px-6">

                    <div className="flex flex-col justify-between items-center">

                        {/* Calendar */}
                        <div className="">

                            {/* Month and Year*/}
                            <div className="flex space-x-4 justify-start mb-5">
                                <NativeSelect 
                                    className="h-12 w-32 rounded-lg bg-white shadow-md/20 text-gray-800 font-inter text-lg hover:bg-gray-100 focus:outline-none"
                                    value={currentMonth}
                                    onChange={handleMonthChange}
                                >
                                    {monthNames.map((month, i) => (
                                        <NativeSelectOption key={i} value={i}>
                                            {month}
                                        </NativeSelectOption>
                                    ))}
                                </NativeSelect>
                                <NativeSelect 
                                    className="h-12 w-32 rounded-lg bg-white shadow-md/20 text-gray-800 font-inter text-lg hover:bg-gray-100 focus:outline-none"
                                    value={currentYear}
                                    onChange={handleYearChange}
                                >
                                    {Array.from({ length: 11 }, (_, i) => currentYear - 5 + i).map((year) => (
                                        <NativeSelectOption key={year} value={year}>
                                            {year}
                                        </NativeSelectOption>
                                    ))}
                                </NativeSelect>
                            </div>

                            {/* Calendar Body */}
                            <div className="bg-white rounded-2xl shadow-md/20 p-4 h-100 w-240">
                                {/* Day of the week */}
                                <div className="grid grid-cols-7 gap-x-9 text-center text-gray-900 font-bold p-4">
                                    {daysOfWeek.map((d) => (
                                        <div key={d}>{d}</div>
                                    ))}
                                </div>

                                {/* Day of month */}
                                <div className="grid grid-cols-7 gap-y-3 text-center">
                                    {days.map((item, i) => (
                                        <button
                                            key={i}
                                            onClick={() => item.type === "current" && setSelectedDate(item.day)}
                                            className={`h-10 w-10 rounded-full flex items-center justify-center transition-colors duration-150 ml-12 cursor-pointer
                                                ${
                                                    item.type === "prev" || item.type === "next"
                                                    ? "text-gray-400"
                                                    : item.day === today.getDate() &&
                                                        currentMonth === today.getMonth() &&
                                                        currentYear === today.getFullYear()
                                                    ? "bg-black text-white font-semibold"
                                                    : selectedDate === item.day && item.type === "current"
                                                    ? "bg-emerald-400 text-white font-semibold"
                                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                                }`}
                                                >
                                                    {item.day}
                                            </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                        
                        {/* Add/Delete Event */}
                        <div className="bg-white rounded-2xl p-6 shadow-md/20 flex w-240">
                            
                            {/* Event Check */}
                            <div className="w-1/2 pr-4 border-r border-black ">
                                <h2 className="text-2xl font-bold text-gray-800 mb-4">Events</h2>
                                <div className="space-y-3 overflow-y-auto max-h-[150px]">
                                {events
                                    .filter((e) => {
                                    const eventDate = new Date(e.date);
                                    return (
                                        eventDate.getDate() === displayDate &&
                                        eventDate.getMonth() === currentMonth &&
                                        eventDate.getFullYear() === currentYear
                                    );
                                    })
                                    .map((e, i) => (
                                    <label key={i} className="flex items-center space-x-3">
                                        <input
                                        type="checkbox"
                                        checked={selectedEvent?.title === e.title && selectedEvent?.date.getTime() === e.date.getTime()}
                                        onChange={() => {
                                            if (e === selectedEvent) setSelectedEvent(null);
                                            else {
                                                setSelectedEvent(e);
                                                setEventName(e.title);
                                                setEventTime(e.time);
                                            }
                                        }}
                                        className="w-5 h-5 cursor-pointer"
                                        />
                                        <div>
                                        <span className="font-medium text-gray-800 text-xl">{e.title}</span>
                                        <span className="text-gray-400 text-sm ml-1">– {e.time}</span>
                                        </div>
                                    </label>
                                    ))}
                                </div>
                            </div>
                            
                            {/* Add/Delete */}
                            <div className="w-1/2 pl-4">
                                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                                    Add / Update
                                </h2>
                                <input
                                    type="text"
                                    placeholder="Event name"
                                    value={eventName}
                                    onChange={(e) => setEventName(e.target.value)}
                                    className="w-full border border-gray-500 rounded-xl p-2 mb-3 focus:outline-none focus:ring-2 focus:ring-emerald-300 bg-gray-100 text-gray-500"
                                />
                                <input
                                    type="text"
                                    placeholder="Timestamp (e.g. 10:00 AM)"
                                    value={eventTime}
                                    onChange={(e) => setEventTime(e.target.value)}
                                    className="w-full border border-gray-500 rounded-xl p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-emerald-300 bg-gray-100 text-gray-500"
                                />
                                <div className="flex space-x-4">
                                    <button
                                        onClick={addEvent}
                                        className="bg-[#07B681] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#059b6f] cursor-pointer"
                                    >
                                        {selectedEvent ? "Update" : "Add"}
                                    </button>
                                    <button
                                        onClick={deleteEvent}
                                        className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg font-semibold hover:bg-gray-400 cursor-pointer"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Event */}
                    <div className="flex flex-col space-y-10">

                        {/* Day Event */}
                        <div className="w-120 h-80 bg-white rounded-2xl shadow-md/20 p-6 mt-17 ml-10">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">
                                {displayDate} {monthNames[currentMonth]}
                            </h2>
                            {selectedEvents.length > 0 ? (
                                <ul className="flex flex-col space-y-3 overflow-y-auto max-h-[200px]">
                                    {selectedEvents.map((event, idx) => (
                                        <li key={idx} className="border border-gray-200 rounded-xl p-4 hover:bg-gray-50">
                                            <h3 className="font-semibold text-lg text-[#07B681]">{event.title}</h3>
                                            <p className="font-inter text-gray-700">{event.time}</p>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-500">No events for this day.</p>
                            )}
                        </div>

                        {/* Month Event */}
                        <div className="w-120 h-80 bg-white rounded-2xl shadow-md/20 p-6 ml-10">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">
                                {monthNames[currentMonth]}
                            </h2>
                            {selectedEvents.length > 0 ? (
                                <ul className="flex flex-col space-y-3 overflow-y-auto max-h-[200px]">
                                    {monthlyEvents.map((event, idx) => (
                                        <li key={idx} className="border border-gray-200 rounded-xl p-4 hover:bg-gray-50">
                                            <p className="text-gray-500 text-sm mb-1">
                                                {event.date.getDate()} {monthNames[event.date.getMonth()]}
                                            </p>
                                            <h3 className="font-semibold text-lg text-[#07B681]">{event.title}</h3>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-500">No events for this month.</p>
                            )}
                        </div>

                    </div>

                </div>

            </div>
        </div>
        
        {/* Mobile */}
        <div className="block lg:hidden min-h-screen bg-[#F4F7FD]">
            <div className="space-y-4 p-5">

                {/* Header */}
                <Topbar />
                
                {/* Body */}
                <div className="flex flex-col justify-between ">

                    {/* Calendar */}
                    <div className="">

                        {/* Month and Year*/}
                        <div className="flex space-x-4 justify-start mb-5">
                            <NativeSelect 
                                className="h-12 w-32 rounded-lg bg-white shadow-md/20 text-gray-800 font-inter text-lg hover:bg-gray-100 focus:outline-none"
                                value={currentMonth}
                                onChange={handleMonthChange}
                            >
                                {monthNames.map((month, i) => (
                                    <NativeSelectOption key={i} value={i}>
                                        {month}
                                    </NativeSelectOption>
                                ))}
                            </NativeSelect>
                            <NativeSelect 
                                className="h-12 w-32 rounded-lg bg-white shadow-md/20 text-gray-800 font-inter text-lg hover:bg-gray-100 focus:outline-none"
                                value={currentYear}
                                onChange={handleYearChange}
                            >
                                {Array.from({ length: 11 }, (_, i) => currentYear - 5 + i).map((year) => (
                                    <NativeSelectOption key={year} value={year}>
                                        {year}
                                    </NativeSelectOption>
                                ))}
                            </NativeSelect>
                        </div>

                        {/* Calendar Body */}
                        <div className="bg-white rounded-2xl shadow-md/20 p-4 h-70 w-full">
                            {/* Day of the week */}
                            <div className="grid grid-cols-7 gap-x-4  text-center text-gray-900 text-sm font-bold p-2">
                                {daysOfWeek.map((d) => (
                                    <div key={d}>{d}</div>
                                ))}
                            </div>

                            {/* Day of month */}
                            <div className="grid grid-cols-7 gap-y-3 text-center mt-2">
                                {days.map((item, i) => (
                                    <button
                                        key={i}
                                        onClick={() => item.type === "current" && setSelectedDate(item.day)}
                                        className={`h-6 w-6 rounded-full flex items-center justify-center transition-colors duration-150 ml-3 cursor-pointer 
                                            ${
                                                item.type === "prev" || item.type === "next"
                                                ? "text-gray-400"
                                                : item.day === today.getDate() &&
                                                currentMonth === today.getMonth() &&
                                                currentYear === today.getFullYear()
                                                ? "bg-black text-white font-semibold text-sm"
                                                : selectedDate === item.day && item.type === "current"
                                                ? "bg-emerald-400 text-white font-semibold text-sm"
                                                : "bg-gray-100 text-gray-700 hover:bg-gray-200 text-sm"
                                            }`}
                                    >
                                        {item.day}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div> 

                    {/* Event */}
                    <div className="flex flex-row space-x-0 mt-12">

                        {/* Day Event */}
                        <div className="w-120 h-50 bg-white rounded-2xl shadow-md/20 p-6 ml-10">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">
                                {displayDate} {monthNames[currentMonth]}
                            </h2>
                            {selectedEvents.length > 0 ? (
                                <ul className="flex flex-col space-y-3 overflow-y-auto max-h-[100px]">
                                    {selectedEvents.map((event, idx) => (
                                        <li key={idx} className="border border-gray-200 rounded-xl p-4 hover:bg-gray-50">
                                            <h3 className="font-semibold text-sm text-[#07B681]">{event.title}</h3>
                                            <p className="font-inter text-gray-700">{event.time}</p>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-500">No events for this day.</p>
                            )}
                        </div>

                        {/* Month Event */}
                        <div className="w-120 h-50 bg-white rounded-2xl shadow-md/20 p-6 ml-10">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">
                                {monthNames[currentMonth]}
                            </h2>
                            {selectedEvents.length > 0 ? (
                                <ul className="flex flex-col space-y-3 overflow-y-auto max-h-[100px]">
                                    {monthlyEvents.map((event, idx) => (
                                        <li key={idx} className="border border-gray-200 rounded-xl p-4 hover:bg-gray-50">
                                            <p className="text-gray-500 text-xs mb-1">
                                                {event.date.getDate()} {monthNames[event.date.getMonth()]}
                                            </p>
                                            <h3 className="font-semibold text-sm text-[#07B681]">{event.title}</h3>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-500">No events for this month.</p>
                            )}
                        </div>

                    </div>                    
                    
                    {/* Add/Delete Event */}
                        <div className="bg-white rounded-2xl p-6 shadow-md/20 flex w-full mt-12">
                            
                            {/* Event Check */}
                            <div className="w-1/2 pr-4 border-r border-black ">
                                <h2 className="text-xl font-bold text-gray-800 mb-4">Events</h2>
                                <div className="space-y-3 overflow-y-auto max-h-[150px]">
                                {events
                                    .filter((e) => {
                                    const eventDate = new Date(e.date);
                                    return (
                                        eventDate.getDate() === displayDate &&
                                        eventDate.getMonth() === currentMonth &&
                                        eventDate.getFullYear() === currentYear
                                    );
                                    })
                                    .map((e, i) => (
                                    <label key={i} className="flex items-center space-x-3">
                                        <input
                                        className="cursor-pointer w-4 h-4"
                                        type="checkbox"
                                        checked={selectedEvent?.title === e.title && selectedEvent?.date.getTime() === e.date.getTime()}
                                        onChange={() => {
                                            if (e === selectedEvent) setSelectedEvent(null);
                                            else {
                                                setSelectedEvent(e);
                                                setEventName(e.title);
                                                setEventTime(e.time);
                                            }
                                        }}
                                        />
                                        <div>
                                        <span className="font-medium text-gray-800 text-md">{e.title}</span>
                                        <span className="text-gray-400 text-xs ml-1">– {e.time}</span>
                                        </div>
                                    </label>
                                    ))}
                                </div>
                            </div>
                            
                            {/* Add/Delete */}
                            <div className="w-1/2 pl-2">
                                <h2 className="text-xl font-bold text-gray-800 mb-4 ml-2">
                                    Add / Update
                                </h2>
                                <input
                                    type="text"
                                    placeholder="Event name"
                                    value={eventName}
                                    onChange={(e) => setEventName(e.target.value)}
                                    className="w-full border border-gray-500 rounded-4xl p-2 mb-3 focus:outline-none focus:ring-2 focus:ring-emerald-300 bg-gray-100 text-gray-500"
                                />
                                <input
                                    type="text"
                                    placeholder="Timestamp (e.g. 10:00 AM)"
                                    value={eventTime}
                                    onChange={(e) => setEventTime(e.target.value)}
                                    className="w-full border border-gray-500 rounded-4xl p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-emerald-300 bg-gray-100 text-gray-500"
                                />
                                <div className="flex space-x-4">
                                    <button
                                    onClick={addEvent}
                                    className="bg-[#07B681] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#059b6f] text-xs"
                                    >
                                    {
                                        selectedEvent ? "Update" : "Add"
                                    }
                                    </button>
                                    <button
                                    onClick={deleteEvent}
                                    className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg font-semibold hover:bg-gray-400 text-xs"
                                    >
                                    Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                </div>
            </div>
        </div>
        </>
    )
}