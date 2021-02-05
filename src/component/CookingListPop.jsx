import React, {useCallback, useEffect, useState} from "react";
import axios from 'axios';
import CookingListItem from "./CookingListItem";
const host = require("../host");

const CookingListPop = ({setIsListPopup, setIsDetailPopup, setPopupCookingId, popupCookingId, calendarSelectData, calendarData, setCalendarData}) => {

    const [cookingList, setCookingList] = useState([])
    useEffect(()=> {
        handleList()
    }, [])
    
    const handleList = useCallback((event) => {
        if(event) {
          let children = event.target.parentElement.children;
          for(let i = 0; i < children.length; i++) {
            children[i].classList.remove('CookingList__tabItem--active')
          }
          event.target.classList.add('CookingList__tabItem--active')
        } 
    
        axios.get(`${host.server}/recipe/list?style=${event ? event.target.attributes.nation.value : `kor`}`, {
            withCredentials: true
          }).then((result) => {
          setCookingList(result.data.data)
        }).catch( error => { console.log('failed', error) });
    }, [setCookingList]);
    
    const handleCloseList = useCallback(
        () => {
            setIsListPopup(false)
        },
        [setIsListPopup],
    )
    return(
        <article className="LayoutPopup">
            <div className="LayoutPopup__header">
                <h2 className="LayoutPopup__title">요리 목록</h2>
                <button className="LayoutPopup__close" onClick={handleCloseList}><i className="fas fa-times"></i><i className="ir">닫기</i></button>
            </div>
            <div className="CookingList">
                <ul className="CookingList__tab">
                <li className="CookingList__tabItem CookingList__tabItem--active" onClick={handleList} nation={`kor`}>
                    한식
                </li>
                <li className="CookingList__tabItem" onClick={handleList} nation={`chn`}>중식</li>
                <li className="CookingList__tabItem" onClick={handleList} nation={`wes`}>양식</li>
                </ul>
                <ul className="CookingList__dishList">
                {
                    cookingList.map((item) => {
                    return (
                        <CookingListItem cookingList={item} key={item.id} popup={true} setIsListPopup={setIsListPopup} setIsDetailPopup={setIsDetailPopup} setPopupCookingId={setPopupCookingId} popupCookingId={popupCookingId} calendarSelectData={calendarSelectData} calendarData={calendarData} setCalendarData={setCalendarData}/>
                    )
                    })
                }
                </ul>
            </div>
        </article>
    )
};

export default CookingListPop;