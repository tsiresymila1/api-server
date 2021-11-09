
import { AppResponse } from "./../../lib/@types/index";
import { Post } from "./../../lib/@decorators/Method";
import { All, Get, Middleware, OpenApi } from "../../lib/@decorators"
import { AppRequest, CookieType } from "../../lib/@types"
import { Params, Req, Res, Query, Headers, Ip, Session, Cookies } from "../../lib/@decorators";
import { Controller } from "../../lib/@decorators";

import InjectMiddleWare from "../middlewares/InjectMiddleware";


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
    @Middleware(InjectMiddleWare)
    @All('/register')
    public async register(@Req() req: AppRequest, @Res() res: AppResponse, @Query() query: any, @Headers() headers: any, @Ip() ip: string, @Session() session: any, @Cookies() cookies: CookieType) {
        cookies.set('name', 'tsiresy')
        cookies.set('key', 'tsiresy')
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