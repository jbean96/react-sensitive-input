import React, {useState} from "react";
import {TaxIdInput, TaxIdType} from "./TaxIdInput";

export default {
    title: 'TaxIdInput',
    component: TaxIdInput
}

export const SocialSecurityNumber = () => {
    const [taxId, setTaxId] = useState("");
    return (
        <>
            <TaxIdInput taxIdType={TaxIdType.SSN} taxId={taxId} onChange={setTaxId} />
            <div>{taxId}</div>
        </>
    );
}

export const EmployerIdentificationNumber = () => {
    const [taxId, setTaxId] = useState("");
    return (
        <>
            <TaxIdInput taxIdType={TaxIdType.EIN} taxId={taxId} onChange={setTaxId} />
            <div>{taxId}</div>
        </>
    );
}