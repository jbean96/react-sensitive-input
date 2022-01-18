import React from "react";
import {TaxIdInput, TaxIdType} from "./TaxIdInput";

export default {
    title: 'TaxIdInput',
    component: TaxIdInput
}

export const SocialSecurityNumber = () => {
    return <TaxIdInput taxIdType={TaxIdType.SSN} taxId={undefined} />;
}

export const EmployerIdentificationNumber = () => {
    return <TaxIdInput taxIdType={TaxIdType.EIN} taxId={undefined} />;
}