import { render } from '@testing-library/react';
import { TaxIdInput, TaxIdInputProps } from 'components/TaxIdInput';
import React from 'react';
import { TaxIdType } from 'types';

test('TaxIdInput renders', () => {
	const renderResult = render(
		<TaxIdInput
			onChange={() => {
				return;
			}}
			taxIdType={TaxIdType.SSN}
			value={undefined}
		/>
	);

	expect(renderResult.getByTestId('tii-1')).toBeInTheDocument();
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
		const renderResult = render(<TaxIdInput {...defaultProps} value="123-45-6789" />);

		expect(renderResult.getByTestId('tii-1')).toHaveDisplayValue('123-45-6789');
	});

	it('shows provided incomplete value', () => {
		const renderResult = render(<TaxIdInput {...defaultProps} value="123-45" />);

		expect(renderResult.getByTestId('tii-1')).toHaveDisplayValue('123-45');
	});

	it('formats input', () => {
		const renderResult = render(<TaxIdInput {...defaultProps} value="123456789" />);

		expect(renderResult.getByTestId('tii-1')).toHaveDisplayValue('123-45-6789');
	});
});
