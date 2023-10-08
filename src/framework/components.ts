import { ExtendedType } from './custom-types';

export interface BaseContext {
}

export type Context = ExtendedType<'Context', BaseContext>

export type DecisionUnit = {
  (ctx: Context): boolean | Promise<boolean>;
};

export interface WorkUnit {
  (ctx: Context): void | Promise<void>;
}

interface BaseProps {
}

export interface RootProps extends BaseProps {}

export interface DecisionProps extends BaseProps {
  is?: DecisionUnit;
}

export interface MidwayProps extends BaseProps {
  is?: DecisionUnit | true;
  then: WorkUnit;
}

export interface EndProps extends BaseProps {
  is?: DecisionUnit | true;
  finally: WorkUnit;
}

export type RunProps = DecisionProps | MidwayProps | EndProps;

export function isPropsForMidway(obj: any): obj is MidwayProps {
  return obj && !!obj.then;
}

export function isPropsForEnd(obj: any): obj is EndProps {
  return obj && !!obj.finally;
}

export function isPropsForDecision(obj: any): obj is DecisionProps {
  return obj && !!obj.is && !obj.then && !obj.finally;
}

const alwaysTrue = () => true;

class BaseComponent {
  constructor(public readonly children: Array<Component>) {}
  isDecision(): this is DecisionComponent {
    return false;
  }
  isMidway(): this is MidwayComponent {
    return false;
  }
  isEnd(): this is EndComponent {
    return false;
  }
}

class ConditionalCondition extends BaseComponent {
  constructor(public readonly condition: DecisionUnit, children: Array<Component>) {
    super(children);
  }
}

export class DecisionComponent extends ConditionalCondition {
  constructor(condition: DecisionUnit, children: Array<Component>) {
    super(condition, children);
  }
  isDecision(): this is DecisionComponent {
    return true;
  }
}

class TruthyDecisionComponent extends DecisionComponent {
  constructor(children: Array<Component>) {
    super(alwaysTrue, children);
  }
}

export class MidwayComponent extends ConditionalCondition {
  constructor(condition: DecisionUnit, public readonly func: WorkUnit, children: Array<Component>) {
    super(condition, children);
  }
  isMidway(): this is MidwayComponent {
    return true;
  }
}

export class EndComponent extends ConditionalCondition {
  constructor(condition: DecisionUnit, public readonly func: WorkUnit) {
    super(condition, []);
  }

  isEnd(): this is EndComponent {
    return true;
  }
}

export type Component = DecisionComponent | MidwayComponent | EndComponent

export function Run(
  props: RunProps | null,
  children: Component[],
): Component {
  if (isPropsForMidway(props)) {
    const condition =
      props.is === true ? () => true : props.is;
    return new MidwayComponent(condition || alwaysTrue, props.then, children);
  }
  if (isPropsForEnd(props)) {
    const condition =
      props.is === true ? () => true : props.is;
    if (Array.isArray(children) && children.length) throw new Error('');
    return new EndComponent(condition || alwaysTrue, props.finally);
  }
  if (isPropsForDecision(props)) {
    return props.is ? new DecisionComponent(props.is, children) : new TruthyDecisionComponent(children);
  }
  if (props === null) {
    return new TruthyDecisionComponent(children);
  }
  throw new Error('not reached');
};

export type FactoryFunction = typeof Run

export function h(
  factory: FactoryFunction,
  props: Parameters<FactoryFunction>[0] = {},
  ...children: Array<Component>
): Component {
  return factory(props, children);
}
