import {BrowserRouter,Routes,Route} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import Layout from "./screens/Layout";
import SignUp from "./screens/SignUp";
import "./styles/style.scss";
import OTP from "./screens/OTP";
import Chat from "./screens/Chat";
import SignIn from "./screens/SignIn";
import AuthProvider from "./components/AuthProvider";
import Userpage from "./screens/Userpage";

function App() {
  return (
    <BrowserRouter>
    <Routes>
    <Route path="/" element={<Layout/>}>
       <Route index  element={<AuthProvider><Chat/></AuthProvider>}/>
       <Route path="/userprofile"  element={<Userpage/>}/>
    </Route>
       <Route path="/signup"  element={<SignUp/>}/>
       <Route path="/signin"  element={<SignIn/>}/>
       <Route path="/otp"  element={<OTP/>}/>
    </Routes>
    </BrowserRouter>
  );
}

export default App;
