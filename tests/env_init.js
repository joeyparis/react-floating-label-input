global.XMLHttpRequest = undefined

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

process.env.ENV = 'development'
process.env.API_URL = 'https://0i4ok7cr18.execute-api.us-east-1.amazonaws.com/dev'
process.env.LEADJIG_URL = 'https://leadjig.ngrok.io'
process.env.CC_KEY = 'pk_test_sb2rlikpwplyIPlOHTvsQU6F'
