//for loop
// for (let i = 1; i <= 4; i++) {
//     console.log("*".repeat(i));
// }

const N = 4; 

for (let i = 1; i <= N; i++) {
    let pola = '';
    for (let j = 1; j <= i; j++) {
        pola += '*';
    }
    console.log(pola);
}