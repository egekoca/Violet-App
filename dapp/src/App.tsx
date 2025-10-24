import Landing from "./Pages/Landing.tsx";
import { LoginProvider } from "./contexts/LoginContext";
import LoginPopup from "./components/LoginPopup";
import WalletStatus from "./components/WalletStatus";

function App() {
  return (
    <LoginProvider>
      <Landing />
      <LoginPopup />
      <WalletStatus />
    </LoginProvider>
  );
}

export default App;
