import { render, screen, within } from '@testing-library/react';
import { TaxIdInput, TaxIdInputProps, TAX_ID_INPUT_TEST_ID } from 'components/TaxIdInput';
import React from 'react';
import { TaxIdType } from 'types';
import userEvent from '@testing-library/user-event';
import { TextField } from '@mui/material';

test('TaxIdInput renders', () => {
	render(
		<TaxIdInput
			onChange={() => {
				return;
			}}
			taxIdType={TaxIdType.SSN}
			value={undefined}
		/>
	);

	expect(screen.getByTestId(TAX_ID_INPUT_TEST_ID)).toBeInTheDocument();
});

describe('TaxIdInput - display, no character hiding', () => {
	const defaultProps: Pick<TaxIdInputProps, 'onChange' | 'taxIdType' | 'show'> = {
		onChange: () => {
			return;
		},
		taxIdType: TaxIdType.SSN,
		show: true,
	};

	it('shows provided value', () => {
		render(<TaxIdInput {...defaultProps} value="123-45-6789" />);

		expect(screen.getByTestId(TAX_ID_INPUT_TEST_ID)).toHaveDisplayValue('123-45-6789');
	});

	it('shows provided incomplete value', () => {
		render(<TaxIdInput {...defaultProps} value="123-45" />);

		expect(screen.getByTestId(TAX_ID_INPUT_TEST_ID)).toHaveDisplayValue('123-45');
	});

	it('formats input', () => {
		render(<TaxIdInput {...defaultProps} value="123456789" />);

		expect(screen.getByTestId(TAX_ID_INPUT_TEST_ID)).toHaveDisplayValue('123-45-6789');
	});
});

describe('TaxIdInput - display, character hiding', () => {
	const defaultProps: Pick<
		TaxIdInputProps,
		'onChange' | 'taxIdType' | 'show' | 'hiddenCharacter' | 'hideLastCharacterDelay'
	> = {
		onChange: () => {
			return;
		},
		taxIdType: TaxIdType.SSN,
		show: false,
		hiddenCharacter: '*',
		hideLastCharacterDelay: 0,
	};

	it('shows provided value', () => {
		render(<TaxIdInput {...defaultProps} value="123-45-6789" />);

		expect(screen.getByTestId(TAX_ID_INPUT_TEST_ID)).toHaveDisplayValue('***-**-****');
	});

	it('uses provided hidden character', () => {
		render(<TaxIdInput {...defaultProps} hiddenCharacter={'\u2022'} value="123-45-6789" />);

		expect(screen.getByTestId(TAX_ID_INPUT_TEST_ID)).toHaveDisplayValue(
			'\u2022\u2022\u2022-\u2022\u2022-\u2022\u2022\u2022\u2022'
		);
	});

	it("doesn't allow '-' as hidden character", () => {
		expect(() =>
			render(<TaxIdInput {...defaultProps} hiddenCharacter="-" value={undefined} />)
		).toThrowError();
	});

	it("doesn't allow multiple characters as hidden character", () => {
		expect(() =>
			render(<TaxIdInput {...defaultProps} hiddenCharacter="asdf" value={undefined} />)
		).toThrowError();
	});

	it("doesn't allow numbers as hidden character", () => {
		expect(() =>
			render(<TaxIdInput {...defaultProps} hiddenCharacter="9" value={undefined} />)
		).toThrowError();
	});

	it('hides last character on initial render', () => {
		render(<TaxIdInput {...defaultProps} hideLastCharacterDelay={500} value="123-45-6789" />);

		expect(screen.getByTestId(TAX_ID_INPUT_TEST_ID)).toHaveDisplayValue('***-**-****');
	});

	it('hides last character after character delay', () => {
		jest.useFakeTimers();
		const hideCharacterDelay = 500;

		render(
			<TaxIdInput
				{...defaultProps}
				hideLastCharacterDelay={hideCharacterDelay}
				value={undefined}
			/>
		);

		const taxIdInput = screen.getByTestId(TAX_ID_INPUT_TEST_ID);

		userEvent.type(taxIdInput, '1');
		expect(taxIdInput).toHaveDisplayValue('1');

		jest.advanceTimersByTime(hideCharacterDelay - 1);
		expect(taxIdInput).toHaveDisplayValue('1');

		jest.advanceTimersByTime(1);
		expect(taxIdInput).toHaveDisplayValue('*');

		jest.useRealTimers();
	});

	it('hides last character immdiately after next character typed', () => {
		jest.useFakeTimers();

		render(<TaxIdInput {...defaultProps} hideLastCharacterDelay={500} value={undefined} />);

		const taxIdInput = screen.getByTestId(TAX_ID_INPUT_TEST_ID);

		userEvent.type(taxIdInput, '1');
		expect(taxIdInput).toHaveDisplayValue('1');

		userEvent.type(taxIdInput, '2');
		expect(taxIdInput).toHaveDisplayValue('*2');

		userEvent.type(taxIdInput, '3');
		expect(taxIdInput).toHaveDisplayValue('**3');

		jest.useRealTimers();
	});

	it("doesn't show last character after backspace", () => {
		jest.useFakeTimers();

		render(<TaxIdInput {...defaultProps} hideLastCharacterDelay={500} value={undefined} />);

		const taxIdInput = screen.getByTestId(TAX_ID_INPUT_TEST_ID);

		userEvent.type(taxIdInput, '1');
		expect(taxIdInput).toHaveDisplayValue('1');

		userEvent.type(taxIdInput, '2');
		expect(taxIdInput).toHaveDisplayValue('*2');

		userEvent.type(taxIdInput, '{backspace}');
		expect(taxIdInput).toHaveDisplayValue('*');

		jest.useRealTimers();
	});
});

