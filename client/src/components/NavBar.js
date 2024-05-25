import "bootstrap/dist/css/bootstrap.css";
import { Row, Col, Button, Image, Container, Modal, Dropdown } from 'react-bootstrap';
import DropdownMenu from './DropdownMenu';

function NavBar() {

    return (
        <Container>
            <DropdownMenu />
        </Container>
    );
};

export default NavBar;