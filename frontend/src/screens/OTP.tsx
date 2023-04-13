import logo from "../assets/images/logo1.png";
import {useLocation} from "react-router-dom";
const OTP = () => {
    const {state:{email}}=useLocation()
  return (
    <section className="otp-screen">
        <form action="" >
        <img src={logo} alt="logo" className="logo" />
        <p className="secondary-topic logo-topic">Sign Up</p>
        <input type="number" />
        <button type="button">Submit</button>
        </form>  
    </section>
  )
}

export default OTP
