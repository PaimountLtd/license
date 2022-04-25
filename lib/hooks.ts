import React, { useState, useEffect } from 'react';

/**
 * onCreate shortcut
 * Helpful if you need to calculate an immutable initial state for a component
 */
export function useOnCreate<TReturnValue>(cb: () => TReturnValue) {
  return useState(cb)[0];
}

/**
 * onDestroy shortcut
 */
export function useOnDestroy(cb: () => void) {
  useEffect(() => cb, []);
}

let nextComponentId = 1;

/**
 * Returns a unique component id
 * If DEBUG=true then the componentId includes a component name
 */
export function useComponentId() {
  const DEBUG = false;
  return useOnCreate(() => (DEBUG ? `${nextComponentId++}_${getComponentName()}` : `${nextComponentId++}`));
}

/**
 * Get component name from the callstack
 * Use for debugging only
 */
function getComponentName(): string {
  try {
    throw new Error();
  } catch (e: unknown) {
    const error = e as Error;
    return error.stack!.split('\n')[10].split('at ')[1].split('(')[0].trim();
  }
}

/**
 * Returns a function for force updating of the component
 * Use it only for frequently used components for optimization purposes
 *
 * Current implementation from
 * https://github.com/ant-design/ant-design/blob/master/components/_util/hooks/useForceUpdate.ts
 */
export function useForceUpdate() {
  const [, forceUpdate] = React.useReducer(x => x + 1, 0);
  return forceUpdate;
}