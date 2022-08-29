/**
 * Scrolls to an element, given the element's css selector
 * @param selector - the id of the element to scroll to.
 * @param {'auto'|'instant'|'smooth'} [behavior=smooth] behavior - the transition animation
 */
export const scrollToEl = (selector, behavior = 'smooth') => {
	const el = document.querySelector(selector);
	if (el) {
		el.scrollIntoView({ behavior, block: 'start' });
	}
};

/**
 * Scrolls to the top
 * @param {'auto'|'instant'|'smooth'} [behavior=smooth] behavior - the transition animation
 */
export const scrollToTop = (behavior = 'smooth') => {
	scrollToEl('body', behavior);
};

/**
 * Formats money value
 * @param value
 * @returns {string}
 */
export const formatMoney = (value) => {
	if ((value === 0) || (value === '0')) return value;
	if (!value) return value;

	const money = value.toString().split('.');
	money[0] = money[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	if (money.length === 1) {
		money[1] = '00';
	} else {
		money[1] = `${money[1]}00`.slice(0, 2);
	}
	return money.join('.');
};

/**
 * Formats money value to Naira
 * @param value
 * @returns {string}
 */
export const formatNaira = value => `₦ ${formatMoney(value)}`;


/**
 * Generates the domain based on host and port
 */

export const getDomain = () => {
	if (process.env.PORT) {
		if (Number(process.env.PORT) === 80) {
			return process.env.HOST;
		}
		return `${process.env.HOST}:${process.env.PORT}`;
	}
	return process.env.HOST;
};
