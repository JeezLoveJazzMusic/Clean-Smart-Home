
import { RouterProvider, createBrowserRouter, Navigate } from "react-router-dom";
import Signup from "./pages/signup/Signup.jsx";
import Login from "./pages/login/Login.jsx";
import Temperature from "./Components/Temperature/Temperature.jsx";
import LightLevel from "./Components/LightLevel/LightLevel.jsx";
import Humidity from "./Components/Humidity/Humidity.jsx";
import EnergyUsage from "./Components/EnergyUsage/EnergyUsage.jsx";
import AddnDltHome from "./Components/AddnDltHome/AddnDltHome.jsx";
import Addndeleteuser from "./Components/addndeleteuser/Addndeleteuser.jsx";
import Userlist from "./Components/userlist/Userlist.jsx";
import Dashboard from "./pages/dashboard/Dashboard.jsx";
<<<<<<< HEAD
import ResetPassword from "./pages/ResetPassword/ResetPassword.jsx";
import RequestResetPassword from "./pages/RequestResetPassword/RequestResetPassword.jsx";
import SuccessfulRequestResetPassword from "./pages/SuccessfulRequestResetPassword/SuccessfulRequestResetPassword.jsx"; // Standardized naming
=======
import RemoveRoom from "./Components/removeroom/Removeroom";
import AddRoom from "./Components/addroom/Addroom.jsx";
>>>>>>> 2980564864d7b663168eec3e7f49a6e493567891


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
      path: "/Temperature",
      element: <Temperature />, // Temperature page 
    },
    {
      path: "/LightLevel",
      element: <LightLevel />, // LightLevel page 
    },
    {
      path: "/Humidity",
      element: <Humidity />, // Humidity page 
    },
    {
      path: "/EnergyUsage",
      element: <EnergyUsage />, // EnergyUsage page 
    },
    {
      path: "/AddnDltHome",
      element: <AddnDltHome />, // AddnDltHome page 
    } ,
    {
      path: "/addndeleteuser",
      element: <Addndeleteuser />, // AddnDltHome page 
    },
    {
      path: "/userlist", 
      element: <Userlist />,  // Userlist page 
  },
  {
    path: "/Dashboard", 
<<<<<<< HEAD
    element: <Dashboard />, // Dashboard page /*Made by Joe */
  },
  {
    path: "/ResetPassword",
    element: <ResetPassword />,
  },
  {
    path: "/RequestResetPassword",
    element: <RequestResetPassword />,
  },
  {
    path: "/SuccessfulRequestResetPassword",
    element: <SuccessfulRequestResetPassword />, // Add new success page
=======
    element: <Dashboard />, // Dashboard page 
  },
  {
    path: "/addroom", 
    element: <AddRoom />, 
  },
  {
    path: "/removeroom", 
    element: <RemoveRoom />, 
>>>>>>> 2980564864d7b663168eec3e7f49a6e493567891
  }
  ]);

  return (
    <div className="App">
      <RouterProvider router={route}></RouterProvider>
    </div>
  );
}

export default App;
