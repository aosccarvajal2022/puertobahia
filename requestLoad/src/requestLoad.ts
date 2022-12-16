/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { People } from "./people";
import { ServicesR } from "./servicesrequest";

export class RequestLoad {
    public ID: string;
    public dateApplication: string;
    public suggestedDate: string;
    public email: string;
    public applicantId: string;
    public applicantName: string;
    public customerNIT: string;

    public agencyNIT: string;

    public remarks: string;
    public radicado: string;
    public requestNumber: string;
    public status: string;
    public people: object[];
    public services: object[];
    public files: object[];
}
