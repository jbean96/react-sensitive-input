import _escapeRegExp from 'lodash/escapeRegExp';
import React, {
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
	ChangeEvent,
	FormEvent,
	VFC,
	MutableRefObject,
} from 'react';
import { TaxIdType } from 'types';
import { cleanInput, formatEin, formatSsn, isHiddenCharacterValid } from 'utils';
import { useIsMounted } from 'utils/hooks';
import keycode from 'keycode';

export const TAX_ID_INPUT_TEST_ID = 'tii-1';

type SyncInputEvent =
	| Event
	| ChangeEvent<HTMLInputElement>
	| FormEvent<HTMLInputElement>
	| KeyboardEvent;

export interface TaxIdInputProps {
	/**
	 * Custom input component can be used in lieu of the default HTML <input> element. Component
	 * must take an inputRef prop that attaches to the underlying HTML input element used as well as
	 * a value property for the current value displayed in the input element.
	 */
	customInput?: React.ComponentType<{
		inputRef: MutableRefObject<HTMLInputElement | null>;
		value: string;
	}>;
	/** The character used to hide characters that have already been inputted. */
	hiddenCharacter?: string;
	/**
	 * The delay before hiding the last inputted character, if you always want the last character to
	 * show you can put "Infinity". If no value is provided, the default value of 500ms is used.
	 */
	hideLastCharacterDelay?: number;
	/** Change handler function that is invoked when the taxId is modified. */
	onChange?: (taxId: string) => void;
	/** When true, shows all characters of the taxId. */
	show?: boolean;
	/**
	 * Prevents the last digits from being hidden with the provided hiddenCharacter. A value of N
	 * means that the last N digits will always be showing and will never be hidden by the
	 * hiddenCharacter. Leaving this undefined is the same as passing a 0 which means that no digits
	 * receive special treatment with regards to being hidden/shown.
	 */
	showLastDigits?: number;
	/** The type of taxId (SSN or EIN). */
	taxIdType: TaxIdType;
	/** The taxId used as the initial value. */
	value?: string;
}

/**
 * The logic for this component was primarily adapted from this JQuery version of a SSN input
 * https://codepen.io/ashblue/pen/LGeqxx
 */

export const TaxIdInput: VFC<TaxIdInputProps> = ({
	customInput,
	hiddenCharacter,
	hideLastCharacterDelay = 500,
	onChange,
	show,
	showLastDigits,
	taxIdType,
	value,
}) => {
	const [taxIdDigits, setTaxIdDigits] = useState(cleanInput(value ?? ''));
	const inputRef = useRef<HTMLInputElement | null>(null);
	const isMountedRef = useIsMounted();

	const [hideLastCharacter, setHideLastCharacter] = useState(hideLastCharacterDelay !== Infinity);
	const hideLastCharacterTimeoutRef = useRef<NodeJS.Timeout | undefined>();

	// Synchronizes our internal storage of the taxId whenever the prop changes
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

	// Invoke onChange whenever the stored taxId changes.
	useEffect(() => {
		onChange?.(getFormattedTaxId(taxIdDigits));
	}, [getFormattedTaxId, onChange, taxIdDigits]);

	// Verifies that the inputRef was correctly passed to the custom input component.
	useEffect(() => {
		const input = inputRef.current;
		if (!input) {
			throw new Error(
				`inputRef is not attached to an element, the customInput component must take 
                inputRef as a prop and attach it to the input element`
			);
		}
	}, []);

	const displayValue = useMemo(() => {
		if (!isHiddenCharacterValid(hiddenCharacter) || !hiddenCharacter || show) {
			return getFormattedTaxId(taxIdDigits);
		}

		// Computing the lookahead number is effectively determining how many digits from the end
		// do we want to be showing. In the case that the user hasn't typed (9 - showLastDigits)
		// numbers, we will either show 0 or 1 numbers depending on the state of
		// hideLastCharacter. Otherwise if the user has typed at least (9 - showLastDigits)
		// numbers, then we will show a number of digits equivalent to the difference between that
		// value and the current # of digits the user has already inputted.
		const lookaheadNumber = Math.max(
			hideLastCharacter ? 0 : 1,
			taxIdDigits.length - (9 - (showLastDigits ?? 0))
		);

		const regex = new RegExp(`\\d(?=\\d{${lookaheadNumber}})`, 'g');

		return getFormattedTaxId(taxIdDigits.replace(regex, hiddenCharacter));
	}, [getFormattedTaxId, hiddenCharacter, hideLastCharacter, show, showLastDigits, taxIdDigits]);

	// On any event, we invoke this function to sync the internal state that we are recording for
	// what the user has typed, as well as the current caret position in the input box.
	const syncInput = useCallback(
		(event: SyncInputEvent) => {
			const input = inputRef.current;
			if (!input) {
				return;
			}

			const cleanedInput = cleanInput(input.value, characterRegex);

			const key = keycode(event as Event);

			if (hideLastCharacterDelay !== 0 && hideLastCharacterDelay !== Infinity) {
				if (cleanedInput.length > taxIdDigits.length) {
					setHideLastCharacter(false);
					if (hideLastCharacterTimeoutRef.current) {
						clearTimeout(hideLastCharacterTimeoutRef.current);
					}
					hideLastCharacterTimeoutRef.current = setTimeout(() => {
						if (isMountedRef.current) {
							setHideLastCharacter(true);
						}
					}, hideLastCharacterDelay);
				} else if (key === 'backspace' || key === 'delete') {
					setHideLastCharacter(true);
				}
			}

			let currentTaxIdDigits = taxIdDigits;
			// Adds the newest character to our state if there is one
			if (
				cleanedInput.length > taxIdDigits.length &&
				/[0-9]/.exec(cleanedInput[cleanedInput.length - 1])
			) {
				currentTaxIdDigits = `${currentTaxIdDigits}${
					cleanedInput[cleanedInput.length - 1]
				}`;
			} else {
				// Removes any deleted characters
				currentTaxIdDigits = currentTaxIdDigits.substring(0, cleanedInput.length);
			}

			setTaxIdDigits(currentTaxIdDigits);

			const formattedTaxId = getFormattedTaxId(currentTaxIdDigits);
			input.setSelectionRange(formattedTaxId.length, formattedTaxId.length);
		},
		[characterRegex, getFormattedTaxId, hideLastCharacterDelay, isMountedRef, taxIdDigits]
	);

	if (!isHiddenCharacterValid(hiddenCharacter)) {
		throw new Error(
			`Value of prop "hiddenCharacter" must be 1 character or less and cannot be a number 
            or "-"`
		);
	}

	const CustomInput = customInput;

	const inputProps = useMemo(
		() => ({
			'data-testid': TAX_ID_INPUT_TEST_ID,
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
