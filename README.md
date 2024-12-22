# 스니펫!

웹 브라우저 / 개발자 도구 / 콘솔에 붙여 넣어 실행합니다.

> [!WARNING]  
> 이해할 수 없거나 직접 검토하지 않은 코드를 DevTools 콘솔에 붙여넣지 마세요. 공격자가 ID를 도용하거나 컴퓨터를 제어할 수 있습니다. — Microsoft Edge

> [!WARNING]
> Don’t paste code into the DevTools Console that you don’t understand or haven’t reviewed yourself. This could allow attackers to steal your identity or take control of your computer. — Google Chrome

## 알라딘 주문 내역

1. [알라딘]에 로그인하고 개발자 콘솔을 엽니다.
2. 코드를 실행하면 CSV 파일이 다운로드됩니다.

[알라딘]: https://www.aladin.co.kr/

```js
// 불러오기
const aladin = await import('https://cdn.jsdelivr.net/gh/hyunbinseo/snippets/sites/aladin.co.kr/index.js');
```

```js
// 실행
aladin.ordersToCsv(1); // 1페이지부터 끝까지
aladin.ordersToCsv(2, 3); // 2페이지부터 3페이지까지
```
