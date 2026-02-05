import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes"; // Ajuste o caminho conforme sua pasta

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
