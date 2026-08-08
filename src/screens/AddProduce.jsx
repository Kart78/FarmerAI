import ScreenHeader from "../components/ScreenHeader.jsx";
import SellingWorkflow from "../components/SellingWorkflow.jsx";
import { useAuth } from "../hooks/useAuth.jsx";

export default function AddProduce({ setScreen, openMenu }) {
  const { farmer } = useAuth();
  return (
    <div className="max-w-md mx-auto">
      <ScreenHeader title="Add Produce" setScreen={setScreen} openMenu={openMenu} />
      <SellingWorkflow farmer={farmer} onPublished={() => setScreen("dashboard")} />
    </div>
  );
}
