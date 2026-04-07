export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;
export const USERNAME_REGEX = /^.{6,}$/;

export const PASSWORD_RULE_TEXT =
  "Use 8+ characters with uppercase, lowercase, a number, and a special character.";
export const USERNAME_RULE_TEXT = "Username must be at least 6 characters long.";
