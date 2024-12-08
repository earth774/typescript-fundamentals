import Currency, { cache } from './currency'
const myCurrency = new Currency(['USD', 'JPY', 'THB'])

myCurrency.log('USD')

myCurrency.convert('USD', 'THB', 1)

const main = async () => {
    await myCurrency.convert("USD", 'THB', 1).then(console.log)
    await myCurrency.convert('USD', 'THB', 2).then(console.log)
    await myCurrency.convert('USD', 'THB', 3).then(console.log)
    await myCurrency.convert('USD', 'THB', 4).then(console.log)
}

main()
// myCurrency.latest.then(console.log)

// const api = 'https://api.frankfurter.app'

// type Currency = 'USD' | 'JPY' | 'THB'

// const convertCurrent = ({
//     from,
//     to,
//     amount
// }: {
//     amount: number
//     from: Currency
//     to: Currency
// }) => {
//     return fetch(`${api}/latest?from=${from}&to=${to}&amount=${amount}`)
//         .then((x) => x.json() as any as CurrencyResult)
//         .then((a) => a)
// }

// const main = async () => {
//     const currency = await convertCurrent({
//         amount: 100,
//         from: 'THB',
//         to: 'USD'
//     })

//     console.log(currency)    
// }

// main()
