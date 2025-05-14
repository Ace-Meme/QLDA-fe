import "./App.css";
import { RootPath } from "./screens/Root/index.jsx";
import { Provider } from "react-redux";
import store from "./redux/store.js";
import "bootstrap/dist/css/bootstrap.min.css";
function App() {
    return (
        <Provider store={store}>
            <RootPath />
        </Provider>
    );
}

export default App;
