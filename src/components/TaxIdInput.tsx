import _escapeRegExp from 'lodash/escapeRegExp';
import React, { isValidElement, useCallback, useEffect, useMemo, useRef, useState, VFC } from 'react';
import { ReactElement } from 'react';

export enum TaxIdType {
    SSN,
    EIN,
}

const cleanInput = (inputString: string, characterRegex = /\d/) => {
    const regex = new RegExp(`[^${characterRegex.source}]`, 'g');
    return inputString.replace(regex, '').substring(0, 9);
};

const formatSsn = (inputString: string, characterRegex = /\d/) => {
    const { source } = characterRegex;

    let formatted = cleanInput(inputString, characterRegex);
    formatted = formatted.replace(new RegExp(`^([${source}]{3})([${source}]+)$`), '$1-$2');
    return formatted.replace(new RegExp(`^([${source}]{3}-[${source}]{2})([${source}]+)$`), '$1-$2');
};

const formatEin = (inputString: string, characterRegex = /\d/) => {
    const { source } = characterRegex;

    const formatted = cleanInput(inputString, characterRegex);
    return formatted.replace(new RegExp(`^([${source}]{2})([${source}]+)`), '$1-$2');
};

const isHiddenCharacterValid = (hiddenCharacter: string | undefined) => {
    if (hiddenCharacter && hiddenCharacter.length > 1) {
        return false;
    }

    if (!hiddenCharacter) {
        return true;
    }

    return !/\d|-/.exec(hiddenCharacter);
};

export interface TaxIdInputProps {
    /**
     *
     */
    customInput?: React.ComponentType<{ inputRef: React.MutableRefObject<HTMLInputElement | null>; value: string }>;
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

export const TaxIdInput: VFC<TaxIdInputProps> = ({
    customInput,
    hiddenCharacter,
    onChange,
    show,
    taxIdType,
    value,
}) => {
    const [taxIdDigits, setTaxIdDigits] = useState(cleanInput(value ?? ''));
    const inputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        setTaxIdDigits(cleanInput(value ?? ''));
    }, [value]);

    const characterRegex = useMemo(() => {
        if (!isHiddenCharacterValid(hiddenCharacter)) {
            return /\d/;
        }

        return new RegExp(`\\d|${_escapeRegExp(hiddenCharacter)}`);
    }, [hiddenCharacter]);

    const getFormattedTaxId = useCallback(
        (input: string): string => {
            switch (taxIdType) {
                case TaxIdType.SSN:
                    return formatSsn(input, characterRegex);
                case TaxIdType.EIN:
                    return formatEin(input, characterRegex);
            }
        },
        [characterRegex, taxIdType]
    );

    useEffect(() => {
        onChange(getFormattedTaxId(taxIdDigits));
    }, [getFormattedTaxId, onChange, taxIdDigits]);

    const displayValue = useMemo(() => {
        if (!isHiddenCharacterValid(hiddenCharacter) || !hiddenCharacter || show) {
            return getFormattedTaxId(taxIdDigits);
        }

        return getFormattedTaxId(taxIdDigits.replace(/\d(?=\d)/g, hiddenCharacter));
    }, [getFormattedTaxId, hiddenCharacter, show, taxIdDigits]);

    if (!isHiddenCharacterValid(hiddenCharacter)) {
        throw new Error('Value of prop "hiddenCharacter" must be 1 character or less');
    }

    const syncInput = useCallback(() => {
        const input = inputRef.current;
        if (!input) {
            throw new Error(
                'inputRef is not attached to an element, the customInput component must take inputRef as a prop and attach it to the input element'
            );
        }

        const cleanedInput = cleanInput(input.value, characterRegex);
        let currentTaxIdDigits = taxIdDigits;

        // Adds any new characters to our state if there are any new ones
        for (let i = 0; i < cleanedInput.length; i++) {
            if (/[0-9]/.exec(cleanedInput[i])) {
                currentTaxIdDigits =
                    currentTaxIdDigits.substring(0, i) + cleanedInput[i] + currentTaxIdDigits.substring(i + 1);
            }
        }
        // Removes any deleted characters
        currentTaxIdDigits = currentTaxIdDigits.substring(0, cleanedInput.length);
        setTaxIdDigits(currentTaxIdDigits);

        const formattedTaxId = getFormattedTaxId(currentTaxIdDigits);
        input.setSelectionRange(formattedTaxId.length, formattedTaxId.length);
    }, [characterRegex, getFormattedTaxId, taxIdDigits]);

    const CustomInput = customInput;

    const inputProps = useMemo(
        () => ({
            value: displayValue,
            onInput: syncInput,
            onChange: syncInput,
            onClick: syncInput,
            onKeyUp: syncInput,
            onKeyDown: syncInput,
            onFocus: syncInput,
            onBlur: syncInput,
        }),
        [displayValue, syncInput]
    );

    return CustomInput ? (
        <CustomInput inputRef={inputRef} {...inputProps} />
    ) : (
        <input type="text" ref={inputRef} {...inputProps} />
    );
};
