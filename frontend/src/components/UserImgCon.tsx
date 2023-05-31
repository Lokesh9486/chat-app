import { useAppDispatch, useAppSelector } from "../app/hooks";
import user from "../assets/images/user.png";
import group from "../assets/images/group.png";
import { getModalShow, modalAction } from "../features/auth";

const UserImgCon = ({profile,status,id,isGroup}:{profile:string,status:string,id?:string,isGroup?:boolean}) => {
  console.log("UserImgCon ~ isGroup:", isGroup)
  const dispatch=useAppDispatch();
  const modalShow=useAppSelector(getModalShow);
  return (
    <button type="button"  className={`sidebar-user primary-transparent-btn ${status}`}
    onClick={()=>dispatch(modalAction({modal:!modalShow,userID:id}))}>
      <img src={isGroup?(profile||group):(profile || user)} alt="user" className="profile-img-upload" />
    </button>
  );
};

export default UserImgCon;
