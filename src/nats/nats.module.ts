import { ClientsModuleOptions, Transport } from "@nestjs/microservices"
import { envsConfig } from "src/config/envs.config"


export const registerNatService = (): ClientsModuleOptions => {
    return [{
        name: 'NATS_SERVICE',
        transport: Transport.NATS,
        options: {
            servers: envsConfig.NATS_URL
        }
    }]

}