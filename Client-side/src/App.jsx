import { RouterProvider, createBrowserRouter, Navigate } from "react-router-dom";
import Signup from "./pages/Signup/Signup.jsx";
import Login from "./pages/Login/Login.jsx";
import Temperature from "./Components/Temperature/Temperature.jsx";
import LightLevel from "./Components/LightLevel/LightLevel.jsx";
import Humidity from "./Components/Humidity/Humidity.jsx";
import EnergyUsage from "./Components/EnergyUsage/EnergyUsage.jsx";
import AddnDltHome from "./Components/AddnDltHome/AddnDltHome.jsx";
import AddnDeleteUser from "./Components/AddnDeleteUser/AddnDeleteUser.jsx";
import Userlist from "./Components/UserList/UserList.jsx";
import Dashboard from "./pages/Dashboard/Dashboard.jsx";
import RemoveRoom from "./Components/RemoveRoom/RemoveRoom.jsx";
import AddRoom from "./Components/AddRoom/AddRoom.jsx";
import ResetPassword from "./pages/ResetPassword/ResetPassword.jsx"
import RequestResetPassword from "./pages/RequestResetPassword/RequestResetPassword.jsx";
import SuccessfulRequestResetPassword from "./pages/SuccessfulRequestResetPassword/SuccessfulRequestResetPassword.jsx";
import Weather from "./pages/weather/weather.jsx";
import EnergyRecomendations from "./Components/EnergyRecomendations/EnergyRecomendations.jsx";


function App() {
  const route = createBrowserRouter([
    {
      path: "/",
      element: <Navigate to="/signup" replace />, // Redirect root path to /signup
    },
    {
      path: "/Signup",
      element: <Signup />, // Signup page
    },
    {
      path: "/Login",
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
      path: "/AddnDeleteUser",
      element: <AddnDeleteUser />, // AddnDltHome page 
    },
    {
      path: "/Userlist", 
      element: <Userlist />,  // Userlist page 
    },
    {
      path: "/Dashboard", 
      element: <Dashboard />, // Dashboard page 
    },
    {
      path: "/AddRoom", 
      element: <AddRoom />, 
    },
    {
      path: "/RemoveRoom", 
      element: <RemoveRoom />, 
    },
    {
      path: "/ResetPassword", 
      element: <ResetPassword />, 
    },
    {
      path: "/RequestResetPassword",
      element:<RequestResetPassword />,
    },
    {
      path: "/SuccessfulRequestResetPassword",
      element:<SuccessfulRequestResetPassword />,
    },
    {
      path: "/weather",
      element:<Weather />
    },
    {
      path: "/EnergyRecomendations",
      element:<EnergyRecomendations />
    }
  ]);

  return (
    <div className="App">
      <RouterProvider router={route}></RouterProvider>
    </div>
  );
}

export default App;
