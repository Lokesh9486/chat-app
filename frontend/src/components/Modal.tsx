import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { getModalShow, modalAction } from "../features/auth";
import { signUpInterface } from "../types";
import searchIcon from "../assets/images/seacrh.png";
import userImage from "../assets/images/user.png";
import tickImg from "../assets/images/tick.png";
import chipCancel from "../assets/images/chipcancel.png";


const Modal = () => {
  const [signUpdetail, setSignUpdetail] = useState<signUpInterface[]>([
    {
      type: "text",
      name: "group_name",
      value: "",
      palceholder: "Group Name",
      error: false,
      errMessage:"Name must contain 3-15 character"
    },
    {
      type: "text",
      name: "description",
      value: "",
      palceholder: "Description",
      error: false,
      errMessage:"Please enter description"
    },
  ]);
  const participants=useState()
  function inputChange(trigger: string, value: string) {
    const filterData = signUpdetail.map((item) => {
      if (item.name === trigger) {
        item["value"] = value;
        return item;
      }
      return item;
    });
    setSignUpdetail(filterData);
  }
  return (
<div className="modal fade show" id="groupCreation" tabIndex={-1} style={{display: "block"}}>
  <div className="modal-dialog modal-dialog-centered">
    <div className="modal-content">
      <div className="modal-header border-0">
        <h1 className="modal-title fs-5" id="exampleModalLabel">Create group</h1>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className="modal-body">
        <form action="">
        {signUpdetail.map(
          ({ name, type, value, palceholder,error,errMessage}, index: number) => (
            <div className="position-relative" key={index}>
            <input
              type={type}
              value={value}
              placeholder={palceholder}
              className={`log-input ${error?"error":""}`}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                inputChange(name, e.target.value)
              }
            />
            {
             error && <p className="error-msg">{errMessage}</p>
            }
            </div>
          )
        )}
        <div className="search-user-con">
          <div className="input-con">
          <input type="text" placeholder="Search participants"/>
          <button type="button"><img src={searchIcon} alt="searchIcon" />
          <img src="" alt="" />
          </button>
          </div>
          <ul className="chip-con">
            <li><img src={userImage} className="user-logo" alt="userImage" />
             <span>user1</span> <button type="button" className="cancel-btn">
              <img src={chipCancel} alt="" /></button></li>
            <li><img src={userImage} className="user-logo" alt="userImage" />
             <span>user1</span> <button type="button" className="cancel-btn">
              <img src={chipCancel} alt="" /></button></li>
            <li><img src={userImage} className="user-logo" alt="userImage" />
             <span>user1</span> <button type="button" className="cancel-btn">
              <img src={chipCancel} alt="" /></button></li>
            <li><img src={userImage} className="user-logo" alt="userImage" />
             <span>user1</span> <button type="button" className="cancel-btn">
              <img src={chipCancel} alt="" /></button></li>
            <li><img src={userImage} className="user-logo" alt="userImage" />
             <span>user1</span> <button type="button" className="cancel-btn">
              <img src={chipCancel} alt="" /></button></li>
            <li><img src={userImage} className="user-logo" alt="userImage" />
             <span>user1</span> <button type="button" className="cancel-btn">
              <img src={chipCancel} alt="" /></button></li>
            <li><img src={userImage} className="user-logo" alt="userImage" />
             <span>user1</span> <button type="button" className="cancel-btn">
              <img src={chipCancel} alt="" /></button></li>
            <li><img src={userImage} className="user-logo" alt="userImage" />
             <span>user1</span> <button type="button" className="cancel-btn">
              <img src={chipCancel} alt="" /></button></li>
            <li><img src={userImage} className="user-logo" alt="userImage" />
             <span>user1</span> <button type="button" className="cancel-btn">
              <img src={chipCancel} alt="" /></button></li>
            <li><img src={userImage} className="user-logo" alt="userImage" />
             <span>user1</span> <button type="button" className="cancel-btn">
              <img src={chipCancel} alt="" /></button></li>
          </ul>
          <ul className="search-participants-con">
            <li className="active"><img src={userImage} alt="userImage" /> <span>user1</span> <img src={tickImg} className="tick-img" alt="tickImg" /></li>
            <li>user2</li>
            <li>user3</li>
            <li>user1</li>
            <li>user2</li>
            <li>user3</li>
            <li>user1</li>
            <li>user2</li>
            <li>user3</li>
            <li>user1</li>
            <li>user2</li>
            <li>user3</li>
          </ul>
        </div>
        </form>
      </div>
    </div>
  </div>
</div>
  );
};

export default Modal;
