/*
 * SPDX-License-Identifier: Apache-2.0
 */

export class Document {
  public ID: string;
  public motonave: string;
  public recaladaRta: string;
  public NIUC: string;
  public lineItem: string;
  public Consignee: string;
  public typeProduct: string;
  public typeCharge: string;
  public typePackaging: string;
  public description: string;
  public netWeight: string;
  public receivedWeight: string;
  public netVolume: string;
  public brand: string;
  public line: string;
  public agencies: object;
  public shipment: {
    IDApplication: string;
    IE: string;
    modality: string;
    portDischarge: string;
    documentReference: string;
    referenciaVinSerie: string;
    model: string;
    color: string;
    quantityAdvertised: string;
    quantityApplied: string;
    quantityReleased: string;
    quantityShipped: string;
    sender: string;
    recipient: string;
  };
  public dishipment: {
    BL: string;
    BLMaster: string;
    NIUCMaster: string;
    dispositionLoad: string;
    reference: string;
    quantity: string;
    quantityReceived: string;
    VIN: string;
    quantityDelivered: string;
  };
}
