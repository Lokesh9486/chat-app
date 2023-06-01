import {Routes,Route} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import SignUp from "./screens/SignUp";
import "./styles/style.scss";
import OTP from "./screens/OTP";
import Chat from "./screens/Chat";
import SignIn from "./screens/SignIn";
import AuthProvider from "./components/AuthProvider";
import { AnimatePresence  } from "framer-motion";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

function App() {
  const location=useLocation();
  const [isUnmounting, setIsUnmounting] = useState(false);

  useEffect(() => {
    setIsUnmounting(true);
    const timeout = setTimeout(() => {
      setIsUnmounting(false);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [location.pathname]);
  return (
    <AnimatePresence mode="wait">
    <Routes location={location} key={location.pathname} >
       <Route index element={<AuthProvider><Chat/></AuthProvider>}/>
       <Route path="/signup"  element={<SignUp/>}/>
       <Route path="/signin"  element={<SignIn/>}/>
       <Route path="/otp"  element={<OTP/>}/>
    </Routes>
    </AnimatePresence>
    
  );
}

export default App;
