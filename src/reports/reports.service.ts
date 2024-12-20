import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from './report.entity';
import { CreateReportDto } from './dtos/create-report.dto';
import { User } from 'src/users/user.entity';
import { NotFoundError } from 'rxjs';
import { GetEstimateDto } from './dtos/get-estimate.dto';

@Injectable()
export class ReportsService {
    constructor(
        @InjectRepository(Report) private repo:Repository<Report>
    ){}

    createEstimate(estimateDto:GetEstimateDto){
        return this.repo.createQueryBuilder()
        .select('AVG(price)','price')
        .where('make = :make',{make:estimateDto.make})
        .andWhere('model = :model',{model:estimateDto.model})
        .andWhere('lng - :lng BETWEEN -5 AND 5',{lng:estimateDto.lng})
        .andWhere('lat - :lng BETWEEN -5 AND 5',{lat:estimateDto.lat})
        .andWhere('year - :year BETWEEN -3 AND 3',{year:estimateDto.year})
        .andWhere('approved IS TRUE')
        .orderBy('ABS(mileage - :mileage)','DESC')
        .setParameters({mileage:estimateDto.mileage})
        .limit(3)
        .getRawOne()
    }

    create(reportDto:CreateReportDto,user:User){
        const report = this.repo.create(reportDto);
        report.user = user;

        // this will extract just the userid and save it even if we passed the whole user as report.user
        return this.repo.save(report)
    }

    async changeApproval(id: string, approved: boolean) {
        const parsedId = parseInt(id); // Use a new variable for the parsed ID
        const report = await this.repo.findOneBy({ id: parsedId });
    
        if (!report) {
            throw new NotFoundException('Report not found');
        }
    
        report.approved = approved;
        return this.repo.save(report);
    }
    
}
