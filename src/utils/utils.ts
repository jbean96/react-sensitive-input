// Determines if a provided hidden character is valid. A hidden charcter is valid if it is:
//  1. A single character.
//  2. Not a digit
//  3. Not a hyphen (-)
export const isHiddenCharacterValid = (hiddenCharacter: string | undefined) => {
	if (hiddenCharacter && hiddenCharacter.length > 1) {
		return false;
	}

	if (!hiddenCharacter) {
		return true;
	}

	return !/\d|-/.exec(hiddenCharacter);
};

export const isMaskCharacterValid = (
	maskCharacter: string | undefined,
	hiddenCharacter: string | undefined
) => {
	return (
		isHiddenCharacterValid(maskCharacter) &&
		(!maskCharacter || maskCharacter !== hiddenCharacter)
	);
};
