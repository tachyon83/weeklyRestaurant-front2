import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import CookingListItem from "./CookingListItem";
const host = require("../host");

const CookingList = ({ setIsLoading }) => {
  const [cookingList, setCookingList] = useState([]);

  useEffect(() => {
    handleList();
  }, []);

  const handleList = useCallback((event) => {
    if (event && event.target && event.target.parentElement) {
      let children = event.target.parentElement.children;
      for (let i = 0; i < children.length; i++) {
        children[i].classList.remove("CookingList__tabItem--active");
      }
      event.target.classList.add("CookingList__tabItem--active");
    }

    setIsLoading(true);

    const nation =
      event && event.target && event.target.attributes.nation
        ? event.target.attributes.nation.value
        : "KOR";

    axios
      .get(`${host.server}/recipe/list?style=${nation}`, {
        withCredentials: true,
      })
      .then((result) => {
        console.log(34, result);
        setCookingList(result.data.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log("failed", error);
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="LineBox">
      <h2>요리 목록</h2>
      <div className="CookingList">
        <ul className="CookingList__tab">
          <li
            className="CookingList__tabItem CookingList__tabItem--active"
            onClick={handleList}
            nation="KOR"
          >
            한식
          </li>
          <li
            className="CookingList__tabItem"
            onClick={handleList}
            nation="CHN"
          >
            중식
          </li>
          <li
            className="CookingList__tabItem"
            onClick={handleList}
            nation="WES"
          >
            양식
          </li>
        </ul>
        <ul className="CookingList__dishList">
          {cookingList.map((item) => (
            <CookingListItem
              cookingList={item}
              key={item.id}
              setIsLoading={setIsLoading}
            />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CookingList;
