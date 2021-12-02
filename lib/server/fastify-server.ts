import Fastify, { FastifyInstance } from "fastify";
import { ServerOption } from "../@types";
import express, { Express } from 'express';
import path from 'path';
import { App } from "./server";


export class FastifyApplication extends App {
    app: FastifyInstance
    appe: Express
    options: ServerOption

    constructor() {
        super();
        this.app = Fastify();
        this.isfastify = true
        // this.options = options
    }

    public async config() {
        // await this.app.register(require('middie'))
        await this.app.register(require('fastify-express'))
        await this.app.register(require('fastify-cookie'))
        await this.app.register(require('fastify-static'), {
            root: this.options.staticFolder ?? path.join(__dirname, 'public'),
            prefix: this.options.staticUrl ?? '/static',
        })
        super.config();
    }

    public async configOpenApiMiddleware() {
        await this.app.register(require('fastify-swagger'), { mode: 'static', exposeRoute: true, specification: { document: this.spec }, routePrefix: this.openapiOptions ? this.openapiOptions.url ?? '/swagger.json' : '/swagger.json', })
        this.app.ready(err => {
            if (err) { console.log(err) }
            this.app['swagger']()
        })
    }

    public async serve(port: string | number, address: string, backlog: number, callback: (err: Error, address: string) => void) {
        await super.serve()
        this.app.listen(port, address, backlog, callback)
    }


}
