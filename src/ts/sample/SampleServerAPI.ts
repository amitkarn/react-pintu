import * as _ from 'lodash';
import * as qs from 'qs';

import {IFlowMetaData, IFlow, FlowSaveResultType, IURLLocation, IURLParams} from '../.';

const DefaultFlow: IFlow = {
  id: '1',
  metaData: {
    description: 'Dummy Flow 1',
    name: 'Dummy Flow 1',
  },
  firstStepID: '0',
  steps: {
    0: {
      id: '0',
      containerName: 'SampleView',
      sources: [],
      destinations: {},
      inputSources: {},
    },
    1: {
      id: '1',
      containerName: 'SampleView',
      sources: [],
      destinations: {},
      inputSources: {},
    }
  },
  serializedDiagram: null,
}

interface ISavedFlows {
  nextId: number,
  flows: {[id: string]: IFlow},
}

function getSavedFlows(): ISavedFlows {
  const savedFlowString = localStorage.getItem('savedFlows');
  let savedFlows = {
    nextId: 0,
    flows: {},
  };
  if (savedFlowString) {
    savedFlows = JSON.parse(savedFlowString);
  }
  return savedFlows;
}

function onCreateFlow(data: IFlowMetaData): Promise<string> {
  return new Promise<string>((resolve) => {
    const savedFlows = getSavedFlows();
    const newFlows: ISavedFlows = {
      nextId: savedFlows.nextId + 1,
      flows: {
        ...savedFlows.flows,
        [savedFlows.nextId]: {
          id: savedFlows.nextId.toString(),
          metaData: data,
          firstStepID: '0',
          steps: {},
          serializedDiagram: null,
        },
      },
    };

    localStorage.setItem('savedFlows', JSON.stringify(newFlows));
    resolve(savedFlows.nextId.toString());
  });
}

function onLoadFlow(flowID: string): Promise<IFlow> {
  return new Promise<IFlow>((resolve) => {
    const savedFlows = getSavedFlows();
    resolve(savedFlows.flows[flowID]);
  });
}

function onAutoSaveFlow(newFlow: IFlow): Promise<FlowSaveResultType> {  
  return new Promise<FlowSaveResultType>((resolve) => {
    const savedFlows = getSavedFlows();
    savedFlows.flows[newFlow.id] = newFlow;
    localStorage.setItem('savedFlows', JSON.stringify(savedFlows));
    resolve({
      type: 'success',
    });
  });
}

function onUserSaveFlow(newFlow: IFlow): Promise<FlowSaveResultType> {
  return new Promise<FlowSaveResultType>((resolve) => {
    const savedFlows = getSavedFlows();
    savedFlows.flows[newFlow.id] = newFlow;
    localStorage.setItem('savedFlows', JSON.stringify(savedFlows));
    resolve({
      type: 'success',
    });
  });
}

function onRunnerLoadFlow(location: IURLLocation, params: IURLParams): Promise<IFlow> {
  return new Promise<IFlow>((resolve) => {
    const savedFlows = getSavedFlows();
    const latestFlow = savedFlows.flows[savedFlows.nextId - 1];
    resolve(latestFlow);
  });
}

function onGetStepID(location: IURLLocation, params: IURLParams): Promise<string> {
  return new Promise<string>((resolve) => {
    resolve(params.stepID);
  });
}

export {
  onCreateFlow,
  onLoadFlow,
  onAutoSaveFlow,
  onUserSaveFlow,
  onRunnerLoadFlow,
  onGetStepID,
}