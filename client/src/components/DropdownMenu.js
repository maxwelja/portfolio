import { Dropdown, DropdownButton } from 'react-bootstrap';

function DropdownMenu() {

    return (
        <div className="Dropdown">
            <header>
                <DropdownButton id="dropdown-basic-button" title="≡">
                    <Dropdown.Item href="/Home">Home</Dropdown.Item>
                    <Dropdown.Item href="/Resumé">Resumé</Dropdown.Item>
                    <Dropdown.Item href="/CoverLetter">Cover Letter</Dropdown.Item>
                    <Dropdown.Item href="/Solo">Solo Projects</Dropdown.Item>
                    <Dropdown.Item href="/Group">Group Projects</Dropdown.Item>
                </DropdownButton>
            </header>
        </div>
    );
};

export default DropdownMenu;