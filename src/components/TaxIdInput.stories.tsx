import TextField from '@mui/material/TextField';
import React, { MutableRefObject, useState, VFC } from 'react';
import { TaxIdType } from 'types';
import { CustomInputPropsType, TaxIdInput } from 'components/TaxIdInput';

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
	showLastDigits,
}: {
	hiddenCharacter: string;
	hideLastCharacterDelay: number;
	show: boolean;
	showLastDigits?: number;
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
				showLastDigits={showLastDigits}
			/>
			<div>{taxId}</div>
		</>
	);
};
SocialSecurityNumber.args = {
	hiddenCharacter: '*',
	hideLastCharacterDelay: 1000,
	show: false,
	showLastDigits: undefined,
};

export const EmployerIdentificationNumber = ({
	hiddenCharacter,
	hideLastCharacterDelay,
	show,
	showLastDigits,
}: {
	hiddenCharacter: string;
	hideLastCharacterDelay: number;
	show: boolean;
	showLastDigits?: number;
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
				showLastDigits={showLastDigits}
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
	showLastDigits,
}: {
	hiddenCharacter: string;
	hideLastCharacterDelay: number;
	show: boolean;
	showLastDigits?: number;
}) => {
	const [taxId, setTaxId] = useState('');
	return (
		<>
			<TaxIdInput
				value={taxId}
				customInput={TextField}
				taxIdType={TaxIdType.SSN}
				onChange={setTaxId}
				hiddenCharacter={hiddenCharacter}
				hideLastCharacterDelay={hideLastCharacterDelay}
				show={show}
				showLastDigits={showLastDigits}
			/>
			<div>{taxId}</div>
		</>
	);
};
CustomInput.args = {
	...SocialSecurityNumber.args,
};
