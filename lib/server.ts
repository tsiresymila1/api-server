import { FastifyInstance } from "fastify"
import express,{Express} from 'express'
import cookieSession  from 'cookie-session'
import multer, { Multer } from 'multer';
import { registerController, registerMiddleware } from "./@decorators/factory"
import { OpenAPiParams, ServerOption } from "./@types"
import  path  from 'path';
import {json, urlencoded} from 'body-parser';
import cookieParser from 'cookie-parser'
import swagger from 'swagger-schema-official'
import swaggerUi from 'swagger-ui-express';


 const createServer = async (
    app: FastifyInstance | Express,
    options: ServerOption,
    isFastify: boolean,
    openapiOptions?: OpenAPiParams
) => {
    let spec: swagger.Spec = {
        swagger : '2.0',
        info : openapiOptions? openapiOptions.options :  {
            title : 'API SERVER ',
            version : '1.0.0'
        },
        paths : {},
    };
    if (isFastify) {
        await (app as FastifyInstance).register(require('fastify-express')) 
        await (app as FastifyInstance).register(require('fastify-cookie'))
        await (app as FastifyInstance).register(require('fastify-static'), {
            root: options.staticFolder ?? path.join(__dirname, 'public'),
            prefix: options.staticUrl ?? '/static',
        })
    }
    else{
        // (app as Express).set('trust proxy', 1)
        (app as Express).use( options.staticUrl ?? '/static', express.static(options.staticFolder ?? path.join(__dirname, 'public')));
    }
    // defile middlware
    //body parse 
    app['use'](json(options.json ?? {limit : '50mb'}))
    app['use'](urlencoded(options.urlencoded ?? {extended: true}));
    //cookie
    app['use'](cookieParser())
    //cookie session
    app['use'](cookieSession({
        name: 'session',
        keys: options.sessionSecretKey ?? ['super_secret', 'super_secret']
    }))

    //file upload 
    const upload: Multer = multer(options.uploadOption ?? { dest: path.join(__dirname,'./public/uploads/' )})
    app['use'](upload.any())

    //end define default middleware
    if (options.cors) {
        app['use'](require('cors'))
    }
    for (let middleware of options.middlewares || []) {
        await registerMiddleware(app, middleware)
    }
    for (let controller of options.controllers || []) {
        spec = await registerController(app, controller,isFastify, options.cookieParams,spec)
    }
    // documentation for swagger
    if(isFastify){ 
        let fastifyApp = (app as FastifyInstance)
         await fastifyApp.register(require('fastify-swagger'), {mode: 'static', exposeRoute: true, specification: { document: spec}, routePrefix: openapiOptions? openapiOptions.url ?? '/swagger.json' : '/swagger.json',})
         fastifyApp.ready(err => {
            if (err) {console.log(err)}
            (app as FastifyInstance)['swagger']()
          })
        }
    else{
        (app as Express).use(openapiOptions? openapiOptions.url ?? '/swagger.json' : '/swagger.json',swaggerUi.serve, swaggerUi.setup(spec))
    }
     // End documentation for swagger
    return app
}

export const createFastifyServer = async (app: FastifyInstance,options: ServerOption,openapiOptions?: OpenAPiParams)=>{
    return await createServer(app,options, true,openapiOptions) 
}

export const createExpressServer = async (app: Express,options: ServerOption,openapiOptions?: OpenAPiParams)=>{
    return await createServer(app,options, false,openapiOptions)
}
