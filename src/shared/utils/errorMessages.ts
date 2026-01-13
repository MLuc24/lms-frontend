/**
 * User-friendly error messages
 * Maps backend error codes/messages to localized, friendly messages
 */

export const ERROR_MESSAGES: Record<string, string> = {
  // Auth errors
  'Invalid credentials': 'Email hoặc mật khẩu không đúng. Vui lòng thử lại.',
  'User not found': 'Tài khoản không tồn tại. Vui lòng kiểm tra lại email.',
  'Email already exists': 'Email này đã được đăng ký. Vui lòng đăng nhập hoặc sử dụng email khác.',
  'Invalid token': 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.',
  'Token expired': 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.',
  'Session expired. Please login again.': 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.',
  'Unauthorized': 'Bạn cần đăng nhập để tiếp tục.',
  'Account not verified': 'Tài khoản chưa được xác thực. Vui lòng kiểm tra email.',
  'Account is locked': 'Tài khoản đã bị khóa. Vui lòng liên hệ hỗ trợ.',
  
  // Password reset errors
  'Invalid or expired OTP': 'Mã OTP không đúng hoặc đã hết hạn. Vui lòng thử lại.',
  'Invalid OTP': 'Mã OTP không đúng hoặc đã hết hạn.',
  'OTP expired': 'Mã OTP đã hết hạn. Vui lòng yêu cầu mã mới.',
  
  // Network errors
  'Network request failed': 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.',
  'Network error': 'Lỗi kết nối mạng. Vui lòng thử lại.',
  'Timeout': 'Yêu cầu quá lâu. Vui lòng thử lại.',
  
  // Validation errors
  'Invalid email format': 'Định dạng email không hợp lệ.',
  'Email is required': 'Vui lòng nhập email.',
  'Password is required': 'Vui lòng nhập mật khẩu.',
  'Name is required': 'Vui lòng nhập họ tên.',
  
  // Server errors
  'Internal server error': 'Lỗi hệ thống. Vui lòng thử lại sau.',
  'Service unavailable': 'Dịch vụ tạm thời không khả dụng. Vui lòng thử lại sau.',
  'Bad request': 'Yêu cầu không hợp lệ. Vui lòng kiểm tra lại thông tin.',
  
  // Default
  'default': 'Đã có lỗi xảy ra. Vui lòng thử lại.',
};

/**
 * Get user-friendly error message
 * @param error - Error object or message from backend
 * @returns User-friendly error message in Vietnamese
 */
export function getUserFriendlyError(error: unknown): string {
  if (!error) {
    return ERROR_MESSAGES.default;
  }

  // If error is an Error object
  if (error instanceof Error) {
    const message = error.message;
    
    // Check if we have a mapping for this exact message
    if (ERROR_MESSAGES[message]) {
      return ERROR_MESSAGES[message];
    }
    
    // Check for partial matches (case-insensitive)
    const lowerMessage = message.toLowerCase();
    for (const [key, value] of Object.entries(ERROR_MESSAGES)) {
      if (lowerMessage.includes(key.toLowerCase())) {
        return value;
      }
    }
    
    // Return original message if no mapping found (for development)
    return message;
  }

  // If error is a string
  if (typeof error === 'string') {
    return ERROR_MESSAGES[error] || error;
  }

  return ERROR_MESSAGES.default;
}
