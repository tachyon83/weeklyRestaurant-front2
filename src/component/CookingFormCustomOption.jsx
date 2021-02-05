import React, {useCallback,useEffect,useState} from "react";

const CookingFormCustomOption = ({setTargetCategory,setHandleValue,cookingForm,baseOption, categoryOptionArr, setCategoryOptionArr, group, index}) => {
  
    // 목록 직접입력/선택입력 옵션 스위치
    const handleSelfInput = useCallback((e)=>{
      e.preventDefault();

      // 직접입력, 선택입력 옵션설정
      const copyArr = {...categoryOptionArr};
      copyArr[group][index].selfInput = false;
      setCategoryOptionArr(copyArr)

      // handlevalue 컨트롤
      const cookingArr = [...cookingForm.contents[group].contents]
      cookingArr[index] = {
          name: Object.keys(baseOption[0])[0],
          amount: 0,
          unit: baseOption[0][Object.keys(baseOption[0])],
      }

      setHandleValue({
        targetCategory: group,
        contents: cookingArr
      })
    }, [categoryOptionArr, group, index, baseOption, cookingForm])

    const handleInput = useCallback((e)=>{
      e.preventDefault();
      const copyArr = [...cookingForm.contents[group].contents];
      copyArr[index][e.target.name] = e.target.value;

      setHandleValue({
        targetCategory: group,
        contents: copyArr
      })
    }, [index, group, cookingForm])
  
    return(
      <dd className="CookingForm__option">
        <div className="CookingForm__section01">
          <input type="text" name="name" placeholder="재료명" onChange={handleInput} />
        </div>
        <div className="CookingForm__section02">
          <input type="number" name="amount" placeholder="수량" onChange={handleInput} />
        </div>
        <div className="CookingForm__section03">
          <input type="text" name="unit" placeholder="단위" onChange={handleInput} />
        </div>
        <div className="CookingForm__section04">
          <button className="CookingForm__optionButton" onClick={handleSelfInput}>선택입력</button>
        </div>
      </dd>
      
    )
  }

  export default CookingFormCustomOption;