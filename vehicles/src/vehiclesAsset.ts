
import { Context, Contract } from 'fabric-contract-api';
import { stringify } from 'querystring';
import { Vehicle } from './vehicles';

export class VehicleAsset extends Contract {

    public async initLedger(ctx: Context) {
        console.info('============= START : Initialize Ledger ===========');
        const vehicles: Vehicle[] = [
            {  
                Placa: "FJM288",
                Type: "Camioneta",
                ClassVehicle: 'Pickup'
             },
            {  
                Placa: "NTX288",
                Type: "Camion",
                ClassVehicle: 'N300'
             }
        ];

        for (let i = 0; i < vehicles.length; i++) {
            await ctx.stub.putState('Vehicles' + i, Buffer.from(JSON.stringify(vehicles[i])));
            console.info('Added <--> ', vehicles[i]);
        }
        console.info('============= END : Initialize Ledger ===========');
    }   


  // ReadAsset returns the asset stored in the world state with given id.
  async ReadVehicle(ctx, id) {
    const assetJSON = await ctx.stub.getState(id); // get the asset from chaincode state
    if (!assetJSON || assetJSON.length === 0) {
        throw new Error(`The register vehicle ${id} does not exist`);
    }
    return assetJSON.toString();
}


    public async createVehicle(
        ctx: Context,
        Placa: string,
        Type: string,
        ClassVehicle: string,
        
        ) {
        console.info('============= START : Create Vehicle ===========');

        const vehicle: Vehicle = {
          Placa, 
          Type,
          ClassVehicle
        };

        const exists = await this.RegisterExistVehicle(ctx, Placa);
        if (exists) {
            throw new Error(`The Vechicle ${Placa} exist`);
        }

        await ctx.stub.putState(Placa, Buffer.from(JSON.stringify(vehicle)));
        console.info('============= END : Create Vehicle ===========');
    }


    async UpdateVehicle(
        ctx: Context,
        Placa: string,
        Type: string,
        ClassVehicle: string,
        ) {

        const exists = await this.RegisterExistVehicle(ctx, Placa);
        if (!exists) {
            throw new Error(`The vehicle ${Placa} does not exist`);
        }

        // overwriting original asset with new asset
        const updateRegister: Vehicle  = {

            Placa: Placa, 
            Type: Type,
            ClassVehicle: ClassVehicle
 
             
        };
        // we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
        return ctx.stub.putState(Placa, Buffer.from(stringify(sortKeysRecursive(updateRegister))));
    }

    public async queryAllRegisterVehicles(ctx: Context): Promise<string> {
        
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

    async DeleteVehicles(ctx, id) {
        const exists = await this.RegisterExistVehicle(ctx, id);
        if (!exists) {
            throw new Error(`The Vehicle ${id} does not exist`);
        }
        return ctx.stub.deleteState(id);
    }


    async RegisterExistVehicle(ctx, id) {
        const assetJSON = await ctx.stub.getState(id);
        return assetJSON && assetJSON.length > 0;
    }
}

function sortKeysRecursive(updateRegister: Vehicle): any {
    throw new Error('Function not implemented.');
}
