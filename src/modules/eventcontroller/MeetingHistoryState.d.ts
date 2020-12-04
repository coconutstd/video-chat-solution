import EventName from './EventName';
/**
 * [[MeetingHistoryState]] describes user actions and events, including all event names
 * in [[EventName]].
 */
declare type MeetingHistoryState = EventName | 'audioInputSelected' | 'audioInputUnselected' | Extract<EventName, 'audioInputFailed'> | 'videoInputSelected' | 'videoInputUnselected' | Extract<EventName, 'videoInputFailed'> | Extract<EventName, 'meetingStartRequested'> | Extract<EventName, 'meetingStartSucceeded'> | Extract<EventName, 'meetingStartFailed'> | Extract<EventName, 'meetingEnded'> | Extract<EventName, 'meetingFailed'> | 'meetingReconnected' | 'signalingDropped' | 'receivingAudioDropped';
export default MeetingHistoryState;
