import { useState,useEffect } from "react";
import logo from "../assets/images/logo1.png";
import { Link,useNavigate } from "react-router-dom";
import { signUpInterface } from "../types";
import { useAppDispatch } from "../app/hooks";
import { useRegisterMutation } from "../app/authApi";

const SignUp = () => {
  const [signUp,{data,isError,isLoading,isSuccess,error,}]=useRegisterMutation();
  const history=useNavigate();
  const [signUpdetail, setSignUpdetail] = useState<signUpInterface[]>([
    {
      type: "text",
      name: "userName",
       value:"" ,
      palceholder: " name",
    },
    {
      type: "email",
      name: "userEmail",
       value:"" ,
      palceholder: " email",
    },
    {
      type: "password",
      name: "userPassword",
       value:"" ,
      palceholder: " password",
    },
  ]);

  useEffect(()=>{
      if(isSuccess){
        history('/otp',{state:{email:signUpdetail[1].value}});
      }
  },[isSuccess])
 
  function inputChange(trigger: string, value: string) {
    const filterData = signUpdetail.map((item) => {
      if (item.name === trigger) {
          item["value"]=value;
          return item;
      } 
      return item
    });
    setSignUpdetail(filterData);
  }
  

  function registerSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    signUp({
      name:signUpdetail[0].value,
      email:signUpdetail[1].value,
      password:signUpdetail[2].value
    })
  }
  return (
    <section className="sign-screen">
      <form action="" onSubmit={registerSubmit}>
        <img src={logo} alt="logo" className="logo" />
        <p className="secondary-topic logo-topic">Sign Up</p>
        <p className="sign-info">
          Please Sign Up and start chat with <br /> your friends
        </p>
        {signUpdetail.map(
          ({ name, type, value, palceholder }, index: number) => (
            <input
              key={index}
              type={type}
              value={value}
              placeholder={palceholder}
              className="log-input"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                inputChange(name, e.target.value)
              }
            />
          )
        )}
        <button type="submit" className="log-btn">
          SignUp
        </button>
        <p>Once sign up you receive OTP to email</p>
        <p>OTP expires in 30 minutes</p>
        <div className="split-topic">
          <Link to="/">Sign in</Link>
        </div>
      </form>
    </section>
  );
};

export default SignUp;
