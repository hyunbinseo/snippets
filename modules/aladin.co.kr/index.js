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
	textarea.value = '주문일자,주문번호,수령인,주문상품,종류(종),수량(권),가격(원)\n';
	document.body.appendChild(textarea);

	let currentPage = startPage;
	let processedPage = currentPage;

	while (!endPage || currentPage <= endPage) {
		console.log(`처리 중입니다: ${currentPage}페이지`);

		try {
			const response = await fetch(
				'https://www.aladin.co.kr/account/wmaininfo.aspx?pType=MyAccount&start=we',
				{
					method: 'POST',
					credentials: 'include',
					headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
					body: `page=${currentPage}&SortOrder=&searchYear=0&searchMonth=0&searchType=0&searchShopType=0&searchOrderStatus=0&searchOrderWord=`,
				},
			);

			if (!response.ok) throw new Error();

			const html = await response.text();
			const parser = new DOMParser();
			const document = parser.parseFromString(html, 'text/html');

			/** @type {NodeListOf<HTMLTableRowElement>} */
			const orders = document.querySelectorAll('tbody tr:has(td.myacc_td03)');
			if (!orders.length) throw new Error();

			for (const order of orders) {
				const cells = order.querySelectorAll(':scope > td');

				const [_, title, types, quantity, price] =
					cells[3]
						?.querySelector('div')
						?.textContent?.trim()
						.match(/(.*?) 총 (\d+)종 (?:총 )?(\d+)권, ([\d,]+)원/) || [];

				const row = [
					cells[0]?.textContent?.trim() || '',
					cells[1]?.querySelector('a')?.textContent?.trim() || '',
					cells[2]?.textContent || '',
					title || '',
					types || '',
					quantity || '',
					price || '',
				];

				textarea.value += row.map((v) => (/[,\n"]/.test(v) ? `"${v}"` : v)).join(',') + '\n';
			}

			processedPage = currentPage;
			currentPage += 1;
		} catch {
			console.error('내역을 찾지 못해 중단합니다.');
			break;
		}
	}

	const blob = new Blob(['\uFEFF' + textarea.value], {
		type: 'text/csv;charset=utf-8;',
	});

	const link = document.createElement('a');
	link.href = URL.createObjectURL(blob);
	link.download = `알라딘 주문 내역 (${startPage}-${processedPage}페이지).csv`;
	console.log('파일을 다운로드합니다.');
	link.click();
	URL.revokeObjectURL(link.href);

	textarea.remove();
};
