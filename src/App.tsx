// import Login from "./components/Login";
// import Map from "./components/Map";

// export default function App() {
//   return (

//     // <Login/>
//     <Map></Map>
//   )
// }


import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Map from "./components/Map";
import Analyse from "./components/Analyse";
import ManageAddresses from "./components/ManageAddresses";
// import Login from "./components/Login";
import First from "./components/First";
import SelectLocation from "./components/SelectLocation";

function App() {
  return (
    <Router>
      
      <Routes>
        <Route path="/other-Location" element={<Map />} />
        <Route path="/" element={<First/>} />
        <Route path="/Select-Location" element={<SelectLocation />} />
        <Route path="/manage" element={<ManageAddresses />} />
        <Route path="/analyse" element={<Analyse />} />
      </Routes>
    </Router>
  );
}

export default App;
