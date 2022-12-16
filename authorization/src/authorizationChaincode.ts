import { Context, Contract } from "fabric-contract-api";
import { stringify } from "querystring";
import { Authorization } from "./authorization";

export class AuthorizationChaincode extends Contract {
    public async initLedger(ctx: Context) {
        console.info("============= START : Initialize Ledger ===========");
        const authorization: Authorization[] = [
            {
                ID: "1",
                nitCustomAgency: "1111",
                nitCustomer: "MSL",
                nitOfficial: "1234",
                official: "",
                nitTransportCompany: "",
                status: "GLC 300 E 4MATIC",
                noAuthorizationAD: "GLC 300 E 4MATIC",
                files: [],
                items: [
                    {
                        NIUC: "BL123",
                        VINreference: "BL123",
                        lineItem: "test",
                        authorizedQuantity: "",
                        description: "",
                        codeIMO: "",
                        codeUM: "",
                    },
                ],
            },
        ];

        for (let i = 0; i < authorization.length; i++) {
            await ctx.stub.putState(
                "Quotes" + i,
                Buffer.from(JSON.stringify(authorization[i]))
            );
            console.info("Added <--> ", authorization[i]);
        }
        console.info("============= END : Initialize Ledger ===========");
    }

    // ReadAsset returns the asset stored in the world state with given id.
    async ReadAuthorization(ctx, id) {
        const assetJSON = await ctx.stub.getState(id); // get the asset from chaincode state
        if (!assetJSON || assetJSON.length === 0) {
            throw new Error(`The register Quotes ${id} does not exist`);
        }
        return assetJSON.toString();
    }

    public async createAuthorizationAD(
        ctx: Context,
        Id: string,
        nitCustomAgency: string,
        nitCustomer: string,
        nitOfficial: string,
        official: string,
        nitTransportCompany: string,
        status: string,
        noAuthorizationAD: string,
        items
    ) {
        console.info("============= START : Create Quotes ===========");
        const itemsJson = JSON.parse(items);
        const authorization: Authorization = {
            ID: Id,
            nitCustomAgency: nitCustomAgency,
            nitCustomer,
            nitOfficial: nitOfficial,
            official: official,
            nitTransportCompany: nitTransportCompany,
            status: status,
            noAuthorizationAD,
            files: [],
            items: itemsJson,
        };

        /*const exists = await this.RegisterExistQuotes(ctx, ReferenceLoad);
        if (exists) {
            throw new Error(`The Quote ${ReferenceLoad} exist`);
        }*/

        await ctx.stub.putState(Id, Buffer.from(JSON.stringify(authorization)));
        console.info("============= END : Create Quotes ===========");
    }

   
    public async queryAllAuthorizationAD(ctx: Context): Promise<string> {
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

    async DeleteAuthorizationAD(ctx, id) {
        const exists = await this.RegisterAuthorizationAD(ctx, id);
        if (!exists) {
            throw new Error(`The quote ${id} does not exist`);
        }
        return ctx.stub.deleteState(id);
    }

    async RegisterAuthorizationAD(ctx, id) {
        const assetJSON = await ctx.stub.getState(id);
        return assetJSON && assetJSON.length > 0;
    }

    async chargeFilesAuthorizationAD(ctx, id, files) {
        const filesObject = JSON.parse(files);
        const exists = await this.RegisterAuthorizationAD(ctx, id);
        if (!exists) {
            throw new Error(`The asset ${id} does not exist`);
        }

        const assetString = await this.ReadAuthorization(ctx, id);
        const asset = JSON.parse(assetString);
        asset.files = filesObject;

        return ctx.stub.putState(id, Buffer.from(JSON.stringify(asset)));
    }
}
