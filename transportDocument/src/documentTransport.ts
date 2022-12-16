/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Context, Contract } from 'fabric-contract-api';
import { Document } from './documents';

export class DocumentTransport extends Contract {

    public async initLedger(ctx: Context) {
        console.info('============= START : Initialize Ledger ===========');
        const document: Document[] = [
            {  
                ID: "DC001",
                bl : "MORNING CHORUS",
                recalada : "RO1602 / 2022-04-17"                
             }
        ];

        for (let i = 0; i < document.length; i++) {
            await ctx.stub.putState('DocumentClosure' + i, Buffer.from(JSON.stringify(document[i])));
            console.info('Added <--> ', document[i]);
        }
        console.info('============= END : Initialize Ledger ===========');
    }   
    public async createDocumentTrasnport(
        ctx: Context,
        id: string,
        bl: string,
        recalada: string        
        ) {
        console.info('============= START : Create Transport Document ===========');

        const document: Document = {
            ID: id,
            bl,
            recalada            
        };
        await ctx.stub.putState(id, Buffer.from(JSON.stringify(document)));
        console.info('============= END : Create Transport Document ===========');
    }

    public async queryAllDocumentTrasnport(ctx: Context): Promise<string> {
        
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
    
    public async UpdateTransport(ctx: Context, id: string, 
        bl: string,
        recalada: string): Promise<void> {
        const exists = await this.DocumentTransportExists(ctx, id);
        if (!exists) {
            throw new Error(`The asset ${id} does not exist`);
        }
        // overwriting original asset with new asset
        const document: Document = {
            ID: id,
            bl,
            recalada            
        };
        return ctx.stub.putState(id, Buffer.from(JSON.stringify(document)));
    }

    public async DocumentTransportExists(ctx: Context, id: string): Promise<boolean> {
        const assetJSON = await ctx.stub.getState(id);
        return assetJSON && assetJSON.length > 0;
    }

}
