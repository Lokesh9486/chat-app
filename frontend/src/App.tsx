import {BrowserRouter,Routes,Route} from "react-router-dom";
import Layout from "./screens/Layout";
import SignUp from "./screens/SignUp";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/style.scss";
import OTP from "./screens/OTP";
import Chat from "./screens/Chat";
import SignIn from "./screens/SignIn";

function App() {
  return (
    <BrowserRouter>
    <Routes>
    <Route path="/" element={<Layout/>}>
       <Route index  element={<SignUp/>}/>
       <Route path="/signin"  element={<SignIn/>}/>
       <Route path="/otp"  element={<OTP/>}/>
       <Route path="/chat"  element={<Chat/>}/>
    </Route>
    </Routes>
    </BrowserRouter>
  );
}

export default App;
