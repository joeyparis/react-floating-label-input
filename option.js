/**
 *
 * FloatingLabel/option
 *
 */

// Core React
import React, { useEffect } from 'react'
import PropTypes from 'prop-types'

import useIsInViewPort from 'use-is-in-viewport'
import classNames from 'classnames'

const Option = ({ index, active_index, text, input_autofill_id, onChange, setIsVisible }) => {
	const [is_visible, is_visible_ref] = useIsInViewPort()

	useEffect(() => {
		setIsVisible({ index, is_visible })
	}, [is_visible])

	return (
		<li
			id={`fl-option-${input_autofill_id}-${index}`}
			ref={is_visible_ref}
			className={classNames('fl-input-select-option', {
				'fl-active-option': index === active_index,
			})}
		>
			<button type="button" className="btn-unstyled fl-input-select-option-button" onMouseDown={onChange}>
				{text}
			</button>
		</li>
	)
}

Option.propTypes = {
	index: PropTypes.number,
	active_index: PropTypes.number,
	text: PropTypes.string,
	onChange: PropTypes.func,
	input_autofill_id: PropTypes.string,
	setIsVisible: PropTypes.func,
}

export default Option
