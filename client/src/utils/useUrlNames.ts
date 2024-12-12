export function useUrlNames() {
  const encodeName = (name: string) => {
    return name.replace(/ /g, '_')
  }

  const unencodeName = (name: string) => {
    return name.replace(/_/g, ' ')
  }

  return { encodeName, unencodeName }
}
