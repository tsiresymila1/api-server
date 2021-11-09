import { NextFunction,Request,Response } from 'express';
import { ExpressMiddleWare } from '../../lib/@types/index';

export default class ExempleMiddleWare implements ExpressMiddleWare {

    public use(req: Request, res: Response, next: NextFunction){
        console.log('Called middleware')
        next();
    }
}
