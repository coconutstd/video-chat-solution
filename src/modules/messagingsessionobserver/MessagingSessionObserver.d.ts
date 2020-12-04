import Message from '../message/Message';
export default interface MessagingSessionObserver {
    messagingSessionDidStart?(): void;
    messagingSessionDidStartConnecting?(reconnecting: boolean): void;
    messagingSessionDidStop?(event: CloseEvent): void;
    messagingSessionDidReceiveMessage?(message: Message): void;
}
