# 스니펫!

웹 브라우저 / 개발자 도구 / 콘솔에 붙여 넣어 실행합니다.

## 알라딘 주문 내역

- [알라딘]에 로그인한 상태에서 실행합니다.
- (Excel 호환) CSV 형식으로 다운로드합니다.

[알라딘]: https://www.aladin.co.kr/

```js
// 불러오기
const aladin = await import('https://cdn.jsdelivr.net/gh/hyunbinseo/snippets/modules/aladin.co.kr/index.js');
```

```js
// 실행
aladin.ordersToCsv(1); // 1페이지부터 끝까지
aladin.ordersToCsv(2, 3); // 2페이지부터 3페이지까지
```