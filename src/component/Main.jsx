import React, { useState } from "react";
import Calendar from "./Calendar";
import CookingDetailPop from "./CookingDetailPop";
import CookingListPop from "./CookingListPop";

const Main = (props) => {
  const { islogin = false, setIsLoading = () => {} } = props;
  const [isDetailPopup, setIsDetailPopup] = useState(false);
  const [isListPopup, setIsListPopup] = useState(false);
  const [popupCookingId, setPopupCookingId] = useState(null);
  const [calendarSelectData, setCalendarSelectData] = useState(null);
  const [calendarData, setCalendarData] = useState(null);

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
        setCalendarSelectData={setCalendarSelectData}
        setIsLoading={setIsLoading}
      />
      {isDetailPopup && (
        <CookingDetailPop
          setIsDetailPopup={setIsDetailPopup}
          popupCookingId={popupCookingId}
          setIsLoading={setIsLoading}
        />
      )}
      {isListPopup && (
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
      )}
    </>
  );
};

export default Main;
