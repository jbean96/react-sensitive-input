/**
 * Cleans an input string of anything that doesn't match the provided regex If no regex is
 * provided the default matches all numbers.
 *
 * @param inputString The string to clean
 * @param characterRegex A regex that will match characters we want to leave in the inputString,
 *  default is to match all numeric characters
 * @returns The string stripped of all characters not matching the regex.
 */
export const cleanInput = (inputString: string, characterRegex = /\d/) => {
	const regex = new RegExp(`[^${characterRegex.source}]`, 'g');
	return inputString.replace(regex, '').substring(0, 9);
};

/*
TODO: Genericize formatSsn & formatEin to work with a generic format string like "###-##-####" so
they can be utilized for custom formats.
*/

export const formatSsn = (inputString: string, characterRegex = /\d/) => {
	const { source } = characterRegex;

	let formatted = cleanInput(inputString, characterRegex);
	formatted = formatted.replace(new RegExp(`^([${source}]{3})([${source}]+)$`), '$1-$2');
	return formatted.replace(
		new RegExp(`^([${source}]{3}-[${source}]{2})([${source}]+)$`),
		'$1-$2'
	);
};

export const formatEin = (inputString: string, characterRegex = /\d/) => {
	const { source } = characterRegex;

	const formatted = cleanInput(inputString, characterRegex);
	return formatted.replace(new RegExp(`^([${source}]{2})([${source}]+)`), '$1-$2');
};
