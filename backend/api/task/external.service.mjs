


export function execute(task) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (Math.random() > 0.5) resolve(parseInt(Math.random() * 100))
            // TODO: throw some more random errors
            else reject('High Temparture');
        }, 5000)
    })
}