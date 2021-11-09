import { Application } from "express";
import { Sequelize } from 'sequelize-typescript';

export default class Server {
    app : Application
    db: Sequelize
    port: any
    constructor(app : Application, database: Sequelize, port=process.env.PORT || 3000){
        this.app = app
        this.db = database
        this.port = port
    }
    public async boot(){
        try{
            await this.db.sync()
        }
        catch(e: any){
            console.error('Error when connection to db ...')
            return ;
        }
        this.app.listen(this.port,()=>{
            console.log('Serveur running on port '+this.port)
        })
    }
}