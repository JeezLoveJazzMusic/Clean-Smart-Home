/*Made by Joe */
import { RouterProvider, createBrowserRouter, Navigate } from "react-router-dom";
import Signup from "./pages/signup/Signup.jsx";
import Login from "./pages/login/Login.jsx";
import Temperature from "./Components/Temperature/Temperature.jsx";
import LightLevel from "./Components/LightLevel/LightLevel.jsx";
import Humidity from "./Components/Humidity/Humidity.jsx";
import EnergyUsage from "./Components/EnergyUsage/EnergyUsage.jsx";
import AddnDltHome from "./Components/AddnDltHome/AddnDltHome.jsx";
import Addndeleteuser from "./Components/addndeleteuser/addndeleteuser.jsx";
import Userlist from "./components/userlist/Userlist.jsx";
import Dashboard from "./pages/dashboard/Dashboard.jsx";


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
      element: <Temperature />, // Temperature page /*Made by Joe */
    },
    {
      path: "/LightLevel",
      element: <LightLevel />, // LightLevel page /*Made by Joe */
    },
    {
      path: "/Humidity",
      element: <Humidity />, // Humidity page /*Made by Joe */
    },
    {
      path: "/EnergyUsage",
      element: <EnergyUsage />, // EnergyUsage page /*Made by Joe */
    },
    {
      path: "/AddnDltHome",
      element: <AddnDltHome />, // AddnDltHome page /*Made by Joe */
    } ,
    {
      path: "/addndeleteuser",
      element: <Addndeleteuser />, // AddnDltHome page /*Made by Joe */
    },
    {
      path: "/userlist", 
      element: <Userlist />,  // Userlist page /*Made by Joe */
  },
  {
    path: "/Dashboard", 
    element: <Dashboard />, // Dashboard page /*Made by Joe */
  }
 
  ]);

  return (
    <div className="App">
      <RouterProvider router={route}></RouterProvider>
    </div>
  );
}

export default App;
