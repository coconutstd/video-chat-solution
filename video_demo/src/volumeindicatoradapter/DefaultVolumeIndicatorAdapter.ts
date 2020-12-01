// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import Logger from '../logger/Logger';
import RealtimeController from '../realtimecontroller/RealtimeController';
import {
  SdkAudioAttendeeState,
  SdkAudioMetadataFrame,
  SdkAudioStreamIdInfoFrame,
} from '../signalingprotocol/SignalingProtocol.js';
import VolumeIndicatorAdapter from './VolumeIndicatorAdapter';

export default class DefaultVolumeIndicatorAdapter implements VolumeIndicatorAdapter {
  private streamIdToAttendeeId: { [key: number]: string } = {};
  private streamIdToExternalUserId: { [key: number]: string } = {};
  private warnedAboutMissingStreamIdMapping: { [key: number]: boolean } = {};
  static MAX_SIGNAL_STRENGTH_LEVELS: number = 2;
  static IMPLICIT_VOLUME: number = 0;
  static IMPLICIT_SIGNAL_STRENGTH: number = 1;

  constructor(
    private logger: Logger,
    private realtimeController: RealtimeController,
    private minVolumeDecibels: number,
    private maxVolumeDecibels: number
  ) {}

  sendRealtimeUpdatesForAudioStreamIdInfo(info: SdkAudioStreamIdInfoFrame): void {
    let streamIndex = 0;
    for (const stream of info.streams) {
      const hasAttendeeId = !!stream.attendeeId;
      const hasExternalUserId = !!stream.externalUserId;
      const hasMuted = stream.hasOwnProperty('muted');
      const hasDropped = !!stream.dropped;
      if (hasAttendeeId) {
        this.streamIdToAttendeeId[stream.audioStreamId] = stream.attendeeId;
        const externalUserId = hasExternalUserId ? stream.externalUserId : stream.attendeeId;
        this.streamIdToExternalUserId[stream.audioStreamId] = externalUserId;
        this.realtimeController.realtimeSetAttendeeIdPresence(
          stream.attendeeId,
          true,
          externalUserId,
          false,
          { attendeeIndex: streamIndex++, attendeesInFrame: info.streams.length }
        );
      }
      if (hasMuted) {
        const attendeeId = this.streamIdToAttendeeId[stream.audioStreamId];
        const externalUserId = this.streamIdToExternalUserId[stream.audioStreamId];
        this.realtimeController.realtimeUpdateVolumeIndicator(
          attendeeId,
          null,
          stream.muted,
          null,
          externalUserId
        );
      }
      if (!hasAttendeeId && !hasMuted) {
        const attendeeId = this.streamIdToAttendeeId[stream.audioStreamId];
        if (attendeeId) {
          const externalUserId = this.streamIdToExternalUserId[stream.audioStreamId];
          delete this.streamIdToAttendeeId[stream.audioStreamId];
          delete this.streamIdToExternalUserId[stream.audioStreamId];
          delete this.warnedAboutMissingStreamIdMapping[stream.audioStreamId];
          let attendeeHasNewStreamId = false;
          for (const otherStreamId of Object.keys(this.streamIdToAttendeeId)) {
            const otherStreamIdNumber = parseInt(otherStreamId);
            if (
              otherStreamIdNumber > stream.audioStreamId &&
              this.streamIdToAttendeeId[otherStreamIdNumber] === attendeeId
            ) {
              attendeeHasNewStreamId = true;
              break;
            }
          }
          if (!attendeeHasNewStreamId) {
            this.realtimeController.realtimeSetAttendeeIdPresence(
              attendeeId,
              false,
              externalUserId,
              hasDropped,
              { attendeeIndex: streamIndex++, attendeesInFrame: info.streams.length }
            );
          }
        }
      }
    }
  }

  sendRealtimeUpdatesForAudioMetadata(metadata: SdkAudioMetadataFrame): void {
    let volumes: { [key: string]: number } | null = null;
    let signalStrengths: { [key: string]: number } | null = null;
    for (const state of metadata.attendeeStates) {
      const attendeeId = this.attendeeIdForStreamId(state.audioStreamId);
      if (state.hasOwnProperty('volume')) {
        if (volumes === null) {
          volumes = {};
        }
        if (attendeeId !== null) {
          // @ts-ignore: TODO fix this protobufjs issue
          volumes[attendeeId] = this.normalizedVolume(state);
        }
      }
      if (state.hasOwnProperty('signalStrength')) {
        if (signalStrengths === null) {
          signalStrengths = {};
        }
        if (attendeeId !== null) {
          // @ts-ignore: TODO fix this protobufjs issue
          signalStrengths[attendeeId] = this.normalizedSignalStrength(state);
        }
      }
    }
    this.applyRealtimeUpdatesForAudioMetadata(volumes, signalStrengths);
  }

  private normalizedVolume(state: SdkAudioAttendeeState): number {
    const dBVolume = -state.volume;
    const normalized =
      1.0 - (dBVolume - this.maxVolumeDecibels) / (this.minVolumeDecibels - this.maxVolumeDecibels);
    const clipped = Math.min(Math.max(normalized, 0.0), 1.0);
    return clipped;
  }

  private normalizedSignalStrength(state: SdkAudioAttendeeState): number {
    const normalized =
      state.signalStrength / DefaultVolumeIndicatorAdapter.MAX_SIGNAL_STRENGTH_LEVELS;
    const clipped = Math.min(Math.max(normalized, 0.0), 1.0);
    return clipped;
  }

  private applyRealtimeUpdatesForAudioMetadata(
    volumes: { [key: string]: number } | null,
    signalStrengths: { [key: string]: number } | null
  ): void {
    for (const streamId in this.streamIdToAttendeeId) {
      const attendeeId = this.streamIdToAttendeeId[streamId];
      const externalUserId = this.streamIdToExternalUserId[streamId];
      let volumeUpdate: number | null = null;
      let signalStrengthUpdate: number | null = null;
      if (volumes !== null) {
        if (volumes.hasOwnProperty(attendeeId)) {
          volumeUpdate = volumes[attendeeId];
        } else {
          volumeUpdate = DefaultVolumeIndicatorAdapter.IMPLICIT_VOLUME;
        }
      }
      if (signalStrengths !== null) {
        if (signalStrengths.hasOwnProperty(attendeeId)) {
          signalStrengthUpdate = signalStrengths[attendeeId];
        } else {
          signalStrengthUpdate = DefaultVolumeIndicatorAdapter.IMPLICIT_SIGNAL_STRENGTH;
        }
      }
      if (volumeUpdate !== null || signalStrengthUpdate !== null) {
        this.realtimeController.realtimeUpdateVolumeIndicator(
          attendeeId,
          volumeUpdate,
          null,
          signalStrengthUpdate,
          externalUserId
        );
      }
    }
  }

  private attendeeIdForStreamId(streamId: number): string | null {
    if (streamId === 0) {
      return null;
    }
    const attendeeId = this.streamIdToAttendeeId[streamId];
    if (attendeeId) {
      return attendeeId;
    }
    if (!this.warnedAboutMissingStreamIdMapping[streamId]) {
      this.warnedAboutMissingStreamIdMapping[streamId] = true;
      this.logger.warn(`volume indicator stream id ${streamId} seen before being defined`);
    }
    return null;
  }
}
