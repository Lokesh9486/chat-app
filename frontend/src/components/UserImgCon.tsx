import { useAppDispatch, useAppSelector } from "../app/hooks";
import {useState} from "react";
import user from "../assets/images/user.png";
import group from "../assets/images/group.png";
import name from "../assets/images/name.png";
import email from "../assets/images/email.png";
import online from "../assets/images/online.png";
import description from "../assets/images/description.png";
import offline from "../assets/images/offline.png";
import groupIcon from "../assets/images/groupicon.png";
import { useFoundUserQuery, useLogoutUserQuery } from "../app/authApi";
import { useGetSingleGroupQuery } from "../app/groupApi";
import { Fragment } from "react";

const UserImgCon = ({profile,id,isGroup,isUser}:{profile:string,id:string,isGroup?:boolean,isUser?:boolean}) => {
  const [userLogout,setUserLogo]=useState(true);
  const {data} = useFoundUserQuery(id);
  const {data:groupData}=useGetSingleGroupQuery(id);
  const active=((Date.now() - Number(new Date(data?.active?new Date(data?.active):""))) < 20 * 1000) ;
  const {data:userLogoOutData,isSuccess:userLogoSuccess} = useLogoutUserQuery("",{skip:userLogout});

  return (
    <div className="dropdown">
    <button type="button" data-bs-toggle="dropdown"  
    className={`sidebar-user dropdown-toggle primary-transparent-btn 
    ${active ? " currently-active" : ""}`}
    >
      <img src={profile||(isGroup?group: user)} alt="user" className="profile-img-upload" />
    </button>
    <div className="dropdown-menu sidebar-dropdown-con">
    {isGroup&&<h6 className="user-detail">Create by : <span>{groupData?.[0]?.created_by}</span> </h6>}
      <div className="img-con ">
      <img src={profile||(isGroup?group: user)} alt="user" className="profile-img-upload border-end" />
      <div className="ps-3" style={{width: "calc(100% - 5em)"}}>
      {
        isGroup?
        <Fragment>
          <p className="user-detail"><img src={groupIcon} alt="groupIcon"  className="user-icon"/>{groupData?.[0]?.name}</p>
          <p className="user-detail"><img src={description} alt="description"  className="user-icon"/>{groupData?.[0]?.description}</p>
        </Fragment>
        :
        <Fragment>
          <p className="user-detail"><img src={name} alt="name"  className="user-icon"/>{data?.name}</p>
          <p className="user-detail"><img src={email} alt="email"  className="user-icon"/>{data?.email}</p>
          <p className="user-detail"><img src={active?online:offline} alt=""  className="user-icon"/>{active? "Active":  "Away"}</p>
          {isUser&& <button type="button" className="logout-btn"onClick={()=>setUserLogo(false)}>logout</button>}
        </Fragment>
      }
      </div>
      </div>
      {isGroup&&
        <div className="participance-con border-top">
          <h6>Participants :</h6>
          <ul className="participants-user-con">
            {
              groupData?.[0]?.participance.map(({name,profile,email},index)=>
                <li key={index}><img src={profile??user} alt="user" className="participance-logo" /><span>{name}</span><span>({email})</span></li>
              )
            }
          </ul>
        </div>}
    </div>
  </div>
  );
};

export default UserImgCon;
