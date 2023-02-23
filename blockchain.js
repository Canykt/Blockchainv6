//Can Yakut
const SHA256 = require ('crypto-js/sha256');
const EC = require ('elliptic').ec;
const ec = new EC('secp256k1');  //elleptische Kurve zur Kryptographischen Verschlüsselung

class Transaktionen
{
    constructor(vonAdresse, zuAdresse, Menge)
    {
        this.vonAdresse = vonAdresse;
        this.zuAdresse = zuAdresse;
        this.Menge = Menge;
    }
   
    HashwertBerechnen()
    {
        return SHA256(this.vonAdresse + this.zuAdresse + this.Menge).toString();
    }

    TransaktionUnterzeichnen(SchluesselUnterzeichnen)
    {
        if(SchluesselUnterzeichnen.getPublic('hex') != this.vonAdresse)
        {
            throw new Error("Du kannst nicht Transaktionen für andere Wallets unterzeichnen")
        }
        const HashwertTx = this.HashwertBerechnen();
        const unt = SchluesselUnterzeichnen.sign(HashwertTx, 'base64');
        this.unterzeichner = unt.toDER('hex');
    }

    IstesValide()
    {
        if(this.vonAdresse == null) return true;

        if(!this.unterzeichner || this.unterzeichner.length == 0)
        {
            throw new Error('Keine Signatur in dieser Transaktion');
        }

        const oeffentlicherSchluessel = ec.keyFromPublic(this.vonAdresse, 'hex');
        return oeffentlicherSchluessel.verify(this.HashwertBerechnen(), this.unterzeichner);
    }
}

class Block
{
    constructor (Zeitstempel, transaktionen, vorherigerHash = '')
    {
        this.Zeitstempel = Zeitstempel;
        this.transaktionen = transaktionen;
        this.vorherigerHash = vorherigerHash;
        this.nonce = 0;
        this.hashwert = this.HashwertBerechnen();
       
    }

    HashwertBerechnen()
    {
        return SHA256(this.index + this.vorherigerHash + this.Zeitstempel + JSON.stringify(this.data) + this.nonce).toString();
    }

    BlockMinen(schwierigkeit) //schwierigkeit um einen Block zu besätigen/krieren
    {
        while(this.hashwert.substring(0, schwierigkeit) != Array(schwierigkeit + 1).join("0")) //sodass hash  mit nullen anfängt
        {
            this.nonce ++;
            this.hashwert = this.HashwertBerechnen();
        }

        console.log("Block wird gemind:" + this.hashwert);
    }

    HateineValideTransaktion()
    {   /////////////////////////////////////////////
        for(const TX of this.transaktionen)
        {
            if(!TX.IstesValide())
            {
                return false;
            }
        }
        return true;
    }
}

class Blockchain
    {
        constructor()
        { /////////////////////////////////////////////
            this.kette = [this.ErstenBlockGenerieren()];
            this.schwierigkeit = 6; //soviele Nullen am anfang hat der Hash dann
            this.wartendeTransaktion = [];
            this.GehaltfuersMinen = 100;
        }

        ErstenBlockGenerieren ()//erste Block
        { /////////////////////////////////////////////
            return new Block("01/01/2023", [], "0");
        }
        
        getakuellenBlock() //letzter BLock 
        { /////////////////////////////////////////////
            return this.kette[this.kette.length - 1];
        }

        minePendingTransaktionen(miningRewardAdress) //miner belohnen
        { /////////////////////////////////////////////
            const EntlohnungTx = new Transaktionen(null, miningRewardAdress, this.GehaltfuersMinen);
            this.wartendeTransaktion.push(EntlohnungTx);


            let block = new Block(Date.now(), this.wartendeTransaktion, this.getakuellenBlock().hashwert);
            block.BlockMinen(this.schwierigkeit);

            console.log("Block erfolgreich mined");
            this.kette.push(block);

            this.wartendeTransaktion = [];
        }

        TransaktionHinzufuegen(transaktion)
        { /////////////////////////////////////////////
            if(!transaktion.vonAdresse || !transaktion.zuAdresse)
            {
                throw new Error("Error");
            }
           
            if(!transaktion.IstesValide())
            {
                throw new Error("Kann nicht unehrliche Transaktionen zur Chain hinzufuegen");
            }
            this.wartendeTransaktion.push(transaktion);

        }


        getBalancevonAdresse(adress)
        { /////////////////////////////////////////////
            let ausgleich = 0;
            for(const block of this.kette)
            {
                for(const trans of block.transaktionen)
                {
                    if(trans.vonAdresse == adress)
                    {
                        ausgleich-= trans.Menge;
                    }

                    if(trans.zuAdresse == adress)
                    {
                        ausgleich +=trans.Menge;
                    }
                }
            }
            return ausgleich;
            
        }

        istKetteValide()
        { /////////////////////////////////////////////
            for(let i = 1; i < this.kette.length; i ++)
            {
                const aktuellerBock = this.kette[i];
                const vorherigerBlock = this.kette [i-1];


                if(!aktuellerBock.HateineValideTransaktion())
                {
                    return false;
                }

                if(aktuellerBock.hashwert !== aktuellerBock.HashwertBerechnen())
                {
                    return false;
                }

                if(aktuellerBock.vorherigerHash !== vorherigerBlock.HashwertBerechnen())
                {
                    return false;
                }
            
            }
            return true;
        }
    }

    module.exports.Blockchain = Blockchain;
    module.exports.Transaktionen = Transaktionen;