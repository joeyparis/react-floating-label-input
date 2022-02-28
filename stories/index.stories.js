// FloatingLabelInput.stories.js|jsx
/* eslint-disable react/react-in-jsx-scope */

import { useArgs } from '@storybook/client-api'

import FloatingLabelInput from '../index'

// 👇 This default export determines where your story goes in the story list
export default {
	/* 👇 The title prop is optional.
	 * See https://storybook.js.org/docsreact/configure/overview#configure-story-loading
	 * to learn how to generate automatic titles
	 */
	title: 'FloatingLabelInput',
	component: FloatingLabelInput,
	args: {
		dark: false,
		value: '',
	},
}

const Template = (args) => {
	const [, updateArgs] = useArgs()

	const onChange = (e) => {
		if (args.onChange) args.onChange(e)
		updateArgs({ value: e.target.value })
	}

	return (
		<div>
			<div style={{ maxWidth: 500 }}>
				<FloatingLabelInput {...args} onChange={onChange} />
			</div>
		</div>
	)
}

export const TextInput = Template.bind({})
TextInput.args = {
	...TextInput.args,
	label: 'Text Input',
}

export const DateInput = Template.bind({})
DateInput.args = {
	...DateInput.args,
	label: 'Date Input',
	type: 'date',
}

export const SelectInput = Template.bind({})
SelectInput.args = {
	...SelectInput.args,
	label: 'Select Input',
	type: 'select',
	options: [
		{ text: 'Apple', value: 'Apple' },
		{ text: 'Banana', value: 'Banana' },
		{ text: 'Cheese', value: 'Cheese' },
	],
}
