import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Doctors from "./pages/Doctor";
import Hospitals from "./pages/Hospital";

function App() {
  const [currentPage, setCurrentPage] = useState("dashboard");

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard />;
      case "doctors":
        return <Doctors />;
      case "hospitals":
        return <Hospitals />;
      // case "productions":
      //   return <Productions />;
      // case "transfers":
      //   return <Transfers />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
      <div className="ml-64 p-8">
        <div className="max-w-7xl mx-auto">{renderPage()}</div>
      </div>
    </div>
  );
}

export default App;
