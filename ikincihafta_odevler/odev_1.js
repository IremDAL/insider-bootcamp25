let name = prompt("Adınız nedir?");
let age = prompt("Yaşınız kaç?");
let job = prompt("Mesleğiniz nedir?");

let user = { name, age, job };
console.log("Kullanıcı Bilgileri:", user);

let cart = [];

function addProduct() {
    while (true) {
        let productName = prompt("Sepete eklemek istediğiniz ürünü yazın (Çıkmak için 'q' girin):");
        if (productName.toLowerCase() === 'q') break;

        let productPrice = parseFloat(prompt("Ürünün fiyatını girin:"));
        if (isNaN(productPrice) || productPrice <= 0) {
            console.log("Geçerli bir fiyat giriniz.");
            continue;
        }

        cart.push({ product: productName, price: productPrice });
        console.log(`${productName} sepete eklendi. Fiyatı: ${productPrice} TL`);
    }
}

function removeProduct() {
    while (true) {
        let productName = prompt("Sepetten çıkarmak istediğiniz ürünü yazın (Çıkmak için 'q' girin):");
        if (productName.toLowerCase() === 'q') break;

        let index = cart.findIndex(item => item.product.toLowerCase() === productName.toLowerCase());
        if (index !== -1) {
            cart.splice(index, 1);
            console.log(`${productName} sepetten çıkarıldı.`);
        } else {
            console.log("Ürün sepette bulunamadı.");
        }
    }
}

function showCart() {
    console.log("Sepetiniz:", cart);
    let totalPrice = cart.reduce((sum, item) => sum + item.price, 0);
    console.log("Toplam Fiyat:", totalPrice, "TL");
}
addProduct();
showCart();
removeProduct();
showCart();