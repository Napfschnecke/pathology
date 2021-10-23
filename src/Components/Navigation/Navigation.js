import React from 'react';
import {Container, Navbar} from  "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./Navigation.css";

class Navigation extends React.Component {
    render()  {
        return <Navbar className="customNavBackground" collapseOnSelect expand="lg" bg="dark" variant="dark" sticky={"top"}>
                <Container>
                    <Navbar.Brand className="brandText" href="/">Pathology</Navbar.Brand>
                </Container>
            </Navbar>

    }
}

export default Navigation