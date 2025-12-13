export function kalkulator(angka1, angka2, operator) {
    switch (operator) {
        case "+":
            return angka1 + angka2;
        case "-":
            return angka1 - angka2;
        case "*":
            return angka1 * angka2;
        case "/":
            if (angka2 === 0) return "Tidak bisa dibagi 0!";
            return angka1 / angka2;
        default:
            return "Operator tidak valid!";
    }
}
