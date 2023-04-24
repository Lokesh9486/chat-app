import { ChangeEvent, SyntheticEvent, useEffect, useState } from "react";
import logo from "../assets/images/logo1.png";
import {Link, useLocation, useNavigate} from "react-router-dom";
import { useOtpVerificationMutation } from "../app/authApi";
const OTP = () => {
    const {state:{email}}=useLocation();
    const history = useNavigate();
    const [otp,setOtp]=useState<string>("");
    const [error,setError]=useState<boolean>(false);
    const  [otpVerfy,{data,isError,isLoading,isSuccess}]=useOtpVerificationMutation();

    useEffect(()=>{
      if(isSuccess){
        history("/");
       }
    },[isSuccess])

    const otpSubmit=(e:SyntheticEvent)=>{
      e.preventDefault();
      if(!otp.match(/[0-9]{4}/)){
        setError(true)              
      }
      else{
        setError(false);
        otpVerfy({email,otp});
      }
    }
    
  return (
    <section className="otp-screen">
        <form action="" onSubmit={otpSubmit}>
        <img src={logo} alt="logo" className="logo" />
        <p className="secondary-topic logo-topic">OTP verification</p>
        <div className="position-relative">
        <input type="number"  className="log-input" onChange={(e:ChangeEvent<HTMLInputElement>)=>setOtp(e.target.value)} value={otp}/>
        {(isError|| error) &&<p className="error-msg">*OTP does not match or expired</p>}
        </div>
        <button type="submit" className="log-btn">Submit</button>
        <Link to="/">Resend OTP</Link>
        </form>   
    </section>
  )
}

export default OTP
