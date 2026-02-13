import type { OCRResult, ReceiptData } from './ocrApi';

// 가격 문자열을 숫자로 파싱하는 유틸리티 함수 (중복 제거)
export function parsePrice(priceText: string): number {
  if (!priceText || typeof priceText !== 'string') return 0;
  const cleanPrice = priceText.replace(/[^\d]/g, '');
  return parseInt(cleanPrice) || 0;
}

// 가격을 한국 원화 형식으로 포맷팅
export function formatPrice(price: number): string {
  if (typeof price !== 'number' || isNaN(price)) return '0원';
  return price.toLocaleString('ko-KR') + '원';
}

// 날짜 문자열을 포맷팅
export function formatDate(dateString?: string): string {
  if (!dateString) return '날짜 정보 없음';
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  } catch {
    return dateString;
  }
}