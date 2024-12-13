import { useNavigate } from "react-router-dom";
import "./App.css";
import BackgroundComponent from "./components/BackgroundComponent";
import { useEffect } from "react";
import { SEO } from "./components/SEO/SEO";
import logoBanki from './assets/logo-banki2.svg'

function App() {
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate("/login");
        }, 5000);

        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <>
            <SEO
                title="BANKI"
                description="Bienvenido a la página de inicio de nuestro sitio web. Aquí podrás encontrar información importante."
                keywords={["inicio", "bienvenida", "sitio web"]}
                image={logoBanki}
                url="https://localhost:5173/home"
                type="website"
            />
            <BackgroundComponent>
                <div className="d-flex flex-column align-items-center justify-content-center">
                    <img
                        src={logoBanki}
                        alt="Banki"
                        style={{
                            width: "100%",
                            height: "90vh",
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                    />
                    <div className="spinner-border text-success" role="status">
                        <span className="sr-only"></span>
                    </div>
                </div>
            </BackgroundComponent>
        </>
    );
}

export default App;
