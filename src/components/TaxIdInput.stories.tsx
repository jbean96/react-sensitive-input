import TextField from "@mui/material/TextField";
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

export const SocialSecurityNumber = ({ hiddenCharacter, show }: { hiddenCharacter: string, show: boolean }) => {
    const [taxId, setTaxId] = useState("");
    return (
        <>
            <TaxIdInput taxIdType={TaxIdType.SSN} taxId={taxId} onChange={setTaxId} hiddenCharacter={hiddenCharacter} show={show} />
            <div>{taxId}</div>
        </>
    );
}
SocialSecurityNumber.args = {
    hiddenCharacter: "*",
    show: false,
}

export const EmployerIdentificationNumber = ({ hiddenCharacter, show }: { hiddenCharacter: string, show: boolean }) => {
    const [taxId, setTaxId] = useState("");
    return (
        <>
            <TaxIdInput taxIdType={TaxIdType.EIN} taxId={taxId} onChange={setTaxId} hiddenCharacter={hiddenCharacter} show={show} />
            <div>{taxId}</div>
        </>
    );
}
EmployerIdentificationNumber.args = {
    ...SocialSecurityNumber.args
}

export const CustomInput = ({ hiddenCharacter, show }: { hiddenCharacter: string, show: boolean }) => {
    const [taxId, setTaxId] = useState("");
    return (
        <>
            <TaxIdInput taxIdType={TaxIdType.EIN} taxId={taxId} onChange={setTaxId} hiddenCharacter={hiddenCharacter} show={show}>
                <TextField />
            </TaxIdInput>
            <div>{taxId}</div>
        </>
    );
}
CustomInput.args = {
    ...SocialSecurityNumber.args
}