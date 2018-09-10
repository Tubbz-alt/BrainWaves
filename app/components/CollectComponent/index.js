// @flow
import React, { Component } from "react";
import { Modal, Button, Ref } from "semantic-ui-react";
import styles from "../styles/common.css";

import {
  EXPERIMENTS,
  DEVICES,
  CONNECTION_STATUS,
  DEVICE_AVAILABILITY
} from "../../constants/constants";
import { MainTimeline, Trial, Timeline } from "../../constants/interfaces";
import { isNil } from "lodash";
import PreTestComponent from "./PreTestComponent";
import ConnectModal from "./ConnectModal";

interface Props {
  experimentActions: Object;
  client: ?any;
  connectedDevice: Object;
  signalQualityObservable: ?any;
  deviceType: DEVICES;
  deviceAvailability: DEVICE_AVAILABILITY;
  connectionStatus: CONNECTION_STATUS;
  deviceActions: Object;
  availableDevices: Array<any>;
  type: ?EXPERIMENTS;
  isRunning: boolean;
  mainTimeline: MainTimeline;
  trials: { [string]: Trial };
  timelines: { [string]: Timeline };
  // dir: ?string,
  subject: string;
  session: number;
}

interface State {
  isConnectModalOpen: boolean;
}

export default class Collect extends Component<Props, State> {
  props: Props;
  state: State;
  handleStartConnect: () => void;

  constructor(props: Props) {
    super(props);
    this.state = {
      isConnectModalOpen: false
    };
    this.handleStartConnect = this.handleStartConnect.bind(this);
  }

  handleStartConnect() {
    this.setState({ isConnectModalOpen: true });
    this.props.deviceActions.setDeviceAvailability(
      DEVICE_AVAILABILITY.SEARCHING
    );
  }

  render() {
    return (
      <div className={styles.mainContainer}>
        <Modal
          basic
          open={this.props.connectionStatus !== CONNECTION_STATUS.CONNECTED}
          dimmer="inverted"
          size="small"
        >
          <Modal.Actions>
            <Button primary onClick={this.handleStartConnect}>
              Connect Device
            </Button>
          </Modal.Actions>
        </Modal>
        <ConnectModal
          open={this.state.isConnectModalOpen}
          client={this.props.client}
          connectedDevice={this.props.connectedDevice}
          signalQualityObservable={this.props.signalQualityObservable}
          deviceType={this.props.deviceType}
          deviceAvailability={this.props.deviceAvailability}
          connectionStatus={this.props.connectionStatus}
          deviceActions={this.props.deviceActions}
          availableDevices={this.props.availableDevices}
        />
        <PreTestComponent
          client={this.props.client}
          connectedDevice={this.props.connectedDevice}
          signalQualityObservable={this.props.signalQualityObservable}
          deviceType={this.props.deviceType}
          deviceAvailability={this.props.deviceAvailability}
          connectionStatus={this.props.connectionStatus}
          deviceActions={this.props.deviceActions}
          experimentActions={this.props.experimentActions}
          availableDevices={this.props.availableDevices}
          type={this.props.type}
          isRunning={this.props.isRunning}
          mainTimeline={this.props.mainTimeline}
          trials={this.props.trials}
          timelines={this.props.timelines}
          subject={this.props.subject}
          session={this.props.session}
        />
      </div>
    );
  }
}
