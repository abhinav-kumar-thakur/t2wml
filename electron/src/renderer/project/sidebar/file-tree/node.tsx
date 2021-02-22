
import React, { Component } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition, faChevronDown, faChevronRight, faTable, faStream, faColumns, faFile, faProjectDiagram, faList } from '@fortawesome/free-solid-svg-icons';
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import Dropzone from 'react-dropzone';
import './node.css';


export type NodeType = "DataFile" | "Sheet" | "Label" | "Yaml" | "Annotation" | "Wikifier" | "Entity"
const nodeToIconMapping = {
  "DataFile": faTable,
  "Sheet": faFile,
  "Label": null,
  "Yaml": faStream,
  "Annotation": faColumns,
  "Wikifier": faList,
  "Entity": faProjectDiagram,
};

export interface NodeProps {
  id: string;
  label: string;
  parentNode: NodeProps | null;
  childNodes: NodeProps[];
  type: NodeType;
  bolded?: boolean;
  onClick?: (node: NodeProps) => void,
  rightClick?: (node: NodeProps) => any,
  onDrop?: (files: File[], node: NodeProps) => void
}

interface NodeState {
  expanded: boolean;
  highlighted: boolean;
}

class FileNode extends Component<NodeProps, NodeState> {

  constructor(props: NodeProps) {
    super(props);
    this.state = {
      expanded: props.type == "Label" || props.bolded == true,
      highlighted: false
    }
  }

  componentDidUpdate(prevProps: NodeProps) {
    if ((prevProps.bolded !== this.props.bolded) && this.props.bolded) {
      this.setState({ expanded: true });
    }
  }

  onArrowClick() {
    this.setState({ expanded: !this.state.expanded });
  }

  async onNodeClick() {
    this.setState({ expanded: true });
    if (this.props.onClick) {
      this.props.onClick(this.props);
    }
  }

  onRightClick(event: any) {
    event.preventDefault();
    if (this.props.rightClick) {
      this.props.rightClick(this.props);
    }
  }

  onDrop(files: File[]) {
    if (this.props.onDrop) {
      this.props.onDrop(files, this.props);
    }
    this.setState({ highlighted: false })
  }

  onDragEnter() {
    this.setState({ highlighted: true, expanded: true  })
  }

  onDragLeave() {
    this.setState({ highlighted: false })
  }

  render() {
    let childrenNodes = null as any; //needed because of dropzone for some reason?
    if (this.props.childNodes.length && this.state.expanded) {
      childrenNodes = (<ul>
        {this.props.childNodes.map((n: NodeProps) =>
          <FileNode key={n.id}
            id={n.id}
            label={n.label}
            bolded={n.bolded}
            childNodes={n.childNodes}
            parentNode={n.parentNode}
            type={n.type}
            rightClick={n.rightClick}
            onClick={n.onClick}
            onDrop={n.onDrop}/>)}
      </ul>)
    }

    let arrowIcon = <em>{'\u00A0\u00A0'}</em> //align with entries that do have an arrow icon
    if (this.props.childNodes.length) {
      if (this.state.expanded) {
        arrowIcon = <FontAwesomeIcon icon={faChevronDown} size="xs" onClick={() => this.onArrowClick()} />
      } else {
        arrowIcon = <FontAwesomeIcon icon={faChevronRight} size="xs" onClick={() => this.onArrowClick()} />
      }
    }

    let typeIcon = null as any; //needed becaise of dropzone for some reason?
    if (nodeToIconMapping[this.props.type]) {
      typeIcon = <FontAwesomeIcon icon={nodeToIconMapping[this.props.type] as IconDefinition} size="xs" />
    }

    const labelText = this.props.bolded ? <b>{this.props.label}</b> : this.props.label

    const logoTooltipHtml = (
      <Tooltip /*style={{ width: "fit-content" }}*/ id="navbar-tooltip">
        {this.props.label}
      </Tooltip>
    );

    const backgroundStyle = this.state.highlighted ? {"background":"green"}:{};


    return (
      <Dropzone
        onDrop={(files) => this.onDrop(files)}
        noDragEventsBubbling={true}
        onDragEnter={() => (this.onDragEnter())}
        onDragLeave={() => (this.onDragLeave())}>
        {({ getRootProps, getInputProps }) =>
        (
          <li  {...getRootProps({ className: 'dropzone' })} style={backgroundStyle}>
            <OverlayTrigger overlay={logoTooltipHtml} delay={{ show: 1000, hide: 0 }} placement="top" trigger={["hover", "focus"]}>
              <label className="pointer ellipsis"
                onContextMenu={(e) => this.onRightClick(e)}
              >
                {arrowIcon} <span onClick={() => this.onNodeClick()}>{typeIcon} {labelText}</span>
              </label>
            </OverlayTrigger>
            {childrenNodes}
          </li>)}
      </Dropzone>
    )
  }
}
export default FileNode;
