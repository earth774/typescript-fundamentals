interface CurrencyResult<T extends string> {
    amount: number
    base: string
    date: string
    rates: Record<T, number>
}

function cache
    (method: Function, context: unknown) {
    // @ts-ignore
    return async function a(
        this,
        from: string,
        to: string,
        amount: number
    ) {
        const key = `${from}${to}`;

        // if (this.caches[key]) {
        //     return this.caches[key] * amount
        // }

        const result = await method.bind(this)(from, to, amount)

        const rate = result.rates[to];

        this.caches[key] = rate / result.amount

        return rate
        // return method(from, to, amount)
    }
}

class Currency<
    const Currencies extends readonly string[] = [],
    Values extends string = Extract<Currencies[keyof Currencies], string>
> {
    api = 'https://api.frankfurter.app'
    private caches: Record<string, number> = {}
    constructor(public currencies: Currencies) {
    }

    @cache
    async convert<To extends Values>(
        from: Values,
        to: To,
        amount: number
    ) {
        return await fetch(`${this.api}/latest?from=${from}&to=${to}&amount=${amount}`)
            .then((x) => x.json() as unknown as any as CurrencyResult<
                To
            >)
            .then((a) => a)

    }

    log(currency: Currencies[keyof Currencies]) {

    }

    get latest() {
        return fetch(`${this.api}/latest`).then((x) => x.json())
    }
}

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
