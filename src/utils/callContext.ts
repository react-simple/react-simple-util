import { REACT_SIMPLE_UTIL } from "data";
import { LogLevel, logError, logMessage, logWarning } from "log";
import { newGuid } from "./guid";
import { removeKeys } from "./object";

export interface CallContext<State = unknown> {
  readonly contextId: string;
  readonly contextKey: string;
  readonly contextDepth: number;
  readonly parentContext: CallContext | undefined;
  readonly parentContexts: CallContext[];
  readonly data: State;
};

export interface CallContextReturn extends CallContext {
  readonly completed: () => void;
  readonly error: (error: any) => void;
};

export let CALLCONTEXT_DATA: {
  readonly allContexts: { [contextId: string]: CallContext };
  readonly currentContext: CallContext | undefined;
} = {
  allContexts: {},
  currentContext: undefined
};

export function callContext<State = unknown>(
  contextKey: string,
  options?: {    
    logLevel?: LogLevel;
    data?: State;
    onCompleted?: (context: CallContext<State>) => void;
    onError?: (error: any, context: CallContext<State>) => void;
  }
): CallContextReturn {
  const contextId = newGuid();
    
  const context: CallContext<State> = {
    contextId,
    contextKey,
    parentContext: CALLCONTEXT_DATA.currentContext,
    parentContexts: CALLCONTEXT_DATA.currentContext
      ? [...CALLCONTEXT_DATA.currentContext.parentContexts, CALLCONTEXT_DATA.currentContext]
      : [],
    contextDepth: CALLCONTEXT_DATA.currentContext ?
      CALLCONTEXT_DATA.currentContext.contextDepth + 1 :
      0,
    data: options?.data as State
  };

  const logLevel = options?.logLevel || REACT_SIMPLE_UTIL.CALL_CONTEXT.logLevelDefault;

  if (logLevel) {
    logMessage(logLevel, `[CallContext] BEGIN ${contextKey}`, { context, CALLCONTEXT_DATA });
  }

  CALLCONTEXT_DATA = {
    allContexts: {
      ...CALLCONTEXT_DATA.allContexts,
      [contextId]: context
    },
    currentContext: context
  };

  return {
    ...context,
    
    completed: () => {
      if (CALLCONTEXT_DATA.currentContext?.contextId !== contextId) {
        logWarning(
          `[CallContext]: Completing context [contextKey: ${contextKey}, contextId: ${contextId}] ` +
          `while current context is [contextKey: ${contextKey}, contextId: ${contextId}].`,
          { context, CALLCONTEXT_DATA }
        );
      }
      else if (logLevel) {
        logMessage(
          logLevel,
          `[CallContext]: Completing context [contextKey: ${contextKey}, contextId: ${contextId}]`,
          { context, CALLCONTEXT_DATA }
        );
      }      

      CALLCONTEXT_DATA = {
        allContexts: removeKeys(CALLCONTEXT_DATA.allContexts, [contextId]),
        currentContext: context.parentContext
      };

      options?.onCompleted?.(context);
    },

    error: error => {
      if (CALLCONTEXT_DATA.currentContext?.contextId !== contextId) {
        logError(
          `[CallContext]: Completing context with error [contextKey: ${contextKey}, contextId: ${contextId}] ` +
          `while current context is [contextKey: ${contextKey}, contextId: ${contextId}].`,
          { context, CALLCONTEXT_DATA, error }
        );
      }
      else if (logLevel) {
        logError(
          logLevel,
          `[CallContext]: Completing context with error [contextKey: ${contextKey}, contextId: ${contextId}]`,
          { context, CALLCONTEXT_DATA, error }
        );
      }

      CALLCONTEXT_DATA = {
        allContexts: removeKeys(CALLCONTEXT_DATA.allContexts, [contextId]),
        currentContext: context.parentContext
      };

      options?.onError?.(error, context);
    }
  };
};
