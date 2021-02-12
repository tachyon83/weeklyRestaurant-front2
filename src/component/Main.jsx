import React, { useState } from 'react';
import Calendar from './Calendar';
import CookingDetailPop from './CookingDetailPop';
import CookingListPop from './CookingListPop';

const Main = (props) => {
  
  const { islogin, setIsLoading } = props;
  const [ isDetailPopup, setIsDetailPopup ] = useState(false);
  const [ isListPopup, setIsListPopup ] = useState(false);
  const [ popupCookingId, setPopupCookingId ] = useState();
  const [ calendarSelectData, setCalendarSelectData ] = useState();
  const [calendarData, setCalendarData] = useState();

  return (
    <>
      <Calendar
        setIsDetailPopup={setIsDetailPopup}
        setIsListPopup={setIsListPopup}
        islogin={islogin}
        calendarSelectData={calendarSelectData}
        setPopupCookingId={setPopupCookingId}
        calendarData={calendarData}
        setCalendarData={setCalendarData}
        calendarSelectData={calendarSelectData}
        setCalendarSelectData={setCalendarSelectData}
        setIsLoading={setIsLoading}
      />
      {
        isDetailPopup &&
          <CookingDetailPop
            setIsDetailPopup={setIsDetailPopup}
            popupCookingId={popupCookingId}
            setIsLoading={setIsLoading}
          />
      }
      {
        isListPopup &&
          <CookingListPop
            setIsListPopup={setIsListPopup}
            setIsDetailPopup={setIsDetailPopup}
            setPopupCookingId={setPopupCookingId}
            calendarData={calendarData}
            setCalendarData={setCalendarData}
            popupCookingId={popupCookingId}
            calendarSelectData={calendarSelectData}
            setIsLoading={setIsLoading}
          />
      }
    </>
  )
};

export default Main;