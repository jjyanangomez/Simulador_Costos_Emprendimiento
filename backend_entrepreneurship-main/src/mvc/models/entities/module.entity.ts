// src/simulator/module/domain/entities/module.entity.ts

export class Module {
  moduleId?: number;
  learningId: number;
  moduleOrder?: number;
  moduleName: string;
  contentTitle?: string;
  concept?: string;
  interactiveResource?: string;

  constructor(
    learningId: number,
    moduleName: string,
    moduleId?: number,
    moduleOrder?: number,
    contentTitle?: string,
    concept?: string,
    interactiveResource?: string,
  ) {
    this.moduleId = moduleId;
    this.learningId = learningId;
    this.moduleOrder = moduleOrder;
    this.moduleName = moduleName;
    this.contentTitle = contentTitle;
    this.concept = concept;
    this.interactiveResource = interactiveResource;
  }
}