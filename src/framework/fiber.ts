import { NOTREACHED } from './base';
import { Component, Context } from './components';

interface FiberNode {
  component: Component;
  alternate: FiberNode | null;
  effectTag?: string;
  child?: FiberNode;
  return?: FiberNode;
  sibling?: FiberNode;
}

let wipRoot: FiberNode | null = null;
let nextUnitOfWork: FiberNode | null = null;
let currentRoot: FiberNode | null = null;
let deletions: FiberNode[] = [];

// Enhanced requestIdleCallback.
const id = 1;
const fps = 1e3 / 60;
let frameDeadline: number;
let pendingCallback: IdleRequestCallback;
const channel = new MessageChannel();
let now = 0;
const timeRemaining = () => {
  now = performance.now();
  return frameDeadline - now;
};

const deadline = {
  didTimeout: false,
  timeRemaining,
};

channel.port2.onmessage = () => {
  if (typeof pendingCallback === 'function') {
    pendingCallback(deadline);
  }
};

const rIC = (callback: IdleRequestCallback) => {
  requestAnimationFrame((frameTime) => {
    frameDeadline = frameTime + fps;
    pendingCallback = callback;
    channel.port1.postMessage(null);
  });
  return id;
};

// Reconcile the fiber nodes before and after, compare and record the differences.
const reconcileChildren = (
  fiberNode: FiberNode,
  elements: Component[] = [],
) => {
  let index = 0;
  let oldFiberNode: FiberNode | undefined = void 0;
  let prevSibling: FiberNode | undefined = void 0;
  const virtualElements = elements.flat(Infinity);

  if (fiberNode.alternate?.child) {
    oldFiberNode = fiberNode.alternate.child;
  }

  while (
    index < virtualElements.length ||
    typeof oldFiberNode !== 'undefined'
    ) {
    const virtualElement = virtualElements[index];
    let newFiber: FiberNode | undefined = void 0;

    const isSameType = Boolean(
      oldFiberNode &&
      virtualElement &&
      oldFiberNode.component === virtualElement,
    );

    if (isSameType && oldFiberNode) {
      newFiber = {
        component: oldFiberNode.component,
        alternate: oldFiberNode,
        return: fiberNode,
        effectTag: 'UPDATE',
      };
    }
    if (!isSameType && Boolean(virtualElement)) {
      newFiber = {
        component: virtualElement,
        alternate: null,
        return: fiberNode,
        effectTag: 'REPLACEMENT',
      };
    }
    if (!isSameType && oldFiberNode) {
      deletions.push(oldFiberNode);
    }

    if (oldFiberNode) {
      oldFiberNode = oldFiberNode.sibling;
    }

    if (index === 0) {
      fiberNode.child = newFiber;
    } else if (typeof prevSibling !== 'undefined') {
      prevSibling.sibling = newFiber;
    }

    prevSibling = newFiber;
    index += 1;
  }
};

// Execute each unit task and return to the next unit task.
// Different processing according to the type of fiber node.
const performUnitOfWork = (fiberNode: FiberNode, ctx: Context): FiberNode | null => {
  if (!fiberNode.component.condition(ctx)) {
    return null;
  }
  if (fiberNode.component.isMidway()) {
    fiberNode.component.func(ctx);
  }

  reconcileChildren(fiberNode, fiberNode.component.children);
  if (fiberNode.child) {
    return fiberNode.child;
  }

  let nextFiberNode: FiberNode | undefined = fiberNode;

  while (typeof nextFiberNode !== 'undefined') {
    if (nextFiberNode.sibling) {
      return nextFiberNode.sibling;
    }

    nextFiberNode = nextFiberNode.return;
  }

  return null;
};

const ctx = {};
// Use requestIdleCallback to query whether there is currently a unit task
// and determine whether the DOM needs to be updated.
export const workLoop: IdleRequestCallback = (deadline) => {
  while (nextUnitOfWork && deadline.timeRemaining() > 1) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork, ctx);
  }

  // commit 阶段
  if (!nextUnitOfWork && wipRoot) {
    wipRoot = null;
  }

  rIC(workLoop);
};

// Initial or reset.
export const run = (component: Component) => {
  currentRoot = null;
  wipRoot = {
    component,
    alternate: currentRoot,
  };
  nextUnitOfWork = wipRoot;
  deletions = [];
  rIC(workLoop);
};
