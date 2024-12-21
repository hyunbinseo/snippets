/**
 * @typedef {Object} Data
 * @property {number} pageIndex
 * @property {number} size
 * @property {Order[]} orderList
 * @property {boolean} hasNext
 */

/**
 * @typedef {Object} Order
 * @property {number} orderId
 * @property {string} title
 * @property {number} orderedAt
 * @property {number} totalProductPrice
 */

/**
 * @param {number} startPage
 * @param {number | undefined} endPage
 */
export const ordersToCsv = async (startPage, endPage) => {
	const startPageIsValid = Number.isInteger(startPage) && startPage > 0;
	const endPageIsValid =
		endPage === undefined || (Number.isInteger(endPage) && endPage > 0 && endPage >= startPage);

	if (!startPageIsValid || !endPageIsValid) {
		console.error('페이지 번호가 잘못되었습니다.');
		return;
	}

	const textarea = document.createElement('textarea');
	textarea.style.display = 'none';
	textarea.value = '주문일자,주문번호,주문상품,물품가격(원)\n';
	document.body.appendChild(textarea);

	let currentPageIndex = startPage - 1;
	let processedPageIndex = currentPageIndex;

	while (!endPage || currentPageIndex < endPage) {
		console.log(`처리 중입니다: ${currentPageIndex + 1}페이지`);

		try {
			const response = await fetch(
				`https://mc.coupang.com/ssr/api/myorders/model/page?requestYear=0&pageIndex=${currentPageIndex}&size=5`,
				{ credentials: 'include' },
			);

			if (!response.ok) throw new Error();

			/** @type {Data} */
			const data = await response.json();
			const orders = data.orderList;

			if (!orders.length) throw new Error();

			for (const order of orders) {
				const row = [
					new Date(order.orderedAt + 9 * 60 * 60 * 1000).toISOString().slice(0, 10),
					order.orderId,
					order.title,
					order.totalProductPrice,
				].map((v) => v.toString());

				textarea.value += row.map((v) => (/[,\n"]/.test(v) ? `"${v}"` : v)).join(',') + '\n';
			}

			processedPageIndex = currentPageIndex;

			if (!data.hasNext) {
				console.log('마지막 페이지에 도달했습니다.');
				break;
			}

			currentPageIndex += 1;
		} catch (error) {
			console.error('내역을 찾지 못해 중단합니다.');
			break;
		}
	}

	const blob = new Blob(['\uFEFF' + textarea.value], {
		type: 'text/csv;charset=utf-8;',
	});

	const link = document.createElement('a');
	link.href = URL.createObjectURL(blob);
	link.download = `쿠팡 주문 내역 (${startPage}-${processedPageIndex + 1}페이지).csv`;
	console.log('파일을 다운로드합니다.');
	link.click();
	URL.revokeObjectURL(link.href);

	textarea.remove();
};