describe('TaxIdInput - show last digits', () => {
	const defaultProps: Pick<
		TaxIdInputProps,
		'onChange' | 'taxIdType' | 'show' | 'hiddenCharacter' | 'hideLastCharacterDelay'
	> = {
		onChange: () => {
			return;
		},
		taxIdType: TaxIdType.SSN,
		show: false,
		hiddenCharacter: '*',
		hideLastCharacterDelay: 0,
	};

	it('shows last 4 characters', () => {
		render(<TaxIdInput {...defaultProps} value="123456789" showLastDigits={4} />);

		expect(screen.getByTestId(TAX_ID_INPUT_TEST_ID)).toHaveDisplayValue('***-**-6789');
	});

	it('shows last 2 characters', () => {
		render(<TaxIdInput {...defaultProps} value="123456789" showLastDigits={2} />);

		expect(screen.getByTestId(TAX_ID_INPUT_TEST_ID)).toHaveDisplayValue('***-**-**89');
	});

	it("doesn't hide last characters after delay", () => {
		jest.useFakeTimers();

		render(
			<TaxIdInput
				{...defaultProps}
				hideLastCharacterDelay={500}
				value={undefined}
				showLastDigits={4}
			/>
		);

		const taxIdInput = screen.getByTestId(TAX_ID_INPUT_TEST_ID);

		userEvent.type(taxIdInput, '12345');
		expect(taxIdInput).toHaveDisplayValue('***-*5');

		jest.advanceTimersByTime(500);
		expect(taxIdInput).toHaveDisplayValue('***-**');

		userEvent.type(taxIdInput, '6');
		expect(taxIdInput).toHaveDisplayValue('***-**-6');

		jest.advanceTimersByTime(500);
		expect(taxIdInput).toHaveDisplayValue('***-**-6');

		userEvent.type(taxIdInput, '789');
		expect(taxIdInput).toHaveDisplayValue('***-**-6789');

		jest.advanceTimersByTime(500);
		expect(taxIdInput).toHaveDisplayValue('***-**-6789');
	});
});

