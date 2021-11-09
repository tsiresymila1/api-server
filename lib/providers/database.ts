import { Sequelize } from 'sequelize-typescript'
import path from 'path'
import ENV from './../utils/env';
export default new Sequelize({
    database: ENV.Get('DATABASE'),
    host: ENV.Get('HOST'),
    port : ENV.Get('PORT'),
    dialect:  ENV.Get('DRIVER'),
    username: ENV.Get('USER'),
    password: ENV.Get('PASSWORD'),
    models: [path.resolve(__dirname + '/../models')] ,
    logging: false
})