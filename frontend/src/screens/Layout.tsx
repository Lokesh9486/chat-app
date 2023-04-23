import { Link, Outlet } from "react-router-dom";
import user from "../assets/images/user.png";
import logo from "../assets/images/logo1.png";

const Layout = () => {
  return (
    <section>
      {/* <header>
        <div>
        <button type="button" className="logo-img"><img src={logo} alt="logo" /></button>
        <Link to="/userprofile"><img src={user} alt="user" /></Link>
        </div>
      </header> */}
        <Outlet></Outlet>      
    </section>
  )
}

export default Layout

