import { Controller,Post,Body,UseGuards,Patch,Param,Get,Query } from '@nestjs/common';
import { CreateReportDto } from './dtos/create-report.dto';
import { ReportsService } from './reports.service';
import { AuthGuard } from 'src/guards/auth.guards';
import { currentUser } from 'src/users/decoratos/current-userdecorator';
import { User } from 'src/users/user.entity';
import { ReportDto } from './dtos/report.dto';
import { Serialize } from 'src/interceptors/serialize.interceptors';
import { ApproveReportDto } from './dtos/approve-report.dto';
import { AdminGuard } from 'src/guards/admin.guard';
import { GetEstimateDto } from './dtos/get-estimate.dto';
import { QueryResult } from 'typeorm';

@Controller('reports')
export class ReportsController {

    constructor(private reportsService:ReportsService){}

    @Get()
    getEstimate(@Query() query:GetEstimateDto){
        return this.reportsService.createEstimate(query);
    }

    @Post()
    @UseGuards(AuthGuard)
    @Serialize(ReportDto)
    createReport(@Body() body:CreateReportDto,@currentUser() user:User){
        return this.reportsService.create(body,user);
    }

    @Patch('/:id')
    @UseGuards(AdminGuard)
    approveReport(@Param('id') id:string, @Body() body:ApproveReportDto ){
        return this.reportsService.changeApproval(id,body.approved)
    }
}

