import { Injectable,NestMiddleware } from "@nestjs/common";
import { Request,Response,NextFunction} from "express";
import { UsersService } from "../users.service";
import { User } from "../user.entity";

declare global{
    namespace Express{
        interface Request{
            currentUser?:User;
        }
    }
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware{
    constructor(private usersService:UsersService){}
    async use(req:Request,res:Response,next:NextFunction){
        const {userId} = req.session || {};

        console.log("this.usersService",this.usersService)
        console.log("this is the userId in middleware",userId);

        if(userId){
            try {
                const user = await this.usersService.findOne(userId);
                console.log('User fetched:', user);

                req.currentUser = user;
            } catch (error) {
                console.error('Error fetching user in middleware:', error);
            }
        }

        next();
    }
}