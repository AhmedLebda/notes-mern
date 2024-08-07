import { Outlet } from "react-router-dom";
import NavBar from "../../components/general/NavBar";
import Footer from "../../components/general/Footer";
import { Container } from "@mui/material";

const MainLayout = () => {
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                minHeight: "100vh",
            }}
        >
            <NavBar />
            <Container sx={{ flexGrow: 1 }} component="main">
                <Outlet></Outlet>
            </Container>
            <Footer />
        </div>
    );
};

export default MainLayout;
