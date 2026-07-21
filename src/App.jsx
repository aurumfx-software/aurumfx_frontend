import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// import Sidebar from "./components/Sidebar";
// import Navbar from "./components/Navbar";


import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
// import Products from "./pages/Products";
// import Categories from "./pages/Categories";
// import Users from "./pages/Users";

import "./App.css";

// function Layout() {
//   return (
//     <div className="app">
//       {/* <Sidebar /> */}

//       <div className="main">
//         {/* <Navbar /> */}
//         <div className="content">
//           <Routes>
//             <Route path="/dashboard" element={<Dashboard />} />
//             {/* <Route path="/products" element={<Products />} />
//             { <Route path="/categories" element={<Categories />} /> */}
//             {/* <Route path="/users" element={<Users />} /> */}
//             <Route path="*" element={<Navigate to="/dashboard" replace />} />
//           </Routes>
//         </div>
//       </div>
//     </div>
//   );
// }

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
