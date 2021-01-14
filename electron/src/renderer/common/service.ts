import { action } from 'mobx';
import wikiStore from '../data/store';
import { currentFilesService } from './current-file-service';
import { backendGet, backendPost, backendPut } from './comm';
import {
  ResponseWithProjectDTO, ResponseWithMappingDTO, ResponseWithTableDTO, ResponseWithQNodeLayerDTO,
  ResponseCallWikifierServiceDTO, ResponseUploadEntitiesDTO, ResponseWithEverythingDTO, ResponseWithProjectAndMappingDTO, TableDTO
} from './dtos';
import { ErrorMessage } from './general';


export interface IStateWithError {
  errorMessage: ErrorMessage;
}


class RequestService {

  public getProjectFolder() {

    if (!wikiStore.project?.projectDTO?.directory) {
      console.warn("There is no projectDTO directory", wikiStore.project.projectDTO);
    }
    return `project_folder=${wikiStore.project.projectDTO!.directory}`;
  }

  public getDataFileParams(required = true) {
    if ( !currentFilesService.currentState.dataFile ) {
      if ( required ) {
        console.error("There is no data file"); //TODO: actual proper error handling?
      }
      return this.getProjectFolder();
    }
    return this.getProjectFolder() + `&data_file=${currentFilesService.currentState.dataFile}&sheet_name=${currentFilesService.currentState.sheetName}`;
  }

  public getMappingParams(){
    let url=this.getDataFileParams();
    if ( currentFilesService.currentState.mappingFile ) {
      url += `&mapping_file=${currentFilesService.currentState.mappingFile}`;
      url += `&mapping_type=${currentFilesService.currentState.mappingType}`;
    }
    return url;
  }

  @action
  public switchProjectState(response: ResponseWithProjectDTO){
    console.debug('switchProejctState called');
    currentFilesService.getFiles(response.project);
    wikiStore.project.projectDTO = response.project;

    // new project
    if ( !Object.keys(response.project.data_files).length ) {
      this.resetPreProject();
    }
  }

  @action
  public resetPreProject(){
    wikiStore.table.updateTable({} as TableDTO);
    wikiStore.layers.resetLayers();
    wikiStore.yaml.yamlContent = '';
    wikiStore.yaml.yamlError = undefined;
    wikiStore.annotations.blocks = [];
  }

  @action
  public fillMapping(response: ResponseWithMappingDTO){
    wikiStore.project.projectDTO = response.project;
    wikiStore.layers.updateFromDTO(response.layers);
    wikiStore.yaml.yamlContent = response.yamlContent;
    wikiStore.yaml.yamlError = response.yamlError;
    wikiStore.annotations.blocks = response.annotations || [];
  }

  @action
  public fillTable(response: ResponseWithTableDTO){
    wikiStore.table.updateTable(response.table);
    this.fillMapping(response);
  }

  @action
  public updateProjectandQnode(response: ResponseWithQNodeLayerDTO){
    wikiStore.layers.updateFromDTO(response.layers);
    wikiStore.project.projectDTO = response.project;
  }

  public async postAnnotationBlocks(data: any) {
    const response = await backendPost(`/annotation?${this.getDataFileParams()}`, data) as ResponseWithProjectAndMappingDTO;
    wikiStore.project.projectDTO = response.project;
    this.fillMapping(response);
  }

  public async createProject(folder: string) {
    const response = await backendPost(`/project?project_folder=${folder}`) as ResponseWithProjectDTO;
    wikiStore.project.projectDTO = response.project; // not necessary?
    wikiStore.changeWindowDisplayMode(folder);
  }

  public async getProject(folder: string) {
    console.debug('getProject called for ', folder);
    const response = await backendGet(`/project?project_folder=${folder}`) as ResponseWithProjectDTO;
    console.debug('Response returned ', response);
    this.switchProjectState(response);
  }

  public async uploadDataFile(folder: string, data: any) {
    const response = await backendPost(`/data?project_folder=${folder}`, data) as ResponseWithEverythingDTO;
    this.fillTable(response);
  }

  public async uploadWikifierOutput(data: any) {
    const response = await backendPost(`/wikifier?${this.getDataFileParams(false)}`, data) as ResponseWithQNodeLayerDTO;
    this.updateProjectandQnode(response);
  }

  public async uploadYaml(data: any) {
    const response = await backendPost(`/yaml/apply?${this.getMappingParams()}`, data) as ResponseWithProjectAndMappingDTO;
    this.fillMapping(response)
    wikiStore.project.projectDTO = response.project;
  }

  public async callWikifierService(data: any) {
    const response = await backendPost(`/wikifier_service?${this.getDataFileParams(false)}`, data) as ResponseCallWikifierServiceDTO;
    this.updateProjectandQnode(response);
    wikiStore.wikifier.wikifierError = response.wikifierError;
  }


  public async getTable() {

    wikiStore.table.showSpinner = true;
    wikiStore.wikifier.showSpinner = true;
    wikiStore.yaml.showSpinner = true;
    try{
    const response = await backendGet(`/table?${this.getMappingParams()}`) as ResponseWithTableDTO;
    this.fillTable(response);
    }
    finally{
      wikiStore.table.showSpinner = false;
      wikiStore.wikifier.showSpinner = false;
      wikiStore.yaml.showSpinner = false;
    }
  }

  public async getMappingCalculation() {
    const response = await backendGet(`/mapping?${this.getMappingParams()}`) as ResponseWithMappingDTO;
    this.fillMapping(response);
  }

  public async renameProject(folder: string, data: any) {
    //returns project
    const response = await backendPut(`/project?project_folder=${folder}`, data) as ResponseWithProjectDTO;
    wikiStore.project.projectDTO = response.project; // not necessary
  }

  public async getSettings(folder: string, data: any) {
    //returns endpoint, warnEmpty
    const response = await backendPut(`/project/settings?project_folder=${folder}`, data) as ResponseWithProjectDTO;
    wikiStore.project.projectDTO = response.project;
  }

  public async uploadEntities(data: any) {
    const response = await backendPost(`/project/entity?${this.getDataFileParams(false)}`, data) as ResponseUploadEntitiesDTO;
    this.updateProjectandQnode(response);
    wikiStore.wikifier.entitiesStats = response.entitiesStats;
  }

  public async downloadResults(fileType: string) {
    //returns "data" (the download), "error": None, and "internalErrors"
    const response = await backendGet(`/project/download/${fileType}?${this.getMappingParams()}`);
    return response;
  }

  public async loadToDatamart() {
    const response = await backendGet(`/project/datamart?${this.getMappingParams()}`);
    return response;
  }

  public async renameYaml(folder: string, data: any) {
    const response = await backendPost(`/yaml/rename?project_folder=${folder}`, data) as ResponseWithProjectDTO;
    wikiStore.project.projectDTO = response.project;
  }

  public async saveYaml(data: any) {
    const response = await backendPost(`/yaml/save?${this.getDataFileParams()}`, data) as ResponseWithProjectDTO;
    wikiStore.project.projectDTO = response.project;
  }

  public async call<IProp, IState extends IStateWithError, ReturnValue>(
    component: React.Component<IProp, IState>,
    func: () => Promise<ReturnValue> ) {

    component.setState({ errorMessage: {} as ErrorMessage });

    try {
      return await func();
    } catch (error) {
      component.setState({ errorMessage: error });
      throw error;
    }
  }
}


export default RequestService;
