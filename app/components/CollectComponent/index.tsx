import { Observable } from 'rxjs';
import React, { Component } from 'react';
import { isNil } from 'lodash';
import {
  EXPERIMENTS,
  DEVICES,
  CONNECTION_STATUS,
  DEVICE_AVAILABILITY
} from '../../constants/constants';
import {
  MainTimeline,
  Trial,
  ExperimentParameters,
  SignalQualityData
} from '../../constants/interfaces';
import PreTestComponent from './PreTestComponent';
import ConnectModal from './ConnectModal';
import RunComponent from './RunComponent';
import { ExperimentActions, DeviceActions } from '../../actions';

export interface Props {
  history: HashHistory;
  ExperimentActions: typeof ExperimentActions;
  connectedDevice: object;
  deviceType: DEVICES;
  deviceAvailability: DEVICE_AVAILABILITY;
  connectionStatus: CONNECTION_STATUS;
  DeviceActions: typeof DeviceActions;
  availableDevices: Array<any>;
  type: EXPERIMENTS;
  signalQualityObservable: Observable<SignalQualityData>;
  isRunning: boolean;
  params: ExperimentParameters;
  paradigm: EXPERIMENTS;
  mainTimeline: MainTimeline;
  trials: {
    [key: string]: Trial;
  };
  timelines: {};
  subject: string;
  group: string;
  session: number;
  isEEGEnabled: boolean;
  title: string;
}

interface State {
  isConnectModalOpen: boolean;
  isRunComponentOpen: boolean;
}

export default class Collect extends Component<Props, State> {
  // handleConnectModalClose: () => void;
  // handleRunComponentOpen: () => void;
  // handleRunComponentClose: () => void;
  constructor(props: Props) {
    super(props);
    this.state = {
      isConnectModalOpen: false,
      isRunComponentOpen: !props.isEEGEnabled
    };
    this.handleStartConnect = this.handleStartConnect.bind(this);
    this.handleConnectModalClose = this.handleConnectModalClose.bind(this);
    this.handleRunComponentOpen = this.handleRunComponentOpen.bind(this);
    this.handleRunComponentClose = this.handleRunComponentClose.bind(this);
    if (isNil(props.params)) {
      props.ExperimentActions.LoadDefaultTimeline();
    }
  }

  componentDidMount() {
    if (
      this.props.connectionStatus !== CONNECTION_STATUS.CONNECTED &&
      this.props.isEEGEnabled
    ) {
      this.handleStartConnect();
    }
  }

  componentDidUpdate = (prevProps: Props, prevState: State) => {
    if (
      this.props.connectionStatus === CONNECTION_STATUS.CONNECTED &&
      prevState.isConnectModalOpen
    ) {
      this.setState({ isConnectModalOpen: false });
    }
  };

  handleStartConnect() {
    this.setState({ isConnectModalOpen: true });
    this.props.DeviceActions.SetDeviceAvailability(
      DEVICE_AVAILABILITY.SEARCHING
    );
  }

  handleConnectModalClose() {
    this.setState({ isConnectModalOpen: false });
  }

  handleRunComponentOpen() {
    this.setState({ isRunComponentOpen: true });
  }

  handleRunComponentClose() {
    this.setState({ isRunComponentOpen: false });
  }

  render() {
    if (this.state.isRunComponentOpen) {
      return <RunComponent {...this.props} />;
    }
    return (
      <>
        <ConnectModal
          history={this.props.history}
          open={this.state.isConnectModalOpen}
          onClose={this.handleConnectModalClose}
          connectedDevice={this.props.connectedDevice}
          signalQualityObservable={this.props.signalQualityObservable}
          deviceType={this.props.deviceType}
          deviceAvailability={this.props.deviceAvailability}
          connectionStatus={this.props.connectionStatus}
          DeviceActions={this.props.DeviceActions}
          availableDevices={this.props.availableDevices}
        />
        <PreTestComponent
          connectedDevice={this.props.connectedDevice}
          signalQualityObservable={this.props.signalQualityObservable}
          deviceType={this.props.deviceType}
          deviceAvailability={this.props.deviceAvailability}
          connectionStatus={this.props.connectionStatus}
          DeviceActions={this.props.DeviceActions}
          ExperimentActions={this.props.ExperimentActions}
          availableDevices={this.props.availableDevices}
          type={this.props.type}
          paradigm={this.props.paradigm}
          isRunning={this.props.isRunning}
          params={this.props.params}
          mainTimeline={this.props.mainTimeline}
          trials={this.props.trials}
          timelines={this.props.timelines}
          subject={this.props.subject}
          group={this.props.group}
          session={this.props.session}
          openRunComponent={this.handleRunComponentOpen}
        />
      </>
    );
  }
}
