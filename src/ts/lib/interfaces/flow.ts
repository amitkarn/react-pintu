export type IActionDestination = 
{
  type: 'flow',
  flowID: string,
  stepID: string,
  sessionID?: string,
}
| {
  type: 'step',
  stepID: string,
}

export interface ISourceSpec {
  linkID: string;
  stepID: string;
  containerName: string;
  actionID: string;
}

export interface IActionPayload {
  [fieldName: string]: any;
}

export type IInputSource = 
{
  type: 'actionPayload',
  stepID: string;
  actionID: string;
  outputName: string;
}
| {
  type: 'constant',
  value: any,
};

export interface IInputSourceMap {
  [inputName: string]: IInputSource;
}

export interface IActionPayloadMap {
  [actrionID: string]: IActionPayload;
}

export interface ILinkSource {
  stepID: string;
  actionID: string;
}

export interface IFlowMetaData {
  description: string;
  name: string;
}

export interface IStepConfig {
  id: string;
  // The name of the container in ContainerRegistry
  containerName: string;
  sources: Array<ISourceSpec>,
  destinations: {[actionName: string]: IActionDestination};
  actionPayloads: IActionPayloadMap;
  inputSources: IInputSourceMap;
}

export interface IStepConfigMap {
  [stepID: string]: IStepConfig;
}

export interface IStepConfigMapChange {
  [stepID: string]: IStepConfig | null,
}

export interface IFlow {
  id: string;
  metaData: IFlowMetaData;
  firstStepID: string;
  steps: {[key: string]: IStepConfig};
  serializedDiagram: string | null;
}