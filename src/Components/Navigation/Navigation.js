import React from 'react';
import {Container, Nav, Navbar, NavDropdown} from  "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./Navigation.css";

class Navigation extends React.Component {
    render()  {
        return <Navbar className="customNavBackground" collapseOnSelect expand="lg" bg="dark" variant="dark" sticky={"top"}>
                <Container>
                    <Navbar.Brand className="brandText" href="/">Pathology</Navbar.Brand>
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className="me-auto">
                            <NavDropdown className="dropShadow" title="Visualize" id="langCollapsible" menuVariant={'dark'}>
                                <NavDropdown.Item>A*</NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

    }
}

export default Navigation