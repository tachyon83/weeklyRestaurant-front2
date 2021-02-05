import React, { useCallback, useEffect, useState } from "react";
import axios from 'axios';
import InventoryItem from './InventoryItem';
import InventoryPopup from './InventoryPopup';
const host = require("../host");

const Inventory = () => {
  const [ingredient, setIngredient] = useState(null);
  const [inventoryPopupInfo, setInventoryPopupInfo] = useState({
    display: false,
    title: null,
    category: null,
    modifyMode: null,
    modifyModeName: null,
    modifyModeAmount: null,
    modifyModeUnit: null,
    listIndex: null,
  })

  useEffect(() => {
    axios.get(`${host.server}/inventory`, {
      withCredentials: true
    }).then((result) => {
      setIngredient(result.data.data);
    }).catch(error => { console.log('failed', error) });
  }, [])

  const onNewIngredient = useCallback((e) => {
    setInventoryPopupInfo({
      display: true,
      title: e.currentTarget.dataset.title,
      category: e.currentTarget.dataset.category,
      modifyMode: false,
      modifyModeName: null,
      modifyModeAmount: null,
      modifyModeUnit: null,
      listIndex: null,
    })
  }, [])

  return (
    <>
      {ingredient && (
        <div className="LineBox">
          <h2>재고 현황</h2>
          <div className="Inventory">
            {inventoryPopupInfo.display && 
            <InventoryPopup 
              inventoryPopupInfo={inventoryPopupInfo} 
              setInventoryPopupInfo={setInventoryPopupInfo} 
              ingredient={ingredient} 
              setIngredient={setIngredient} 
            />}
            <dl>
              <dt className="Inventory__category">
                육류
              </dt>
              <dd className="Inventory__ingredient">
                {
                  ingredient.meat.map((item, i) => {
                    return (
                      <InventoryItem ingredient={item} key={i} inventoryPopupInfo setInventoryPopupInfo={setInventoryPopupInfo} index={i} category="meat" title="육류" />
                    )
                  })
                }
              </dd>
              <dd className="Inventory__newIngredient">
                <button className="Inventory__addButton" onClick={onNewIngredient} data-category="meat" data-title="육류">새 재료 추가 <i className="far fa-plus-square"></i></button>
              </dd>
            </dl>
            <dl>
              <dt className="Inventory__category">
                어류
              </dt>
              <dd className="Inventory__ingredient">
                {
                  ingredient.fish.map((item, i) => {
                    return (
                      <InventoryItem ingredient={item} key={i} inventoryPopupInfo setInventoryPopupInfo={setInventoryPopupInfo} index={i} category="fish" title="어류" />
                    )
                  })
                }
              </dd>
              <dd className="Inventory__newIngredient">
                <button className="Inventory__addButton" onClick={onNewIngredient} data-category="fish" data-title="어류">새 재료 추가 <i className="far fa-plus-square"></i></button>
              </dd>
            </dl>
            <dl>
              <dt className="Inventory__category">
                부재료
              </dt>
              <dd className="Inventory__ingredient">
                {
                  ingredient.misc.map((item, i) => {
                    return (
                      <InventoryItem ingredient={item} key={i} inventoryPopupInfo setInventoryPopupInfo={setInventoryPopupInfo} index={i} category="misc" title="부재료" />
                    )
                  })
                }
              </dd>
              <dd className="Inventory__newIngredient">
                <button className="Inventory__addButton" onClick={onNewIngredient} data-category="misc" data-title="부재료">새 재료 추가 <i className="far fa-plus-square"></i></button>
              </dd>
            </dl>
            <dl>
              <dt className="Inventory__category">
                양념(소스)
              </dt>
              <dd className="Inventory__ingredient">
                {
                  ingredient.sauce.map((item, i) => {
                    return (
                      <InventoryItem ingredient={item} key={i} inventoryPopupInfo setInventoryPopupInfo={setInventoryPopupInfo} index={i} category="sauce" title="양념(소스)" />
                    )
                  })
                }
              </dd>
              <dd className="Inventory__newIngredient">
                <button className="Inventory__addButton" onClick={onNewIngredient} data-category="sauce" data-title="양념(소스)">새 재료 추가 <i className="far fa-plus-square"></i></button>
              </dd>
            </dl>
          </div>
        </div>

      )}
    </>
  );
};

export default Inventory;
