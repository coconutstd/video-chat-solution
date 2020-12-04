/**
 * [[RealtimeAttendeePositionInFrame]] information about the attendee's place in the frame.
 */
export default class RealtimeAttendeePositionInFrame {
    /**
     * Index of attendee update in the frame starting at zero
     */
    attendeeIndex: number | null;
    /**
     * Number of total attendee updates in the frame
     */
    attendeesInFrame: number | null;
}
