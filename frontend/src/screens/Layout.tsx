import { Link, Navigate, Outlet, useNavigate } from "react-router-dom";
import user from "../assets/images/user.png";
import logo from "../assets/images/logo1.png";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { getModalShow, modalAction,getSideBarUserID } from "../features/auth";
import Modal from "../components/Modal";
import cancel from "../assets/images/cancel.png";
import clock from "../assets/images/clock.png";
import { useFoundUserQuery, useGetUserProfileQuery, useLogoutUserQuery } from "../app/authApi";
import clockgif from "../assets/images/clock.gif";
import { useState,useEffect } from "react";

const Layout = () => {
  const [userLogout,setUserLogo]=useState(true);
  const modalShow = useAppSelector(getModalShow);
  const userId = useAppSelector(getSideBarUserID);
  const dispatch = useAppDispatch();
  const history=useNavigate();
  const { data, isError, isLoading, isSuccess, error } = useFoundUserQuery(userId,{ skip: !modalShow });
const { data: userDetails } = useGetUserProfileQuery();

const {data:userLogoOutData,isSuccess:userLogoSuccess} = useLogoutUserQuery("",{skip:userLogout});

useEffect(()=>{
  console.log(userLogoOutData,userLogoSuccess,userLogout);
   if(userLogoSuccess){
    dispatch(modalAction({ modal: !modalShow, userID: "" }))
    history("/signin");
   }
},[userLogout,userLogoOutData,userLogoSuccess]);


  return (
    <section className={`layout ${modalShow ? "layout-overflow-hide" : ""}`}>
      <Outlet/>
      {modalShow && (
        <div
          className="modal-section"
          onClick={() =>
            dispatch(modalAction({ modal: !modalShow, userID: "" }))
          }
        ></div>
      )}
      <div className={`user-detail-container ${modalShow ? "active" : ""}`}>
        <div className="user-detail-header">
          <p>Profile</p>
          <button
            type="button"
            className="primary-transparent-btn"
            onClick={() =>
              dispatch(modalAction({ modal: !modalShow, userID: "" }))
            }
          >
            <img src={cancel} alt="" className="profile-img-upload" />
          </button>
        </div>
        {isLoading ? (
          <div className="user-while-loader">
            <img src={clockgif} alt="clock" />
          </div>
        ) : (
          <div className="user-detail-body">
            <img src={data?.profile??user} alt="user" className="user-detail-profile" />
            <div className="user-detail-contact">
              <p className="user-detail-name">{data?.name}</p>
              <p className="user-detail-active">
                {
                  ((Date.now() - Number(new Date(data?.active?new Date(data?.active):""))) < 20 * 1000)? "Active":  "Away"
                }
                </p>
              <div className="d-flex align-items-center">
              <img src={clock} alt="clock" /> 
              <p className="user-detail-date">{new Date(data?.active?data?.active:"").toLocaleString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })} </p>
              </div>
            </div>
            <div className="user-detail-contact">
              <p className="user-detail-name">Contact</p>
              <p>{data?.email}</p>
            </div>
            {
              (data?._id===userDetails?.user._id)&&
            <button type="button" className="logout-btn" onClick={()=>setUserLogo(false)}>
              Logout 
            </button>
            }
          </div>
        )}
      </div>
      <Modal/>  
    </section>
  );
};

export default Layout;
