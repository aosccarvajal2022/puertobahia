import { Context, Contract } from "fabric-contract-api";
import { MotonaveAdvert } from "./motonaveAdvert";

export class MotonaveAdvertAsset extends Contract {
    public async initLedger(ctx: Context) {
        console.info("============= START : Initialize Ledger ===========");
        const motonave: MotonaveAdvert[] = [
            {
                ID: "1",
                recalada: "RC199124",
                motonave: "",
                imo: "",
                agency: "",
                ETA: "2022-01-01",
                ETD: "2022-01-02",
                status: "Anulado",
            },
            {
                ID: "2",
                recalada: "",
                motonave: "",
                imo: "",
                agency: "",
                ETA: "2022-01-01",
                ETD: "2022-01-02",
                status: "Pendiente",
            },
        ];

        for (let i = 0; i < motonave.length; i++) {
            await ctx.stub.putState(
                "Motonave" + i,
                Buffer.from(JSON.stringify(motonave[i]))
            );
            console.info("Added <--> ", motonave[i]);
        }
        console.info("============= END : Initialize Ledger ===========");
    }

    // ReadAsset returns the asset stored in the world state with given id.
    async ReadMotonaveAdvert(ctx, id) {
        const assetJSON = await ctx.stub.getState(id); // get the asset from chaincode state
        if (!assetJSON || assetJSON.length === 0) {
            throw new Error(`The register Motonave ${id} does not exist`);
        }
        return assetJSON.toString();
    }

    public async createRegister(
        ctx: Context,
        id: string,
        recalada: string,
        motonave: string,
        imo: string,
        agency: string,
        ETD: string,
        ETA: string,
        status: string
    ) {
        console.info(
            "============= START : Create Motonave Advert ==========="
        );

        const motonavere: MotonaveAdvert = {
            ID: id,
            recalada,
            motonave,
            imo,
            agency,
            ETA,
            ETD,
            status,
        };

        const exists = await this.RegisterExistMotonaveAdvert(ctx, motonave);
        if (exists) {
            throw new Error(`The Motonave ${recalada} exist`);
        }

        await ctx.stub.putState(
            motonavere.ID,
            Buffer.from(JSON.stringify(motonavere))
        );
        console.info("============= END : Create Motonave Advert ===========");
    }

    async UpdateMptonaveAdvert(
        ctx: Context,
        id: string,
        recalada: string,
        motonave: string,
        imo: string,
        agency: string,
        ETD: string,
        ETA: string,
        status: string
    ) {
        const exists = await this.RegisterExistMotonaveAdvert(ctx, id);
        if (!exists) {
            throw new Error(`The Motonave ${recalada} does not exist`);
        }

        // overwriting original asset with new asset
        const updateRegister: MotonaveAdvert = {
            ID: id,
            recalada,
            motonave,
            imo,
            agency,
            ETA,
            ETD,
            status,
        };
        // we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
        await ctx.stub.putState(
            id,
            Buffer.from(JSON.stringify(updateRegister))
        );
        console.info("============= END : Update Motonave Advert ===========");
    }

    public async queryAllRegisterMotonaveAdvert(ctx: Context): Promise<string> {
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

    async DeleteMotonave(ctx, id) {
        const exists = await this.RegisterExistMotonaveAdvert(ctx, id);
        if (!exists) {
            throw new Error(`The Motonave Advert ${id} does not exist`);
        }
        return ctx.stub.deleteState(id);
    }

    async RegisterExistMotonaveAdvert(ctx, id) {
        const assetJSON = await ctx.stub.getState(id);
        return assetJSON && assetJSON.length > 0;
    }
}

function sortKeysRecursive(updateRegister: MotonaveAdvert): any {
    throw new Error("Function not implemented.");
}
