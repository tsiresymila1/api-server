import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import cookie from 'cookie';
import { Express, Request, Response } from 'express'
import { AppRequest, AppResponse, ExpressErrorMiddleWare, RouteParams, ExpressMiddleWare, ParamsKey, CookieType } from "../@types";
import DefaultMiddleWare from './Controller';
import { CookieSerializeOptions } from 'cookie';
import { pathToRegexp, compile } from "path-to-regexp";
import swagger from 'swagger-schema-official';
import { TestPost } from './../../exemple/types/test';

const bindParams = (params: null | ParamsKey[], req: AppRequest, res: AppResponse, isFastify: boolean, cookieparams?: CookieSerializeOptions): any[] => {
    let methodParams = []
    params?.forEach((value: ParamsKey, index) => {
        let param: any;
        switch (value.param) {
            case 'req':
                param = isFastify ? (req as FastifyRequest).raw : (req as Request);
                break;
            case 'res':
                param = res;
                break;
            case 'params':
                param = req[value.param];
                break;
            case 'cookies':
                let data: CookieType = isFastify ? (req as FastifyRequest).raw[value.param] : (req as Request)[value.param];
                data.set = (key: string, value: string) => {
                    res['cookie'](cookie.serialize(key, String(value), cookieparams ?? {
                        httpOnly: true,
                        maxAge: 60 * 60 * 24 * 7
                    }))
                }
                param = data;
                break;
            default:
                param = isFastify ? (req as FastifyRequest).raw[value.param] : (req as Request)[value.param];
        }
        methodParams.push(value.value ? param[value.value] : param)
    });
    return methodParams;
}

const getInstance = (classRef: any): Object => {
    let Instance = class extends classRef {
        constructor(...params: any[]) {
            super(...params);
        }
    };
    return new Instance();
}

export const registerController = async (app: FastifyInstance | Express, object: Function, isFastify: boolean, cookieparams?: CookieSerializeOptions, spec?: swagger.Spec): Promise<swagger.Spec> => {
    let baseUrl: string = Object.getOwnPropertyDescriptors(object)['baseUrl'].value
    let renderType: string = Object.getOwnPropertyDescriptors(object)['render'].value
    let properties: string[] = Object.getOwnPropertyNames(object.prototype)
    for (let a of properties) {
        let method: Function = object.prototype[a];
        if (typeof method === 'function' && a !== 'constructor') {
            let route: RouteParams = object.prototype['routes'][a]
            let params: ParamsKey[] = object.prototype['params'] ? object.prototype['params'][a] ?? [] : []
            let middleware: Function = object.prototype['middlewares'] ? object.prototype['middlewares'][a] ?? DefaultMiddleWare : DefaultMiddleWare
            let use: Function = middleware.prototype.use;
            let applymiddleware: Function | Object = isFastify ? { preHandler: use } : use
            route.url = String().concat(baseUrl, route.url)

            // swagger processing
            let path = object.prototype['paths'] ? object.prototype['paths'][a] ?? null : null as swagger.Operation
            if (path) {
                
                const keys = [];
                await pathToRegexp(route.url, keys)
                if ('parameters' in path === false) {
                    path.parameters = []
                }
                const toPath = compile(route.url);
                let swaggerRoute: string = route.url
                for (let key of keys) {
                    path.parameters.push({
                        name: key['name'],
                        in: 'path',
                        required: true
                    })
                    swaggerRoute = toPath({ [key['name']]: `{${key['name']}}` })

                }
                // openAPi
                if (spec) {
                    if (!spec.paths) {
                        spec.paths = {}
                    }
                    if (!spec.paths[swaggerRoute]) {
                        spec.paths[swaggerRoute] = {}
                    }
                    if (route.method === 'all') {
                        spec.paths[swaggerRoute]['get'] = path
                        spec.paths[swaggerRoute]['post'] = path
                        spec.paths[swaggerRoute]['put'] = path
                        spec.paths[swaggerRoute]['delete'] = path
                    }
                    else {
                        spec.paths[swaggerRoute][route.method] = path
                    }
                }
            }

            //End open api
            // routing configuration
            app[route.method](route.url, applymiddleware, function (req: AppRequest, res: AppResponse) {
                let methodParams = bindParams(params, req, res, isFastify, cookieparams);
                method(...methodParams).then((data) => {
                    if (renderType) {
                        res.header('Content-type', renderType);
                    }
                    res.send(data)
                }).catch((err) => {
                    res.send({ error: err }).status(500)
                });

            })
        }
    }
    return spec;
}


export const registerMiddleware = async (app: Express | FastifyInstance, object: Function, isExpress: boolean = false) => {
    app['use']((object.prototype as ExpressMiddleWare | ExpressErrorMiddleWare).use)
}

