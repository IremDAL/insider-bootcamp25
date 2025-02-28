let maxLength = 0;
let maxNumber = 0;

for (let i = 1; i < 1000000; i++) {
    let sayi = i;
    let length = 0;

    while (sayi !== 1) {
        if (sayi % 2 === 1) {
            sayi = 3 * sayi + 1;
        } else {
            sayi = sayi / 2;
        }
        length++;
    }

    if (length > maxLength) {
        maxLength = length;
        maxNumber = i;
    }
}

console.log("En uzun Collatz zincirine sahip sayı:", maxNumber);
