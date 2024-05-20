import { REACT_SIMPLE_UTIL } from "data";
import { LogLevel, logMessage, logWarning } from "log";
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
  readonly completed: (error?: any) => void;
  readonly run: <Result>(action: () => Result) => Result;
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
  data?: State,
  onCompleted?: (context: CallContext<State>, error?: any) => void,
  logLevel?: LogLevel
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
    data: data as State
  };

  logLevel ||= REACT_SIMPLE_UTIL.CALL_CONTEXT.logLevelDefault;

  if (logLevel) {
    logMessage(logLevel, `[CallContext] Started context '${contextKey}'`, { context, CALLCONTEXT_DATA });
  }

  CALLCONTEXT_DATA = {
    allContexts: {
      ...CALLCONTEXT_DATA.allContexts,
      [contextId]: context
    },
    currentContext: context
  };

  const completed: CallContextReturn["completed"] = (error?: any) => {
    if (CALLCONTEXT_DATA.currentContext?.contextId !== contextId) {
      logWarning(
        `[CallContext]: Completed context${error ? " with error " : ""} '${contextKey}' ` +
        `while current context is another context '${CALLCONTEXT_DATA.currentContext?.contextKey}'.`,
        { context, CALLCONTEXT_DATA }
      );
    }
    else if (logLevel) {
      logMessage(
        logLevel,
        `[CallContext]: Completed context${error ? " with error" : ""} '${contextKey}'`,
        { context, CALLCONTEXT_DATA }
      );
    }

    CALLCONTEXT_DATA = {
      allContexts: removeKeys(CALLCONTEXT_DATA.allContexts, [contextId]),
      currentContext: context.parentContext
    };

    onCompleted?.(context, error);
  };

  const run: CallContextReturn["run"] = action => {
    try {
      return action();
    }
    finally {
      completed();
    }
  };

  return { ...context, completed, run };
};
