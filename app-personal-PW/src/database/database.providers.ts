import { ConfigService } from "../config/config.service";
import { DataSource } from "typeorm"

export const databaseProvider=[
    {
        provide: 'DATABASE_CONNECTION_POSTGRES',
        inject: [ConfigService],
        useFactory:(config: ConfigService)=>{
            const dataSource= new DataSource({
                type:'postgres',
                host:config.get('HOST'),
                port: +config.get('PORT'),
                username: config.get('USERNAME'),
                password: config.get('PASSWORD'),
                database: config.get('DATABASE'),
                entities: [
                    __dirname + '/../**/*.entity{.ts,.js}'
                ]
            });

            return dataSource.initialize();
        }
    }
]