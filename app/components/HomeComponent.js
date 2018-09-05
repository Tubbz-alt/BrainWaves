// @flow
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Grid, Header, Segment, List, Image } from "semantic-ui-react";
import styles from "./styles/common.css";
import { EXPERIMENTS, SCREENS } from "../constants/constants";
import faceHouseIcon from "../assets/face_house/face_house_icon.jpg";

interface Props {
  jupyterActions: Object;
  deviceActions: Object;
  experimentActions: Object;
  rawObservable: ?any;
  client: ?any;
  mainChannel: ?any;
}

export default class Home extends Component<Props> {
  props: Props;

  handleExperimentSelect(experimentType: EXPERIMENTS) {
    this.props.experimentActions.setType(experimentType);
    this.props.experimentActions.loadDefaultTimeline();
  }

  render() {
    return (
      <div>
        <div className={styles.mainContainer} data-tid="container">
          <Grid columns={2} relaxed padded>
            <Grid.Row>
              <Grid.Column>
                <Segment raised color="red">
                  <Header as="h2">Welcome to the BrainWaves App Alpha</Header>
                  <p>
                    The New York University (NYU) BrainWaves app allows you to
                    learn to design and carry out original brain experiments
                    using real brainwave scanning equipment in the classroom.
                  </p>
                  <p>
                    Get started by choosing to practice a new skill, start an
                    experiment, or pick up where you left off with a past
                    workspace.
                  </p>
                </Segment>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                <Segment color="red">
                  <Header as="h3">Start Experiment</Header>
                  <List size="medium">
                    <List.Item>
                      <Link
                        to={SCREENS.DESIGN.route}
                        onClick={() =>
                          this.handleExperimentSelect(EXPERIMENTS.N170)
                        }
                      >
                        <Image size="small" src={faceHouseIcon} />
                        <List.Content
                          header="Faces and Houses"
                          description="Detecting the N170 face-evoked potential"
                        />
                      </Link>
                    </List.Item>
                  </List>
                </Segment>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </div>
      </div>
    );
  }
}
