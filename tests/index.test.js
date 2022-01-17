import React, { useState } from 'react'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import FloatingLabel from '../index'

describe('<FloatingLabel />', () => {
	const FloatingLabelWrapper = (props) => {
		const [value, setValue] = useState('')
		return <FloatingLabel value={value} onChange={(e) => setValue(e.target.value)} {...props} />
	}

	beforeAll(() => {
		if (typeof global.IntersectionObserver === 'undefined') {
			global.IntersectionObserver = class IntersectionObserver {
				observe() {
					return null
				}

				unobserve() {
					return null
				}
			}
		}
	})

	it('matches snapshots', () => {
		const { baseElement } = render(<FloatingLabel id="snapshot" />)
		expect(baseElement).toMatchSnapshot()
	})

	it('handles input change', () => {
		const { queryByLabelText } = render(<FloatingLabelWrapper label="First Name" />)

		const first_name_input = queryByLabelText('First Name')
		userEvent.type(first_name_input, 'Joey')

		expect(first_name_input.value).toBe('Joey')
	})

	it('displays a message', () => {
		const { queryByText } = render(<FloatingLabelWrapper label="First Name" message="An important message" />)
		const message = queryByText('An important message')
		expect(message).toBeDefined()
	})

	it('handles a message being clicked', () => {
		const { queryByText, queryByLabelText } = render(
			<FloatingLabelWrapper label="First Name" message="default_name" />,
		)
		const message = queryByText('default_name')
		const first_name_input = queryByLabelText('First Name')

		expect(first_name_input.value).toBe('')
		userEvent.click(message)
		expect(first_name_input.value).toBe('default_name')
	})

	it('handles a message being pressed with enter', () => {
		const { queryByText, queryByLabelText } = render(
			<FloatingLabelWrapper label="First Name" message="default_name" />,
		)
		const message = queryByText('default_name')
		const first_name_input = queryByLabelText('First Name')

		expect(first_name_input.value).toBe('')
		message.focus()
		expect(message).toHaveFocus()
		userEvent.keyboard('{Enter}')
		expect(first_name_input.value).toBe('default_name')
	})

	it('works as a select field', () => {
		window.scrollTo = jest.fn()

		const { queryByTitle, queryByText } = render(
			<FloatingLabelWrapper
				label="Department"
				type="select"
				options={[
					{ value: 1, text: 'one' },
					{ value: 2, text: 'two' },
				]}
				title="floating-label-select"
			/>,
		)
		const department_dropdown = queryByTitle('floating-label-select')
		userEvent.click(department_dropdown)

		const first_option = queryByText('one')
		expect(department_dropdown.value).toBe('')
		userEvent.click(first_option)

		expect(department_dropdown.value).toBe('one') // But shouldn't it be 1? It hasn't been a problem but this seems wrong
		expect(window.scrollTo).toHaveBeenCalled()
	})

	it('handles keyboard input for select fields', () => {
		const { queryByTitle } = render(
			<FloatingLabelWrapper
				label="Department"
				type="select"
				options={[
					{ value: 1, text: 'one' },
					{ value: 2, text: 'two' },
				]}
				title="floating-label-select"
			/>,
		)
		const department_dropdown = queryByTitle('floating-label-select')
		userEvent.click(department_dropdown)

		userEvent.keyboard('{ArrowDown}') // Start at the first entry (one), so pressing it only once moves us to (two)
		userEvent.keyboard('{Enter}')

		expect(department_dropdown.value).toBe('two')
	})

	it.skip('handles a fake preventDefault', () => {
		// todo: This doesn't actually cover the preventDefault function
		const onChange = jest.fn()

		const { queryByTitle } = render(
			<FloatingLabelWrapper
				label="Department"
				type="select"
				options={[
					{ value: 1, text: 'one' },
					{ value: 2, text: 'two' },
				]}
				title="floating-label-select"
				onChange={onChange}
			/>,
		)
		const department_dropdown = queryByTitle('floating-label-select')
		userEvent.click(department_dropdown)
		userEvent.keyboard('{Enter}')

		expect(onChange).toHaveBeenCalledWith(
			{ preventDefault: expect.any(Function), target: { name: undefined, value: 1 } },
			true,
		)
	})

	it('suggests autocomplete options', () => {
		const { queryByTitle, queryByText } = render(
			<FloatingLabelWrapper
				autocomplete_strings={['abcd', 'defg', 'ghij', '123']}
				title="floating-label-select"
			/>,
		)
		const department_dropdown = queryByTitle('floating-label-select')

		userEvent.type(department_dropdown, 'd')
		expect(queryByText('abcd')).toBeDefined()
		expect(queryByText('defg')).toBeDefined()
		expect(queryByText('ghij')).toBeNull()
		expect(queryByText('123')).toBeNull()

		userEvent.type(department_dropdown, '{backspace}g')
		expect(queryByText('abcd')).toBeNull()
		expect(queryByText('defg')).toBeDefined()
		expect(queryByText('ghij')).toBeDefined()
		expect(queryByText('123')).toBeNull()

		userEvent.type(department_dropdown, '{backspace}2')
		expect(queryByText('abcd')).toBeNull()
		expect(queryByText('defg')).toBeNull()
		expect(queryByText('ghij')).toBeNull()
		expect(queryByText('123')).toBeDefined()
	})
})
