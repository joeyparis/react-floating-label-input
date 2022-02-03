/**
 *
 * FloatingLabel
 *
 */

// Core React
import React, { useEffect, useReducer } from 'react'
import { Global, css } from '@emotion/react'
import PropTypes from 'prop-types'

// NPM Packages
import classNames from 'classnames'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import scrollIntoView from 'scroll-into-view'

// Utils
import { useIdentifier, useAutocomplete, useKeyboardScroll } from '@joeyparis/hooks'

import Option from './option'

// CSS
const styles = css`
	.fl-input-container {
		-ms-flex-direction: column;
		-webkit-flex-direction: column;
		display: -ms-flexbox;
		display: -webkit-flex;
		display: flex;
		flex-direction: column;
		position: relative;
		transition: 200ms ease all;
	}

	.fl-input-container-msg-show {
		margin-bottom: 1.5em;
	}

	.fl-input-container input:not(:focus):not(.fl-valid):not(.fl-invalid) {
		color: transparent;
	}

	.fl-input-container input,
	.fl-input-container label,
	.fl-label,
	.fl-msg {
		-webkit-font-smoothing: antialiased;
		font-family: 'Roboto', sans-serif;
		text-shadow: none;
	}

	.fl-input-container input:disabled {
		background-color: #e9ecef;
		cursor: not-allowed;
	}

	.fl-input-container input {
		-moz-appearance: none;
		-webkit-appearance: none;
		-webkit-tap-highlight-color: transparent;
		border-radius: 0;
		display: -moz-flex;
		display: -ms-flexbox;
		display: -webkit-flex;
		display: flex;
		font-size: 100%;
		line-height: 25px;

		background-color: #fff;
		padding: 0.5em;
		text-shadow: 0 0 #000;
	}

	.fl-input-container input[type='date'],
	.fl-input-container input[type='time'],
	.fl-input-container input[type='datetime-local'],
	.fl-input-container input[type='month'] {
		line-height: 1em;
	}

	.fl-input-container .fl-input-dark {
		border-radius: 0.25em;
	}

	.fl-input-container .fl-transparent {
		background-color: transparent;
		color: #fff;
		border-radius: 0;
	}

	.fl-input-container input:-webkit-autofill.fl-transparent {
		-webkit-box-shadow: 0 0 0px 1000px #16a1d4 inset;
		-webkit-text-fill-color: #fff;
	}

	.fl-input-select-container input {
		cursor: pointer;
	}

	.fl-input-group .fl-input-container {
		display: inline-flex;
		vertical-align: top;
	}

	.fl-input-group .btn {
		vertical-align: bottom;
	}

	.fl-input-group .fl-input-container:not(:first-of-type):not(:last-child) input {
		border-radius: 0;
	}

	.fl-input-group .fl-input-container:first-of-type input {
		border-top-right-radius: 0;
		border-bottom-right-radius: 0;
	}

	.fl-input-group .fl-input-container:last-child input {
		border-top-left-radius: 0;
		border-bottom-left-radius: 0;
	}

	.fl-input-label {
		-moz-transform-origin: left top;
		-moz-transform: scale(1) translate3d(0, 2.1em, 0);
		-moz-transition: 200ms ease all;
		-ms-flex-order: 1;
		-webkit-order: 1;
		-webkit-transform-origin: left top;
		-webkit-transform: scale(1) translate3d(0, 2.1em, 0);
		-webkit-transition: 200ms ease all;
		color: #999;
		font-weight: normal;
		opacity: 0.75;
		order: 1;
		padding-left: 0.5em;
		pointer-events: none;
		text-transform: capitalize;
		transform-origin: left top;
		transform: scale(1) translate3d(0, 2.1em, 0);
		transition: 200ms ease all;
		margin-bottom: 0;
		white-space: nowrap;
	}

	#complete-profile input[required] + label {
		font-weight: bold;
	}

	#complete-profile input.fl-valid + .fl-input-label {
		font-weight: normal;
	}

	.fl-input-label.fl-transparent {
		color: #fff;
		opacity: 1;
	}

	.fl-label {
		color: #3949ab;
		transform: scale(0.8) translate3d(0, 5px, 0);
		margin-bottom: 0.15em;
		margin-left: -0.5em; /* I'm not entirely sure why this is needed to get the label to properly align but w/e */
	}

	.fl-input-label-address::after {
		content: 'Address';
	}

	.fl-input-container input[required] + label:not(:empty)::after {
		content: '*';
	}

	.fl-input-container input:focus + label,
	.fl-input-container .fl-valid + label,
	.fl-invalid + label {
		-moz-transform: scale(0.8) translate3d(0, 5px, 0);
		-webkit-transform: scale(0.8) translate3d(0, 5px, 0);
		color: #3949ab;
		padding-left: 0.25em;
		opacity: 1;
		transform: scale(0.8) translate3d(0, 5px, 0);
	}

	.fl-input-container input:focus + label.fl-input-label-wrap,
	.fl-input-container .fl-valid + label.fl-input-label-wrap,
	.fl-invalid + label.fl-input-label-wrap {
		white-space: normal;
	}

	.fl-input-container input:focus + label.fl-input-label-dark,
	.fl-input-container input.fl-valid + label.fl-input-label-dark,
	.fl-invalid + label.fl-input-label-dark {
		color: #fff;
	}

	.fl-input-container input[required]:focus + label::after,
	.fl-input-container input[required].fl-valid + label::after,
	.fl-invalid + label::after {
		content: '';
	}

	.fl-input-select-container input:focus ~ .fl-input-select {
		display: block;
	}

	.fl-input:active,
	.fl-input:focus,
	.fl-input-label {
		outline: 0;
	}

	.fl-input {
		-ms-flex-order: 2;
		-ms-flex: 1 1 auto;
		-webkit-flex: 1 1 auto;
		-webkit-order: 2;
		border: 0;
		border-bottom: 1px solid rgba(0, 0, 0, 0.15);
		color: #000;
		flex: 1 1 auto;
		order: 2;
	}

	.fl-input.fl-transparent {
		border-bottom: 1px solid #fff;
	}

	.fl-input-select {
		display: none;
		position: absolute;
		margin: 0;
		background-color: #fff;
		top: 99%;
		width: 100%;
		z-index: 10;
		list-style-type: none;
		padding: 0;
		box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.5);
		overflow-y: scroll;
		border-radius: 0 0 5px 5px;
	}

	.fl-input-select::-webkit-scrollbar {
		-webkit-appearance: none;
		width: 10px;
		background-color: transparent;
	}

	.fl-input-select::-webkit-scrollbar-thumb {
		border-radius: 5px;
		background-color: rgba(0, 0, 0, 0.4);
		-webkit-box-shadow: 0 0 1px rgba(255, 255, 255, 0.5);
	}

	.fl-input-select-option {
		padding: 0;
		cursor: pointer;
		border-bottom: 1px solid #eee;
		color: #1b1b1c;
	}

	.fl-input-select-option .fl-input-select-option-button {
		padding: 0.5em 1em;
		width: 100%;
		text-align: left;
		cursor: pointer;
		border: none;
		background: transparent;
	}

	.fl-input-select-option:hover,
	.fl-active-option {
		background-color: #f8f8f8;
	}

	.fl-input-bar {
		-ms-flex-order: 3;
		-webkit-order: 3;
		display: block;
		order: 3;
		top: 0;
		width: 100% !important;
	}

	.fl-input-bar::after,
	.fl-input-bar::before {
		-moz-transition: 200ms ease all;
		-webkit-transition: 200ms ease all;
		background: #3949ab;
		bottom: 0;
		content: '';
		height: 2px;
		position: absolute;
		transition: 200ms ease all;
		width: 0;
	}

	.fl-input-bar::before {
		left: 50%;
	}

	.fl-input-bar::after {
		right: 50%;
	}

	.fl-input:focus ~ .fl-input-bar::after,
	.fl-input:focus ~ .fl-input-bar::before,
	.fl-invalid ~ .fl-input-bar::after,
	.fl-invalid ~ .fl-input-bar::before {
		width: 50%;
	}

	.fl-input-bar,
	.fl-msg {
		position: relative;
		width: inherit;
	}

	.fl-msg {
		bottom: -1.75em;
		display: none;
		font-size: 13px;
		overflow: hidden;
		position: absolute;
		text-overflow: ellipsis;
		white-space: nowrap;
		width: 90%;
		word-break: break-all;
		word-wrap: break-word;
	}

	.fl-msg-show {
		display: inline-block;
	}

	.fl-invalid ~ .fl-input-bar::after,
	.fl-invalid ~ .fl-input-bar::before {
		background: #e74c3c;
	}

	.fl-msg {
		color: #1b1b1c;
	}

	.fl-input-container .fl-input.fl-invalid + label,
	.fl-input.fl-invalid ~ .fl-msg {
		color: #e74c3c;
	}

	.fl-hide-cursor {
		color: transparent;
		text-shadow: 0 0 #000;
	}
`

