import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { AuthData } from '../auth/AuthWrapper';
import { nav } from "./navigation";

const AppNavbar = () => {
    const { user } = AuthData();

    if (user === undefined) {
        return;
    }

    const login = () => {
        window.location.href="<keycloak_login_url>"
    }
    const logout = () => {
        window.location.href= "<keycloak_logout_url>"
    }

    return (
        <Navbar bg="dark" variant="dark" expand="lg" className="shadow-sm">
            <Container>
                <Navbar.Brand href="/" className="fw-bold">KeyCloak Authentication</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto">
                        {nav.map((r, i) => {
                            if (!r.isPrivate && r.isMenu) {
                                return (
                                    <Nav.Link key={i} href={r.path} className="text-light hover-light">
                                        {r.name}
                                    </Nav.Link>
                                );
                            } else if (user !== undefined) {
                                if (user.isAuthenticated && r.isMenu) {
                                    return (
                                        <Nav.Link key={i} href={r.path} className="text-light hover-light">
                                            {r.name}
                                        </Nav.Link>
                                    );
                                }
                            }
                            return null;
                        })}
                        {!user.isAuthenticated ?
                            <Nav.Link onClick={login} className="text-light hover-light">Login</Nav.Link>
                            :
                            <Nav.Link onClick={logout} className="text-light hover-light">Logout</Nav.Link>
                        }
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default AppNavbar;
