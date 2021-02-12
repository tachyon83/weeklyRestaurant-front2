import React, { useCallback, useState, useEffect } from "react";
import axios from 'axios';
const host = require("../host");

const weekArr = ["일", "월", "화", "수", "목", "금", "토"];
const emptyImage = ["fa-utensils", "fa-cheese", "fa-hamburger", "fa-fish", "fa-ice-cream", "fa-apple-alt", "fa-carrot", "fa-hotdog", "fa-egg", "fa-cookie-bite"];
const randomImageNumber = () => {
    return Math.floor(Math.random() * 10);
}

const CalendarItem = (props = null) => {
  const {setIsLoading, todayYear,todayMonth,todayDate,setMonth, fullCalendarData, calendarData, setCalendarData, calendarSelectData, setIsDetailPopup, setIsListPopup, date, week, setYear, setWeek, setDay, islogin, setPopupCookingId, setCalendarSelectData } = props;

  return (
    <li
      className={ todayYear === setYear && todayMonth === setMonth && todayDate === date ? "Calendar__item active" : "Calendar__item"}
    >
      <div className="Calendar__day">
        <span>{weekArr[week]}</span>
        <b>{date}</b>
      </div>
      <div className="Calendar__menu">
        <div className="Calendar__section CalendarMenu">
          <div className="CalendarMenu__tag">
            <span>아침</span>
          </div>
          {
            (calendarData[0] && calendarData[0].id)
            ? <CalendarItemContent 
                name={calendarData[0].name}
                id={calendarData[0].id}
                img={calendarData[0].img}
                setIsDetailPopup={setIsDetailPopup}
                setPopupCookingId={setPopupCookingId}
                islogin={islogin}
                fullCalendarData={fullCalendarData}
                setCalendarData={setCalendarData} 
                calendarSelectData={calendarSelectData}
                setCalendarSelectData={setCalendarSelectData} 
                eatTime={0} 
                week={week} 
                setYear={setYear}
                setWeek={setWeek} 
                setIsLoading={setIsLoading}
              /> 
            : islogin 
              ? <CalendarItemAdd 
                  setIsListPopup={setIsListPopup} 
                  setCalendarSelectData={setCalendarSelectData} 
                  eatTime={0} 
                  week={week} 
                  setYear={setYear}
                  setWeek={setWeek} 
                /> 
              : <CalendarItemEmpty />
          }
        </div>
        <div className="Calendar__section CalendarMenu">
          <div className="CalendarMenu__tag">
            <span>점심</span>
          </div>
          {
            (calendarData[1] && calendarData[1].id)
            ? <CalendarItemContent 
                name={calendarData[1].name}
                id={calendarData[1].id}
                img={calendarData[1].img}
                setIsDetailPopup={setIsDetailPopup}
                setPopupCookingId={setPopupCookingId}
                islogin={islogin}
                fullCalendarData={fullCalendarData}
                setCalendarData={setCalendarData} 
                calendarSelectData={calendarSelectData}
                setCalendarSelectData={setCalendarSelectData} 
                eatTime={1} 
                week={week} 
                setYear={setYear}
                setWeek={setWeek} 
                setIsLoading={setIsLoading}
              /> 
            : islogin 
              ? <CalendarItemAdd 
                  setIsListPopup={setIsListPopup} 
                  setCalendarSelectData={setCalendarSelectData} 
                  eatTime={1} 
                  week={week} 
                  setYear={setYear}
                  setWeek={setWeek} 
                /> 
              : <CalendarItemEmpty />
          }
        </div>
        <div className="Calendar__section CalendarMenu">
          <div className="CalendarMenu__tag">
            <span>저녁</span>
          </div>
          {
            (calendarData[2] && calendarData[2].id)
            ? <CalendarItemContent 
                name={calendarData[2].name}
                id={calendarData[2].id}
                img={calendarData[2].img}
                setIsDetailPopup={setIsDetailPopup}
                setPopupCookingId={setPopupCookingId}
                islogin={islogin}
                fullCalendarData={fullCalendarData}
                setCalendarData={setCalendarData} 
                calendarSelectData={calendarSelectData}
                setCalendarSelectData={setCalendarSelectData} 
                eatTime={2} 
                week={week} 
                setYear={setYear}
                setWeek={setWeek} 
                setIsLoading={setIsLoading}
              /> 
            : islogin 
              ? <CalendarItemAdd 
                  setIsListPopup={setIsListPopup} 
                  setCalendarSelectData={setCalendarSelectData} 
                  eatTime={2} 
                  week={week} 
                  setYear={setYear}
                  setWeek={setWeek} 
                /> 
              : <CalendarItemEmpty />
          }
        </div>
      </div>
    </li>
  );
};


const CalendarItemEmpty = (props) => {
  return (
    <div className="CalendarMenu__empty">
      <i className={`fas ${emptyImage[randomImageNumber()]}`}></i>
    </div>
  )
}

const CalendarItemAdd = (props) => {
  const { setIsListPopup, setCalendarSelectData, eatTime, week, setYear, setWeek } = props;

  const handleShowList = useCallback(() => {
    setIsListPopup(true);
    setCalendarSelectData({
      year: setYear,
      week: setWeek,
      planWeek: week,
      planEatTime: eatTime,
    });
  });

  return (
    <button
      className="CalendarMenu__button CalendarMenu__button--add"
      onClick={handleShowList}
    >
      <i className="fas fa-plus"></i>
      <i className="ir">메뉴 추가</i>
    </button>
  )
}

const CalendarItemContent = (props) => {
  const { setIsDetailPopup, name, id, img, setPopupCookingId, islogin, fullCalendarData, setCalendarData, calendarSelectData } = props;
  const { setCalendarSelectData, eatTime, week, setYear, setWeek, setIsLoading } = props;

  const handleShowDetail = useCallback(() => {
    setPopupCookingId(id);
    setIsDetailPopup(true);
  });

  const handleDeleteOnCalendar = useCallback(() => {
    setIsLoading(true)
    axios.put(`${host.server}/plan`,{
      year: setYear,
      week: setWeek,
      day: week,
      meal: eatTime,
      recipeId: null,
    },{
        withCredentials: true
    }).then((result) => {
      console.log('success plan delete', result)
        axios.get(`${host.server}/plan/${setYear}/${setWeek}`, {
            withCredentials: true
        }).then((result) => {
            setCalendarData(result.data)
            setIsLoading(false)
        }).catch(error => { console.log('failed', error) })
    }).catch(error => { console.log('failed', error) })

  }, [setYear, setWeek, week, eatTime]);

  return (
    <div className="CalendarMenu__wrap">
      <div className="CalendarMenu__thumb">
        <img
          src={img}
          alt=""
        />
      </div>
      <div className="CalendarMenu__title">{name}</div>
      <div className="CalendarMenu__hover">
        <button
          className="CalendarMenu__button CalendarMenu__button--more"
          onClick={handleShowDetail}
        >
          <i className="fas fa-search"></i>
          <i className="ir">상세 보기</i>
        </button>
        {
          islogin 
          ? 
          <button
              className="CalendarMenu__button CalendarMenu__button--delete"
              onClick={handleDeleteOnCalendar}
            >
              <i className="far fa-trash-alt"></i>
              <i className="ir">메뉴 삭제</i>
          </button>
          : null
        }
      </div>
    </div>
  )
}

export default CalendarItem;
