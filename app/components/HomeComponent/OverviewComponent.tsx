import React, { Component } from 'react';
import { Grid, Header, Button, Segment } from 'semantic-ui-react';
import { isNil } from 'lodash';
import styles from '../styles/common.css';
import { EXPERIMENTS } from '../../constants/constants';
import SecondaryNavComponent from '../SecondaryNavComponent';
import PreviewExperimentComponent from '../PreviewExperimentComponent';
import PreviewButton from '../PreviewButtonComponent';
import { loadProtocol } from '../../utils/labjs/functions';

enum OVERVIEW_STEPS {
  OVERVIEW = 'OVERVIEW',
  BACKGROUND = 'BACKGROUND',
  PROTOCOL = 'PROTOCOL',
}

interface Props {
  type: EXPERIMENTS;
  protocol: string;
  background: string;
  background_title: string;
  overview: string;
  onStartExperiment: (arg0: EXPERIMENTS) => void;
  onCloseOverview: () => void;
}

interface State {
  activeStep: OVERVIEW_STEPS;
  isPreviewing: boolean;
}

export default class OverviewComponent extends Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      activeStep: OVERVIEW_STEPS.OVERVIEW,
      isPreviewing: false,
    };
    this.handleStepClick = this.handleStepClick.bind(this);
    this.handlePreview = this.handlePreview.bind(this);
    this.endPreview = this.endPreview.bind(this);
  }

  handleStepClick(step: string) {
    if (isEnum(OVERVIEW_STEPS)(step)) {
      this.setState({ activeStep: step });
    }
  }

  handlePreview(e) {
    e.target.blur();
    this.setState((prevState) => ({
      ...prevState,
      isPreviewing: !prevState.isPreviewing,
    }));
  }

  endPreview() {
    this.setState({ isPreviewing: false });
  }

  renderSectionContent() {
    switch (this.state.activeStep) {
      case OVERVIEW_STEPS.PROTOCOL:
        return (
          <Grid relaxed padded className={styles.contentGrid}>
            <Grid.Column
              stretched
              width={12}
              textAlign="right"
              verticalAlign="middle"
              className={styles.previewWindow}
            >
              <PreviewExperimentComponent
                {...loadProtocol(this.props.type)}
                isPreviewing={this.state.isPreviewing}
                onEnd={this.endPreview}
                type={this.props.type}
              />
            </Grid.Column>
            <Grid.Column stretched width={4} verticalAlign="middle">
              <Segment as="p" basic>
                {this.props.protocol}
              </Segment>
              <PreviewButton
                isPreviewing={this.state.isPreviewing}
                onClick={(e) => this.handlePreview(e)}
              />
            </Grid.Column>
          </Grid>
        );
      case OVERVIEW_STEPS.BACKGROUND:
        return (
          <Grid stretched relaxed padded className={styles.contentGrid}>
            <Grid.Column
              stretched
              width={6}
              textAlign="right"
              verticalAlign="middle"
            >
              <Header as="h1">{this.props.background_title}</Header>
            </Grid.Column>
            <Grid.Column stretched width={6} verticalAlign="middle">
              <Segment as="p" basic>
                {this.props.background}
              </Segment>
            </Grid.Column>
          </Grid>
        );
      case OVERVIEW_STEPS.OVERVIEW:
      default:
        return (
          <Grid stretched relaxed padded className={styles.contentGrid}>
            <Grid.Column
              stretched
              width={6}
              textAlign="right"
              verticalAlign="middle"
            >
              <Header as="h1">{this.props.type}</Header>
            </Grid.Column>
            <Grid.Column stretched width={6} verticalAlign="middle">
              <Segment as="p" basic>
                {this.props.overview}
              </Segment>
            </Grid.Column>
          </Grid>
        );
    }
  }

  render() {
    return (
      <>
        <Button
          basic
          circular
          size="huge"
          floated="right"
          icon="x"
          className={styles.closeButton}
          onClick={this.props.onCloseOverview}
        />
        <SecondaryNavComponent
          title={this.props.type}
          steps={OVERVIEW_STEPS}
          activeStep={this.state.activeStep}
          onStepClick={this.handleStepClick}
          saveButton={
            <Button
              primary
              onClick={() => this.props.onStartExperiment(this.props.type)}
            >
              Start Experiment
            </Button>
          }
        />
        <div className={styles.homeContentContainer}>
          {this.renderSectionContent()}
        </div>
      </>
    );
  }
}

// Generic curreid enum type guard
function isEnum<T>(en: T) {
  return (val: any): val is T[keyof T] => val in Object.values(en);
}
