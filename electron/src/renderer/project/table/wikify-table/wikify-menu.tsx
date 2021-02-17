import React from 'react';

import './wikify-menu.css';
import WikifyForm from './wikify-form';

import Draggable from 'react-draggable';
import { Toast } from 'react-bootstrap';
import { ErrorMessage } from '../../../common/general';
import RequestService from '../../../common/service';
import { QNode } from '@/renderer/common/dtos';
import { Cell } from '../../../common/general';
import wikiStore from '../../../data/store';
import * as utils from '../table-utils';


interface WikifyMenuProperties {
  selectedCell: Cell;
  position: Array<number>;
  wikifyCellContent?: string;
  onClose: () => void;
}


interface WikifyMenuState {
  errorMessage: ErrorMessage;
}


class WikifyMenu extends React.Component<WikifyMenuProperties, WikifyMenuState> {

  private requestService: RequestService;

  constructor(props: WikifyMenuProperties) {
    super(props);

    this.requestService = new RequestService();

    this.state = {
      errorMessage: {} as ErrorMessage,
    };
  }

  async handleOnChange(key: string, value: string) {
    console.log('WikifyMenu OnChange triggered for -> ', key, value);

    if ( value.length < 4 ) { return; }
    try {
      await this.requestService.call(this, () => (
        this.requestService.getQNodes(value)
      ));
    } catch (error) {
      error.errorDescription += `\nWasn't able to find any qnodes for ${value}`;
      this.setState({ errorMessage: error });
    } finally {
      console.log('qnodes request finished');
    }
  }

  async handleOnSubmit(qnode: QNode, applyToBlock: boolean) {
    console.log('WikifyMenu OnSubmit triggered for -> ', qnode);

    wikiStore.table.showSpinner = true;
    wikiStore.wikifier.showSpinner = true;
    wikiStore.yaml.showSpinner = true;

    const { selectedCell, wikifyCellContent } = this.props;
    const { col, row } = selectedCell;
    const selection = [[col, row], [col, row]];

    try {
      await this.requestService.call(this, () => (
        this.requestService.postQNodes({
          value: wikifyCellContent,
          applyToBlock,
          selection,
          ...qnode,
        })
      ));
    } catch (error) {
      error.errorDescription += `\nWasn't able to submit the qnode!`;
      this.setState({ errorMessage: error });
    } finally {
      wikiStore.table.showSpinner = false;
      wikiStore.wikifier.showSpinner = false;
      wikiStore.yaml.showSpinner = false;

      // Close the wikify menu on submit
      this.props.onClose();
    }
  }

  renderHeader() {
    const { selectedCell } = this.props;
    if (!selectedCell) { return null; }
    const { col, row } = selectedCell;
    return (
      <Toast.Header className="handle">
        <strong className="mr-auto">
          Selected: {utils.columnToLetter(col + 1)}{row + 1}
        </strong>
      </Toast.Header>
    )
  }

  renderWikifyForms() {
    const { selectedCell } = this.props;
    return (
      <WikifyForm
        selectedCell={selectedCell}
        onChange={this.handleOnChange.bind(this)}
        onSubmit={this.handleOnSubmit.bind(this)} />
    )
  }

  render() {
    const { position, onClose } = this.props;
    return (
      <Draggable handle=".handle"
        defaultPosition={{x: position[0], y: position[1]}}>
        <div className="wikify-menu">
          <Toast onClose={onClose}>
            {this.renderHeader()}
            <Toast.Body>
              {this.renderWikifyForms()}
            </Toast.Body>
          </Toast>
        </div>
      </Draggable>
    )
  }
}


export default WikifyMenu
