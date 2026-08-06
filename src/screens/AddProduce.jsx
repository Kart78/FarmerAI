import ScreenHeader from "../components/ScreenHeader.jsx";
import SellingWorkflow from "../components/SellingWorkflow.jsx";

export default function AddProduce({ setScreen, openMenu }) {
  return (
    <div className="max-w-md mx-auto">
      <ScreenHeader title="Add Produce" setScreen={setScreen} openMenu={openMenu} />
      <SellingWorkflow onPublished={() => setScreen("dashboard")} />
    </div>
  );
}
