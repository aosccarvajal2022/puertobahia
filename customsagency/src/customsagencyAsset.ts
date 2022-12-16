
import { Context, Contract } from 'fabric-contract-api';
import { stringify } from 'querystring';
import { CustomsAgency } from './customsagency';

export class CustomsagencyAsset extends Contract {

    public async initLedger(ctx: Context) {
        console.info('============= START : Initialize Ledger ===========');
        const document: CustomsAgency[] = [
            {  
                NIT: "DC001",
                AgencyName: "Puerto Bahia",
                AgencyContact: "Margariat",
                AgencyPhoneNumber : "0000001"
             },
            {  
                NIT: "DC002",
                AgencyName: "AOS SAS",
                AgencyContact: "Jhonathan Chamizo",
                AgencyPhoneNumber : "0000000"
             }
        ];

        for (let i = 0; i < document.length; i++) {
            await ctx.stub.putState('Agency' + i, Buffer.from(JSON.stringify(document[i])));
            console.info('Added <--> ', document[i]);
        }
        console.info('============= END : Initialize Ledger ===========');
    }   


  // ReadAsset returns the asset stored in the world state with given id.
  async ReadRegister(ctx, id) {
    const assetJSON = await ctx.stub.getState(id); // get the asset from chaincode state
    if (!assetJSON || assetJSON.length === 0) {
        throw new Error(`The register inventory ${id} does not exist`);
    }
    return assetJSON.toString();
}


    public async createAgency(
        ctx: Context,
        NIT: string,
        AgencyContact: string,
        AgencyName: string,
        AgencyPhoneNumber: string
        ) {
        console.info('============= START : Create Agency ===========');

        const agency: CustomsAgency = {
            NIT, 
            AgencyContact,
            AgencyName,
            AgencyPhoneNumber
            
        };

        const exists = await this.RegisterExistAgency(ctx, NIT);
        if (exists) {
            throw new Error(`The Agency ${NIT} exist`);
        }

        await ctx.stub.putState(NIT, Buffer.from(JSON.stringify(agency)));
        console.info('============= END : Create Agency ===========');
    }


    async UpdateAgency(
        ctx: Context,
        NIT: string,
        AgencyContact: string,
        AgencyName: string,
        AgencyPhoneNumber: string
        ) {

        const exists = await this.RegisterExistAgency(ctx, NIT);
        if (!exists) {
            throw new Error(`The agency ${NIT} does not exist`);
        }

        // overwriting original asset with new asset
        const updateRegister: CustomsAgency  = {
            NIT: NIT,
            AgencyContact: AgencyContact,
            AgencyName: AgencyName,
            AgencyPhoneNumber: AgencyPhoneNumber,
             
        };
        // we insert data in alphabgitetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
        return ctx.stub.putState(NIT, Buffer.from(stringify(sortKeysRecursive(updateRegister))));
    }

    public async queryAllRegisterAgency(ctx: Context): Promise<string> {
        
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

    async DeleteAgency(ctx, id) {
        const exists = await this.RegisterExistAgency(ctx, id);
        if (!exists) {
            throw new Error(`The Agency ${id} does not exist`);
        }
        return ctx.stub.deleteState(id);
    }


    async RegisterExistAgency(ctx, id) {
        const assetJSON = await ctx.stub.getState(id);
        return assetJSON && assetJSON.length > 0;
    }
}
function sortKeysRecursive(updateRegister: CustomsAgency): any {
    throw new Error('Function not implemented.');
}
