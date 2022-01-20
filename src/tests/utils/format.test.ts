import { cleanInput } from 'utils';

describe('default regex', () => {
	it('ignores one number', () => {
		expect(cleanInput('1')).toBe('1');
	});

	it('ignores multiple numbers', () => {
		expect(cleanInput('123')).toBe('123');
	});

	it('works with the empty string', () => {
		expect(cleanInput('')).toBe('');
	});

	it('removes a single non-digit character', () => {
		expect(cleanInput('123-456')).toBe('123456');
	});

	it('removes multiple non-digit characters', () => {
		expect(cleanInput('123-456-789')).toBe('123456789');
	});

	it('removes repeated non-digit characters', () => {
		expect(cleanInput('123--456--789')).toBe('123456789');
	});

	it('removes many non-digit characters', () => {
		expect(cleanInput('abcdef*&%$)(+[]')).toBe('');
	});

	it('removes whitespace', () => {
		expect(cleanInput('123      456')).toBe('123456');
	});

	it('trims whitespace', () => {
		expect(cleanInput('    123     ')).toBe('123');
	});
});

describe('custom regex', () => {
	it("doesn't remove *", () => {
		expect(cleanInput('1*', /\d|\*/)).toBe('1*');
	});

	it("doesn't remove * with other characters", () => {
		expect(cleanInput('1*&(', /\d|\*/)).toBe('1*');
	});

	it("removes numbers if regex doesn't specify them", () => {
		expect(cleanInput('1111*11111', /\*/)).toBe('*');
	});

	it('works with characters other than *', () => {
		expect(cleanInput('&', /&/)).toBe('&');
		expect(cleanInput('&^', /&/)).toBe('&');
		expect(cleanInput('&^', /^/)).toBe('^');
		expect(cleanInput('1%$2', /$/)).toBe('$');
	});
});
