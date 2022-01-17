import 'react-app-polyfill/ie11'
import 'react-app-polyfill/stable'

import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'

// Add all icons to the library so you can use it in your page
library.add(fas)

// const Enzyme = require('enzyme')
// const EnzymeAdapter = require('enzyme-adapter-react-16')

// // Setup enzyme's react adapter
// Enzyme.configure({
// 	adapter: new EnzymeAdapter(),
// })
