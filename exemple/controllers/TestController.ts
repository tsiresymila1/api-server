import { Controller, Get, Params,Headers, OpenApi } from "../../lib/@decorators";

@Controller({ prefix: '/api' })
export default class TestController {

    @OpenApi({
        responses: {
            '200': {
                '$ref': '',
                'description': 'Response',
            }
        }
    })
    @Get('/user/:id')
    public async getUser(@Params('id') id: number, @Headers('authorization') authorization) {
        return {
            name: 'user', 
            params: id,
            authorization: authorization
        }
    }
}