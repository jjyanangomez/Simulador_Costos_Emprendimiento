import { Module } from '@nestjs/common';
import { AppController } from '../app.controller';
import { AppService } from '../app.service';
import { PrismaModule } from '../shared/database/prisma.module';


// Controllers
import { UserController } from './controllers/user.controller';
import { BusinessController } from './controllers/business.controller';
import { SizeController } from './controllers/size.controller';
import { StatusController } from './controllers/status.controller';
import { ModuleController } from './controllers/module.controller';
import { LearningController } from './controllers/learning.controller';
import { AprendizajeController } from './controllers/aprendizaje.controller';
import { BusinessProgressStepController } from './controllers/business-progress-step.controller';
import { FinancialRecordController } from './controllers/financial-record.controller';
import { ValidationResultController } from './controllers/validation-result.controller';
import { CompleteAnalysisResultController } from './controllers/complete-analysis-result.controller';
import { AnalisisIAController } from './controllers/analysis_ai.controller';
import { AiController } from './controllers/ai.controller';
import { CostosFijosController } from './controllers/costos-fijos.controller';
import { CostosVariablesController } from './controllers/costos-variables.controller';
import { ProductosController, RecetasController } from './controllers/productos.controller';
import { AnalisisController } from './controllers/analisis.controller';
import { ProductoPrecioVentaController } from '../simulator/bussiness/controllers/producto-precio-venta.controller';
import { ItemsInversionController } from './controllers/items-inversion.controller';

// Services
import { UserService } from './services/user.service';
import { BusinessService } from './services/business.service';
import { SizeService } from './services/size.service';
import { StatusService } from './services/status.service';
import { ModuleService } from './services/module.service';
import { LearningService } from './services/learning.service';
import { AprendizajeService } from './services/aprendizaje.service';
import { BusinessProgressStepService } from './services/business-progress-step.service';
import { FinancialRecordService } from './services/financial-record.service';
import { ValidationResultService } from './services/validation-result.service';
import { CompleteAnalysisResultService } from './services/complete-analysis-result.service';
import { AnalisisIAService } from './services/analysis_ai.service';
import { AiService } from './services/ai.service';
import { CostosFijosService } from './services/costos-fijos.service';
import { CostosVariablesService } from './services/costos-variables.service';
import { ProductosService } from './services/productos.service';
import { AnalisisService } from './services/analisis.service';
import { ProductoPrecioVentaService } from '../simulator/bussiness/services/producto-precio-venta.service';
import { ItemsInversionService } from './services/items-inversion.service';

// Mappers
import { AnalisisIAMapper } from './models/mappers/analysis_ai.mapper';
import { UserMapper } from './models/mappers/user.mapper';
import { BusinessMapper } from './models/mappers/business.mapper';
import { SizeMapper } from './models/mappers/size.mapper';
import { StatusMapper } from './models/mappers/status.mapper';
import { ModuleMapper } from './models/mappers/module.mapper';
import { LearningMapper } from './models/mappers/learining.mapper';
import { AprendizajeMapper } from './models/mappers/aprendizaje.mapper';
import { BusinessProgressStepMapper } from './models/mappers/business-progress-step.mapper';
import { FinancialRecordMapper } from './models/mappers/financial-record.mapper';
import { ValidationResultMapper } from './models/mappers/validation-result.mapper';
import { CompleteAnalysisResultMapper } from './models/mappers/complete-analysis-result.mapper';
import { ModuloMapper } from './models/mappers/modulo.mapper';

@Module({
  imports: [PrismaModule],
  controllers: [
    AppController,
    UserController,
    BusinessController,
    SizeController,
    StatusController,
    ModuleController,
    LearningController,
    AprendizajeController,
    BusinessProgressStepController,
    FinancialRecordController,
    ValidationResultController,
    CompleteAnalysisResultController,
    AnalisisIAController,
    AiController,
    CostosFijosController,
    CostosVariablesController,
    ProductosController,
    RecetasController,
    AnalisisController,
    ProductoPrecioVentaController,
    ItemsInversionController,
  ],
  providers: [
    AppService,
    UserService,
    BusinessService,
    SizeService,
    StatusService,
    ModuleService,
    LearningService,
    AprendizajeService,
    BusinessProgressStepService,
    FinancialRecordService,
    ValidationResultService,
    CompleteAnalysisResultService,
    AnalisisIAService,
    AiService,
    CostosFijosService,
    CostosVariablesService,
    ProductosService,
    AnalisisService,
    ProductoPrecioVentaService,
    ItemsInversionService,
    // Mappers
    AnalisisIAMapper,
    UserMapper,
    BusinessMapper,
    SizeMapper,
    StatusMapper,
    ModuleMapper,
    LearningMapper,
    AprendizajeMapper,
    BusinessProgressStepMapper,
    FinancialRecordMapper,
    ValidationResultMapper,
    CompleteAnalysisResultMapper,
    ModuloMapper,
  ],
})
export class MvcModule {}
