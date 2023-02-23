const EC = require ('elliptic').ec;
const ec = new EC('secp256k1');  //elleptische Kurve zur Kryptographischen Verschlüsselung

const key = ec.genKeyPair();
const oeffentlicherSchluessel = key.getPublic('hex');
const PrivaterSchluessel = key.getPrivate('hex');

console.log();
console.log('Privater Schluessel:', PrivaterSchluessel);

console.log();
console.log('Oeffentlicher Schluessel:', oeffentlicherSchluessel);