
import React, { Component } from 'react';

// App
import { Button, Col, Form, Modal, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';

import { observer } from "mobx-react";


interface CreateProperties {
    showCreateProjectModal: boolean;

    createProject: (
        path: string,
        title: string,
        description: string,
        url: string,
    ) => void;
    cancelCreateProject: () => void;
}

interface CreateState {
    path: string;
    title: string;
    description: string;
    url: string;
}

@observer
class CreateProject extends Component<CreateProperties, CreateState> {
  constructor(props: CreateProperties) {
    super(props);

    this.state = {
      path: '',
      title: '',
      description: '',
      url: '',
    };
  }

  createProject() {
      this.props.createProject(this.state.path, this.state.title, this.state.description, this.state.url);
  }

  openFile() {
      debugger
    // const result = await dialog.showOpenDialog( this.mainWindow!, {
    //         title: "Open Project Folder",
    //         properties: ['openDirectory', 'createDirectory']
    // });

    // if (!result.canceled && result.filePaths) {
    //     console.log(")))))))", result.filePaths[0]);
        
    //     this.setState({ path: result.filePaths[0] });
    // }
    
  }


  render() {
    return (
      <Modal show={this.props.showCreateProjectModal} onHide={() => { /* do nothing */ }}>

        {/* header */}
        <Modal.Header style={{ background: "whitesmoke" }}>
          <Modal.Title>New Project</Modal.Title>
        </Modal.Header>

        {/* body */}
        <Modal.Body>
          <Form className="container">
            <Form.Group as={Row} style={{ marginTop: "1rem" }}>
              <Col xs="9" md="9" className="pr-0">
                <Form.Label>
                  Choose a folder
                </Form.Label>
                <button
                  onClick={this.openFile()}
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} style={{ marginTop: "1rem" }}>
              <Col xs="9" md="9" className="pr-0">
                <Form.Label>
                  Title
                </Form.Label>
                <Form.Control
                  type="text"
                  defaultValue={this.state.title}
                  onChange={(event) => this.setState({ title: event.target?.value })}
                />
              </Col>
            </Form.Group>
            
            <Form.Group as={Row} style={{ marginTop: "1rem" }}>
              <Col xs="9" md="9" className="pr-0">
                <Form.Label>
                  Description
                </Form.Label>
                <Form.Control
                  type="text"
                  defaultValue={this.state.description}
                  onChange={(event) => this.setState({ description: event.target?.value })}
                />
              </Col>
            </Form.Group>
            
            <Form.Group as={Row} style={{ marginTop: "1rem" }}>
              <Col xs="9" md="9" className="pr-0">
                <Form.Label>
                  Data source URL
                </Form.Label>
                <Form.Control
                  type="text"
                  defaultValue={this.state.url}
                  onChange={(event) => this.setState({ url: event.target?.value })}
                />
              </Col>
            </Form.Group>
          </Form>
        </Modal.Body>

        {/* footer */}
        <Modal.Footer style={{ background: "whitesmoke" }}>
          <Button variant="outline-dark" onClick={() => this.props.cancelCreateProject()}>
            Cancel
          </Button>
          <OverlayTrigger placement="bottom" trigger={["hover", "focus"]}
            overlay={
              <Tooltip style={{ width: "fit-content" }} id="file">
                <div className="text-left small">
                  text here....
                </div>
              </Tooltip>
            }
          >
            <Button variant="dark" onClick={() => this.createProject()}>
              OK
            </Button>
          </OverlayTrigger>

        </Modal.Footer>
      </Modal >
    );
  }
}

export default CreateProject;
