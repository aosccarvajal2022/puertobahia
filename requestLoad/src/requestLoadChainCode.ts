/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Context, Contract } from "fabric-contract-api";
import { People } from "./people";
import { RequestLoad } from "./requestLoad";
import { ServicesR } from "./servicesrequest";

export class RequestLoadChainCode extends Contract {
    public async createRequestLoad(
        ctx: Context,
        id: string,
        dateApplication: string,
        suggestedDate: string,
        email: string,
        applicantId: string,
        applicantName: string,
        customerNIT: string,
        agencyNIT: string,
        remarks: string,
        radicado: string,
        requestNumber: string,
        status: string,
        people,
        services
    ) {
        console.info(
            "============= START : Create Request to load ==========="
        );
        const peopleJSON = JSON.parse(people);
        const servicesJSON = JSON.parse(services);

        const document: RequestLoad = {
            ID: id,
            dateApplication,
            suggestedDate,
            email,
            applicantId,
            applicantName,
            customerNIT,
            agencyNIT,
            remarks,
            radicado,
            requestNumber,
            status,
            people: peopleJSON,
            services: servicesJSON,
            files: [],
        };
        await ctx.stub.putState(id, Buffer.from(JSON.stringify(document)));
        console.info("============= END : Create Request to load ===========");
    }

    public async queryAllRequestLoad(ctx: Context): Promise<string> {
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

    async AssetExists(ctx, id) {
        const assetJSON = await ctx.stub.getState(id);
        return assetJSON && assetJSON.length > 0;
    }

    async ReadAsset(ctx, id) {
        const assetJSON = await ctx.stub.getState(id); // get the asset from chaincode state
        if (!assetJSON || assetJSON.length === 0) {
            throw new Error(`The asset ${id} does not exist`);
        }
        return assetJSON.toString();
    }

    async UpdateStatusRequestLoad(ctx, id, status, radicado, numberequest) {
        const exists = await this.AssetExists(ctx, id);
        if (!exists) {
            throw new Error(`The asset ${id} does not exist`);
        }
        const assetString = await this.ReadAsset(ctx, id);
        const asset = JSON.parse(assetString);
        asset.status = status;
        asset.radicado = radicado;
        asset.requestNumber = numberequest;

        return ctx.stub.putState(id, Buffer.from(JSON.stringify(asset)));
    }

    async chargeFilesRequestLoad(ctx, id, files) {
        const filesObject = JSON.parse(files);
        const exists = await this.AssetExists(ctx, id);
        if (!exists) {
            throw new Error(`The asset ${id} does not exist`);
        }

        const assetString = await this.ReadAsset(ctx, id);
        const asset = JSON.parse(assetString);
        asset.files = filesObject;

        return ctx.stub.putState(id, Buffer.from(JSON.stringify(asset)));
    }
}
