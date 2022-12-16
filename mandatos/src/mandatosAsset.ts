
import { Context, Contract } from 'fabric-contract-api';
import { stringify } from 'querystring';
import { Mandato } from './mandatos';

export class MandatoAsset extends Contract {

    public async initLedger(ctx: Context) {
        console.info('============= START : Initialize Ledger ===========');
        const mandatos: Mandato[] = [
            {  
                ID: "1000",
                approver_third: "auduana",
                authorizing_third: "Aos0,",
                type: "Test",
                from: "2022-01-01",
                to: "2022-01-03"
             },
            {  
                ID: "1001",
                approver_third: "auduana",
                authorizing_third: "Aos0,",
                type: "Test",
                from: "2022-02-01",
                to: "2022-05-03"
             }
        ];

        for (let i = 0; i < mandatos.length; i++) {
            await ctx.stub.putState('Mandatos' + i, Buffer.from(JSON.stringify(mandatos[i])));
            console.info('Added <--> ', mandatos[i]);
        }
        console.info('============= END : Initialize Ledger ===========');
    }   


  // ReadAsset returns the asset stored in the world state with given id.
  async ReadMandato(ctx, id) {
    const assetJSON = await ctx.stub.getState(id); // get the asset from chaincode state
    if (!assetJSON || assetJSON.length === 0) {
        throw new Error(`The register Mandato ${id} does not exist`);
    }
    return assetJSON.toString();
}


    public async createRegisterMandato(
        ctx: Context,
        ID: string, 
        type : string,
        authorizing_third: string,
        approver_third: string,
        from: string,
        to: string
        
        ) {
        console.info('============= START : Create Mandato ===========');

        const mandato: Mandato = {
            ID, 
            type,
            authorizing_third,
            approver_third,
            from,
            to
        };

        const exists = await this.RegisterExistMandato(ctx, ID);
        if (exists) {
            throw new Error(`The Mandato ${ID} exist`);
        }

        await ctx.stub.putState(ID, Buffer.from(JSON.stringify(mandato)));
        console.info('============= END : Create Mandato ===========');
    }


    async UpdateMandato(
        ctx: Context,
        ID: string, 
        type : string,
        authorizing_third: string,
        approver_third: string,
        from: string,
        to: string
        ) {

        const exists = await this.RegisterExistMandato(ctx, ID);
        if (!exists) {
            throw new Error(`The mandato ${ID} does not exist`);
        }

        // overwriting original asset with new asset
        const updateRegister: Mandato  = {

            ID, 
            type,
            authorizing_third,
            approver_third,
            from,
            to
 
             
        };
        // we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
        return ctx.stub.putState(ID, Buffer.from(stringify(sortKeysRecursive(updateRegister))));
    }

    public async queryAllRegister(ctx: Context): Promise<string> {
        
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

    async DeleteMandato(ctx, id) {
        const exists = await this.RegisterExistMandato(ctx, id);
        if (!exists) {
            throw new Error(`The Mandato ${id} does not exist`);
        }
        return ctx.stub.deleteState(id);
    }


    async RegisterExistMandato(ctx, id) {
        const assetJSON = await ctx.stub.getState(id);
        return assetJSON && assetJSON.length > 0;
    }
}

function sortKeysRecursive(updateRegister: Mandato): any {
    throw new Error('Function not implemented.');
}
