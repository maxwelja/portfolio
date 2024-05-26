import 'bootstrap/dist/css/bootstrap.css';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Row, Col, Button, Image, Container, Modal, Dropdown } from 'react-bootstrap';
import DropdownMenu from './DropdownMenu';

function NavBar() {
    const location = useLocation();
    const [pageTitle, setPageTitle] = useState('');

    useEffect(() => {
        const routeToTitleMap = {
            '/Home': 'Home',
            '/CoverLetter': 'Cover Letter',
            '/Solo': 'Solo Projects',
            '/Group': 'Group Projects'
        };
        const currentPath = location.pathname;
        const title = routeToTitleMap[currentPath] || 'Resumé';
        setPageTitle(title);

    }, [location.pathname]);

    return (
        <Container className="NavBar">
            <DropdownMenu />
            <h1> {pageTitle} </h1>
            <Image className="logo" alt="logo" src="images/logo192.png" />
        </Container>
    );
};

export default NavBar;