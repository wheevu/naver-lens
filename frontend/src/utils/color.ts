/**
 * Tính toán xem một màu Hex có phải là màu sáng hay không.
 * Sử dụng công thức YIQ để phù hợp với cảm nhận mắt người.
 * @param hexColor Mã màu hex (ví dụ: #FFFFFF, #000000, #123456)
 * @returns true nếu là màu sáng (nên dùng chữ đen), false nếu là màu tối (nên dùng chữ trắng)
 */
export const isLightColor = (hexColor: string): boolean => {
  // 1. Xóa dấu # nếu có
  const hex = hexColor.replace("#", "");

  // 2. Parse ra R, G, B
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // 3. Tính độ sáng (YIQ formula)
  // Công thức chuẩn: ((R*299)+(G*587)+(B*114))/1000
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;

  // 4. So sánh với ngưỡng (thường là 128)
  return yiq >= 128;
};
