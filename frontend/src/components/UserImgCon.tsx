import { useAppDispatch, useAppSelector } from "../app/hooks";
import user from "../assets/images/user.png";
import { getModalShow, modalAction } from "../features/auth";

const UserImgCon = ({profile,status,id}:{profile:string,status:string,id?:string}) => {
  const dispatch=useAppDispatch();
  const modalShow=useAppSelector(getModalShow);
  return (
    <button type="button"  className={`sidebar-user primary-transparent-btn ${status}`}
    onClick={()=>dispatch(modalAction({modal:!modalShow,userID:id}))}>
      <img src={profile ?? user} alt="user" className="profile-img-upload" />
    </button>
  );
};

export default UserImgCon;
