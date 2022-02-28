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
