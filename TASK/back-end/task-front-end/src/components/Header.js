import React from 'react'; // Import the React module to use React functionalities
import Row from 'react-bootstrap/Row'; // Import Bootstrap Row component
import Col from 'react-bootstrap/Col'; // Import Bootstrap Column component


//Header function component
export default function Header() {
    //============JSX RENDERING===============
  return (
      <header id="header">
          <Row>
              <Col>
                  <h1 className="h1">TO-DO LIST</h1>
              </Col>
          </Row>
      </header>
  )
}
