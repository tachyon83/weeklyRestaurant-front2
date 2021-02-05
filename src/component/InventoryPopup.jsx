import React, {useCallback, useState} from 'react';
import axios from 'axios';
const host = require("../host");

const InventoryPopup = (props) => {
    const {inventoryPopupInfo, setInventoryPopupInfo, ingredient, setIngredient} = props;
    const [inventoryInputValue, setInventoryInputValue] = useState({
        name: null,
        amount: null,
        unit: null
    });
    
    const handleCloseInventoryPopup = useCallback(
        () => {
            setInventoryPopupInfo({
                ...inventoryPopupInfo, 
                display: false,
                modifyMode: false,
                modifyModeName: null,
                modifyModeAmount: null,
                modifyModeUnit: null,
                listIndex: null,
            })
            setInventoryInputValue({
                name: null,
                amount: null,
                unit: null
            })
        }
    )

    const handleAddInventory = useCallback(()=>{
        const copyIngredient = {...ingredient};

        if(inventoryPopupInfo.modifyMode){
            copyIngredient[inventoryPopupInfo.category][inventoryPopupInfo.listIndex] = inventoryInputValue;
        }else{
            copyIngredient[inventoryPopupInfo.category].push(inventoryInputValue);
        }

        console.log(copyIngredient, 'copyIngredient')

        axios.put(`${host.server}/inventory`, copyIngredient,{
            withCredentials: true
        }).then((result) => {
            console.log(result);
            setIngredient(copyIngredient);
            setInventoryPopupInfo({
                ...inventoryPopupInfo, 
                display: false,
                modifyMode: false,
                modifyModeName: null,
                modifyModeAmount: null,
                modifyModeUnit: null,
                listIndex: null,
            })
            setInventoryInputValue({
                name: null,
                amount: null,
                unit: null
            })
        }).catch(error => { console.log('failed', error) });
        
    })

    const handleAddInput = useCallback((e)=>{
        if(inventoryPopupInfo.modifyMode){
            setInventoryInputValue({
                name: inventoryPopupInfo.modifyModeName,
                amount: e.currentTarget.value,
                unit: inventoryPopupInfo.modifyModeUnit,
            })
        } else {
            setInventoryInputValue({...inventoryInputValue, [e.target.name]: e.currentTarget.value})
        }
    }, [inventoryInputValue])

    return (
        <div className="InventoryPopup">
            <div className="InventoryPopup__title">
                {inventoryPopupInfo.title} 재고 추가
                <button className="InventoryPopup__close" onClick={handleCloseInventoryPopup}><i className="fas fa-times"></i><i className="ir">닫기</i></button>
            </div>
            {
                inventoryPopupInfo.modifyMode 
                ? (
                    <div className="InventoryPopup__wrap">
                        <div className="InventoryPopup__name">
                            <input type="text" placeholder="이름" name="name" value={inventoryPopupInfo.modifyModeName} disabled />
                        </div>
                        <div className="InventoryPopup__amount">
                            <input type="text" placeholder={inventoryPopupInfo.modifyModeAmount} name="amount" onChange={handleAddInput} value={inventoryInputValue.amount} />
                        </div>
                        <div className="InventoryPopup__unit">
                            <input type="text" placeholder="단위" name="unit" value={inventoryPopupInfo.modifyModeUnit} disabled />
                        </div>
                    </div>
                )
                : (
                    <div className="InventoryPopup__wrap">
                        <div className="InventoryPopup__name">
                            <input type="text" placeholder="이름" name="name" onChange={handleAddInput} value={inventoryInputValue.name} />
                        </div>
                        <div className="InventoryPopup__amount">
                            <input type="text" placeholder="수량" name="amount" onChange={handleAddInput} value={inventoryInputValue.amount} />
                        </div>
                        <div className="InventoryPopup__unit">
                            <input type="text" placeholder="단위" name="unit" onChange={handleAddInput} value={inventoryInputValue.unit} />
                        </div>
                    </div>
                )
            }
            <div className="InventoryPopup__buttonArea">
                <button className="InventoryPopup__button InventoryPopup__button--add" onClick={handleAddInventory}>추가하기</button>
            </div>
        </div>
    )
};

export default InventoryPopup;