// For select, type="select" and options={[{text: "Example object", value: 'ex'}]}
// For autocomplete, type="text" and autocomplete_strings={['Just strings']}

const FloatingLabel = ({
	always_float,
	className,
	containerClassNames,
	containerStyle,
	listStyle,
	dark,
	transparent,
	message,
	invalid,
	input_ref,
	label,
	onBlur,
	onChange,
	onFocus,
	options,
	autocomplete_strings,
	prevent_autofill,
	show_bar,
	value,
	wrap_label,
	placeholder,
	...input_props
}) => {
	const default_id = useIdentifier()
	const input_autofill_id = useIdentifier()
	const label_autofill_id = useIdentifier()

	const [visible, setVisible] = useReducer((state, action) => {
		if (action.is_visible) {
			state.add(action.index)
		} else {
			state.delete(action.index)
		}

		return state
	}, new Set())

	const [all_autocomplete_options, matchAutocomplete] = useAutocomplete(autocomplete_strings)

	const initial_options = options || all_autocomplete_options
	const selected_option = initial_options && initial_options.find((o) => String(o.value) === String(value))

	const { handleKeyboardScroll, active_index, visible_options, updateOptions } = useKeyboardScroll({
		initial_options,
		selected_option,
		onEnter(index) {
			onChange(
				{
					target: {
						name: input_props.name,
						value: visible_options[index].value,
					},
					preventDefault: /* istanbul ignore next */ () => null,
				},
				true,
			)
		},
	})

	// Change behavior for select input types or text with autocomplete.
	const is_autocomplete = !!autocomplete_strings
	const is_select = input_props.type === 'select'
	const is_list = input_props.type === 'list'
	const display_value = is_select && selected_option ? selected_option.text : value || ''

	// Prevent autofill if requested or if input is select type or if autocomplete options provided
	const should_prevent_autofill = prevent_autofill || is_select || is_autocomplete

	const has_value = Boolean(display_value) || always_float || Boolean(placeholder) || input_props.type === 'date'
	const has_message = Boolean(message)

	useEffect(() => {
		if (options) {
			updateOptions(options)
		}
	}, [JSON.stringify(options)])

	useEffect(() => {
		if (autocomplete_strings && autocomplete_strings.length > 0) {
			const new_autocomplete_options = matchAutocomplete(value)
			if (new_autocomplete_options) {
				updateOptions(new_autocomplete_options)
			}
		}
	}, [value])

	function scrollToActiveItem() {
		const li = document.getElementById(`fl-option-${input_autofill_id}-${active_index}`)
		if (li && window.getComputedStyle(li.parentElement).display !== 'none' && !visible.has(active_index)) {
			scrollIntoView(li)
		}
	}

	useEffect(() => {
		if (is_select || is_autocomplete) {
			scrollToActiveItem()
		}
	}, [active_index])

	if (is_select) {
		input_props.type = 'text' // eslint-disable-line no-param-reassign
	}

	// Display classes for input and error message
	const input_classes = classNames('fl-input', {
		'fl-valid': has_value && !invalid,
		'fl-invalid': invalid,
		'fl-hide-cursor': is_select,
	})

	const message_classes = classNames({
		clickable: has_message,
		'fl-msg': has_message,
		'fl-msg-show': has_message,
	})

	const handleInputChange = (e, force = false) => {
		e.preventDefault()

		if (!is_select && !is_list && !force) {
			if (onChange) onChange(e)
		}

		return false
	}

	return (
		<React.Fragment>
			<Global styles={styles} />
			<div
				className={classNames('fl-input-container', containerClassNames, {
					'fl-input-select-container': is_select || is_autocomplete,
					'fl-input-container-msg-show': has_message,
				})}
				style={containerStyle}
			>
				{is_select && (
					<FontAwesomeIcon
						icon="angle-double-down"
						style={{
							position: 'absolute',
							right: '0.5em',
							bottom: '0.75em',
							pointerEvents: 'none',
						}}
					/>
				)}
				<input
					ref={input_ref}
					tab_index="0"
					className={classNames(input_classes, className, {
						'fl-input-dark': dark,
						'fl-transparent': transparent,
					})}
					value={display_value}
					placeholder={placeholder}
					onChange={handleInputChange}
					onFocus={(e) => {
						if (onFocus) onFocus(e)
						if (is_select || is_autocomplete) {
							setTimeout(scrollToActiveItem, 100)
						}
					}}
					onBlur={(e) => {
						if (onBlur) onBlur(e)
						if ((is_select || is_autocomplete) && !visible.has(active_index)) {
							scrollIntoView(e.target)
						}
					}}
					onKeyDown={(e) => {
						if (is_autocomplete) {
							return handleKeyboardScroll(e)
						}
						if (is_select) {
							e.preventDefault()
							return handleKeyboardScroll(e)
						}
						return true
					}}
					autoComplete={should_prevent_autofill ? 'off' : 'on'}
					{...input_props}
					id={should_prevent_autofill ? input_autofill_id : input_props.id || default_id}
				/>
				<label
					htmlFor={should_prevent_autofill ? label_autofill_id : input_props.id || default_id}
					className={classNames('fl-input-label', {
						'fl-input-label-dark': dark,
						'fl-input-label-wrap': wrap_label,
						'fl-transparent': transparent,
					})}
				>
					{label}
				</label>

				{show_bar && <span className="fl-input-bar" />}

				{message && (
					<span
						role="button"
						tabIndex={-1}
						onClick={() => {
							onChange({
								target: {
									name: input_props.name,
									value: message,
								},
							})
						}}
						onKeyPress={(e) => {
							if (e.key === 'Enter') {
								onChange({
									target: {
										name: input_props.name,
										value: message,
									},
								})
							}
						}}
						className={message_classes}
					>
						{message}
					</span>
				)}

				{(is_select || is_autocomplete) && !input_props.disabled && (
					<ul className="fl-input-select" style={listStyle}>
						{visible_options.map((option, index) => (
							<Option
								key={option.value || `i-${index}`}
								index={index}
								active_index={active_index}
								text={option.text}
								value={option.value}
								input_autofill_id={input_autofill_id}
								onChange={() =>
									onChange(
										{
											target: {
												name: input_props.name,
												value: option.value,
											},
											preventDefault: /* istanbul ignore next */ () => null,
										},
										true,
									)
								}
								setIsVisible={setVisible}
							/>
						))}
					</ul>
				)}
			</div>
		</React.Fragment>
	)
}

