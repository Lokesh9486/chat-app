import user from "../assets/images/user.png";
const Userpage = () => {
  const formData=[{type:""}]
  return (
    <section className="user-page">
      <img src={user} alt="" className="user-page-logo" />
      <form action="">
        {[...Array(4)].map((_) => (
          <div className="log-input-con">
            <label className="log-label">Name</label>
            <input type="text"  className="log-input "/>
          </div>
        ))}
      </form>
    </section>
  );
};

export default Userpage;
