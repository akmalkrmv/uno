import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ConnectionStateLogger {
  private states = {
    signalingState: [],
    connectionState: [],
    iceConnectionState: [],
    iceGatheringState: [],
  };

  public showState(connection: RTCPeerConnection, caller?: string) {
    const addState = (current: string[], newState: string) => {
      if (!current.length) {
        return current.push(newState);
      }

      const lastState = current[current.length - 1];
      if (lastState !== newState) {
        return current.push(newState);
      }
    };

    addState(this.states.signalingState, connection.signalingState);
    addState(this.states.connectionState, connection.connectionState);
    addState(this.states.iceConnectionState, connection.iceConnectionState);
    addState(this.states.iceGatheringState, connection.iceGatheringState);

    const localDescription = connection.localDescription
      ? connection.localDescription.type
      : 'null';
    const remoteDesccription = connection.remoteDescription
      ? connection.remoteDescription.type
      : 'null';

    const state = {
      localDescription,
      remoteDesccription,
      signalingState: this.states.signalingState.join(' => '),
      connectionState: this.states.connectionState.join(' => '),
      iceConnectionStates: this.states.iceConnectionState.join(' => '),
      iceGatheringStates: this.states.iceGatheringState.join(' => '),
    };

    const table = {
      ...(caller ? { caller } : {}),
      ...state,
    };

    console.groupCollapsed('connection');
    console.table(table);
    console.groupEnd();
  }
}
