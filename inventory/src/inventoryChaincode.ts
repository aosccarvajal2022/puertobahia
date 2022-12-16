/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Context, Contract } from "fabric-contract-api";
import { Document } from "./documents";
import { Items } from "./items";
export class DocumentClosure extends Contract {
    public async createDocumentClosure(
        ctx: Context,
        id: string,
        recalada: string,
        maritimeAgency: string,
        motonave: string,
        items
    ) {
        console.info(
            "============= START : Create Document closure ==========="
        );
        const itemsJSON = JSON.parse(items);
        const arrayaux = [];
        for (let item of itemsJSON) {
            const aux = {
                typeApplication: item.typeApplication,
                NIUC: item.NIUC,
                chargingDocument: item.chargingDocument,
                lineItem: item.lineItem,
                consignee: item.consignee,
                typeLoad: item.typeLoad,
                typeProduct: item.typeProduct,
                typePackaging: item.typePackaging,
                WeightAdvertised: item.WeightAdvertised,
                receivedWeight: item.receivedWeight,
                volumeAdvertised: item.volumeAdvertised,
                VINReferenceSerie: item.VINReferenceSerie,
                loadDisposition: item.loadDisposition,
                brand: item.brand,
                description: item.description,
                BLMaster: item.BLMaster,
                NIUCMaster: item.NIUCMaster,
                entryDate: item.entryDate,
                model: item.model,
                amountReceived: item.amountReceived,
                balance: item.balance,
                position: item.position,
                portDischarge: item.portDischarge,
                portLoading: item.portLoading,
                daysPort: item.daysPort,
                color: item.color,
                line: item.line,
                containerNumber: item.containerNumber,
                stamps: item.stamps,
                remarks: item.remarks,
                formalities: item.formalities,
                typeOperation: item.typeOperation,
                weightStock: item.weightStock,
                volumeReceived: item.volumeReceived,
                volumeStock: item.volumeStock,
            };
            arrayaux.push(aux);
        }

        const document: Document = {
            ID: id,
            recalada,
            maritimeAgency,
            motonave,
            items: arrayaux,
        };

        const result = await ctx.stub.putState(
            id,
            Buffer.from(JSON.stringify(document))
        );
        return result;
        console.info("============= END : Create Document Closure ===========");
    }

    public async queryAllDocumentClosure(ctx: Context): Promise<string> {
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

    public async updateDocumentClosure(
        ctx: Context,
        id: string,
        index: string,
        newInfo: string
    ) {
        const pos = Number(index);
        const documentBytes = await ctx.stub.getState(id); // get the car from chaincode state
        if (!documentBytes || documentBytes.length === 0) {
            throw new Error(`${id} does not exist`);
        }
        const document = JSON.parse(documentBytes.toString());
        const item = document.items[pos];
        const newInfoJSON = JSON.parse(newInfo);
        item.BLMaster = newInfoJSON.BLMaster;
        item.NIUC = newInfoJSON.NIUC;
        item.NIUCMaster = newInfoJSON.NIUCMaster;
        item.VINReferenceSerie = newInfoJSON.VINReferenceSerie;
        item.WeightAdvertised = newInfoJSON.WeightAdvertised;
        item.amountReceived = newInfoJSON.amountReceived;
        item.brand = newInfoJSON.brand;
        item.chargingDocument = newInfoJSON.chargingDocument;
        item.color = newInfoJSON.color;
        item.consignee = newInfoJSON.consignee;
        item.containerNumber = newInfoJSON.containerNumber;
        item.daysPort = newInfoJSON.daysPort;
        item.description = newInfoJSON.description;
        item.entryDate = newInfoJSON.entryDate;
        item.formalities = newInfoJSON.formalities;
        item.line = newInfoJSON.line;
        item.lineItem = newInfoJSON.lineItem;
        item.loadDisposition = newInfoJSON.loadDisposition;
        item.model = newInfoJSON.model;
        item.portDischarge = newInfoJSON.portDischarge;
        item.portLoading = newInfoJSON.portLoading;
        item.receivedWeight = newInfoJSON.receivedWeight;
        item.remarks = newInfoJSON.remarks;
        item.stamps = newInfoJSON.stamps;
        item.typeApplication = newInfoJSON.typeApplication;
        item.typeLoad = newInfoJSON.typeLoad;
        item.typeOperation = newInfoJSON.typeOperation;
        item.typePackaging = newInfoJSON.typePackaging;
        item.typeProduct = newInfoJSON.typeProduct;
        item.volumeAdvertised = newInfoJSON.volumeAdvertised;
        item.volumeReceived = newInfoJSON.volumeReceived;
        item.volumeStock = newInfoJSON.volumeStock;
        item.weightStock = newInfoJSON.weightStock;
        item.balance = newInfoJSON.balance;

        const result = await ctx.stub.putState(
            id,
            Buffer.from(JSON.stringify(document))
        );
        console.info("============= END : changeCarOwner ===========");
        return JSON.stringify(result);
    }

    public async queryInventory(ctx: Context, id: string): Promise<string> {
        const inventoryAsBytes = await ctx.stub.getState(id); // get the car from chaincode state
        if (!inventoryAsBytes || inventoryAsBytes.length === 0) {
            throw new Error(`${id} does not exist`);
        }
        return inventoryAsBytes.toString();
    }

    async deleteInventory(ctx, id) {
        const exists = await this.DocumentClosureExists(ctx, id);
        if (!exists) {
            throw new Error(`The Register Inventory ${id} does not exist`);
        }
        return ctx.stub.deleteState(id);
    }

    
}
