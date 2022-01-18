import {useCallback, useRef, useState, VFC} from "react";

export enum TaxIdType {
    SSN,
    EIN
}

const formatSsn = (inputString: string) => {
    let formatted = inputString.replace(/[^\d]/g, '');
    formatted = formatted.substring(0, 9);
    formatted = formatted.replace(/^(\d{3})(\d+)/, '$1-$2');
    return formatted.replace(/^(\d{3}-\d{2})(\d+)/, '$1-$2');
}

const formatEin = (inputString: string) => {
    let formatted = inputString.replace(/[^\d]/g, '');
    formatted = formatted.substring(0, 9);
    return formatted.replace(/^(\d{2})(\d+)/, '$1-$2');
}

export interface TaxIdInputProps {
    maskCharacter?: string;
    taxIdType: TaxIdType;
    taxId: string | undefined;
}

// https://codepen.io/ashblue/pen/LGeqxx

export const TaxIdInput: VFC<TaxIdInputProps> = ({ maskCharacter, taxIdType }) => {
    const [taxIdDigits, setTaxIdDigits] = useState("");
    const inputRef = useRef<HTMLInputElement | null>(null);

    const getFormattedTaxId = (input: string): string => {
        switch (taxIdType) {
            case TaxIdType.SSN:
                return formatSsn(input);
            case TaxIdType.EIN:
                return formatEin(input);
        }
    }

    const syncInput = () => {
        const input = inputRef.current;
        if (!input) {
            return;
        }

        let cleanedInput = input.value.replace(/[^\d]/g, '');
        cleanedInput = cleanedInput.substring(0, 9);

        let currentTaxIdDigits = taxIdDigits;

        for (let i = 0; i < cleanedInput.length; i++) {
            if (/[0-9]/.exec(cleanedInput[i])) {
                currentTaxIdDigits = currentTaxIdDigits.substring(0, i) + cleanedInput[i] + currentTaxIdDigits.substring(i + 1);
            }
        }
        currentTaxIdDigits = currentTaxIdDigits.substring(0, cleanedInput.length);

        setTaxIdDigits(currentTaxIdDigits);

        const formattedTaxId = getFormattedTaxId(currentTaxIdDigits);

        input.setSelectionRange(formattedTaxId.length, formattedTaxId.length);
    }

    return (
        <>
        <input
            type="text"
            value={getFormattedTaxId(taxIdDigits)}
            ref={inputRef}
            onInput={syncInput}
            onChange={syncInput}
            onClick={syncInput}
            onKeyUp={syncInput}
            onKeyDown={syncInput}
            onFocus={syncInput}
            onBlur={syncInput}
        />
            <div>{getFormattedTaxId(taxIdDigits)}</div>
            </>
    );
}