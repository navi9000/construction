export function diff<T>(currArr: T[], prevArr: T[]) {
  return {
    added: currArr.filter((item) => !prevArr.includes(item)),
    removed: prevArr.filter((item) => !currArr.includes(item)),
    shared: currArr.filter((item) => prevArr.includes(item)),
  }
}
