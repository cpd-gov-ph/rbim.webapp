import React, { useEffect, useState,useRef } from "react";
import Toast from "react-bootstrap/Toast";
import Button from "../../components/Form/Button";
import moment from "moment";
import logo from "../../assets/images/logo.png";
import { toast } from "react-toastify";
//style
import "./style.scss";
import ClearAllPopup from "./ClearAllPopup";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Dropdown from "react-bootstrap/Dropdown";
import { NavLink, useNavigate } from "react-router-dom";
import Logout from "./Logout";
import { getData, userRole, postData, deleteData,putData } from '../../api';
const Header = () => {
  let navigate = useNavigate();
  const [toaster, showToaster] = useState(false);
  const [logoutShowModal, setLogoutShowModal] = useState(false);
  const [list, setList] = useState([]);
  const [clearAllShowModal, setClearAllShowModal] = useState(false);
  const [notificationCount,setNotificationCount]=useState(null);
  const wrapperRef = useRef(null);

  const deleteNotification = async (data) => {

    const res = await deleteData("delete-notification/" + data.id + '/', {});
    if (res.status === 1) {
      let listCopy = [...list];
      listCopy.forEach((listData) => {
        listData.notification_data.forEach((notification, index) => {
          if (data.id === notification.id) {
            listData.notification_data.splice(index, 1);
          }
        })
      });
      setList(listCopy);
    } else {
      toast.error(res.message, { theme: "colored" });
      //setLoading(false);
    }
  }
  
    useEffect(() => {
      /**
       * Close toast if clicked on outside of element
       */
      function handleClickOutside(event) {
        if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        
          showToaster(false)
        }
      }
      // Bind the event listener
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        // Unbind the event listener on clean up
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [wrapperRef]);
  
  const clearList = () => {
    //setList([])
    //showToaster(false);
    setClearAllShowModal(true)
  }
  const clearAllNotification = async () => {

    const res = await deleteData("clear-all-notification/", {});
    if (res.status === 1) {
      setList([]);
      setClearAllShowModal(false)
    } else {
      toast.error(res.message, { theme: "colored" });
      //setLoading(false);
    }
  }
  const ViewProfile = () => {
    navigate("/profile");
  }
  const findDate = (notification_date) => {
    let dateStatus;
    let currentDate = moment(new Date()).format('DD-MM-YYYY');
    let currentNotificationDate = moment(notification_date, 'YYYY-MM-DD').format('DD-MM-YYYY');
    if (currentDate === currentNotificationDate) {
      dateStatus = 'Today'
    }
    else if (currentNotificationDate === moment(currentDate, 'DD-MM-YYYY').subtract(1, 'days').format('DD-MM-YYYY')) {
      dateStatus = 'Yesterday';
    }
    else {
      dateStatus = currentNotificationDate;
    }
    return dateStatus;
  }
  useEffect(() => {
    getNotificationList();
  }, [])
  const getNotificationList = async () => {

    const res = await getData("get-web-header-notification-list/", {});
    if (res.status === 1) {
      setList(res.data);
      setNotificationCount(res.notification_header_count)
    
    } else {
      //toast.error(res.message, { theme: "colored" });
      //setLoading(false);
    }
  }
  const logOut = async () => {
    const res = await getData("logout/", {});
    if (res.status == 1) {
      setLogoutShowModal(false);
      localStorage.clear();
      navigate("/login-selection");
    }
  }
  const viewAll = () => {
    navigate('/notification');
    showToaster(false);
  }
  const clearNotificationCount=async()=>{
    showToaster(!toaster);
    const res = await putData("seen-all-notification/", {});
    if(res.status ===1){
      setNotificationCount(0);
    }
  }
  const getTime = (time) => {
    let timeStatus;
    let currentTime = moment(new Date());
    let notificationTime = moment(time);
    let timeDiff = currentTime.diff(notificationTime, 'minutes');
    if (timeDiff <= 10) {
      timeStatus = timeDiff + 'min ago'
    }
    else {
      timeStatus =moment.utc(time).local().format('hh:mm A');;
    }
    return timeStatus;
  }
  return (
    <>
      <div className="header bg-color-primary">
        <Navbar variant="dark" expanded className="ps-0 pe-2 pb-0">
          <Container fluid>
            <div className="d-flex justify-content-between w-100">
              <div className="d-flex align-items-center logo-section">
                <img src={logo} alt="logo" />
                Baseline Census for the Establishment of Registry  of<br />
                Barangay Inhabitants and Migrants (RBIM)
              </div>
              <Nav className="align-items-center">
                <Navbar.Text className="bell-icon">
                  <div>
                    <i onClick={() =>clearNotificationCount() } className="fa fa-solid fa-bell">
                   
                      {notificationCount && notificationCount >0 ? (
                        <>
                           <span className="notification_count"></span>
                        </>
                      ):null}
                    </i>
                    <Toast show={toaster} onClose={() => showToaster(false)} ref={wrapperRef}>
                      <Toast.Header>

                        <strong className="me-auto">Notifications</strong>
                        {list && list.length > 0 ? (
                          <>
                            <small onClick={() => clearList()}>Clear all</small>
                          </>
                        ) : null}
                      </Toast.Header>

                      <Toast.Body>
                        <div className="toast-list">
                          {list.map((item, index) => {
                            return (
                              <>
                                <div className="notification_title">{findDate(item.date)}</div>
                                {item.notification_data.map((notification_detail, nofitication_index) => {
                                  return (
                                    <>
                                      <div className="toast-list-item mb-2" key={nofitication_index}>
                                        <div>
                                          <div className="toast-list-msg">{notification_detail.message}</div>
                                          <div className="toast-list-time mt-1">{getTime(notification_detail.created_at)}</div>
                                        </div>
                                        <div className="notification_close" onClick={() => deleteNotification(notification_detail)}></div>
                                      </div>
                                    </>
                                  )
                                })}
                              </>
                            );
                          })}
                          {list && list.length === 0 ? (
                            <>
                              <p className='text-center notification_title mb-0'>No notification</p>
                            </>
                          ) : null}
                        </div>
                        {list && list.length > 0 ? (
                          <>
                            <div className='btn-div'>
                              <Button
                                type="button"
                                className="btn-primary button-width text-white"
                                onClick={() => viewAll()}
                              >
                                View All
                              </Button>
                            </div>
                          </>
                        ) : null}
                      </Toast.Body>
                    </Toast>
                  </div>
                </Navbar.Text>
                <Dropdown as={Nav.Item} align={{ lg: "start" }}>
                  <Dropdown.Toggle as={Nav.Link} className="pt-1 px-0">
                    <div className="media d-flex align-items-center">
                      <div className="user-icon">
                        <i className=" fa fa-solid fa-user"></i>
                      </div>
                      <div className="media-body ms-2 text-dark align-items-center d-lg-block">
                        <span className="mb-0 font-small fw-normal text-white">
                          {userRole()?.first_name}
                        </span>
                        <i className="fa fa-thin fa-chevron-down"></i>
                      </div>
                    </div>
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="user-dropdown dropdown-menu-right mt-2">
                    <Dropdown.Item className="fw-normal" as="button" onClick={() => ViewProfile()}>
                      View Profile
                    </Dropdown.Item>
                    <Dropdown.Item className="fw-normal" as="button" onClick={() => setLogoutShowModal(true)}>Logout</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Nav>
            </div>
          </Container>
        </Navbar>
        {logoutShowModal && (
          <Logout
            show={logoutShowModal}
            onClose={() => setLogoutShowModal(false)}
            onLogout={logOut}
          ></Logout>
        )}
        {clearAllShowModal && (
          <ClearAllPopup
            show={clearAllShowModal}
            onClose={() => setClearAllShowModal(false)}
            onClearAll={clearAllNotification}
          ></ClearAllPopup>
        )}
      </div>
    </>
  );
};

export default Header;