FloatingLabel.propTypes = {
	always_float: PropTypes.bool,
	autocomplete_strings: PropTypes.arrayOf(PropTypes.string),
	className: PropTypes.string,
	containerClassNames: PropTypes.string,
	containerStyle: PropTypes.objectOf(PropTypes.any),
	dark: PropTypes.bool,
	input_ref: PropTypes.any, // todo: I have no idea what this should be
	invalid: PropTypes.bool,
	label: PropTypes.oneOfType([PropTypes.string, PropTypes.objectOf(PropTypes.any)]),
	listStyle: PropTypes.objectOf(PropTypes.any),
	message: PropTypes.string,
	onBlur: PropTypes.func,
	onChange: PropTypes.func,
	onFocus: PropTypes.func,
	options: PropTypes.arrayOf(
		PropTypes.shape({
			text: PropTypes.any,
			value: PropTypes.any,
		}),
	),
	placeholder: PropTypes.string,
	prevent_autofill: PropTypes.bool,
	show_bar: PropTypes.bool,
	transparent: PropTypes.bool,
	value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	wrap_label: PropTypes.bool,
}

FloatingLabel.defaultProps = {
	always_float: false,
	dark: true,
	invalid: false,
	message: '',
	prevent_autofill: false,
	show_bar: true,
	transparent: false,
	// options: [],
}

export default FloatingLabel
