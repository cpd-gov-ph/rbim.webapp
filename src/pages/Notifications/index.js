import React, { useEffect, useState } from 'react';
import { FaArrowLeft } from "react-icons/fa";
import moment from "moment";
import ClearAllPopup from "./ClearAllPopup";
import { toast } from "react-toastify";
import {postData, deleteData } from '../../api';
import { useNavigate } from "react-router-dom";
const Notifications = () => {
  const [list, setList] = useState([]);
  const [clearAllShowModal, setClearAllShowModal] = useState(false);
  let navigate = useNavigate();
  document.body.classList.add('adminSurveyQusView');
  useEffect(() => {
    getAllNotificationList();
    return () => {
      document.body.classList.remove('adminSurveyQusView');
    }
  }, []);
  const getAllNotificationList = async () => {
    let data = {
      "page": 1,
      "page_size": 10,
      "search": ""
    }
    const res = await postData("get-web-viewall-notification-list/", {}, data);
    if (res.status === 1) {
      setList(res.data);

    }
  }
  const goBack=()=>{
    console.log(navigate)
    navigate(-1)
    //history.goBack();
    console.log(navigate)
  }
  const deleteNotification = async (data) => {
    const res = await deleteData("delete-notification/"+data.id+'/', {});
    if (res.status === 1) {
      let listCopy =[...list];
      listCopy.forEach((listData) => {
        listData.notification_data.forEach((notification, index)=>{
          if (data.id === notification.id) {
            listData.notification_data.splice(index, 1);
          }
        })
      });
      setList(listCopy);
    } else {
      toast.error(res.message, { theme: "colored" });
    }
  }
  const clearAllNotification = async () => {
    
    const res = await deleteData("clear-all-notification/", {});
    if (res.status === 1) {
      setList([]);
      setClearAllShowModal(false);
    } else {
      toast.error(res.message, { theme: "colored" });
      //setLoading(false);
    }
  }
  const findDate=(notification_date)=>{
    let dateStatus;
    let currentDate = moment(new Date()).format('DD-MM-YYYY');
    let currentNotificationDate =moment(notification_date,'YYYY-MM-DD').format('DD-MM-YYYY');
    if(currentDate ===currentNotificationDate ){
      dateStatus='Today'
    }
    else if(currentNotificationDate === moment(currentDate,'DD-MM-YYYY').subtract(1,'days').format('DD-MM-YYYY')){
      dateStatus='Yesterday';
    }
    else{
      dateStatus=currentNotificationDate;
    }
    return dateStatus;
  }
  const getTime=(time)=>{
    let timeStatus;
    let currentTime = moment(new Date());
    let notificationTime = moment(time);
    let timeDiff=currentTime.diff(notificationTime,'minutes');
    if(timeDiff <= 10){
      timeStatus =timeDiff+'min ago'
    }
    else{
      timeStatus= moment.utc(time).local().format('hh:mm A');
    }
    return timeStatus;
  }
  return (
    <div>
      <div className='notification_breadcrumb'>
        <div className='d-flex'>
          <div className='notification_breadcrumb_title'>
            <h4 className="title mb-0"><FaArrowLeft className='me-2' onClick={() => goBack()}/> Notifications</h4>
          </div>
          <div className='notification_breadcrumb_action'>
            <div className='text-end'>
              {list && list.length >0 ? (
                <>
                 <button className='btn btn_clearall'  onClick={() => setClearAllShowModal(true)}>Clear all</button>
                </>
              ):null}
            </div>
          </div>
        </div>
      </div>
      <div className='notification_list'>
        {list.length >0 && list.map((notification) => {
          return (
            <>
              <div className='notification_wrapper'>
                <h5>{findDate(notification.date)}</h5>
                {notification.notification_data.map((notification_info) => {
                  return (
                    <>
                      <div className='notification_card boxshadow'>
                        <p className='notification_info'>{notification_info.message}</p>
                        <p className='notification_time'>{getTime(notification_info.created_at)}</p>
                        <div className='notification_close' onClick={() => deleteNotification(notification_info)}></div>
                      </div>
                    </>
                  )
                })}
              </div>
            </>
          )
        })}
        {list && list.length === 0? (
          <>
            <h5 className='text-center'>No notification</h5>
          </>
        ):null}
      </div>
      {clearAllShowModal && (
          <ClearAllPopup
            show={clearAllShowModal}
            onClose={() => setClearAllShowModal(false)}
            onClearAll={clearAllNotification}
          ></ClearAllPopup>
        )}
    </div>
  );
}
export default Notifications