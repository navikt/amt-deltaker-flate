import { isValidElement, ReactElement, ReactNode } from 'react'

export const finnElement = (
  node: ReactNode,
  targetType: unknown
): ReactElement | null => {
  if (!isValidElement(node)) return null
  if (node.type === targetType) return node

  const children = node.props?.children
  if (!children) return null

  const nodes = Array.isArray(children) ? children : [children]
  for (const child of nodes) {
    const match = finnElement(child, targetType)
    if (match) return match
  }
  return null
}

export const extractText = (node: ReactNode): string[] => {
  if (node == null || typeof node === 'boolean') return []
  if (typeof node === 'string' || typeof node === 'number') {
    return [String(node)]
  }
  if (Array.isArray(node)) return node.flatMap(extractText)
  if (isValidElement<{ children?: ReactNode }>(node)) {
    return extractText(node.props.children)
  }
  return []
}
