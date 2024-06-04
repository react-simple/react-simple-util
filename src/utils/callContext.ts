import { REACT_SIMPLE_UTIL } from "data";
import { LogLevel, logMessage, logWarning } from "log";
import { newGuid } from "./guid";
import { removeKeys } from "./object";
import { CallContext, CallContextReturn } from "./types";

export function callContext<State = unknown>(
  contextKey: string,
  data?: State,
  onCompleted?: (context: CallContext<State>, error?: any) => void,
  logLevel?: LogLevel
): CallContextReturn {
  const contextId = newGuid();
  let isCompleted = false;
  const { logLevel: callContextLogLevel, currentContext, allContexts } = REACT_SIMPLE_UTIL.CALLCONTEXT;
    
  const context: CallContext<State> = {
    contextId,
    contextKey,
    parentContext: currentContext,
    parentContexts: currentContext
      ? [...currentContext.parentContexts, currentContext]
      : [],
    contextDepth: currentContext ?
      currentContext.contextDepth + 1 :
      0,
    data: data as State
  };

  logLevel ||= callContextLogLevel;

  if (logLevel) {
    logMessage(
      logLevel,
      `[CallContext] Started context '${contextKey}'`,
      { context, currentContext, allContexts },
      REACT_SIMPLE_UTIL.LOGGING.logLevel
    );
  }

  REACT_SIMPLE_UTIL.CALLCONTEXT = {
    ...REACT_SIMPLE_UTIL.CALLCONTEXT,
    allContexts: {
      ...allContexts,
      [contextId]: context
    },
    currentContext: context
  };

  const complete: CallContextReturn["complete"] = (error?: any) => {    
    const { currentContext, allContexts } = REACT_SIMPLE_UTIL.CALLCONTEXT;

    if (!isCompleted && currentContext?.contextId !== contextId) {
      logWarning(
        `[CallContext]: Completed context${error ? " with error " : ""} '${contextKey}' ` +
        `while current context is another context '${REACT_SIMPLE_UTIL.CALLCONTEXT.currentContext?.contextKey}'.`,
        { context, currentContext, allContexts },
        REACT_SIMPLE_UTIL.LOGGING.logLevel
      );
    }
    else if (logLevel) {
      logMessage(
        logLevel,
        `[CallContext]: Completed context${error ? " with error" : ""} '${contextKey}'`,
        { context, currentContext, allContexts },
        REACT_SIMPLE_UTIL.LOGGING.logLevel
      );
    }

    if (!isCompleted) {
      REACT_SIMPLE_UTIL.CALLCONTEXT = {
        ...REACT_SIMPLE_UTIL.CALLCONTEXT,
        allContexts: removeKeys(allContexts, [contextId]),
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
