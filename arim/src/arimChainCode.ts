/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Context, Contract } from "fabric-contract-api";
import { Arim } from "./arim";

export class ArimChainCode extends Contract {
    public async initLedger(ctx: Context) {
        console.info("============= START : Initialize Ledger ===========");
        const arim: Arim[] = [
            {
                ID: "DC001",
                ARIM: "test",
                placaVIN: "test",
                cargoDescription: "test",
                cargoLocation: "test",
                driver: "test",
                transportationCompany: "test",
                dateIssue: "test",
                typeOperation: "test",
                originDestiny: "test",
                BL_IE: "test",
                Client: "test",
                CustomsAgency: "test",
                payrollReceiver: "test",
                portOperator: "test",
            },
        ];

        for (let i = 0; i < arim.length; i++) {
            await ctx.stub.putState(
                "ARIM" + i,
                Buffer.from(JSON.stringify(arim[i]))
            );
            console.info("Added <--> ", arim[i]);
        }
        console.info("============= END : Initialize Ledger ===========");
    }

    public async createArim(
        ctx: Context,
        id: string,
        ARIM: string,
        placaVIN: string,
        cargoDescription: string,
        cargoLocation: string,
        driver: string,
        transportationCompany: string,
        dateIssue: string,
        typeOperation: string,
        originDestiny: string,
        BL_IE: string,
        Client: string,
        CustomsAgency: string,
        payrollReceiver: string,
        portOperator: string
    ) {
        console.info(
            "============= START : Create Document closure ==========="
        );
        const arim: Arim = {
            ID: id,
            ARIM: ARIM,
            placaVIN: placaVIN,
            cargoDescription: cargoDescription,
            cargoLocation: cargoLocation,
            driver: driver,
            transportationCompany: transportationCompany,
            dateIssue: dateIssue,
            typeOperation: typeOperation,
            originDestiny: originDestiny,
            BL_IE: BL_IE,
            Client: Client,
            CustomsAgency: CustomsAgency,
            payrollReceiver: payrollReceiver,
            portOperator: portOperator,
        };

        await ctx.stub.putState(id, Buffer.from(JSON.stringify(arim)));
        console.info("============= END : Create ARIM ===========");
    }

    public async queryAllArim(ctx: Context): Promise<string> {
        const startKey = "";
        const endKey = "";
        const allResults = [];
        for await (const { key, value } of ctx.stub.getStateByRange(
            startKey,
            endKey
        )) {
            const strValue = Buffer.from(value).toString("utf8");
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

    public async queryArim(ctx: Context, id: string): Promise<string> {
        const arimAsBytes = await ctx.stub.getState(id); // get the car from chaincode state
        if (!arimAsBytes || arimAsBytes.length === 0) {
            throw new Error(`${id} does not exist`);
        }
        console.log(arimAsBytes.toString());
        return arimAsBytes.toString();
    }

    public async ArimExists(ctx: Context, id: string): Promise<boolean> {
        const assetJSON = await ctx.stub.getState(id);
        return assetJSON && assetJSON.length > 0;
    }
}