describe('TaxIdInput - invokes onChange', () => {
	const defaultProps: Pick<
		TaxIdInputProps,
		'taxIdType' | 'show' | 'hiddenCharacter' | 'hideLastCharacterDelay'
	> = {
		taxIdType: TaxIdType.SSN,
		show: false,
		hideLastCharacterDelay: 0,
	};

	it('invokes onChange when character is inputted', () => {
		const onChange = jest.fn();

		render(<TaxIdInput {...defaultProps} value={undefined} onChange={onChange} />);

		const numCalls = onChange.mock.calls.length;

		userEvent.type(screen.getByTestId(TAX_ID_INPUT_TEST_ID), '1');

		expect(onChange).toHaveBeenCalledTimes(numCalls + 1);
		expect(onChange).toHaveBeenLastCalledWith('1');
	});

	it('does not invoke onChange with hidden characters', () => {
		const onChange = jest.fn();

		render(
			<TaxIdInput
				{...defaultProps}
				hiddenCharacter="*"
				value={undefined}
				onChange={onChange}
			/>
		);

		const taxIdInput = screen.getByTestId(TAX_ID_INPUT_TEST_ID);

		userEvent.type(taxIdInput, '123456789');
		expect(taxIdInput).toHaveDisplayValue('***-**-****');

		expect(onChange).toHaveBeenLastCalledWith('123-45-6789');
	});

	it('invokes onChange on backspace', () => {
		const onChange = jest.fn();

		render(<TaxIdInput {...defaultProps} value="123456789" onChange={onChange} />);

		const taxIdInput = screen.getByTestId(TAX_ID_INPUT_TEST_ID);

		userEvent.type(taxIdInput, '{backspace}');
		expect(taxIdInput).toHaveDisplayValue('123-45-678');

		expect(onChange).toHaveBeenLastCalledWith('123-45-678');
	});
});

describe('TaxIdInput - updating value prop changes display value', () => {
	it('changes display based on value prop', () => {
		const { rerender } = render(
			<TaxIdInput taxIdType={TaxIdType.SSN} show value={undefined} onChange={() => {}} />
		);

		const taxIdInput = screen.getByTestId(TAX_ID_INPUT_TEST_ID);

		expect(taxIdInput).toHaveDisplayValue('');

		rerender(<TaxIdInput taxIdType={TaxIdType.SSN} show value="1234" onChange={() => {}} />);

		expect(taxIdInput).toHaveDisplayValue('123-4');
	});
});

test('TaxIdInput renders with custom input', () => {
	render(
		<TaxIdInput
			onChange={() => {}}
			taxIdType={TaxIdType.SSN}
			value={undefined}
			customInput={TextField}
		/>
	);

	expect(screen.getByTestId(TAX_ID_INPUT_TEST_ID)).toBeInTheDocument();
});

describe('Basic functionality with custom input', () => {
	it('displays initial value', () => {
		render(
			<TaxIdInput
				onChange={() => {}}
				taxIdType={TaxIdType.SSN}
				value="123"
				customInput={TextField}
			/>
		);

		expect(
			within(screen.getByTestId(TAX_ID_INPUT_TEST_ID)).getByRole('textbox')
		).toHaveDisplayValue('123');
	});

	it('hides and formats provided value', () => {
		render(
			<TaxIdInput
				onChange={() => {}}
				taxIdType={TaxIdType.SSN}
				value="123456789"
				customInput={TextField}
				hiddenCharacter="*"
				hideLastCharacterDelay={0}
			/>
		);

		expect(
			within(screen.getByTestId(TAX_ID_INPUT_TEST_ID)).getByRole('textbox')
		).toHaveDisplayValue('***-**-****');
	});

	it('responds to keyboard input', () => {
		render(
			<TaxIdInput
				onChange={() => {}}
				taxIdType={TaxIdType.SSN}
				value={undefined}
				customInput={TextField}
				hiddenCharacter="*"
				hideLastCharacterDelay={500}
			/>
		);

		const input = within(screen.getByTestId(TAX_ID_INPUT_TEST_ID)).getByRole('textbox');

		expect(input).toHaveDisplayValue('');

		userEvent.type(input, '1234');
		expect(input).toHaveDisplayValue('***-4');

		userEvent.type(input, '5678');
		expect(input).toHaveDisplayValue('***-**-**8');

		userEvent.type(input, '{backspace}{backspace}');
		expect(input).toHaveDisplayValue('***-**-*');
	});

	it('shows last 4', () => {
		render(
			<TaxIdInput
				onChange={() => {}}
				taxIdType={TaxIdType.SSN}
				value="123456789"
				customInput={TextField}
				hiddenCharacter="*"
				hideLastCharacterDelay={0}
				showLastDigits={4}
			/>
		);

		expect(
			within(screen.getByTestId(TAX_ID_INPUT_TEST_ID)).getByRole('textbox')
		).toHaveDisplayValue('***-**-6789');
	});
});
