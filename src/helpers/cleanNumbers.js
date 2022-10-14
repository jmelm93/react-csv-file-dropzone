export default function cleanNumbers(x) {
    if (x.toString().length <= 5) {
        return x;
    }
    else {
        return '~' + x.toString().slice(0, -3) + 'k';
    }
}