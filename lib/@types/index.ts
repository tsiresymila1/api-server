import { FastifyRequest,FastifyReply } from "fastify"
import {Request,Response, NextFunction,} from 'express'
import multer from "multer"
import {OptionsJson,OptionsUrlencoded} from "body-parser"
import { CookieSerializeOptions } from "cookie"
import swagger from 'swagger-schema-official';
type ControllerOptions = {
    url?: string
}

export  interface ExpressMiddleWare {
    use : (req: Request, res: Response, next: NextFunction) => void;
}
export interface ExpressErrorMiddleWare {
    use: (error: Error, res: Response, next: NextFunction) => void;
}

export type AppRequest = Request | FastifyRequest
export type AppResponse = Response | FastifyReply

export interface  ServerOption {
    sessionSecretKey?: string[],
    cors?: boolean,
    controllers?: Function[],
    middlewares?: Function[],
    uploadOption?: multer.Options,
    json? : OptionsJson
    urlencoded? : OptionsUrlencoded;
    cookieParams?: CookieSerializeOptions,
    staticFolder? :string,
    staticUrl?: string
 }



 export interface RouteParams {
     url: string,
     method: string
     
 }

 export interface CookieType{
     set: (key:string, value: string)=> any,
 }

 export type ParamsKey = {
    param : string,
    value :  string
 }

 export type OpenAPiParams = {
     options : swagger.Info
     url?: string
 }