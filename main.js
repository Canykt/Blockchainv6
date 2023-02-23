    const{Blockchain,Transaktionen} = require('./blockchain');
    const EC = require ('elliptic').ec;
    const ec = new EC('secp256k1');  //elleptische Kurve zur Kryptographischen Verschlüsselung
    const myKey = ec.keyFromPrivate('10124196ffb1333c0d6892332b7dcbc6b33b740640e84e7d7777491e563dcf7f');
    const myWalletAdress = myKey.getPublic('hex');


    let YakutCoin = new Blockchain();

    const tx1 = new Transaktionen(myWalletAdress, 'public key goes here', 8);
    
    tx1.TransaktionUnterzeichnen(myKey);
    YakutCoin.TransaktionHinzufuegen(tx1);

    console.log("Start mining");
    YakutCoin.minePendingTransaktionen(myWalletAdress);
    console.log("Balance of Tobi is", YakutCoin.getBalancevonAdresse(myWalletAdress));

    console.log("Is chain valid?", YakutCoin.istKetteValide());


    YakutCoin.kette[1].transaktionen[0].Menge = 1; //2 Blocker die erste Transaktion auf 0 ändern--> müsste jtzt false sein weil hashwerte nicht mehr passen!
    console.log("Is chain valid?", YakutCoin.istKetteValide());


    console.log("");
    console.log("");
    console.log("");
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    const tx2 = new Transaktionen(myWalletAdress, 'public key goes here', 12);
    
    tx1.TransaktionUnterzeichnen(myKey);
    YakutCoin.TransaktionHinzufuegen(tx1);

    console.log("Start mining");
    YakutCoin.minePendingTransaktionen(myWalletAdress);
    console.log("Balance of Can is", YakutCoin.getBalancevonAdresse(myWalletAdress));




    console.log("");
    console.log("");
    console.log("");

//aktuelle block ausgeben
console.log("", YakutCoin.getakuellenBlock());





   

