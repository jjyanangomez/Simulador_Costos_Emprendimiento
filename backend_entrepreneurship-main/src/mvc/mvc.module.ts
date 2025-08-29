import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AiModule } from '../simulator/ai/ai.module';
import { PrismaModule } from '../shared/database/prisma.module';

// Controllers
import { BusinessController } from './controllers/business.controller';
import { LearningController } from './controllers/learning.controller';
import { SizeController } from './controllers/size.controller';
import { ModuleController } from './controllers/module.controller';
import { StatusController } from './controllers/status.controller';
import { FinancialRecordController } from './controllers/financial-record.controller';
import { AnalisisIAController } from './controllers/analysis_ai.controller';
import { UserController } from './controllers/user.controller';
import { AprendizajeController, ModuloController } from './controllers/aprendizaje.controller';
import { ValidationResultController } from './controllers/validation-result.controller';
import { CostValidationController } from './controllers/cost-validation.controller';
import { BusinessProgressStepController } from './controllers/business-progress-step.controller';
import { CompleteAnalysisResultController } from './controllers/complete-analysis-result.controller';
import { AnalyzedCostResultController } from '../simulator/results_costs_analyzed/analyzed_cost_result.controller';
import { DetectedRiskResultController } from '../simulator/results_risks_detected/detected-risk-result.controller';
import { ActionPlanResultController } from '../simulator/results_action_plan/action-plan-result.controller';
import { OmittedCostResultController } from '../simulator/results_omitted_costs/omitted-cost-result.controller';

// Services
import { BusinessService } from './services/business.service';
import { LearningService } from './services/learning.service';
import { SizeService } from './services/size.service';
import { ModuleService } from './services/module.service';
import { StatusService } from './services/status.service';
import { FinancialRecordService } from './services/financial-record.service';
import { AnalisisIAService } from './services/analysis_ai.service';
import { UserService } from './services/user.service';
import { AprendizajeService } from './services/aprendizaje.service';
import { ValidationResultService } from './services/validation-result.service';
import { BusinessProgressStepService } from './services/business-progress-step.service';
import { CompleteAnalysisResultService } from './services/complete-analysis-result.service';
import { AnalyzedCostResultService } from '../simulator/results_costs_analyzed/analyzed_cost_result.service';
import { DetectedRiskResultService } from '../simulator/results_risks_detected/detected-risk-result.service';
import { ActionPlanResultService } from '../simulator/results_action_plan/action-plan-result.service';
import { OmittedCostResultService } from '../simulator/results_omitted_costs/omitted-cost-result.service';

// Mappers
import { BusinessMapper } from './models/mappers/business.mapper';
import { LearningMapper } from './models/mappers/learining.mapper';
import { SizeMapper } from './models/mappers/size.mapper';
import { ModuleMapper } from './models/mappers/module.mapper';
import { StatusMapper } from './models/mappers/status.mapper';
import { FinancialRecordMapper } from './models/mappers/financial-record.mapper';
import { AnalisisIAMapper } from './models/mappers/analysis_ai.mapper';
import { UserMapper } from './models/mappers/user.mapper';
import { AprendizajeMapper } from './models/mappers/aprendizaje.mapper';
import { ModuloMapper } from './models/mappers/modulo.mapper';
import { ValidationResultMapper } from './models/mappers/validation-result.mapper';
import { CompleteAnalysisResultMapper } from './models/mappers/complete-analysis-result.mapper';
import { AnalyzedCostResultMapper } from '../simulator/results_costs_analyzed/mappers/analyzed_cost_result.mapper';
import { DetectedRiskResultMapper } from '../simulator/results_risks_detected/mappers/detected-risk-result.mapper';
import { ActionPlanResultMapper } from '../simulator/results_action_plan/mappers/action-plan-result.mapper';
import { OmittedCostResultMapper } from '../simulator/results_omitted_costs/mappers/omitted-cost-result.mapper';

@Module({
  imports: [ConfigModule, AiModule, PrismaModule],
  controllers: [
    BusinessController,
    LearningController,
    SizeController,
    ModuleController,
    StatusController,
    FinancialRecordController,
    AnalisisIAController,
    UserController,
    AprendizajeController,
    ModuloController,
    ValidationResultController,
    CostValidationController,
    BusinessProgressStepController,
    CompleteAnalysisResultController,
    AnalyzedCostResultController,
    DetectedRiskResultController,
    ActionPlanResultController,
    OmittedCostResultController,
  ],
  providers: [
    BusinessService,
    LearningService,
    SizeService,
    ModuleService,
    StatusService,
    FinancialRecordService,
    AnalisisIAService,
    UserService,
    AprendizajeService,
    ValidationResultService,
    BusinessProgressStepService,
    CompleteAnalysisResultService,
    AnalyzedCostResultService,
    DetectedRiskResultService,
    ActionPlanResultService,
    OmittedCostResultService,
    BusinessMapper,
    LearningMapper,
    SizeMapper,
    ModuleMapper,
    StatusMapper,
    FinancialRecordMapper,
    AnalisisIAMapper,
    UserMapper,
    AprendizajeMapper,
    ModuloMapper,
    ValidationResultMapper,
    CompleteAnalysisResultMapper,
    AnalyzedCostResultMapper,
    DetectedRiskResultMapper,
    ActionPlanResultMapper,
    OmittedCostResultMapper,
  ],
  exports: [
    BusinessService,
    LearningService,
    SizeService,
    ModuleService,
    StatusService,
    FinancialRecordService,
    AnalisisIAService,
    UserService,
    AprendizajeService,
    ValidationResultService,
    BusinessProgressStepService,
  ],
})
export class MvcModule {}
