import { useState, useEffect, useRef, ChangeEvent } from "react";
import logo from "../assets/images/logo1.png";
import { Link, useNavigate } from "react-router-dom";
import { signUpInterface } from "../types";
import { useRegisterMutation } from "../app/authApi";
import anime from "animejs";
import  uploadImg from "../assets/images/uploadimage.png";

const SignUp = () => {
  const [signUp, { data, isError, isLoading, isSuccess, error }] =
    useRegisterMutation();
  const history = useNavigate();
  const [signUpdetail, setSignUpdetail] = useState<signUpInterface[]>([
    {
      type: "text",
      name: "userName",
      value: "",
      palceholder: " name",
      error: false,
      errMessage:"Name must contain 5-15 character"
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
      errMessage:"Passwrod must contain 5-15 character"
    },
  ]);
  const [preview,setPreview]=useState<any>("");
  const [proifle,setProfile]=useState<File | undefined>(undefined);

  useEffect(() => {
    if (isSuccess) {
      history("/otp", { state: { email: signUpdetail[1].value } });
    }
  }, [isSuccess]);

  const [animationRef, setAnimationRef] = useState<
    ReturnType<typeof anime> | undefined
  >();

  useEffect(() => {
    //   setAnimationRef(
    //     anime({
    //       targets: ".blur-round1",
    //       translateX: 500,
    //       translateY: 500,
    //       delay: function(el:HTMLElement, i:number) {
    //         return i * 100;
    //       },
    //       loop: true,
    //       direction: "alternate",
    //       easing: "easeInOutSine"
    //     }),
    // );
  }, []);

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
        return errorFunc(/[a-zA-Z]{5,15}/, value, item);
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
      signUp({
        name: signUpdetail[0].value,
        email: signUpdetail[1].value,
        password: signUpdetail[2].value,
      });
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
      console.log(`fileOnChange ~ e.target?.files:`, e.target?.files)
      reader.readAsDataURL(e.target.files?.[0])
    }
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
        <input type="file" id="register-img-upload" onChange={fileOnChange}/>
        <label htmlFor="register-img-upload" className="upload-img">
          <img src={uploadImg} alt="uploadImg" />
          Choose file
        </label>
        <div>
        <img src={preview} alt="preview"  className="profile-img-upload"/>
        <p className="image-name">{proifle?.name}</p>
        </div>
        <button type="submit" className="log-btn">
          SignUp
        </button>
        <p>Once sign up you receive OTP to email</p>
        <p>OTP expires in 30 minutes</p>
        <div className="split-topic">
          <Link to="/">Sign in</Link>
        </div>
      </form>
      <div className="blur-round1"></div>
      <div className="blur-round2"></div>
    </section>
  );
};

export default SignUp;
