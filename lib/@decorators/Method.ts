
import { RouteParams } from "./../@types/index";
import * as swagger from "swagger-schema-official";
const methodFactory = (method: string)=>{
    return (url: string)=>{
        return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
            let value: Function = descriptor.value
            // const args = Array.prototype.slice.call(target[propertyKey]['arguments'], 0, target[propertyKey]['arguments'].length);
            // const argTypes = args.map(e => typeof e); 
            // console.log(argTypes);
            if(target['routes']){
                target['routes'][propertyKey] =  {
                    method: method,
                    url : url,
                };
            }
            else{
                target['routes'] = {
                    [propertyKey]: {
                        method: method, 
                        url : url,
                    }
                }
            }
            descriptor.value = async function(...args: any[] | null){
                 return  await value.apply(this,args)
            }
            return target;
        }
    }
}

export const Middleware = (middleware: Function) => {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        if(!target['middlewares']){
            target['middlewares'] = {} 
        }
        target['middlewares'][propertyKey] = middleware
        return target;
    }
    
}

export const OpenApi = (options?: swagger.Operation)=>{
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        if(!target['paths']){
            target['paths'] = {} 
        }
        let route : RouteParams  = target['routes'][propertyKey]
        let operationId: string = String().concat(target.constructor.name,'.',propertyKey)
        options.operationId = operationId
        options.tags = [String(target.constructor.name).replace('Controller','')]
        target['paths'][propertyKey] = options
        return target;
    } 
    
}

export const Get = methodFactory('get')
export const Post = methodFactory('post')
export const Put = methodFactory('put')
export const All = methodFactory('all')