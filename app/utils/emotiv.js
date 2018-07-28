/*
 * Adapted from the Cortex example, this file provides functions for creating a Cortex client and creating
 * an RxJS Observable of raw EEG data
 *
 */
import { Observable } from "rxjs";
import { mergeMap, map } from "rxjs/operators";
import { USERNAME, PASSWORD, CLIENT_ID, CLIENT_SECRET } from "../../keys";
import { EMOTIV_CHANNELS } from "../constants/constants";

// Just returns the Cortex object from SDK
export const initCortex = () => {
  const verbose = process.env.LOG_LEVEL || 1;
  const options = { verbose };

  return new Cortex(options);
};

// Returns an observable that will handle both connecting to Client and providing a source of EEG data
// TODO: Break this into multiple async functions to allow greater control over connectivity
export const createRawEmotivObservable = client =>
  Observable.from(
    client.ready
      .then(() =>
        client.init({
          // These values need to be filled with personal Emotiv credentials
          username: USERNAME,
          password: PASSWORD,
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
          debit: 1
        })
      )
      .then(() =>
        client
          .createSession({
            status: "active"
          })
          .subscribe({ streams: ["eeg"] })
      )
  ).pipe(
    mergeMap(subs => {
      if (!subs[0].eeg) throw new Error("failed to subscribe");
      return Observable.fromEvent(client, "eeg").pipe(map(parseEEG));
    })
  );

export const injectEmotivMarker = (client, value, time) => {
  client.injectMarker({ label: "event", value, time });
};

// ---------------------------------------------------------------------
// Helpers

// Removes the redundant stuff included in the Cortex SDK eeg return
// 14 EEG channels with timestamp and optional event
const parseEEG = (eegSample: { data: Array, timestamp: number }) => {
  const prunedArray = new Array(EMOTIV_CHANNELS.length);
  for (let i = 0; i < EMOTIV_CHANNELS.length; i++) {
    prunedArray[i] = eegSample.data[i + 3];
  }
  const event = eegSample.data[eegSample.data.length - 1];
  if (event != 0) {
    return { data: prunedArray, timestamp: eegSample.time, event };
  }
  return { data: prunedArray, timestamp: eegSample.time };
};
