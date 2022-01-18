import React, {useState} from "react";
import {TaxIdInput, TaxIdType} from "./TaxIdInput";

export default {
    title: 'TaxIdInput',
    component: TaxIdInput,
    argTypes: {
        taxId: {
            control: false,
        },
        onChange: {
            control: false,
        },
        taxIdType: {
            control: false,
        }
    }
}

export const SocialSecurityNumber = ({ hiddenCharacter }: { hiddenCharacter: string }) => {
    const [taxId, setTaxId] = useState("");
    return (
        <>
            <TaxIdInput taxIdType={TaxIdType.SSN} taxId={taxId} onChange={setTaxId} hiddenCharacter={hiddenCharacter} />
            <div>{taxId}</div>
        </>
    );
}
SocialSecurityNumber.args = {
    hiddenCharacter: "*",
}

export const EmployerIdentificationNumber = ({ hiddenCharacter }: { hiddenCharacter: string }) => {
    const [taxId, setTaxId] = useState("");
    return (
        <>
            <TaxIdInput taxIdType={TaxIdType.EIN} taxId={taxId} onChange={setTaxId} hiddenCharacter={hiddenCharacter} />
            <div>{taxId}</div>
        </>
    );
}
EmployerIdentificationNumber.args = {
    hiddenCharacter: "*",
}