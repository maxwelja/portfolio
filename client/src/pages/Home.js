import "bootstrap/dist/css/bootstrap.css";
import { Row, Col, Button, Image, Container, Modal } from 'react-bootstrap';
import NavBar from '../components/NavBar';

function Home(){

    return (
        <Col className="mainColumn">
            <NavBar />
        </Col>
    )
}

export default Home;