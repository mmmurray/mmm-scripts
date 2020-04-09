import chalk from 'chalk'

export type Style = 'negative' | 'positive' | 'neutral'

const colors: { [key in Style]: (v: string) => string } = {
  negative: chalk.redBright,
  positive: chalk.greenBright,
  neutral: chalk.yellowBright,
}

const boxify = (message: string, style: Style = 'neutral') => {
  const chars = Array(message.length + 2)
    .fill('═')
    .join('')

  return colors[style](`\n╔${chars}╗\n║ ${message} ║\n╚${chars}╝`)
}

const printBox = (message: string, style: Style) => {
  console.log(boxify(message, style))
}

const printList = <T>(
  heading: string,
  items: T[],
  itemFormatter: (value: T) => string = (x) => String(x),
  style: Style = 'neutral',
): void => {
  printBox(heading, style)
  console.log(`${items.map((item) => ` - ${itemFormatter(item)}`).join('\n')}`)
}

const pluraliseMessage = <T>(
  arr: T[],
  message: string,
  wordSingular: string,
  wordPlural: string,
): string =>
  message
    .replace(/#N/g, String(arr.length))
    .replace(/#W/g, arr.length === 1 ? wordSingular : wordPlural)

export { boxify, printBox, printList, pluraliseMessage }
