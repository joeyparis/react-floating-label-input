import 'react-app-polyfill/ie11'
import 'react-app-polyfill/stable'

import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'

import '@testing-library/jest-dom'

// Add all icons to the library so you can use it in your page
library.add(fas)
