import "./App.css";
import {
  RouterProvider,
  createBrowserRouter,
  Navigate,
} from "react-router-dom";
import Signup from "./pages/signup/Signup.jsx";
import Login from "./pages/login/Login.jsx";
import Temperature from "./Components/Temperature/Temperature.jsx";
import LightLevel from "./Components/LightLevel/LightLevel.jsx";
import Humidity from "./Components/Humidity/Humidity.jsx";
import EnergyUsage from "./Components/EnergyUsage/EnergyUsage.jsx";
import AddnDltHome from "./Components/AddnDltHome/AddnDltHome.jsx";
import Addndeleteuser from "./Components/addndeleteuser/Addndeleteuser.jsx";
import Userlist from "./Components/userlist/Userlist.jsx";
import AddDevicePopup from "./Components/AddDevicePopup/AddDevicePopup.jsx";
import RemoveDevicePopup from "./Components/RemoveDevicePopup/RemoveDevicePopup.jsx";

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
    },
    {
      path: "/addndeleteuser",
      element: <Addndeleteuser />,
    },
    {
      path: "/userlist",
      element: <Userlist />,
    },
    {
      path: "/AddDevicePopup",
      element: <AddDevicePopup />,
    },
    {
      path: "/RemoveDevicePopup",
      element: <RemoveDevicePopup />,
    },
  ]);

  return (
    <div className="App">
      <RouterProvider router={route}></RouterProvider>
    </div>
  );
}

export default App;
