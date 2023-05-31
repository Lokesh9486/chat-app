import { useAppDispatch, useAppSelector } from "../app/hooks";
import user from "../assets/images/user.png";
import group from "../assets/images/group.png";
import name from "../assets/images/name.png";
import email from "../assets/images/email.png";
import online from "../assets/images/online.png";
import description from "../assets/images/description.png";
import offline from "../assets/images/offline.png";
import groupIcon from "../assets/images/groupicon.png";
import { getModalShow, modalAction } from "../features/auth";
import { useFoundUserQuery } from "../app/authApi";
import { useGetSingleGroupQuery } from "../app/groupApi";
import { Fragment } from "react";

const UserImgCon = ({profile,status,id,isGroup}:{profile:string,status:string,id:string,isGroup?:boolean}) => {
  // const dispatch=useAppDispatch();
  // const modalShow=useAppSelector(getModalShow);
  
  const { data, isError, isLoading, isSuccess, error } = useFoundUserQuery(id);
  const {data:groupData}=useGetSingleGroupQuery(id);
  console.log(`UserImgCon ~ groupData:`, groupData)
  // console.log(data);
  const active=((Date.now() - Number(new Date(data?.active?new Date(data?.active):""))) < 20 * 1000) ;
  return (
    <div className="dropdown">
    <button type="button" data-bs-toggle="dropdown"  className={`sidebar-user dropdown-toggle primary-transparent-btn ${status}`}
    // onClick={()=>dispatch(modalAction({modal:!modalShow,userID:id}))}
    >
      <img src={profile||(isGroup?group: user)} alt="user" className="profile-img-upload" />
    </button>
    <div className="dropdown-menu sidebar-dropdown-con">
      <div className="img-con ">
      <img src={profile||(isGroup?group: user)} alt="user" className="profile-img-upload border-end" />
      <div className="ps-3">
      {
        isGroup?
        <Fragment>
          <p className="user-detail"><img src={groupIcon} alt=""  className="user-icon"/>{groupData?.[0]?.name}</p>
          <p className="user-detail"><img src={description} alt=""  className="user-icon"/>{groupData?.[0]?.description}</p>
        </Fragment>
        :
        <Fragment>
          <p className="user-detail"><img src={name} alt=""  className="user-icon"/>{data?.name}</p>
          <p className="user-detail"><img src={email} alt=""  className="user-icon"/>{data?.email}</p>
          <p className="user-detail"><img src={active?online:offline} alt=""  className="user-icon"/>{active? "Active":  "Away"}</p>
        </Fragment>
      }
      </div>
      </div>
      {isGroup&&
        <div className="participance-con border-top">
          <h6 className="user-detail"><span>Create by :</span> {groupData?.[0]?.created_by}</h6>
          <h6>Participants :</h6>
          <ul>
            {
              groupData?.[0]?.participance.map(({name,profile},index)=>
                <li key={index}><img src={profile??user} alt="user" className="participance-logo" /><span>{name}</span></li>
              )
            }
          </ul>
        </div>}
    </div>
  </div>
  );
};

export default UserImgCon;
