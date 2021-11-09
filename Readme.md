# API SERVER 

API SERVER is an ts module that have for goal to create MVC pattern with express or fastify and auto configure swagger interface to manipulate the api 

*Installing* 

<br>

    npm install --save @tsiresy/api-server 
    
After that you can create server via express or fastify 

## Fastify server
```ts
import "reflect-metadata";
import {fastify} from 'fastify'
import {  createFastifyServer } from '@tsiresy/api-server';

createFastifyServer(fastify(), {
    controllers: [ExempleController], // register all controllers here 
    middlewares:[ExempleMiddleWare], // register all global middlewares here 
},{
    options :{
        title : 'API SERVER ',
        version : '1.0.0'
    },
    url : '/docs' // OpenApi doc url
}).then((app)=>{
    app.listen(8080, 'localhost', 5, ()=>{
        console.log('Fastify server starting on port 8080')
    })
})
  
```

## Express server

```ts
import "reflect-metadata";
import express from 'express';
import { createExpressServer } from '@tsiresy/api-server';

createFastifyServer(express(), {
    controllers: [ExempleController],
    middlewares:[ExempleMiddleWare],
},{
    options :{
        title : 'API SERVER ',
        version : '1.0.0'
    },
    url : '/docs'
}).then((app)=>{
    app.listen(8080, 'localhost', 5, ()=>{
        console.log('Express server starting on port 8080')
    })
})
 
```

## Controller 
There is an exemple of controller with opeapi 
```ts
import { All, Get, Middleware, OpenApi } from "@tsiresy/api-server"
import { AppRequest, CookieType, AppResponse } from "@tsiresy/api-server"
import { Params, Req, Res, Query, Headers, Ip, Session, Cookies } from "@tsiresy/api-server";
import { Controller } from "@tsiresy/api-server";



@Controller({ prefix: '/api' })
export default class ExempleController {

    @OpenApi({
        responses: {
            '200': {
                '$ref': '',
                'description': 'Response',
            }
        },
        parameters: [
            {
                name: 'authorization',
                in: 'header'
            }
        ]
    })
    @Get('/login/:id')
    public async login(@Params('id') id: number,@Headers('authorization') authorization) {
        return {
            name: 'login', 
            params: id,
            authorization: authorization
        }
    }

    @OpenApi({
        responses: {
            '200': {
                '$ref': '',
                'description': 'Response',
            }
        }
    })
    @Middleware(InjectMiddleWare) // can inject middleware for only some method
    @All('/register')
    public async register(@Req() req: AppRequest, @Res() res: AppResponse, @Query() query: any, @Headers() headers: any, @Ip() ip: string, @Session() session: any, @Cookies() cookies: CookieType) {
        cookies.set('name', 'cookies test') // setting cookie 
        cookies.set('key', 'cookies test') // setting cookie 
        return {
            name: 'register',
            query: query,
            headers: headers,
            ip: ip,
            session: session,
            cookies: cookies
        }
    }
}
```
## Middleware 

Middleware is based on express middleware but it can work perfectly with fastify 

```ts
import { NextFunction,Request,Response } from 'express';
import { ExpressMiddleWare } from '@tsiresy/api-server';

export default class ExempleMiddleWare implements ExpressMiddleWare {

    public use(req: Request, res: Response, next: NextFunction){
        console.log('Called middleware')
        next();
    }
}

```

## Tsiresy Milà
### tsiresymila@gmail.com
