import * as _ from 'lodash';
import {fillString} from './strings';
import {IFlow, IStepConfig} from '../interfaces';
import {ContainerRegistry} from '../ContainerRegistry';

export function resolveUrlStepId(flow: IFlow, urlStepId: string): string {
  const {
    steps,
  } = flow;
  const step = steps[urlStepId];
  if (step) {
    return urlStepId;
  }

  const realStepId = _.findKey(flow.steps, (step: IStepConfig) => {
    return step.urlIdOverride === urlStepId;
  });
  return realStepId || '';
}

  /**
   * Find an existing stepID with the same override. Returns undefined
   * if not found.
   */
export function existingStepIdForOverride(
  flow: IFlow, 
  override: string,
): string | undefined {
  const {
    steps,
  } = flow;
  return _.findKey(steps, (step: IStepConfig) => {
    return step.urlIdOverride === override;
  });
}

export function findStepIdOverrideError(
  flow: IFlow,
  override: string,
): string | null {
  const existingStepId = existingStepIdForOverride(flow, override);
  if (existingStepId) {
    return `Conflicting with override for Step ${existingStepId}`;
  }

  if (override in flow.steps) {
    return `${override} is an existing step ID`;
  }

  return null;
}

/**
 * Template params:
 * :flowID
 * :stepID 
 * :containerPathTemplate
 */
export function getPathTo(
  registry: ContainerRegistry,
  pathTemplate: string,
  flow: IFlow,
  stepId: string, 
  args: Object = {}
) {
  const step = flow.steps[stepId];
  const container = registry.getContainerSpec(step.containerName);
  const finalTemplate = fillString(pathTemplate, {
    flowID: flow.id,
    stepID: stepId,
    containerPathTemplate: container.pathTemplate,
  });
  return fillString(finalTemplate, args);
}