
import { Context, Contract } from 'fabric-contract-api';
import { stringify } from 'querystring';
import { ServiceLoad } from './ServiceLoad';

export class ServiceLoadAsset extends Contract {

    public async initLedger(ctx: Context) {
        console.info('============= START : Initialize Ledger ===========');
        const services: ServiceLoad[] = [
            {  
                
                serviceName: "Levantamiento",
                serviceCode: '199124'
                
             },
            {  
                serviceName: "Recarga",
                serviceCode: '199125'
             }
        ];

        for (let i = 0; i < services.length; i++) {
            await ctx.stub.putState('ServicesLoad' + i, Buffer.from(JSON.stringify(services[i])));
            console.info('Added <--> ', services[i]);
        }
        console.info('============= END : Initialize Ledger ===========');
    }   


  // ReadAsset returns the asset stored in the world state with given id.
  async ReadService(ctx, id) {
    const assetJSON = await ctx.stub.getState(id); // get the asset from chaincode state
    if (!assetJSON || assetJSON.length === 0) {
        throw new Error(`The register Service Load ${id} does not exist`);
    }
    return assetJSON.toString();
}


    public async createRegisterservice(
        ctx: Context,
        serviceName: string,
        serviceCode: string,
       
        
        ) {
        console.info('============= START : Create Service Load ===========');

        const service: ServiceLoad = {
            serviceName,
            serviceCode
        };

        const exists = await this.RegisterExistService(ctx, serviceCode);
        if (exists) {
            throw new Error(`The Service Code ${serviceCode} exist`);
        }

        await ctx.stub.putState(serviceCode, Buffer.from(JSON.stringify(service)));
        console.info('============= END : Create Service Load ===========');
    }


    async UpdateService(
        ctx: Context,
        serviceName: string,
        serviceCode: string,
        ) {

        const exists = await this.RegisterExistService(ctx, serviceCode);
        if (!exists) {
            throw new Error(`The Service Load ${serviceCode} does not exist`);
        }

        // overwriting original asset with new asset
        const updateRegister: ServiceLoad  = {

            serviceCode: serviceCode, 
            serviceName: serviceName, 
             
        };
        // we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
        return ctx.stub.putState(serviceCode, Buffer.from(stringify(sortKeysRecursive(updateRegister))));
    }

    public async queryAllRegisterServices(ctx: Context): Promise<string> {
        
        const startKey = '';
        const endKey = '';
        const allResults = [];
        for await (const {key, value} of ctx.stub.getStateByRange(startKey, endKey)) {
            const strValue = Buffer.from(value).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            allResults.push({ Key: key, Record: record });
        }
        return JSON.stringify(allResults);
    }

    async DeleteService(ctx, id) {
        const exists = await this.RegisterExistService(ctx, id);
        if (!exists) {
            throw new Error(`The Service ${id} does not exist`);
        }
        return ctx.stub.deleteState(id);
    }


    async RegisterExistService(ctx, id) {
        const assetJSON = await ctx.stub.getState(id);
        return assetJSON && assetJSON.length > 0;
    }
}

function sortKeysRecursive(updateRegister: ServiceLoad): any {
    throw new Error('Function not implemented.');
}
