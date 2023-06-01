import { useState, useEffect, ChangeEvent } from "react";
import logo from "../assets/images/postboxlogo.png";
import { Link, useNavigate } from "react-router-dom";
import { signUpInterface } from "../types";
import { useRegisterMutation } from "../app/authApi";
import  uploadImg from "../assets/images/uploadimage.png";
import user from "../assets/images/user.png";
import dotLoader from "../assets/images/dotloader.gif";
import { motion  } from "framer-motion";

const SignUp = () => {
  const [signUp, { data, isError, isLoading, isSuccess, error }] =useRegisterMutation();
  const history = useNavigate();
  const [signUpdetail, setSignUpdetail] = useState<signUpInterface[]>([
    {
      type: "text",
      name: "userName",
      value: "",
      palceholder: " name",
      error: false,
      errMessage:"Name must contain 3-15 character"
    },
    {
      type: "email",
      name: "userEmail",
      value: "",
      palceholder: " email",
      error: false,
      errMessage:"Please enter proper email address"
    },
    {
      type: "password",
      name: "userPassword",
      value: "",
      palceholder: " password",
      error: false,
      errMessage:"Passwrod must contain 8-15 character"
    },
  ]);
  const [preview,setPreview]=useState<any>("");
  const [proifle,setProfile]=useState<any>(undefined);

  useEffect(() => {
    if (isSuccess) {
      history("/otp", { state: { email: signUpdetail[1].value } });
    }
  }, [isSuccess]);

  function inputChange(trigger: string, value: string) {
    const filterData = signUpdetail.map((item) => {
      if (item.name === trigger) {
        item["value"] = value;
        return item;
      }
      return item;
    });
    setSignUpdetail(filterData);
  }

  function registerSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    const errorFunc = (
      patt: RegExp,
      value: string | undefined,
      item: signUpInterface
    ) => {
      if (!value?.match(patt)) {
        item["error"] = true;
      } else {
        item["error"] = false;
      }
      return item;
    };
    const errorMap: signUpInterface[] = signUpdetail.map((item) => {
      const { type, value } = item;
      if (type === "text") {
        return errorFunc(/[a-zA-Z]{3,15}/, value, item);
      }
      if (type === "email") {
        return errorFunc(
          /\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/,
          value,
          item
        );
      }
      if (type === "password") {
        return errorFunc(/[A-Za-z\d]{8,}/, value, item);
      }
      return item;
    });
    setSignUpdetail(errorMap);
    const errorValu = errorMap.every(({ error }) => !error);
    if (errorValu) {
      const formData=new FormData();
      formData.append("name",signUpdetail[0].value)
      formData.append("email",signUpdetail[1].value)
      formData.append("password",signUpdetail[2].value)
      formData.append("profile",proifle);
      signUp(formData);
    }
  }
  
  const fileOnChange=(e:ChangeEvent<HTMLInputElement>)=>{
    const reader=new FileReader();
    reader.onload=()=>{
      if(reader.readyState===2){
        setPreview(reader.result);
        setProfile(e.target.files?.[0]);
      }
    }
    if(e.target?.files){
      reader.readAsDataURL(e.target.files?.[0])
    }
  }
  const variants = {
    initial: { opacity: 0, y: "-100%" },
    animate: { opacity: 1, y: "0"},
    exit: { opacity: 0, y: "100%"  }
  };

  return (
    <section
     className="sign-screen">
      
      <motion.form
      initial={variants.initial}
      animate={variants.animate}
      exit={variants.exit}
      transition={{ duration: 0.5 }}
      onSubmit={registerSubmit}>
      <div className="logo-setup">
        <img src={logo} alt="logo" className="logo" />
        <p className="logo-text">postbox</p>
        </div>
        <p className="secondary-topic logo-topic">Sign Up</p>
        <p className="sign-info">
          Please Sign Up and start chat with <br /> your friends
        </p>
        {signUpdetail.map(
          ({ name, type, value, palceholder,error,errMessage}, index: number) => (
            <div className="position-relative" key={index}>
            <input
              type={type}
              value={value}
              placeholder={palceholder}
              className={`log-input ${error?"error":""}`}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                inputChange(name, e.target.value)
              }
            />
            {
             error && <p className="error-msg">{errMessage}</p>
            }
            </div>
          )
        )}
        <input type="file" accept="image/*" id="register-img-upload" onChange={fileOnChange}/>
        <label htmlFor="register-img-upload" className="upload-img">
          <img src={uploadImg} alt="uploadImg" />
          Choose file
        </label>
        <div className="d-flex align-items-center  gap-3">
        <img src={preview||user} alt="preview"   className="profile-img-upload"/>
        <p className="image-name">{proifle?.name || ""}</p>
        </div>
        {isError&&<div className="position-relative">
             <p className="error-msg">{(error as any)?.data}</p>
            </div>}
        {isLoading? <img src={dotLoader} alt="" className="loader-img m-auto"/>:<button type="submit" className="log-btn">
          SignUp
        </button>}
        <div>
        <p>Once sign up you receive OTP to email</p>
        <p>OTP expires in 30 minutes</p>
        </div>
        <div className="split-topic">
          <Link to="/signin">Sign in</Link>
        </div>
      </motion.form>
    </section>
  );
};

export default SignUp;
