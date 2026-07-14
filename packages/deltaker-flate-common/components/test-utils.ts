import { isValidElement, ReactElement, ReactNode } from 'react'

const resolveNode = (node: ReactNode): ReactNode => {
  if (!isValidElement(node)) {
    return node
  }

  if (typeof node.type === 'function') {
    return resolveNode(node.type(node.props))
  }

  return node
}

export const finnElement = (
  node: ReactNode,
  targetType: unknown
): ReactElement | null => {
  node = resolveNode(node)
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
  node = resolveNode(node)
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
