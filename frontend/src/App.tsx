import {BrowserRouter,Routes,Route} from "react-router-dom";
import Layout from "./screens/Layout";
import SignUp from "./screens/SignUp";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/style.scss";

function App() {
  return (
    <BrowserRouter>
    <Routes>
    <Route path="/" element={<Layout/>}>
       <Route index  element={<SignUp/>}/>
    </Route>
    </Routes>
    </BrowserRouter>
  );
}

export default App;
