import React, {useCallback} from "react";

const InventoryItem = (props) => {
  const {name, amount, unit} = props.ingredient;
  const {setInventoryPopupInfo, inventoryPopupInfo, category, title, index} = props;

  const onModifyAction = useCallback(() =>{
    setInventoryPopupInfo({
      display: true,
      title: title,
      category: category,
      modifyMode: true,
      modifyModeName: name,
      modifyModeAmount: amount,
      modifyModeUnit: unit,
      listIndex: index,
    })
  }, [setInventoryPopupInfo, category, title, name, unit, index, amount])

  return (
    <div className="Ingredient">
      
      {
        inventoryPopupInfo
        ? (
          <a onClick={onModifyAction}>
            <div className="Ingredient__title">{name}</div>
            <div className="Ingredient__count">{amount}</div>
            <div className="Ingredient__unit">{unit}</div>
          </a>
        ) 
        : (
          <div className="Ingredient__wrap">
            <div className="Ingredient__title">{name}</div>
            <div className="Ingredient__count">{amount}</div>
            <div className="Ingredient__unit">{unit}</div>
          </div>
        )
      }
        
    </div>
  );
};

export default InventoryItem;
