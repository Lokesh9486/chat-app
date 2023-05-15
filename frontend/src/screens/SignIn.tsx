import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/images/postboxlogo.jpg";
import { SyntheticEvent, useState, useEffect } from "react";
import { useLoginMutation } from "../app/authApi";
import dotLoader from "../assets/images/dotloader.gif";

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
      return history("/");
    }
  }, [isSuccess]);

  return (
    <section className="sign-in">
      <form action="" onSubmit={formSubmit}>
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
      </form>
    </section>
  );
};

export default SignIn;
