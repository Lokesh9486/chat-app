import { Link, Outlet } from "react-router-dom";
import user from "../assets/images/user.png";
import logo from "../assets/images/logo1.png";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { getModalShow, modalAction,getSideBarUserID } from "../features/auth";
import Modal from "../components/Modal";
import cancel from "../assets/images/cancel.png";
import clock from "../assets/images/clock.png";
import { useFoundUserQuery } from "../app/authApi";
import clockgif from "../assets/images/clock.gif";

const Layout = () => {
  const modalShow = useAppSelector(getModalShow);
  const userId = useAppSelector(getSideBarUserID);
  const dispatch = useAppDispatch();
  const { data, isError, isLoading, isSuccess, error } = useFoundUserQuery(userId,{ skip: !modalShow }
);

  return (
    <section className={`layout ${modalShow ? "layout-overflow-hide" : ""}`}>
      {/* <header>
        <div>
        <button type="button" className="logo-img"><img src={logo} alt="logo" /></button>
        <Link to="/userprofile"><img src={user} alt="user" /></Link>
        </div>
      </header> */}
      <Outlet></Outlet>
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
              <div>
              <img src={clock} alt="clock" /> 
              <p className="user-detail-date">{data?.active?new Date(data?.active).toString():""} </p>
              </div>
            </div>
            <div className="user-detail-contact">
              <p className="user-detail-name">Contact</p>
              <p>{data?.email}</p>
            </div>
          </div>
        )}
      </div>
      {/* <Modal/>   */}
    </section>
  );
};

export default Layout;
