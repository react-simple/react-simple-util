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
}

export interface CallContextReturn extends CallContext {
  readonly complete: (error?: any) => void;
  readonly run: <Result>(action: (onError: (err: any) => void) => Result) => Result;
  readonly runAsync: <Result>(action: (onError: (err: any) => void) => Promise<Result>) => Promise<Result>;
}

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
  let isCompleted = false;
    
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

  logLevel ||= REACT_SIMPLE_UTIL.CALL_CONTEXT.LOG_LEVEL;

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

  const complete: CallContextReturn["complete"] = (error?: any) => {
    if (!isCompleted && CALLCONTEXT_DATA.currentContext?.contextId !== contextId) {
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

    if (!isCompleted) {
      CALLCONTEXT_DATA = {
        allContexts: removeKeys(CALLCONTEXT_DATA.allContexts, [contextId]),
        currentContext: context.parentContext
      };
    }

    isCompleted = true;
    onCompleted?.(context, error);
  };

  const run: CallContextReturn["run"] = action => {
    try {
      return action(err => complete(err));
    }
    finally {     
      if (!isCompleted) {
        complete();
      }
    }
  };

  const runAsync: CallContextReturn["runAsync"] = async action => {
    try {
      return await action(err => complete(err));
    }
    finally {
      if (!isCompleted) {
        complete();
      }
    }
  };

  return { ...context, complete: complete, run, runAsync };
}
