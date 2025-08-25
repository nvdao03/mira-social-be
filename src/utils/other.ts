export const handleEmail = (email: string) => {
  const emailStr = email.split('@')[0]
  return emailStr
}

export const handleEnumToArray = (enumObj: any) => {
  return Object.values(enumObj).filter((value) => typeof value === 'number') as number[]
}

export const handleGetNameFile = (fileName: string) => {
  return fileName.split('.')[0]
}
