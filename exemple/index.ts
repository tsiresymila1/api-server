import "reflect-metadata";
import  TestController  from "./controllers/TestController";
import express from 'express';
import {fastify} from 'fastify'
import { createExpressServer, createFastifyServer } from '../lib/server';
import ExempleController from './controllers/ExempleController';
import ExempleMiddleWare from './middlewares/ExempleMiddleware';

createFastifyServer(fastify(), {
    controllers: [ExempleController, TestController],
    middlewares:[ExempleMiddleWare],
},{
    options :{
        title : 'API SERVER ',
        version : '1.0.0'
    },
    url : '/docs'
}).then((app)=>{
    app.listen(8080, 'localhost', 5, ()=>{
        console.log('Fastify server starting on port 8080')
    })
})
 
// createExpressServer(express(), {
//     controllers: [ExempleController],
//     middlewares:[ExempleMiddleWare],
// },{
//     options :{
//         title : 'API SERVER ',
//         version : '1.0.0'
//     },
//     url : '/docs'
// }).then((app)=>{
//     console.log(JSON.stringify(spec,null,2))
//     app.listen(8080, 'localhost', 5, ()=>{
//         console.log('Express server starting on port 8080') 
//     })
// })








