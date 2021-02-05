import React, { useCallback, useState, useEffect } from "react";
import CalendarItem from './CalendarItem'
import axios from 'axios';
const host = require("../host");

const Calendar = (props) => {

  const date = new Date();
  const getWeek = useCallback((dowOffset) => {
    dowOffset = typeof (dowOffset) == 'number' ? dowOffset : 0;
    var newdate = new Date();
    var newYear = new Date(newdate.getFullYear(), 0, 1);
    var day = newYear.getDay() - dowOffset;
    day = (day >= 0 ? day : day + 7);
    var daynum = Math.floor((newdate.getTime() - newYear.getTime() -
      (newdate.getTimezoneOffset() - newYear.getTimezoneOffset()) * 60000) / 86400000) + 1;
    var weeknum;
    if (day < 4) {
      weeknum = Math.floor((daynum + day - 1) / 7) + 1;
      if (weeknum > 52) {
        let nYear = new Date(newdate.getFullYear() + 1, 0, 1);
        let nday = nYear.getDay() - dowOffset;
        nday = nday >= 0 ? nday : nday + 7;
        weeknum = nday < 4 ? 1 : 53;
      }
    }
    else {
      weeknum = Math.floor((daynum + day - 1) / 7);
    }
    return weeknum;
  });

  const getFirstDay = (year) => {
    return new Date(year, 0, 1).getDay() - 1;
  };

  const todayYear = date.getFullYear(); // 년
  const todayMonth = date.getMonth() + 1; // 월
  const todayDate = date.getDate(); // 날짜
  const todayDay = date.getDay(); // 요일
  const todayWeek = getWeek(getFirstDay(todayYear)); // 몇주차
  const lastDate = new Date(todayYear, todayMonth, 0).getDate();

  const getLastDay = function (year, month) {
    return new Date(year, month, 0).getDay();
  };

  const getLastDate = function (year, month) {
    return new Date(year, month, 0).getDate();
  };

  const getPrevLastDate = function (year, month) {
    if (month === 1) {
      return new Date(year - 1, 12, 0).getDate();
    } else {
      return new Date(year, month - 1, 0).getDate();
    }
  }

  const {calendarData, setCalendarData, calendarSelectData, setIsDetailPopup, setIsListPopup, islogin, setPopupCookingId, setCalendarSelectData } = props;
  const [calendarDateInfo, setCalendarDateInfo] = useState({
    setYear: todayYear,
    setMonth: todayMonth,
    setDay: todayDay,
    setDate: todayDate,
    setWeek: todayWeek,
  });
  const [calendarDateArr, setCalendarDataArr] = useState([]);

  const calendarCalc = useCallback((year, month, day, date) => {
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
    setCalendarDataArr(calendarArr)
  });

  useEffect(() => {
    axios.get(`${host.server}/plan/${calendarDateInfo.setYear}/${calendarDateInfo.setWeek}`, {
      withCredentials: true
    }).then((result) => {
      setCalendarData(result.data)
    }).catch(error => { console.log('failed', error) })

    
  }, [calendarDateInfo])

  useEffect(() => {
    calendarCalc(calendarDateInfo.setYear, calendarDateInfo.setMonth, calendarDateInfo.setDay, calendarDateInfo.setDate);
  }, [calendarData])


  const prevCalendar = useCallback(() => {
    // 1월에서 이전달로 갈시
    if (calendarDateInfo.setDate < 8 && calendarDateInfo.setMonth === 1) {
      setCalendarDateInfo({
        ...calendarDateInfo,
        setYear: calendarDateInfo.setYear - 1,
        setMonth: 12,
        setDate: 31 + (calendarDateInfo.setDate - 7),
        setWeek: 53,
      })
    } else if (calendarDateInfo.setDate < 8) {
      setCalendarDateInfo({
        ...calendarDateInfo,
        setMonth: calendarDateInfo.setMonth - 1,
        setDate: getPrevLastDate(calendarDateInfo.setYear, calendarDateInfo.setMonth) + (calendarDateInfo.setDate - 7),
        setWeek: calendarDateInfo.setWeek - 1,
      })
    } else {
      setCalendarDateInfo({
        ...calendarDateInfo,
        setDate: calendarDateInfo.setDate - 7,
        setWeek: calendarDateInfo.setWeek - 1,
      })
    }
  })

  const nextCalendar = useCallback(() => {
    if (
      calendarDateInfo.setDate > 24
      && calendarDateInfo.setDay !== 6
      && calendarDateInfo.setMonth === 12
    ) {
      setCalendarDateInfo({
        ...calendarDateInfo,
        setYear: calendarDateInfo.setYear + 1,
        setMonth: 1,
        setDate: 1 + (calendarDateInfo.setDate - 25),
        setWeek: 2,
      })
    } else if (
      calendarDateInfo.setDate === 31
      && calendarDateInfo.setDay === 6
      && calendarDateInfo.setMonth === 12
    ) {
      setCalendarDateInfo({
        ...calendarDateInfo,
        setYear: calendarDateInfo.setYear + 1,
        setMonth: 1,
        setDate: 1 + (calendarDateInfo.setDate - 25),
        setWeek: 1,
      })
    } else if (calendarDateInfo.setDate > 24) {
      setCalendarDateInfo({
        ...calendarDateInfo,
        setMonth: calendarDateInfo.setMonth + 1,
        setDate: 7 - getLastDate(calendarDateInfo.setYear, calendarDateInfo.setMonth) + calendarDateInfo.setDate,
        setWeek: calendarDateInfo.setWeek + 1,
      })
    } else {
      setCalendarDateInfo({
        ...calendarDateInfo,
        setDate: calendarDateInfo.setDate + 7,
        setWeek: calendarDateInfo.setWeek + 1,
      })
    }
  })

  const todayCalendar = useCallback(() => {
    setCalendarDateInfo({
      setYear: todayYear,
      setMonth: todayMonth,
      setDay: todayDay,
      setDate: todayDate,
      setWeek: todayWeek,
    });
  })

  return (
    <div className="LineBox">
      <div className="CalendarTitle">
        <button onClick={prevCalendar}>
          <i className="fas fa-chevron-left"></i>
        </button>
        <h2>{calendarDateInfo.setMonth}월 주간 식단표 <button className="Calendar__todayBtn" onClick={todayCalendar}>today</button></h2>
        <button onClick={nextCalendar}>
          <i className="fas fa-chevron-right"></i>
        </button>
      </div>

      <ul className="Calendar">
        
        {
          calendarData
          ? calendarDateArr.map((item, i) => {
            return (
              <CalendarItem
                setIsDetailPopup={setIsDetailPopup}
                setIsListPopup={setIsListPopup}
                date={item}
                week={i}
                key={i}
                setDay={calendarDateInfo.setDay}
                calendarData={calendarData.data[i]}
                fullCalendarData={calendarData}
                setCalendarData={setCalendarData}
                calendarSelectData={calendarSelectData}
                setCalendarSelectData={setCalendarSelectData}
                islogin={islogin}
                setPopupCookingId={setPopupCookingId}
                setYear={calendarDateInfo.setYear}
                setWeek={calendarDateInfo.setWeek}
              />
            )
          })
          :null
        }
      </ul>
    </div>
  );
};

export default Calendar;
