import Logger from '../logger/Logger';
import SessionStateController from './SessionStateController';
import { SessionStateControllerAction } from './SessionStateControllerAction';
import { SessionStateControllerState } from './SessionStateControllerState';
import { SessionStateControllerTransitionResult } from './SessionStateControllerTransitionResult';
export default class DefaultSessionStateController implements SessionStateController {
    private logger;
    constructor(logger: Logger);
    perform(action: SessionStateControllerAction, work: () => void): SessionStateControllerTransitionResult;
    state(): SessionStateControllerState;
    private currentState;
    private deferredAction;
    private deferredWork;
    private transition;
    private deferPriority;
    private deferAction;
    private canDefer;
    private performDeferredAction;
}
