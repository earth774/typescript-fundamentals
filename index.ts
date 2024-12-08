interface CurrencyResult {
    amount: number
    base: string
    date: string
    rates: {
        [a: string]: number
    }
}



class Currency<const Currencies> {
    api = 'https://api.frankfurter.app'
    constructor(public currencies: Currencies) {
    }

    convert(from: string, to: string, amount: number) {
        return fetch(`${this.api}/latest?from=${from}&to=${to}&amount=${amount}`)
            .then((x) => x.json() as any as CurrencyResult)
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
myCurrency.convert('USD', 'THB', 1).then(console.log)
myCurrency.latest.then(console.log)

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
