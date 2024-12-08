interface CurrencyResult<T extends string> {
    amount: number
    base: string
    date: string
    rates: Record<T, number>
}



class Currency<const Currencies> {
    api = 'https://api.frankfurter.app'
    private caches: Record<string, number> = {}
    constructor(public currencies: Currencies) {
    }

    async convert<To extends Currencies[keyof Currencies]>(
        from: Currencies[keyof Currencies],
        to: To,
        amount: number
    ) {
        const key = `${from}${to}${amount}` as To extends string ? To : never;

        if (this.caches[key]) {
            return this.caches[key]
        }

        await new Promise(resolve => setTimeout(resolve, 1000))

        const result = await fetch(`${this.api}/latest?from=${from}&to=${to}&amount=${amount}`)
            .then((x) => x.json() as any as CurrencyResult<
                To extends string ? To : never
            >)
            .then((a) => a)

        const rate = result.rates[to as To extends string ? To : never];

        this.caches[key] = rate

        return rate
    }

    log(currency: Currencies[keyof Currencies]) {

    }

    get latest() {
        return fetch(`${this.api}/latest`).then((x) => x.json())
    }
}

const myCurrency = new Currency(['USD', 'JPY', 'THB'])

myCurrency.log('USD')


const main = async () => {
    await myCurrency.convert('USD', 'THB', 1).then(console.log)
    await myCurrency.convert('USD', 'THB', 1).then(console.log)
    await myCurrency.convert('USD', 'THB', 1).then(console.log)
    await myCurrency.convert('USD', 'THB', 1).then(console.log)
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
