import { NextFunction,Request,Response } from 'express';
import { AppMiddleWare, ExpressMiddleWare } from '../../lib/@types/index';

export default class ExempleMiddleWare implements AppMiddleWare {

    public use(req: Request, res: Response, next: NextFunction){
        console.log('Called middleware')
        next();
    }
}
