import { ParamsKey } from "../@types";

const paramsFactory = (ptype: string)=> {
    return (key?: string) => {
        return (target: any, propertyKey: string, parameterIndex: number) => {
            let data = {
                param : ptype,
                value :  key
            } as ParamsKey;
            if(target['params']){
                if(!target['params'][propertyKey]){
                    target['params'][propertyKey] = []
                }
                target['params'][propertyKey][parameterIndex] = data
            }
            else{
                target['params'] = {
                    [propertyKey]: []
                }
                target['params'][propertyKey][parameterIndex] = data
            }
            return target
        }
    }
    
}

export const Req = paramsFactory('req')
export const Res = paramsFactory('res')
export const Params = paramsFactory('params')
export const Body = paramsFactory('body')
export const Query = paramsFactory('query')
export const Headers = paramsFactory('headers')
export const Session = paramsFactory('session')
export const Cookies = paramsFactory('cookies')
export const Ip = paramsFactory('ip')
