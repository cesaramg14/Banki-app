import {
    createBrowserRouter,
    createRoutesFromElements,
    Route,
} from "react-router-dom";
import App from "./App";
import NotFound from "./pages/NotFound/NotFound";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import VerifyRegister from "./pages/Register/VerifyRegister";
import { Profile } from "./pages/Profile/Profile";

const router = createBrowserRouter(
    createRoutesFromElements(
        <>
            <Route path="/" element={<App />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verifyRegister" element={<VerifyRegister />} />
            <Route path="/home" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            {/* Ruta 404 */}
            <Route path="*" element={<NotFound />} />
        </>
    )
);

export default router;
