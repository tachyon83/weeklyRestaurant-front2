import React, { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from 'axios';
import InventoryItem from './InventoryItem'
const host = require("../host");

const CookingDetail = ({ history }) => {
    let { cookingId } = useParams();

    const [cookingDetail, setCookingDetail] = useState()

    useEffect(() => {
        handleDetail()
    }, [])

    const handleDetail = useCallback(() => {
        axios.get(`${host.server}/recipe/${cookingId}`, {
            withCredentials: true
        }).then((result) => {
            setCookingDetail(result.data.data);
        }).catch(error => { console.log('failed', error) });
    }, []);

    const onDeleteRecipe = useCallback((e) => {
        e.preventDefault();
        axios.delete(`${host.server}/recipe`, {
            data: { id: `${cookingId}` },
            withCredentials: true
            // id: `${cookingId}`
        }
            // {
            //     withCredentials: true
            // }
        ).then((result) => {
            console.log('삭제완료', cookingId, result)
            history.push('/cookingList');
        }).catch(error => { console.log('failed', error) });
    }, [cookingId])

    return (
        <>
            {cookingDetail && (
                <div className="LineBox">
                    <h2>요리 상세</h2>
                    <div className="CookingDetail">
                        <div className="CookingDetail__top">
                            <div className="CookingDetail__desc">
                                <div className="CookingDetail__title">{cookingDetail.name}</div>
                                <div className="CookingDetail__imgUrl">
                                    <span>이미지 URL</span>
                                    <p>{cookingDetail.img}</p>
                                </div>
                                <div className="CookingDetail__buttonWrap">
                                    <Link to={`/cookingForm/${cookingId}`} className="CookingDetail__button CookingDetail__button--edit">수정하기</Link>
                                    <button className="CookingDetail__button CookingDetail__button--delete" onClick={onDeleteRecipe}>삭제</button>
                                </div>
                            </div>
                            <div className="CookingDetail__thumb">
                                <img src={cookingDetail.img} alt="" />
                            </div>
                        </div>
                        <div className="CookingDetail__ingredient">
                            <dl>
                                <dt className="CookingDetail__category">육류</dt>
                                {
                                    cookingDetail.contents.meat.contents ? (
                                        cookingDetail.contents.meat.contents.map((item, i) => {
                                            return (
                                                <InventoryItem ingredient={item} key={i} />
                                            )
                                        })
                                    ) : null
                                }
                            </dl>
                            <dl>
                                <dt className="CookingDetail__category">어류</dt>
                                {
                                    cookingDetail.contents.fish.contents ? (
                                        cookingDetail.contents.fish.contents.map((item, i) => {
                                            return (
                                                <InventoryItem ingredient={item} key={i} />
                                            )
                                        })
                                    ) : null
                                }
                            </dl>
                            <dl>
                                <dt className="CookingDetail__category">부재료</dt>
                                {
                                    cookingDetail.contents.misc.contents ? (
                                        cookingDetail.contents.misc.contents.map((item, i) => {
                                            return (
                                                <InventoryItem ingredient={item} key={i} />
                                            )
                                        })
                                    ) : null
                                }
                            </dl>
                            <dl>
                                <dt className="CookingDetail__category">양념(소스)</dt>
                                {
                                    cookingDetail.contents.sauce.contents ? (
                                        cookingDetail.contents.sauce.contents.map((item, i) => {
                                            return (
                                                <InventoryItem ingredient={item} key={i} />
                                            )
                                        })
                                    ) : null
                                }
                            </dl>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default CookingDetail;
