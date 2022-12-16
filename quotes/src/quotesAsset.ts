import { Context, Contract } from "fabric-contract-api";
import { stringify } from "querystring";
import { Quotes } from "./quotes";

export class QuotesAsset extends Contract {
    public async initLedger(ctx: Context) {
        console.info("============= START : Initialize Ledger ===========");
        const quotes: Quotes[] = [
            {
                ID: "1",
                nitCustomAgency: "1111",
                nitCustomer: "MSL",
                nitOfficial: "1234",
                official: "",
                nitOfficialAuthorized: "",
                officialAuthorized: "",
                modalityOperation: "",
                nitTransportCompany: "",
                typeOperation: "Ingreso",
                replyEmail: "",
                observation: "",
                radicado: "",
                requestNumber: "W1N2539531G048562",
                status: "GLC 300 E 4MATIC",
                requiredFiles: [],
                drivers: [
                    {
                        placaCabezote: "",
                        placaREmolque: "",
                        codigoEjes: "",
                        driverId: "",
                        destination: "",
                        suggestedDate: "",
                        suggestedTime: "",
                        cargoManifest: "",
                        cycle: "",
                        itemsToRemove: [
                            {
                                NIUC: "",
                                VINReference: "",
                                lineItem: "",
                                quantity: "",
                            },
                        ],
                    },
                ],
            },
        ];

        for (let i = 0; i < quotes.length; i++) {
            await ctx.stub.putState(
                "Quotes" + i,
                Buffer.from(JSON.stringify(quotes[i]))
            );
            console.info("Added <--> ", quotes[i]);
        }
        console.info("============= END : Initialize Ledger ===========");
    }

    // ReadAsset returns the asset stored in the world state with given id.
    async ReadQuotes(ctx, id) {
        const assetJSON = await ctx.stub.getState(id); // get the asset from chaincode state
        if (!assetJSON || assetJSON.length === 0) {
            throw new Error(`The register Quotes ${id} does not exist`);
        }
        return assetJSON.toString();
    }

    async Update(
        ctx: Context,
        Id: string,
        nitCustomAgency: string,
        NitCustomer: string,
        nitOfficial: string,
        official: string,
        nitOfficialAuthorized: string,
        officialAuthorized: string,
        modalityOperation: string,
        nitTransportCompany: string,
        typeOperation: string,
        replyEmail: string,
        observation: string,
        radicado: string,
        requestNumber: string,
        status: string,
        requiredFiles,
        drivers
    ) {
        const exists = await this.RegisterExistQuotes(ctx, Id);
        if (!exists) {
            throw new Error(`The Register  ${Id} does not exist`);
        }

        const requiredFilesJson = JSON.parse(requiredFiles);
        const driversJson = JSON.parse(drivers);
        // overwriting original asset with new asset
        const quote: Quotes = {
            ID: Id,
            nitCustomAgency: nitCustomAgency,
            nitCustomer: NitCustomer,
            nitOfficial: nitOfficial,
            official: official,
            nitOfficialAuthorized: nitOfficialAuthorized,
            officialAuthorized: officialAuthorized,
            modalityOperation: modalityOperation,
            nitTransportCompany: nitTransportCompany,
            typeOperation: typeOperation,
            replyEmail: replyEmail,
            observation: observation,
            radicado: radicado,
            requestNumber: requestNumber,
            status: status,
            requiredFiles: requiredFilesJson,
            drivers: driversJson,
        };
        // we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
        return ctx.stub.putState(Id, Buffer.from(JSON.stringify(quote)));
    }

    public async createRegisterQuotes(
        ctx: Context,
        Id: string,
        nitCustomAgency: string,
        NitCustomer: string,
        nitOfficial: string,
        official: string,
        nitOfficialAuthorized: string,
        officialAuthorized: string,
        modalityOperation: string,
        nitTransportCompany: string,
        typeOperation: string,
        replyEmail: string,
        observation: string,
        radicado: string,
        requestNumber: string,
        status: string,
        requiredFiles,
        drivers
    ) {
        console.info("============= START : Create Quotes ===========");
        const requiredFilesJson = JSON.parse(requiredFiles);
        const driversJson = JSON.parse(drivers);
        const quote: Quotes = {
            ID: Id,
            nitCustomAgency: nitCustomAgency,
            nitCustomer: NitCustomer,
            nitOfficial: nitOfficial,
            official: official,
            nitOfficialAuthorized: nitOfficialAuthorized,
            officialAuthorized: officialAuthorized,
            modalityOperation: modalityOperation,
            nitTransportCompany: nitTransportCompany,
            typeOperation: typeOperation,
            replyEmail: replyEmail,
            observation: observation,
            radicado: radicado,
            requestNumber: requestNumber,
            status: status,
            requiredFiles: requiredFilesJson,
            drivers: driversJson,
        };

        await ctx.stub.putState(Id, Buffer.from(JSON.stringify(quote)));
        console.info("============= END : Create Quotes ===========");
    }

    public async queryAllRegisterQuotes(ctx: Context): Promise<string> {
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

    async DeleteQuotes(ctx, id) {
        const exists = await this.RegisterExistQuotes(ctx, id);
        if (!exists) {
            throw new Error(`The quote ${id} does not exist`);
        }
        return ctx.stub.deleteState(id);
    }

    async RegisterExistQuotes(ctx, id) {
        const assetJSON = await ctx.stub.getState(id);
        return assetJSON && assetJSON.length > 0;
    }

    async chargeFilesQuotes(ctx, id, files) {
        const filesObject = JSON.parse(files);
        const exists = await this.RegisterExistQuotes(ctx, id);
        if (!exists) {
            throw new Error(`The asset ${id} does not exist`);
        }

        const assetString = await this.ReadQuotes(ctx, id);
        const asset = JSON.parse(assetString);
        asset.requiredFiles = filesObject;

        return ctx.stub.putState(id, Buffer.from(JSON.stringify(asset)));
    }
}

function sortKeysRecursive(updateRegister: Quotes): any {
    throw new Error("Function not implemented.");
}
