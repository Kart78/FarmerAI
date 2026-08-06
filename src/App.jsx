import { useState } from "react";
import Sidebar from "./components/Sidebar.jsx";
import TopBar from "./components/TopBar.jsx";
import BottomNav from "./components/BottomNav.jsx";
import Dashboard from "./screens/Dashboard.jsx";
import AddProduce from "./screens/AddProduce.jsx";
import MyListings from "./screens/MyListings.jsx";
import Orders from "./screens/Orders.jsx";
import Deliveries from "./screens/Deliveries.jsx";
import AiAssistant from "./screens/AiAssistant.jsx";
import Notifications from "./screens/Notifications.jsx";
import Payments from "./screens/Payments.jsx";
import Customers from "./screens/Customers.jsx";
import Settings from "./screens/Settings.jsx";
import { FARMER } from "./data/mock.js";

export default function App() {
  const [screen, setScreen] = useState("dashboard");
  const [menuOpen, setMenuOpen] = useState(false);
  const openMenu = () => setMenuOpen(true);
  const closeMenu = () => setMenuOpen(false);

  const renderScreen = () => {
    switch (screen) {
      case "dashboard":
        return <Dashboard setScreen={setScreen} openMenu={openMenu} />;
      case "add-produce":
        return <AddProduce setScreen={setScreen} />;
      case "products":
        return <MyListings setScreen={setScreen} openMenu={openMenu} />;
      case "orders":
        return <Orders setScreen={setScreen} openMenu={openMenu} />;
      case "deliveries":
        return <Deliveries setScreen={setScreen} openMenu={openMenu} />;
      case "ai":
        return <AiAssistant setScreen={setScreen} openMenu={openMenu} />;
      case "notifications":
        return <Notifications setScreen={setScreen} openMenu={openMenu} />;
      case "payments":
        return <Payments setScreen={setScreen} openMenu={openMenu} />;
      case "customers":
        return <Customers setScreen={setScreen} openMenu={openMenu} />;
      case "settings":
        return <Settings setScreen={setScreen} openMenu={openMenu} />;
      default:
        return <Dashboard setScreen={setScreen} openMenu={openMenu} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <TopBar onMenuClick={openMenu} />
      <div className="flex flex-1 min-h-0">
        <Sidebar screen={screen} setScreen={setScreen} farmer={FARMER} mobileOpen={menuOpen} closeMobile={closeMenu} />
        <main className="flex-1 p-4 sm:p-5 pb-20 md:pb-5 overflow-y-auto min-w-0">{renderScreen()}</main>
      </div>
      <BottomNav screen={screen} setScreen={setScreen} />
    </div>
  );
}
