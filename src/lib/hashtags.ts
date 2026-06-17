export function parseHashtags(input: string): string[] {
  const tags = input
    .split(/[,#\s]+/)
    .map((tag) => tag.trim().toLowerCase())
    .filter((tag) => tag.length > 0)

  return [...new Set(tags)]
}

export function formatHashtags(tags: string[]): string {
  return tags.map((tag) => `#${tag}`).join(', ')
}
