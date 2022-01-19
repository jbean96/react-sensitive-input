import React, {cloneElement, isValidElement, FC, useEffect, useMemo, useRef, useState } from "react";
import _escapeRegExp from 'lodash/escapeRegExp';

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

const isHiddenCharacterValid = (hiddenCharacter: string | undefined) => {
    if (hiddenCharacter && hiddenCharacter.length > 1) {
        return false;
    }

    if (!hiddenCharacter) {
        return true;
    }

    return !Boolean(/\d|-/.exec(hiddenCharacter));
}

export interface TaxIdInputProps {
    /**
     * The character used to hide characters that have already been inputted.
     */
    hiddenCharacter?: string;
    /**
     * Change handler function that is invoked when the taxId is modified.
     */
    onChange: (taxId: string) => void;
    /**
     * When true, shows all characters of the taxId.
     */
    show?: boolean;
    /**
     * The type of taxId (SSN or EIN).
     */
    taxIdType: TaxIdType;
    /**
     * The taxId used as the initial value.
     */
    value: string | undefined;
}

/**
 * The logic for this component was primarily adapted from this JQuery version of a SSN input
 * https://codepen.io/ashblue/pen/LGeqxx
 */

export const TaxIdInput: FC<TaxIdInputProps> = ({ children, hiddenCharacter, onChange, show, taxIdType, value }) => {
    const [taxIdDigits, setTaxIdDigits] = useState(cleanInput(value ?? ""));
    const inputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        setTaxIdDigits(cleanInput(value ?? ""));
    }, [value]);

    const getFormattedTaxId = (input: string): string => {
        switch (taxIdType) {
            case TaxIdType.SSN:
                return formatSsn(input, characterRegex);
            case TaxIdType.EIN:
                return formatEin(input, characterRegex);
        }
    }

    useEffect(() => {
        onChange(getFormattedTaxId(taxIdDigits));
    }, [taxIdDigits]);

    const characterRegex = useMemo(() => {
        if (!isHiddenCharacterValid(hiddenCharacter)) {
            return /\d/;
        }

        return new RegExp(`\\d|${_escapeRegExp(hiddenCharacter)}`);
    }, [hiddenCharacter]);

    const displayValue = useMemo(() => {
        if (!isHiddenCharacterValid(hiddenCharacter) || !hiddenCharacter || show) {
            return getFormattedTaxId(taxIdDigits);
        }

        return getFormattedTaxId(taxIdDigits.replace(/\d(?=\d)/g, hiddenCharacter));
    }, [hiddenCharacter, show, taxIdDigits]);

    if (!isHiddenCharacterValid(hiddenCharacter)) {
        throw new Error('Value of prop "hiddenCharacter" must be 1 character or less');
    }

    if (children) {
        React.Children.only(children);
    }

    const syncInput = () => {
        const input = inputRef.current;
        if (!input) {
            return;
        }

        let cleanedInput = cleanInput(input.value, characterRegex);
        let currentTaxIdDigits = taxIdDigits;

        // Adds any new characters to our state if there are any new ones
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
        isValidElement(children) ?
            cloneElement(children, {
                inputRef,
                value: displayValue,
                onInput: syncInput,
                onChange: syncInput,
                onClick: syncInput,
                onKeyUp: syncInput,
                onKeyDown: syncInput,
                onFocus: syncInput,
                onBlur: syncInput
            }) :
        <input
            type="text"
            value={displayValue}
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

function useCallback(arg0: () => void, arg1: never[]) {
    throw new Error("Function not implemented.");
}
