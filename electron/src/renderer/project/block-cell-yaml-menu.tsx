import React, { Component } from 'react';
import { observer } from "mobx-react"
import wikiStore from '../data/store';
import { Tab, Tabs } from 'react-bootstrap';
import YamlEditor from './yaml-editor/yaml-editor';
import CellTab from './cell-tab';
import BlockTab from './block-tab';

@observer
class BlockCellYamlMenu extends Component {
    render() {
        return (
            <div className="w-100 shadow-sm h-100" style={{ margin: "2px" }}>
                <Tabs defaultActiveKey="Cell" id="tabs" transition={false}>
                    <Tab eventKey="Cell" title="Cell">
                        <CellTab />
                    </Tab>
                    <Tab eventKey="block" title="Block">
                        <BlockTab />
                    </Tab>
                    <Tab eventKey="yaml" title="YAML">
                        <YamlEditor isShowing={true} />
                    </Tab>
                </Tabs>
            </div>
        );
    }
}

export default BlockCellYamlMenu;