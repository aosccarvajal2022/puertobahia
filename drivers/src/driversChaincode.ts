/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Context, Contract } from "fabric-contract-api";
import { Driver } from "./drivers";

export class DriverChaincode extends Contract {
    public async initLedger(ctx: Context) {
        console.info("============= START : Initialize Ledger ===========");
        const document: Driver[] = [
            {
                ID: "DC001",
                ID_type: "MORNING CHORUS",
                ID_transport: "MORNING CHORUS",
                first_name: "RO1602 / 2022-04-17",
                second_name: "202201551",
                surname: "1 / 1",
                second_surname: "FORD MOTOR COLOMBIA S.A.S.",
            },
        ];

        for (let i = 0; i < document.length; i++) {
            await ctx.stub.putState(
                "DocumentClosure" + i,
                Buffer.from(JSON.stringify(document[i]))
            );
            console.info("Added <--> ", document[i]);
        }
        console.info("============= END : Initialize Ledger ===========");
    }

    public async createDriver(
        ctx: Context,
        id: string,
        ID_type: string,
        first_name: string,
        second_name: string,
        surname: string,
        second_surname: string,
        ID_transport: string
    ) {
        console.info(
            "============= START : Create Document closure ==========="
        );

        const document: Driver = {
            ID: id,
            ID_type,
            ID_transport,
            first_name,
            second_name,
            surname,
            second_surname,
        };

        await ctx.stub.putState(id, Buffer.from(JSON.stringify(document)));
        console.info("============= END : Create Document Closure ===========");
    }

    public async queryAllDrivers(ctx: Context): Promise<string> {
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

    public async DocumentClosureExists(
        ctx: Context,
        id: string
    ): Promise<boolean> {
        const assetJSON = await ctx.stub.getState(id);
        return assetJSON && assetJSON.length > 0;
    }
}
