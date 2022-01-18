import { useEffect, useRef, useState, VFC } from "react";

export enum TaxIdType {
    SSN,
    EIN
}

const cleanInput = (inputString: string, characterRegex = /\d/) => {
    const regex = new RegExp(`[^${characterRegex.source}]`, "g");
    return inputString.replace(regex, '').substring(0, 9);
}

const formatSsn = (inputString: string, characterRegex = /\d/) => {
    const { source } = characterRegex;

    let formatted = cleanInput(inputString, characterRegex);
    formatted = formatted.replace(new RegExp(`^([${source}]{3})([${source}]+)$`), '$1-$2');
    return formatted.replace(new RegExp(`^([${source}]{3}-[${source}]{2})([${source}]+)$`), '$1-$2');
}

const formatEin = (inputString: string, characterRegex = /\d/) => {
    const { source } = characterRegex;

    let formatted = cleanInput(inputString, characterRegex);
    return formatted.replace(new RegExp(`^([${source}]{2})([${source}]+)`), '$1-$2');
}

export interface TaxIdInputProps {
    onChange: (taxId: string) => void;
    taxIdType: TaxIdType;
    taxId: string | undefined;
}

/**
 * The logic for this component was primarily adapted from this JQuery version of a SSN input
 * https://codepen.io/ashblue/pen/LGeqxx
 *
 * @param onChange
 * @param taxIdType
 * @param taxId
 * @constructor
 */

export const TaxIdInput: VFC<TaxIdInputProps> = ({ onChange, taxIdType, taxId }) => {
    const [taxIdDigits, setTaxIdDigits] = useState(cleanInput(taxId ?? ""));
    const inputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        setTaxIdDigits(cleanInput(taxId ?? ""));
    }, [taxId]);

    useEffect(() => {
        onChange(getFormattedTaxId(taxIdDigits));
    }, [taxIdDigits]);

    const getFormattedTaxId = (input: string, characterRegex = /\d/): string => {
        switch (taxIdType) {
            case TaxIdType.SSN:
                return formatSsn(input, characterRegex);
            case TaxIdType.EIN:
                return formatEin(input, characterRegex);
        }
    }

    const syncInput = () => {
        const input = inputRef.current;
        if (!input) {
            return;
        }

        let cleanedInput = cleanInput(input.value, /\d|\*/);
        let currentTaxIdDigits = taxIdDigits;

        for (let i = 0; i < cleanedInput.length; i++) {
            if (/[0-9]/.exec(cleanedInput[i])) {
                currentTaxIdDigits = currentTaxIdDigits.substring(0, i) + cleanedInput[i] + currentTaxIdDigits.substring(i + 1);
            }
        }
        // Removes any deleted characters
        currentTaxIdDigits = currentTaxIdDigits.substring(0, cleanedInput.length);
        setTaxIdDigits(currentTaxIdDigits);

        const formattedTaxId = getFormattedTaxId(currentTaxIdDigits);
        input.setSelectionRange(formattedTaxId.length, formattedTaxId.length);
    }

    return (
        <input
            type="text"
            value={getFormattedTaxId(taxIdDigits.replace(/\d(?=\d)/g, '*'), /\d|\*/)}
            ref={inputRef}
            onInput={syncInput}
            onChange={syncInput}
            onClick={syncInput}
            onKeyUp={syncInput}
            onKeyDown={syncInput}
            onFocus={syncInput}
            onBlur={syncInput}
        />
    );
}