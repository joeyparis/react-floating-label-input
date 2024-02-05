import React, { useState } from 'react'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

jest.mock('use-is-in-viewport')
import useIsInViewPort from 'use-is-in-viewport'
let i = 0
useIsInViewPort.mockImplementation(() => {
	i += 1
	return [Boolean(i % 2), jest.fn()]
})

import FloatingLabel from '../index'

describe('<FloatingLabel />', () => {
	const FloatingLabelWrapper = (props) => {
		const [value, setValue] = useState('')
		return <FloatingLabel value={value} onChange={(e) => setValue(e.target.value)} {...props} />
	}

	let user

	beforeAll(() => {
		user = userEvent.setup({ delay: null })

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

	afterEach(() => {
		jest.useRealTimers()
	})

	it('matches snapshots', () => {
		const { baseElement } = render(<FloatingLabel id="snapshot" />)
		expect(baseElement).toMatchSnapshot()
	})

	it('handles input change', async () => {
		const { queryByLabelText } = render(<FloatingLabelWrapper label="First Name" />)

		const first_name_input = queryByLabelText('First Name')
		await user.type(first_name_input, 'Joey')

		expect(first_name_input.value).toBe('Joey')
	})

	it('displays a message', () => {
		const { queryByText } = render(<FloatingLabelWrapper label="First Name" message="An important message" />)
		const message = queryByText('An important message')
		expect(message).toBeDefined()
	})

	it('handles a message being clicked', async () => {
		const { queryByText, queryByLabelText } = render(
			<FloatingLabelWrapper label="First Name" message="default_name" />,
		)
		const message = queryByText('default_name')
		const first_name_input = queryByLabelText('First Name')

		expect(first_name_input.value).toBe('')
		await user.click(message)
		expect(first_name_input.value).toBe('default_name')
	})

	it('handles a message being pressed with enter', async () => {
		const { queryByText, queryByLabelText } = render(
			<FloatingLabelWrapper label="First Name" message="default_name" />,
		)
		const message = queryByText('default_name')
		const first_name_input = queryByLabelText('First Name')

		expect(first_name_input.value).toBe('')
		message.focus()
		expect(message).toHaveFocus()
		await user.keyboard('{Enter}')
		expect(first_name_input.value).toBe('default_name')
	})

	it('works as a select field', async () => {
		jest.useFakeTimers()
		window.scrollTo = jest.fn()

		const { findByTitle, findByText } = render(
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
		const department_dropdown = await findByTitle('floating-label-select')
		await user.click(department_dropdown)

		const first_option = await findByText('one')
		expect(department_dropdown.value).toBe('')
		await user.click(first_option)

		// await waitForElementToBeRemoved(() => queryByT('floating-label-select'))

		expect(department_dropdown.value).toBe('one') // But shouldn't it be 1? It hasn't been a problem but this seems wrong
		jest.runAllTimers()
		expect(window.scrollTo).toHaveBeenCalled()

		useIsInViewPort.mockImplementation(() => [true, jest.fn()])

		const dropwdown_select = await findByTitle('Department Dropdown')
		expect(dropwdown_select).toHaveStyle({ display: 'none' })
	})

	it('handles keyboard input for select fields', async () => {
		window.scrollTo = jest.fn()

		const { findByTitle } = render(
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
		const department_dropdown = await findByTitle('floating-label-select')
		await user.click(department_dropdown)

		await user.keyboard('{ArrowDown}') // Start at the first entry (one), so pressing it only once moves us to (two)
		await user.keyboard('{Enter}')

		expect(department_dropdown.value).toBe('two')

		const dropwdown_select = await findByTitle('Department Dropdown')
		expect(dropwdown_select).toHaveStyle({ display: 'none' })
	})

	it('suggests autocomplete options', async () => {
		window.scrollTo = jest.fn()

		const { findByTitle, queryByText } = render(
			<FloatingLabelWrapper
				autocomplete_strings={['abcd', 'defg', 'ghij', '123']}
				title="floating-label-select"
			/>,
		)
		const department_dropdown = await findByTitle('floating-label-select')

		await user.type(department_dropdown, 'd')
		expect(queryByText('abcd')).toBeDefined()
		expect(queryByText('defg')).toBeDefined()
		expect(queryByText('ghij')).toBeNull()
		expect(queryByText('123')).toBeNull()

		await user.type(department_dropdown, '{backspace}g')
		expect(queryByText('abcd')).toBeNull()
		expect(queryByText('defg')).toBeDefined()
		expect(queryByText('ghij')).toBeDefined()
		expect(queryByText('123')).toBeNull()

		await user.type(department_dropdown, '{backspace}2')
		expect(queryByText('abcd')).toBeNull()
		expect(queryByText('defg')).toBeNull()
		expect(queryByText('ghij')).toBeNull()
		expect(queryByText('123')).toBeDefined()

		const dropwdown_select = await findByTitle('undefined Dropdown')
		expect(dropwdown_select).toHaveStyle({ display: 'block' }) // We want it to be block because nothing has been selected
	})

	it('handles custom onFocus callback', async () => {
		const onFocus = jest.fn()

		const { queryByTitle } = render(
			<FloatingLabelWrapper label="Department" title="floating-label-input" onFocus={onFocus} />,
		)
		const department_dropdown = queryByTitle('floating-label-input')
		await user.click(department_dropdown)

		expect(onFocus).toHaveBeenCalledWith(
			expect.objectContaining({
				type: 'focus',
			}),
		)
	})

	it('handles custom onBlur callback', async () => {
		const onBlur = jest.fn()

		const { queryByTitle } = render(
			<FloatingLabelWrapper label="Department" title="floating-label-input" onBlur={onBlur} />,
		)
		const department_dropdown = queryByTitle('floating-label-input')
		await user.click(department_dropdown)
		await user.click(department_dropdown.parentElement)

		expect(onBlur).toHaveBeenCalledWith(
			expect.objectContaining({
				type: 'blur',
			}),
		)
	})

	it.skip('handles a fake preventDefault', async () => {
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
		await user.click(department_dropdown)
		await user.keyboard('{Enter}')

		expect(onChange).toHaveBeenCalledWith(
			{ preventDefault: expect.any(Function), target: { name: undefined, value: 1 } },
			true,
		)
	})
})
