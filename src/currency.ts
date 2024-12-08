interface CurrencyResult<T extends string> {
    amount: number
    base: string
    date: string
    rates: Record<T, number>
}

export function cache(key: string = null): any {
    return function decorator(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value || descriptor.get;

        if (!originalMethod) {
            throw new Error('@cache can only be applied to methods or getters.');
        }

        const isGetter = !!descriptor.get;

        // Wrap the original function or getter
        if (isGetter) {
            descriptor.get = function (this: any) {
                if (key && this.caches[key]) {
                    console.log(`Cache hit for key: ${key}`);
                    return this.caches[key];
                }

                console.log(`Cache miss for key: ${key}`);
                const result = originalMethod.apply(this);

                // Cache the result
                if (key) {
                    this.caches[key] = result;
                }

                return result;
            };
        } else {
            descriptor.value = async function (this: any, ...args: any[]) {
                const cacheKey = (`${args[0]}${args[1]}`);

                if (this.caches[cacheKey]) {
                    console.log(`Cache hit for key: ${cacheKey}`);
                    return this.caches[cacheKey];
                }

                console.log(`Cache miss for key: ${cacheKey}`);
                const result = await originalMethod.apply(this, args);

                // Cache the result
                this.caches[cacheKey] = result;

                return result;
            };
        }
    };
}

export default class Converter<
    const Currencies extends readonly string[] = [],
    Values extends string = Extract<Currencies[keyof Currencies], string>
> {
    api = 'https://api.frankfurter.app'
    private caches: Record<string, number> = {}
    constructor(public currencies: Currencies) {
    }

    @cache()
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

    @cache('latests')
    get latest(): Promise<any> {
        return fetch(`${this.api}/latest`).then((x) => x.json())
    }
}

class MyCurrency<
    const Currencies extends readonly string[] = [],
    Values extends string = Extract<Currencies[keyof Currencies], string>
> extends Converter<Currencies, Values> {
    constructor(
        public currencies: Currencies,
        public api = 'https://api.frankfurter.app'
    ) {
        super(currencies);
    }
}
const myCurrency = new MyCurrency(['USD', 'JPY', 'THB'])