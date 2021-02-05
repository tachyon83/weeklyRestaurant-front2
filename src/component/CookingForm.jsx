import React, { useCallback, useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from 'axios';
import CookingFormSelectOption from './CookingFormSelectOption';
import CookingFormCustomOption from './CookingFormCustomOption';

const host = require("../host");

const CookingForm = ({ history }) => {
  // params로 수정할 요리의 id를 받아온다.
  let { cookingId } = useParams();
  console.log('cookingId', cookingId)

  useEffect(() => {
    axios.get(`${host.server}/recipe/new`, {
      withCredentials: true
    }).then((result) => {
      setBaseOption(result.data.data)
      console.log('data in cookingForm.jsx>/recipe/new', result.data.data)
    }).catch((error) => { console.log('failed', error) })
  }, [])

  // 수정시 레시피 get
  useEffect(() => {
    if (cookingId) {
      axios.get(`${host.server}/recipe/${cookingId}`, {
        withCredentials: true
      }).then((result) => {
        console.log(result.data.data, '요리수정 레시피 get 요청')
        setCookingForm(result.data.data)

        const varStyle = result.data.data.style;
        if (varStyle === 'KOR') {
          selectStyle.current.selectedIndex = 1
        } else if (varStyle === 'CHN') {
          selectStyle.current.selectedIndex = 2
        } else if (varStyle === 'WES') {
          selectStyle.current.selectedIndex = 3
        }

        const category = ['meat', 'fish', 'misc', 'sauce'];
        let meatArr = [], fishArr = [], miscArr = [], sauceArr = [];
        const arr = [meatArr, fishArr, miscArr, sauceArr];
        category.map((item, index) => {
          if (result.data.data.contents[item].contents) {
            for (let i = 0; i < result.data.data.contents[item].contents.length; i++) {
              arr[index].push({ selfInput: false })
            }
          }
        })

        setCategoryOptionArr({
          meat: meatArr,
          fish: fishArr,
          misc: miscArr,
          sauce: sauceArr,
        })

      }).catch((error) => { console.log('failed', error) })
    }
  }, [])

  const [cookingForm, setCookingForm] = useState({
    id: null,
    name: null,
    style: null,
    img: null,
    contents: {
      meat: {
        id: null,
        name: null,
        contents: [],
      },
      fish: {
        id: null,
        name: null,
        contents: [],
      },
      misc: {
        id: null,
        name: null,
        contents: [],
      },
      sauce: {
        id: null,
        name: null,
        contents: [],
      }
    }
  });

  const [baseOption, setBaseOption] = useState({
    name: null,
    amount: null,
    unit: null,
  });

  const [handleValue, setHandleValue] = useState({
    targetCateogry: null,
    contents: {
      name: null,
      amount: null,
      unit: null,
    }
  });

  useEffect(() => {
    console.log(handleValue.contents, 'handleValue change', handleValue.targetCategory, ': target')
    if (handleValue.targetCategory) {
      setCookingForm({
        ...cookingForm,
        contents: {
          ...cookingForm.contents,
          [handleValue.targetCategory]: {
            id: null,
            name: null,
            contents: handleValue.contents
          }
        }
      })
    }
  }, [handleValue])

  const [categoryOptionArr, setCategoryOptionArr] = useState({
    meat: [],
    fish: [],
    misc: [],
    sauce: [],
  });

  const onCookingCreate = useCallback((e) => {
    e.preventDefault();

    console.log(cookingForm, '최종 전송 폼')

    axios.post(`${host.server}/recipe`, cookingForm, {
      withCredentials: true
    }).then((result) => {
      alert('요리 추가 성공.')
      setHandleValue({
        targetCateogry: null,
        contents: {
          name: null,
          amount: null,
          unit: null,
        }
      })
      setCookingForm({
        id: null,
        name: '',
        style: null,
        img: '',
        contents: {
          meat: {
            id: null,
            name: null,
            contents: [],
          },
          fish: {
            id: null,
            name: null,
            contents: [],
          },
          misc: {
            id: null,
            name: null,
            contents: [],
          },
          sauce: {
            id: null,
            name: null,
            contents: [],
          }
        }
      })
      setCategoryOptionArr({
        meat: [],
        fish: [],
        misc: [],
        sauce: [],
      })

      // 카테고리 style 옵션 초기화
      selectStyle.current.selectedIndex = 0;

    }).catch(error => { console.log('failed', error) });

  }, [cookingForm])

  const onChangeInput = useCallback((e) => {
    setCookingForm({
      ...cookingForm,
      [e.target.name]: e.target.value,
    })
  })

  const selectStyle = useRef(null);

  const onCookingEdit = useCallback((e) => {
    e.preventDefault();
    console.log('전달 레시피', cookingForm)

    axios.put(`${host.server}/recipe`, cookingForm, {
      withCredentials: true
    }).then((result) => {
      console.log('요리 수정완료', result)
      history.push(`/cookingList/${cookingId}`);
    }).catch(error => { console.log('failed', error) });
  }, [cookingForm])

  useEffect(() => {
    console.log(cookingForm, 'cookingForm change!!')
  }, [cookingForm])

  return (
    <div className="LineBox">
      {
        cookingId ? <h2>요리 수정</h2> : <h2>요리 추가</h2>
      }
      <form className="CookingForm">
        <ul className="CookingForm__top">
          <li>
            <dl>
              <dt>
                <label htmlFor="">요리명</label>
              </dt>
              <dd>
                <input type="text" name="name" onChange={onChangeInput} value={cookingForm.name} />
              </dd>
            </dl>
          </li>
          <li className="halfType">
            <dl>
              <dt>
                <label htmlFor="">요리사진 URL</label>
              </dt>
              <dd>
                <input type="text" name="img" onChange={onChangeInput} value={cookingForm.img} />
              </dd>
            </dl>
            <dl>
              <dt>
                <label htmlFor="">요리 카테고리</label>
              </dt>
              <dd>
                <select name="style" id="" onChange={onChangeInput} ref={selectStyle}>
                  <option value="none" selected disabled hidden>카테고리 선택</option>
                  <option value="KOR">한식</option>
                  <option value="CHN">중식</option>
                  <option value="WES">양식</option>
                </select>
              </dd>
            </dl>
          </li>
        </ul>
        <ul className="CookingForm__category">
          <li>
            <dl>
              <dt>
                육류
              </dt>
              {
                baseOption
                  ?
                  categoryOptionArr.meat.map((item, index) => {
                    return (
                      item.selfInput
                        ? <CookingFormCustomOption
                          baseOption={baseOption.meat}
                          group={'meat'}
                          categoryOptionArr={categoryOptionArr}
                          setCategoryOptionArr={setCategoryOptionArr}
                          cookingForm={cookingForm}
                          setCookingForm={setCookingForm}
                          index={index}
                          key={index}
                          handleValue={handleValue}
                          setHandleValue={setHandleValue}
                        />
                        : <CookingFormSelectOption
                          baseOption={baseOption.meat}
                          group={'meat'}
                          categoryOptionArr={categoryOptionArr}
                          setCategoryOptionArr={setCategoryOptionArr}
                          cookingForm={cookingForm}
                          setCookingForm={setCookingForm}
                          index={index}
                          key={index}
                          handleValue={handleValue}
                          setHandleValue={setHandleValue}
                        />
                    )
                  })
                  : null
              }
            </dl>
            <CookingMoreOption
              baseOption={baseOption.meat}
              setHandleValue={setHandleValue}
              setCookingForm={setCookingForm}
              cookingForm={cookingForm}
              group={'meat'}
              categoryOptionArr={categoryOptionArr}
              setCategoryOptionArr={setCategoryOptionArr}
            />
          </li>
          <li>
            <dl>
              <dt>
                어류
              </dt>
              {
                baseOption
                  ?
                  categoryOptionArr.fish.map((item, index) => {
                    return (
                      item.selfInput
                        ? <CookingFormCustomOption
                          baseOption={baseOption.fish}
                          group={'fish'}
                          categoryOptionArr={categoryOptionArr}
                          setCategoryOptionArr={setCategoryOptionArr}
                          cookingForm={cookingForm}
                          setCookingForm={setCookingForm}
                          index={index}
                          key={index}
                          handleValue={handleValue}
                          setHandleValue={setHandleValue}
                        />
                        : <CookingFormSelectOption
                          baseOption={baseOption.fish}
                          group={'fish'}
                          categoryOptionArr={categoryOptionArr}
                          setCategoryOptionArr={setCategoryOptionArr}
                          cookingForm={cookingForm}
                          setCookingForm={setCookingForm}
                          index={index}
                          key={index}
                          handleValue={handleValue}
                          setHandleValue={setHandleValue}
                        />
                    )
                  })
                  : null
              }
            </dl>
            <CookingMoreOption
              baseOption={baseOption.fish}
              setHandleValue={setHandleValue}
              setCookingForm={setCookingForm}
              cookingForm={cookingForm}
              group={'fish'}
              categoryOptionArr={categoryOptionArr}
              setCategoryOptionArr={setCategoryOptionArr}
            />
          </li>
          <li>
            <dl>
              <dt>
                부재료
              </dt>
              {
                baseOption
                  ?
                  categoryOptionArr.misc.map((item, index) => {
                    return (
                      item.selfInput
                        ? <CookingFormCustomOption
                          baseOption={baseOption.misc}
                          group={'misc'}
                          categoryOptionArr={categoryOptionArr}
                          setCategoryOptionArr={setCategoryOptionArr}
                          cookingForm={cookingForm}
                          setCookingForm={setCookingForm}
                          index={index}
                          key={index}
                          handleValue={handleValue}
                          setHandleValue={setHandleValue}
                        />
                        : <CookingFormSelectOption
                          baseOption={baseOption.misc}
                          group={'misc'}
                          categoryOptionArr={categoryOptionArr}
                          setCategoryOptionArr={setCategoryOptionArr}
                          cookingForm={cookingForm}
                          setCookingForm={setCookingForm}
                          index={index}
                          key={index}
                          handleValue={handleValue}
                          setHandleValue={setHandleValue}
                        />
                    )
                  })
                  : null
              }
            </dl>
            <CookingMoreOption
              baseOption={baseOption.misc}
              setHandleValue={setHandleValue}
              setCookingForm={setCookingForm}
              cookingForm={cookingForm}
              group={'misc'}
              categoryOptionArr={categoryOptionArr}
              setCategoryOptionArr={setCategoryOptionArr}
            />
          </li>
          <li>
            <dl>
              <dt>
                소스(양념)
              </dt>
              {
                baseOption
                  ?
                  categoryOptionArr.sauce.map((item, index) => {
                    return (
                      item.selfInput
                        ? <CookingFormCustomOption
                          baseOption={baseOption.sauce}
                          group={'sauce'}
                          categoryOptionArr={categoryOptionArr}
                          setCategoryOptionArr={setCategoryOptionArr}
                          cookingForm={cookingForm}
                          setCookingForm={setCookingForm}
                          index={index}
                          key={index}
                          handleValue={handleValue}
                          setHandleValue={setHandleValue}
                        />
                        : <CookingFormSelectOption
                          baseOption={baseOption.sauce}
                          group={'sauce'}
                          categoryOptionArr={categoryOptionArr}
                          setCategoryOptionArr={setCategoryOptionArr}
                          cookingForm={cookingForm}
                          setCookingForm={setCookingForm}
                          index={index}
                          key={index}
                          handleValue={handleValue}
                          setHandleValue={setHandleValue}
                        />
                    )
                  })
                  : null
              }
            </dl>
            <CookingMoreOption
              baseOption={baseOption.sauce}
              setHandleValue={setHandleValue}
              setCookingForm={setCookingForm}
              cookingForm={cookingForm}
              group={'sauce'}
              categoryOptionArr={categoryOptionArr}
              setCategoryOptionArr={setCategoryOptionArr}
            />
          </li>
        </ul>
        <div className="CookingForm__buttonWrap">
          {
            cookingId
              ? <button type="submit" className="CookingForm__button CookingForm__button--edit" onClick={onCookingEdit}>요리수정</button>
              : <button type="submit" className="CookingForm__button CookingForm__button--submit" onClick={onCookingCreate}>요리추가</button>
          }
        </div>
      </form>
    </div>
  );
};


const CookingMoreOption = ({ setHandleValue, cookingForm, setCookingForm, setCategoryOptionArr, categoryOptionArr, group, baseOption }) => {
  const handleMore = useCallback((e) => {
    e.preventDefault()

    // 직접입력, 선택입력 옵션설정
    // 기본값 선택입력 추가
    const optionArr = { ...categoryOptionArr };
    optionArr[group].push({ selfInput: false })
    setCategoryOptionArr(optionArr);

    // handlevalue 컨트롤
    // 기본값 선택입력 추가

    let copyArr;
    if (cookingForm.contents[group].contents) {
      copyArr = Array.from(cookingForm.contents[group].contents)
      copyArr.push({
        name: Object.keys(baseOption[0])[0],
        amount: 0,
        unit: baseOption[0][Object.keys(baseOption[0])],
      })
    } else {
      copyArr = [{
        name: Object.keys(baseOption[0])[0],
        amount: 0,
        unit: baseOption[0][Object.keys(baseOption[0])],
      }]
    }
    console.log(copyArr, `${group}기본 생성값 추가!`)

    setHandleValue({
      targetCategory: group,
      contents: copyArr
    })
  }, [categoryOptionArr, group, cookingForm, baseOption])

  return (
    <div className="CookingForm__more">
      <button className="CookingForm__optionButton CookingForm__optionButton--add" onClick={handleMore}>+ 추가</button>
    </div>
  )
}

export default CookingForm;