import { ChangeEvent, SyntheticEvent, useEffect, useState } from "react";
import logo from "../assets/images/postboxlogo.jpg";
import {Link, useLocation, useNavigate} from "react-router-dom";
import { useOtpVerificationMutation } from "../app/authApi";
import dotLoader from "../assets/images/dotloader.gif";

const OTP = () => {
    const {state:{email}}=useLocation();
    const history = useNavigate();
    const [otp,setOtp]=useState<string>("");
    const [error,setError]=useState<boolean>(false);
    const  [otpVerfy,{data,isError,isLoading,isSuccess,error:otpError}]=useOtpVerificationMutation();
    
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
        <div className="logo-setup">
        <img src={logo} alt="logo" className="logo" />
        <p className="logo-text">postbox</p>
        </div>
        <p className="secondary-topic logo-topic">OTP verification</p>
        <div className="position-relative">
        <input type="number"  className="log-input" onChange={(e:ChangeEvent<HTMLInputElement>)=>setOtp(e.target.value)} value={otp}/>
        {(isError|| error) &&<p className="error-msg">{error?((otpError as any)?.data):"*OTP does not match or expired"}</p>}
        </div>
        {
          isLoading? <img src={dotLoader} alt="" className="loader-img m-auto"/>:
        <button type="submit" className="log-btn">Submit</button>
        }
        <Link to="/">Resend OTP</Link>
        </form>   
    </section>
  )
}

export default OTP
