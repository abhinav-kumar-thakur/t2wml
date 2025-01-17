import React, { Component } from 'react';
import { observer } from "mobx-react"
import Output from './cell-output/output';
import WikifyMenu from './wikify-menu';
import { Col, Container, Row } from 'react-bootstrap';
import "../../project.css";

@observer
class CellTab extends Component {
    render() {
        return (
            <Container>
                <Row>
                    <Col>
                        <WikifyMenu />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Output />
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default CellTab;
