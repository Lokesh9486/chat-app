import user from "../assets/images/user.png";

const UserImgCon = ({profile,status}:{profile:string,status:string}) => {
  return (
    <div className={`sidebar-user ${status}`}>
      <img src={profile ?? user} alt="user" className="profile-img-upload" />
    </div>
  );
};

export default UserImgCon;
