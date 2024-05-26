import "bootstrap/dist/css/bootstrap.css";
import { useState } from 'react';
import { Row, Col, Button, Image, Container, Modal } from 'react-bootstrap';
import NavBar from '../components/NavBar';
import BitHeroGame from "../components/BitHeroGame";

function Home(){
    const [refreshKey, setRefreshKey] = useState(0);

    const refreshGame = () => {
        setRefreshKey(oldKey => oldKey + 1);
    };

    return (
        <>
            <div className="main">
                <Col className="mainColumn">
                    <Row>
                        <NavBar />
                    </Row>
                    <Row>
                        <Col>
                            <Container>
                                <Col>
                                    <Button onClick={refreshGame}> Reset </Button>
                                    <Button> button 2 </Button>
                                </Col>
                                <Col>
                                    <Button> button 3 </Button>
                                    <Button> button 4 </Button>
                                </Col>
                            </Container>
                            <Container>
                                <BitHeroGame key={refreshKey} />
                            </Container>
                        </Col>
                    </Row>                    
                </Col>
            </div>
        </>
    )
}

export default Home;