import "./App.css";
import CardComponent from "./components/cardComponent";
import Navbar from "./components/Layout";

function App() {
  return (
    <div>
      <Navbar />
      <div>
        <CardComponent />
      </div>
    </div>
  );
}

export default App;
