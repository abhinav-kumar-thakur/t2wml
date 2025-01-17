import React, { Component } from 'react';
import '../project.css';
import '../ag-grid.css';
import '../ag-theme-balham.css';

// App
import { Button, Col, Dropdown, Form, Modal, Row, InputGroup } from 'react-bootstrap';

import Config from '@/shared/config';

import { observer } from "mobx-react";


interface SettingsProperties {
    showSettings: boolean;
    endpoint: string;
    warnEmpty: boolean;
    calendar: string;
    title: string;
    description: string;
    url: string;

    handleSaveSettings: (
      endpoint: string,
      warn: boolean,
      calendar: string,
      title: string,
      description: string,
      url: string,
    ) => void;
    cancelSaveSettings: () => void;
}

interface SettingsState {
  tmpWarnEmpty: boolean;
  title: string;
  description?: string;
  url?: string;
}

const calendarOptions = [
  {text: "Leave Untouched", value: "leave"},
  {text: "Replace with Gregorian", value: "replace"},
  {text: "Add Gregorian", value: "add"}
];

@observer
class Settings extends Component<SettingsProperties, SettingsState> {
  private tempSparqlEndpointRef: React.RefObject<HTMLInputElement>;
  private tempCalendarRef: React.RefObject<HTMLInputElement>;

  constructor(props: SettingsProperties) {
    super(props);

    this.tempSparqlEndpointRef = React.createRef();
    this.tempCalendarRef = React.createRef();

    this.state = {
      tmpWarnEmpty: this.props.warnEmpty,
      title: this.props.title,
      description: this.props.description,
      url: this.props.url,
    }
  }

  componentDidUpdate(prevProps: SettingsProperties) {
    if (prevProps.title !== this.props.title) {
      this.setState({
        tmpWarnEmpty: this.props.warnEmpty,
        title: this.props.title,
        description: this.props.description,
        url: this.props.url,
      });
    }
  }

  handleSaveSettings() {
    const endpoint = (this.tempSparqlEndpointRef as any).current.value;
    const warn = this.state.tmpWarnEmpty;
    const calendar = calendarOptions.find(c => c.text === (this.tempCalendarRef as any).current.value)!.value;
    const title = this.state.title;
    const description = this.state.description || '';
    const url = this.state.url || '';
    this.props.handleSaveSettings(endpoint, warn, calendar, title, description, url);
  }

  render() {
    const sparqlEndpoints = [
      Config.defaultSparqlEndpoint,
      "https://query.wikidata.org/sparql"
    ];
    const handleClose = () => this.props.cancelSaveSettings()
    return (
      <Modal show={this.props.showSettings} size="lg" onHide={handleClose}>

        {/* header */}
        <Modal.Header  closeButton style={{ background: "whitesmoke" }}>
          <Modal.Title>Project Settings</Modal.Title>
        </Modal.Header>

        {/* body */}
        <Modal.Body>
          <Form className="container">
            {/* title */}
            <Form.Group as={Row} style={{ marginTop: "1rem" }}>
              <Form.Label column sm="12" md="3" className="text-right">
                Title
              </Form.Label>
              <Col sm="12" md="9">
                <Form.Control
                  defaultValue={this.props.title}
                  onChange={(event) => this.setState({ title: event?.target.value })}/>
                  {this.state.title ? null : <label style={{ "color": "#FF0000"}}>Title cannot be left blank</label>}
              </Col>
            </Form.Group>

            {/* description */}
            <Form.Group as={Row} style={{ marginTop: "1rem" }}>
              <Form.Label column sm="12" md="3" className="text-right">
                Description
              </Form.Label>
              <Col sm="12" md="9">
                <Form.Control
                  defaultValue={this.props.description}
                  onChange={(event) => this.setState({ description: event?.target.value })}/>
              </Col>
            </Form.Group>

            {/* url */}
            <Form.Group as={Row} style={{ marginTop: "1rem" }}>
              <Form.Label column sm="12" md="3" className="text-right">
                Data source URL
              </Form.Label>
              <Col sm="12" md="9">
                <Form.Control
                  defaultValue={this.props.url}
                  onChange={(event) => this.setState({ url: event?.target.value })}/>
              </Col>
            </Form.Group>

            {/* sparql endpoint */}
            <Form.Group as={Row} style={{ marginTop: "1rem" }}>
              <Form.Label column sm="12" md="3" className="text-right">
                SPARQL&nbsp;endpoint
              </Form.Label>
              <Col sm="12" md="9">
                <Dropdown as={InputGroup} alignRight>
                  <Form.Control
                    type="text"
                    defaultValue={this.props.endpoint}
                    ref={this.tempSparqlEndpointRef}
                    onKeyDown={(event: any) => event.stopPropagation()} // or Dropdown would get error
                  />
                  <Dropdown.Toggle split variant="outline-dark" id="endpoint"/>
                  <Dropdown.Menu style={{ width: "100%" }}>
                    <Dropdown.Item onClick={() => (this.tempSparqlEndpointRef as any).current.value = sparqlEndpoints[0]}>{sparqlEndpoints[0]}</Dropdown.Item>
                    <Dropdown.Item onClick={() => (this.tempSparqlEndpointRef as any).current.value = sparqlEndpoints[1]}>{sparqlEndpoints[1]}</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Col>
            </Form.Group>

            {/* warn for empty cells */}
            <Form.Group as={Row} style={{ marginTop: "1rem" }}>
              <Form.Label column sm="12" md="3" className="text-right">
                Warn for empty cells
              </Form.Label>
              <Col sm="12" md="9">
                <input type="checkbox"
                  style={{ width: '25px', height: '25px', marginTop: '5px' }}
                  defaultChecked={(this.props.warnEmpty)}
                  onChange={(event) => this.setState({ tmpWarnEmpty: event?.target.checked })}/>
              </Col>
            </Form.Group>

            {/* calendar settings */}
            <Form.Group as={Row} style={{ marginTop: "1rem" }}>
              <Form.Label column sm="12" md="3" className="text-right">
              Non-Gregorian Calendar
              </Form.Label>
              <Col sm="12" md="9">
                <Dropdown as={InputGroup} alignRight>
                  <Form.Control
                    type="text"
                    defaultValue={calendarOptions.find(c => c.value === this.props.calendar)!.text}
                    ref={this.tempCalendarRef}
                    onKeyDown={(event: any) => event.stopPropagation()} // or Dropdown would get error
                  />
                  <Dropdown.Toggle split variant="outline-dark" id="calendar"/>
                  <Dropdown.Menu style={{ width: "100%" }}>
                    {calendarOptions.map((option, index) => (
                      <Dropdown.Item key={index}
                        onClick={() => (this.tempCalendarRef as any).current.value = option.text}>
                        {option.text}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              </Col>
            </Form.Group>
          </Form>

        </Modal.Body>

        {/* footer */}
        <Modal.Footer style={{ background: "whitesmoke" }}>
          <Button variant="outline-dark" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="dark" onClick={() => this.handleSaveSettings()} disabled={!this.state.title}>
            Save
          </Button>
        </Modal.Footer>

      </Modal>
    );
  }
}

export default Settings;
