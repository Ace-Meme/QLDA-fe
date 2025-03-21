import "./App.css";
import { RootPath } from "./screens/Root";
import { Provider } from "react-redux";
import store from "./redux/store.js";
function App() {
    return (
        <Provider store={store}>
            <RootPath />
        </Provider>
    );
}

export default App;
