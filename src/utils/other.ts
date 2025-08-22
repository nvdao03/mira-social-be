export const handleEmail = (email: string) => {
  const emailStr = email.split('@')[0]
  return emailStr
}
