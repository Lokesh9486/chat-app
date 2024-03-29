import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/images/postboxlogo.png";
import { SyntheticEvent, useState, useEffect } from "react";
import { useLoginMutation } from "../app/authApi";
import dotLoader from "../assets/images/dotloader.gif";
import { chatApi, useGetChatDetailsQuery } from "../app/chatApi";
import { useAppDispatch } from "../app/hooks";
import { motion } from "framer-motion";
import { SuccessMsg } from "../components/SuccessMsg";



const SignIn = () => {
  const history = useNavigate();
  const [state, setState] = useState<{
    [email: string]: string;
    password: string;
  }>({ email: "", password: "" });
  const [errorState, setErrorState] = useState<{
    email: boolean;
    password: boolean;
  }>({ email: false, password: false });
  const [loginApi, { data, isError, isLoading, isSuccess, error, status }] =
    useLoginMutation();
const dispatch=useAppDispatch();

const errorHandler = (match: string, regex: RegExp) => {
    if (!state[match].match(regex)) {
      return setErrorState((prev) => ({ ...prev, [match]: true }));
    } else {
      return setErrorState((prev) => ({ ...prev, [match]: false }));
    }
  };

  const formSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    errorHandler("email", /\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/);
    errorHandler("password", /[A-Za-z\d]{8,}/);
  };

  useEffect(() => {
    if (
      !Object.values(errorState).every((item) => item === true) &&
      !Object.values(state).every((item) => item.length < 1)
    ) {
      loginApi(state);
    }
  }, [errorState]);
  
  useEffect(() => {
    if (isSuccess) {
      dispatch(chatApi.util.resetApiState());
      setTimeout(()=> history("/"),1000)
    }
  }, [isSuccess]);

  const variants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, y: "0"},
    exit: { opacity: 0, y: "100%" }
  };

  return (
    <section className="sign-in">
      {/* <div
      className={`message-con ${isSuccess?"active":""}`}
      >
        <img src={successIson} alt="" />
        <div>
          <h5>Success</h5>
          <p>Login successfull</p>
        </div>
        </div> */}
        <SuccessMsg isSuccess={isSuccess} message="Login successfull"/>
      <motion.form
      initial={variants.initial}
      animate={ variants.animate}
      exit={variants.exit}
      transition={{ duration: 0.5 }}
       onSubmit={formSubmit}>
        <div className="logo-setup">
        <img src={logo} alt="logo" className="logo" />
        <p className="logo-text">postbox</p>
        </div>
        <p className="secondary-topic logo-topic">Sign In</p>
        <div className="position-relative">
          <input
            type="email"
            placeholder="Email"
            className="log-input"
            onChange={(e) => setState({ ...state, email: e.target.value })}
          />
          {errorState.email && (
            <p className="error-msg">Please enter proper email address</p>
          )}
        </div>
        <div className="position-relative">
          <input
            type="password"
            placeholder="Password"
            className="log-input"
            onChange={(e) => setState({ ...state, password: e.target.value })}
          />
          {errorState.password && (
            <p className="error-msg">Passwrod must contain 8-15 character</p>
          )}
        </div>
        {isLoading ? (
          <img src={dotLoader} alt="" className="loader-img" />
        ) : (
          <button type="submit" className="log-btn">
            Sign In
          </button>
        )}
        <div className="position-relative">
          <p className="error-msg">{(error as any)?.data}</p>
        </div>

        <Link to="/signup">Sign Up</Link>
      </motion.form>
    </section>
  );
};

export default SignIn;
