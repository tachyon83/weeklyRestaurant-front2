// Calendar.js

import React, { useCallback, useState, useEffect } from "react";
import CalendarItem from "./CalendarItem";
import axios from "axios";
const host = require("../host");

const Calendar = (props) => {
  const date = new Date();

  const getWeek = useCallback((dowOffset = 0) => {
    const newdate = new Date();
    const newYear = new Date(newdate.getFullYear(), 0, 1);
    let day = newYear.getDay() - dowOffset;
    day = day >= 0 ? day : day + 7;
    const daynum =
      Math.floor(
        (newdate.getTime() -
          newYear.getTime() -
          (newdate.getTimezoneOffset() - newYear.getTimezoneOffset()) * 60000) /
          86400000
      ) + 1;
    let weeknum;
    if (day < 4) {
      weeknum = Math.floor((daynum + day - 1) / 7) + 1;
      if (weeknum > 52) {
        const nYear = new Date(newdate.getFullYear() + 1, 0, 1);
        let nday = nYear.getDay() - dowOffset;
        nday = nday >= 0 ? nday : nday + 7;
        weeknum = nday < 4 ? 1 : 53;
      }
    } else {
      weeknum = Math.floor((daynum + day - 1) / 7);
    }
    return weeknum;
  }, []);

  const getFirstDay = (year) => new Date(year, 0, 1).getDay() - 1;

  const todayYear = date.getFullYear();
  const todayMonth = date.getMonth() + 1;
  const todayDate = date.getDate();
  const todayDay = date.getDay();
  const todayWeek = getWeek(getFirstDay(todayYear));
  const lastDate = new Date(todayYear, todayMonth, 0).getDate();

  const getLastDay = (year, month) => new Date(year, month, 0).getDay();
  const getLastDate = (year, month) => new Date(year, month, 0).getDate();
  const getPrevLastDate = (year, month) =>
    month === 1
      ? new Date(year - 1, 12, 0).getDate()
      : new Date(year, month - 1, 0).getDate();

  const {
    setIsLoading,
    calendarData = {},
    setCalendarData,
    calendarSelectData = {},
    setIsDetailPopup,
    setIsListPopup,
    islogin,
    setPopupCookingId,
    setCalendarSelectData,
  } = props;

  const [calendarDateInfo, setCalendarDateInfo] = useState({
    setYear: todayYear,
    setMonth: todayMonth,
    setDay: todayDay,
    setDate: todayDate,
    setWeek: todayWeek,
  });

  const [calendarDateArr, setCalendarDateArr] = useState([]);

  const calendarCalc = useCallback(
    (year, month, day, date) => {
      let calendarArr = [];
      for (let i = 0; i < 7; i++) {
        if (day > i) {
          if (date - day + i <= 0) {
            calendarArr.unshift(getPrevLastDate(year, month) - i);
          } else {
            calendarArr.push(date - day + i);
          }
        } else {
          if (date - day + i > lastDate) {
            calendarArr.push(i - getLastDay(year, month));
          } else {
            calendarArr.push(date - day + i);
          }
        }
      }
      setCalendarDateArr(calendarArr);
    },
    [getLastDay, getPrevLastDate, lastDate]
  );

  useEffect(() => {
    setIsLoading(true);
    axios
      .get(
        `${host.server}/plan/${calendarDateInfo.setYear}/${calendarDateInfo.setWeek}`,
        {
          withCredentials: true,
        }
      )
      .then((result) => {
        console.log(108, calendarDateInfo);
        console.log(109, result, result.data);
        setCalendarData(result.data || {});
        setIsLoading(false);
      })
      .catch((error) => {
        console.log("failed", error);
        setIsLoading(false);
      });
  }, [calendarDateInfo, setCalendarData, setIsLoading]);

  useEffect(() => {
    calendarCalc(
      calendarDateInfo.setYear,
      calendarDateInfo.setMonth,
      calendarDateInfo.setDay,
      calendarDateInfo.setDate
    );
  }, [calendarData, calendarCalc, calendarDateInfo]);

  const prevCalendar = useCallback(() => {
    if (calendarDateInfo.setDate < 8 && calendarDateInfo.setMonth === 1) {
      setCalendarDateInfo({
        ...calendarDateInfo,
        setYear: calendarDateInfo.setYear - 1,
        setMonth: 12,
        setDate: 31 + (calendarDateInfo.setDate - 7),
        setWeek: 53,
      });
    } else if (calendarDateInfo.setDate < 8) {
      setCalendarDateInfo({
        ...calendarDateInfo,
        setMonth: calendarDateInfo.setMonth - 1,
        setDate:
          getPrevLastDate(calendarDateInfo.setYear, calendarDateInfo.setMonth) +
          (calendarDateInfo.setDate - 7),
        setWeek: calendarDateInfo.setWeek - 1,
      });
    } else {
      setCalendarDateInfo({
        ...calendarDateInfo,
        setDate: calendarDateInfo.setDate - 7,
        setWeek: calendarDateInfo.setWeek - 1,
      });
    }
  }, [calendarDateInfo, getPrevLastDate]);

  const nextCalendar = useCallback(() => {
    if (
      calendarDateInfo.setDate > 24 &&
      calendarDateInfo.setDay !== 6 &&
      calendarDateInfo.setMonth === 12
    ) {
      setCalendarDateInfo({
        ...calendarDateInfo,
        setYear: calendarDateInfo.setYear + 1,
        setMonth: 1,
        setDate: 1 + (calendarDateInfo.setDate - 25),
        setWeek: 2,
      });
    } else if (
      calendarDateInfo.setDate === 31 &&
      calendarDateInfo.setDay === 6 &&
      calendarDateInfo.setMonth === 12
    ) {
      setCalendarDateInfo({
        ...calendarDateInfo,
        setYear: calendarDateInfo.setYear + 1,
        setMonth: 1,
        setDate: 1 + (calendarDateInfo.setDate - 25),
        setWeek: 1,
      });
    } else if (calendarDateInfo.setDate > 24) {
      setCalendarDateInfo({
        ...calendarDateInfo,
        setMonth: calendarDateInfo.setMonth + 1,
        setDate:
          7 -
          getLastDate(calendarDateInfo.setYear, calendarDateInfo.setMonth) +
          calendarDateInfo.setDate,
        setWeek: calendarDateInfo.setWeek + 1,
      });
    } else {
      setCalendarDateInfo({
        ...calendarDateInfo,
        setDate: calendarDateInfo.setDate + 7,
        setWeek: calendarDateInfo.setWeek + 1,
      });
    }
  }, [calendarDateInfo, getLastDate]);

  const todayCalendar = useCallback(() => {
    setCalendarDateInfo({
      setYear: todayYear,
      setMonth: todayMonth,
      setDay: todayDay,
      setDate: todayDate,
      setWeek: todayWeek,
    });
  }, [todayDate, todayDay, todayMonth, todayWeek, todayYear]);

  return (
    <div className="LineBox">
      <div className="CalendarTitle">
        <button onClick={prevCalendar}>
          <i className="fas fa-chevron-left"></i>
        </button>
        <h2>
          {calendarDateInfo.setMonth}월 주간 식단표{" "}
          <button className="Calendar__todayBtn" onClick={todayCalendar}>
            today
          </button>
        </h2>
        <button onClick={nextCalendar}>
          <i className="fas fa-chevron-right"></i>
        </button>
      </div>

      <ul className="Calendar">
        {calendarData && calendarData.data && calendarData.data.length
          ? calendarDateArr.map((item, i) => (
              <CalendarItem
                setIsDetailPopup={setIsDetailPopup}
                setIsListPopup={setIsListPopup}
                date={item}
                week={i}
                key={i}
                setDay={calendarDateInfo.setDay}
                calendarData={calendarData.data[i] || {}} // Safely access calendarData.data[i]
                fullCalendarData={calendarData}
                setCalendarData={setCalendarData}
                calendarSelectData={calendarSelectData}
                setCalendarSelectData={setCalendarSelectData}
                islogin={islogin}
                todayDate={todayDate}
                todayMonth={todayMonth}
                todayYear={todayYear}
                setPopupCookingId={setPopupCookingId}
                setYear={calendarDateInfo.setYear}
                setWeek={calendarDateInfo.setWeek}
                setMonth={calendarDateInfo.setMonth}
                setIsLoading={setIsLoading}
              />
            ))
          : []}
      </ul>
    </div>
  );
};

export default Calendar;
