import "./App.css";
import { RouterProvider, createBrowserRouter, Navigate } from "react-router-dom";
import Signup from "./pages/signup/Signup.jsx";
import Login from "./pages/login/Login.jsx";
import Addndeleteuser from "./components/addndeleteuser/Addndeleteuser.jsx";
import Userlist from "./components/userlist/Userlist.jsx";

function App() {
  const route = createBrowserRouter([
    {
      path: "/",
      element: <Navigate to="/signup" replace />, // Redirect root path to /signup
    },
    {
      path: "/signup",
      element: <Signup />, // Signup page
    },
    {
      path: "/login",
      element: <Login />, // Login page
    },
    {
      path: "/addndeleteuser",
      element: <Addndeleteuser />, 
    },
    {
      path: "/userlist", 
      element: <Userlist />, 
    },
  ]);

  return (
    <div className="App">
      <RouterProvider router={route}></RouterProvider>
    </div>
  );
}

export default App;
