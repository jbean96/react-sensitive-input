import TextField from '@mui/material/TextField';
import React, { useState } from 'react';
import { TaxIdInput, TaxIdType } from './TaxIdInput';

export default {
    title: 'TaxIdInput',
    component: TaxIdInput,
    argTypes: {
        customInput: {
            control: false,
        },
        taxId: {
            control: false,
        },
        onChange: {
            control: false,
        },
        taxIdType: {
            control: false,
        },
        value: {
            control: false,
        },
    },
};

export const SocialSecurityNumber = ({
    hiddenCharacter,
    hideLastCharacterDelay,
    show,
}: {
    hiddenCharacter: string;
    hideLastCharacterDelay: number;
    show: boolean;
}) => {
    const [taxId, setTaxId] = useState('');
    return (
        <>
            <TaxIdInput
                taxIdType={TaxIdType.SSN}
                value={taxId}
                onChange={setTaxId}
                hiddenCharacter={hiddenCharacter}
                hideLastCharacterDelay={hideLastCharacterDelay}
                show={show}
            />
            <div>{taxId}</div>
        </>
    );
};
SocialSecurityNumber.args = {
    hiddenCharacter: '*',
    hideLastCharacterDelay: 1000,
    show: false,
};

export const EmployerIdentificationNumber = ({
    hiddenCharacter,
    hideLastCharacterDelay,
    show,
}: {
    hiddenCharacter: string;
    hideLastCharacterDelay: number;
    show: boolean;
}) => {
    const [taxId, setTaxId] = useState('');
    return (
        <>
            <TaxIdInput
                taxIdType={TaxIdType.EIN}
                value={taxId}
                onChange={setTaxId}
                hiddenCharacter={hiddenCharacter}
                hideLastCharacterDelay={hideLastCharacterDelay}
                show={show}
            />
            <div>{taxId}</div>
        </>
    );
};
EmployerIdentificationNumber.args = {
    ...SocialSecurityNumber.args,
};

export const CustomInput = ({
    hiddenCharacter,
    hideLastCharacterDelay,
    show,
}: {
    hiddenCharacter: string;
    hideLastCharacterDelay: number;
    show: boolean;
}) => {
    const [taxId, setTaxId] = useState('');
    return (
        <>
            <TaxIdInput
                customInput={TextField}
                value={taxId}
                taxIdType={TaxIdType.SSN}
                onChange={setTaxId}
                hiddenCharacter={hiddenCharacter}
                hideLastCharacterDelay={hideLastCharacterDelay}
                show={show}
            />
            <div>{taxId}</div>
        </>
    );
};
CustomInput.args = {
    ...SocialSecurityNumber.args,
};
