const express = require("express");
const fs = require("fs");
const cors = require("cors");
const mysql = require('mysql2');

// Stvaranje veze na mysql
const db = mysql.createConnection({
    host: 'ucka.veleri.hr',
    user: 'fzuzic',
    password: '11',
    database: 'fzuzic'
});

// Povezivanje na bazu podataka
db.connect((err) => {

    if (err) {
        console.log("Greška prilikom povezivanja na bazu!");
        return;
    }

    console.log("Uspješno spajanje s bazom");
});

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors()); //cors je način da server dozvoli pristup svojim resursima iz različitih domena

/*
▀███▀▀▀██▄   ███▀▀▀███ ▀████▀     ███▀▀▀████ ██▀▀██▀▀███ ███▀▀▀███ 
  ██    ▀██▄  ██    ▀█   ██        ██    ▀██ ▀   ██   ▀█  ██    ▀█ 
  ██     ▀██  ██   █     ██        ██   █        ██       ██   █   
  ██      ██  ██████     ██        ██████        ██       ██████   
  ██     ▄██  ██   █  ▄  ██     ▄  ██   █  ▄     ██       ██   █  ▄
  ██    ▄██▀  ██     ▄█  ██    ▄█  ██     ▄█     ██       ██     ▄█
▄████████▀   ██████████ █████████ ██████████   ▄████▄    ██████████
*/

// brisanje prehrambenih intolerancija

app.delete("/pi/:id", (req, res) => { 

    // povlaci query ako je unesen ( /pi/2 )
    const {id} = req.params;

    // stvara sql query, upitnik se zamjenje sa podacima iz varijable (2 reda ispod unutar uglatih zagrada)
    const sqlQuery = `DELETE FROM Prehrambena_intolerancija WHERE ID_pi=?;`;


    // salje query, zamjenjuje upitnik sa podacima
    db.query(sqlQuery, [id], (err, result) => {

        if (err) {
            console.error('Greška pri dohvatu podataka:', err);
            return res.status(500).send("Greška na serveru");
        }

        // provjera je li nesto obrisano (npr. ako ID ne postoji)
        if (result.affectedRows === 0) {
            return res.status(404).send("Intolerancija s tim ID-em nije pronađena");
        }
        

        res.json({ message: `Intolerancija ID ${id} uspješno obrisana.` });
    })

})


// brisanje stavki u jelovniku

app.delete("/jelovnici/:id", (req, res) => { 

    // povlaci query ako je unesen ( /jelovnici/2 )
    const {id} = req.params;

    // stvara sql query, upitnik se zamjenje sa podacima iz varijable (2 reda ispod unutar uglatih zagrada)
    const sqlQuery = `DELETE FROM Stavka_jelovnika WHERE ID_stavke=?;`;


    // salje query, zamjenjuje upitnik sa podacima
    db.query(sqlQuery, [id], (err, result) => {

        if (err) {
            console.error('Greška pri dohvatu podataka:', err);
            return res.status(500).send("Greška na serveru");
        }

        // provjera je li nesto obrisano (npr. ako ID ne postoji)
        if (result.affectedRows === 0) {
            return res.status(404).send("Stavka u jelovniku s tim ID-em nije pronađena");
        }
        

        res.json({ message: `Stavka u jelovniku ID ${id} uspješno obrisana.` });
    })

})


// brisanje objekata

app.delete("/objekti/:id", (req, res) => { 

    // povlaci query ako je unesen ( /objekti/2 )
    const {id} = req.params;

    // stvara sql query, upitnik se zamjenje sa podacima iz varijable (2 reda ispod unutar uglatih zagrada)
    const sqlQuery = `DELETE FROM Poslovni_objekt WHERE ID_objekta=?;`;


    // salje query, zamjenjuje upitnik sa podacima
    db.query(sqlQuery, [id], (err, result) => {

        if (err) {
            console.error('Greška pri dohvatu podataka:', err);
            return res.status(500).send("Greška na serveru");
        }

        // provjera je li nesto obrisano (npr. ako ID ne postoji)
        if (result.affectedRows === 0) {
            return res.status(404).send("Objekt s tim ID-em nije pronađen");
        }
        

        res.json({ message: `Objekt ID ${id} uspješno obrisan.` });
    })

})


// brisanje vlasnika

app.delete("/vlasnik/:id", (req, res) => { 

    // povlaci query ako je unesen ( /vlasnik/2 )
    const {id} = req.params;

    // stvara sql query, upitnik se zamjenje sa podacima iz varijable (2 reda ispod unutar uglatih zagrada)
    const sqlQuery = `DELETE FROM Vlasnik_objekta WHERE ID_vlasnika=?;`;


    // salje query, zamjenjuje upitnik sa podacima
    db.query(sqlQuery, [id], (err, result) => {

        if (err) {
            console.error('Greška pri dohvatu podataka:', err);
            return res.status(500).send("Greška na serveru");
        }

        // provjera je li nesto obrisano (npr. ako ID ne postoji)
        if (result.affectedRows === 0) {
            return res.status(404).send("Vlasnik s tim ID-em nije pronađen");
        }
        

        res.json({ message: `Vlasnik ID ${id} uspješno obrisan.` });
    })

})


// brisanje gradova

app.delete("/gradovi/:id", (req, res) => { 

    // povlaci query ako je unesen ( /gradovi/2 )
    const {id} = req.params;

    // stvara sql query, upitnik se zamjenje sa podacima iz varijable (2 reda ispod unutar uglatih zagrada)
    const sqlQuery = `DELETE FROM Grad WHERE Postanski_broj=?;`;


    // salje query, zamjenjuje upitnik sa podacima
    db.query(sqlQuery, [id], (err, result) => {

        if (err) {
            console.error('Greška pri dohvatu podataka:', err);
            return res.status(500).send("Greška na serveru");
        }

        // provjera je li nesto obrisano (npr. ako ID ne postoji)
        if (result.affectedRows === 0) {
            return res.status(404).send("Grad s tim ID-em nije pronađen");
        }
        

        res.json({ message: `Grad ID ${id} uspješno obrisan.` });
    })

})


// brisanje komentara

app.delete("/komentari/:id", (req, res) => { 

    // povlaci query ako je unesen ( /komentari/2 )
    const {id} = req.params;

    // stvara sql query, upitnik se zamjenje sa podacima iz varijable (2 reda ispod unutar uglatih zagrada)
    const sqlQuery = `DELETE FROM Komentar WHERE ID_komentara=?;`;


    // salje query, zamjenjuje upitnik sa podacima
    db.query(sqlQuery, [id], (err, result) => {

        if (err) {
            console.error('Greška pri dohvatu podataka:', err);
            return res.status(500).send("Greška na serveru");
        }

        // provjera je li nesto obrisano (npr. ako ID ne postoji)
        if (result.affectedRows === 0) {
            return res.status(404).send("Komentar s tim ID-em nije pronađen");
        }
        

        res.json({ message: `Komentar ID ${id} uspješno obrisan.` });
    })

})


// brisanje korisnika

app.delete("/korisnik/:id", (req, res) => { 

    // povlaci query ako je unesen ( /korisnik/2 )
    const {id} = req.params;

    // stvara sql query, upitnik se zamjenje sa podacima iz varijable (2 reda ispod unutar uglatih zagrada)
    const sqlQuery = `DELETE FROM Korisnik WHERE ID_korisnika=?;`;


    // salje query, zamjenjuje upitnik sa podacima
    db.query(sqlQuery, [id], (err, result) => {

        if (err) {
            console.error('Greška pri dohvatu podataka:', err);
            return res.status(500).send("Greška na serveru");
        }

        // Provjera je li nešto uopće obrisano (npr. ako ID ne postoji)
        if (result.affectedRows === 0) {
            return res.status(404).send("Korisnik s tim ID-em nije pronađen");
        }
        

        res.json({ message: `Korisnik ID ${id} uspješno obrisan.` });
    })

})


/*
▀███▀   ▀███▀ ▀███▀▀▀██▄ ▀███▀▀▀██▄        ██     ███▀▀██▀▀███ ███▀▀▀███ 
 ██       █     ██   ▀██▄  ██    ▀██▄     ▄██▄    █▀   ██   ▀█  ██    ▀█ 
 ██       █     ██   ▄██   ██     ▀██    ▄█▀██▄        ██       ██   █   
 ██       █     ███████    ██      ██   ▄█  ▀██        ██       ██████   
 ██       █     ██         ██     ▄██   ████████       ██       ██   █  ▄
 ██▄     ▄█     ██         ██    ▄██▀  █▀      ██      ██       ██     ▄█
  ▀██████▀▀   ▄████▄     ▄████████▀  ▄███▄   ▄████▄  ▄████▄    ██████████
*/


// brisanje prehrambenih intolerancija

app.delete("/pi/:id", (req, res) => { 

    const { id } = req.params;
    const { Naziv_pi } = req.body;

    const sqlQuery = `
        UPDATE Prehrambena_intolerancija
        SET Naziv_pi = ?
        WHERE ID_pi = ?
    `;

    db.query(sqlQuery, [Naziv_pi, id], (err, result) => {
        if (err) {
            console.error("Greška pri ažuriranju intolerancije:", err);
            return res.status(500).send("Greška na serveru");
        }

        if (result.affectedRows === 0) {
            return res.status(404).send("Intolerancija nije pronađen");
        }

        res.send("Intolerancija uspješno ažuriran");
        
    });

})


// ažuriranje stavki u jelovniku

app.put("/jelovnici/:id", (req, res) => { 

    const { id } = req.params;
    const { Naziv_stavke, Cijena_stavke, Sastav_stavke, Intolerancije } = req.body;

    const sqlQuery = `
        UPDATE Stavka_jelovnika
        SET Naziv_stavke = ?, Cijena_stavke = ?, Sastav_stavke = ?
        WHERE ID_stavke = ?
    `;

    db.query(sqlQuery, [Naziv_stavke, Cijena_stavke, Sastav_stavke, id], (err, result) => {
        if (err) {
            console.error("Greška pri ažuriranju stavke:", err);
            return res.status(500).send("Greška na serveru");
        }

        if (result.affectedRows === 0) {
            return res.status(404).send("Stavka nije pronađena");
        }

        // Ako imamo nove intolerancije, prvo ih izbrišemo i dodamo nove
        if (Array.isArray(Intolerancije)) {
            // Prvo izbriši stare veze
            const deleteQuery = `DELETE FROM PI_u_stavci_jelovnika WHERE ID_stavke = ?`;
            db.query(deleteQuery, [id], (delErr) => {
                if (delErr) {
                    console.error("Greška pri brisanju starih veza:", delErr);
                    return res.status(500).send("Greška pri brisanju veza");
                }

                // Dodaj nove veze (ako ih ima)
                if (Intolerancije.length > 0) {
                    const insertQuery = `
                        INSERT INTO PI_u_stavci_jelovnika (ID_stavke, ID_pi)
                        VALUES ?
                    `;
                    const values = Intolerancije.map(pid => [id, pid]);
                    db.query(insertQuery, [values], (insErr) => {
                        if (insErr) {
                            console.error("Greška pri dodavanju novih veza:", insErr);
                            return res.status(500).send("Greška pri dodavanju veza");
                        }

                        res.send("Stavka i intolerancije uspješno ažurirane");
                    });
                } else {
                    res.send("Stavka ažurirana (bez novih intolerancija)");
                }
            });
        } else {
            res.send("Stavka uspješno ažurirana");
        }
    });
})


// ažuriranje objekata

app.put("/objekti/:id", (req, res) => { 

    const { id } = req.params;
    const { Ime_objekta, Adresa_objekta, Opis_objekta, Postanski_broj, Tip_objekta } = req.body;

    const sqlQuery = `
        UPDATE Poslovni_objekti
        SET Ime_objekta = ?, Adresa_objekta = ?, Opis_objekta = ?, Postanski_broj = ?, Tip_objekta = ?
        WHERE ID_objekta = ?
    `;

    db.query(sqlQuery, [Ime_objekta, Adresa_objekta, Opis_objekta, Postanski_broj, Tip_objekta, id], (err, result) => {
        if (err) {
            console.error("Greška pri ažuriranju poslovnog objekta:", err);
            return res.status(500).send("Greška na serveru");
        }

        if (result.affectedRows === 0) {
            return res.status(404).send("Poslovni objekt nije pronađen");
        }
        
        res.send("Poslovni objekt uspješno ažuriran");
        
    });

})


// ažuriranje vlasnika

app.put("/vlasnik/:id", (req, res) => { 

    const { id } = req.params;
    const { Ime_vlasnika, Lozinka_vlasnika, Prezime_vlasnika, Email_objekta, OIB_objekta, Korisnicko_ime_vlasnika } = req.body;

    const sqlQuery = `
        UPDATE Vlasnik_objekta
        SET Ime_vlasnika = ?, Lozinka_vlasnika = ?, Prezime_vlasnika = ?, Email_objekta = ?, OIB_objekta = ?, Korisnicko_ime_vlasnika = ?
        WHERE ID_vlasnika = ?
    `;

    db.query(sqlQuery, [Ime_vlasnika, Lozinka_vlasnika, Prezime_vlasnika, Email_objekta, OIB_objekta, Korisnicko_ime_vlasnika, id], (err, result) => {
        if (err) {
            console.error("Greška pri ažuriranju vlasnika:", err);
            return res.status(500).send("Greška na serveru");
        }

        if (result.affectedRows === 0) {
            return res.status(404).send("Vlasnik nije pronađen");
        }
        
        res.send("Vlasnik uspješno ažuriran");
        
    });

})


// ažuriranje gradova

app.put("/gradovi/:id", (req, res) => { 

    const { id } = req.params;
    const { Naziv_grada } = req.body;

    const sqlQuery = `
        UPDATE Grad
        SET Naziv_grada = ?
        WHERE Postanski_broj = ?
    `;

    db.query(sqlQuery, [Naziv_grada, id], (err, result) => {
        if (err) {
            console.error("Greška pri ažuriranju grada:", err);
            return res.status(500).send("Greška na serveru");
        }

        if (result.affectedRows === 0) {
            return res.status(404).send("Grad nije pronađen");
        }

        res.send("Grad uspješno ažuriran");
        
    });

})


// ažuriranje komentara

app.put("/komentari/:id", (req, res) => { 

    const { id } = req.params;
    const { Sadrzaj_komentara, Ocjena } = req.body;

    const sqlQuery = `
        UPDATE Komentar
        SET Sadrzaj_komentara = ?, Ocjena = ?
        WHERE ID_komentara = ?
    `;

    db.query(sqlQuery, [Sadrzaj_komentara, Ocjena, id], (err, result) => {
        if (err) {
            console.error("Greška pri ažuriranju komentara:", err);
            return res.status(500).send("Greška na serveru");
        }

        if (result.affectedRows === 0) {
            return res.status(404).send("Komentar nije pronađen");
        }
        
        res.send("Komentar uspješno ažuriran");
        
    });

})


// ažuriranje korisnika

app.put("/korisnik/:id", (req, res) => { 

    const { id } = req.params;
    const { Korisnicko_ime, Lozinka_korisnika, Ime_korisnika, Prezime_korisnika, Email_korisnika, Intolerancije } = req.body;

    const sqlQuery = `
        UPDATE Korisnik
        SET Korisnicko_ime = ?, Lozinka_korisnika = ?, Ime_korisnika = ?, Prezime_korisnika = ?, Email_korisnika = ?
        WHERE ID_korisnika = ?
    `;

    db.query(sqlQuery, [Korisnicko_ime, Lozinka_korisnika, Ime_korisnika, Prezime_korisnika, Email_korisnika, id], (err, result) => {
        if (err) {
            console.error("Greška pri ažuriranju korisnika:", err);
            return res.status(500).send("Greška na serveru");
        }

        if (result.affectedRows === 0) {
            return res.status(404).send("Korisnik nije pronađen");
        }

        // Ako imamo nove intolerancije, prvo ih izbrišemo i dodamo nove
        if (Array.isArray(Intolerancije)) {
            // Prvo izbriši stare veze
            const deleteQuery = `DELETE FROM PI_korinsika WHERE ID_korisnika = ?`;
            db.query(deleteQuery, [id], (delErr) => {
                if (delErr) {
                    console.error("Greška pri brisanju starih veza:", delErr);
                    return res.status(500).send("Greška pri brisanju veza");
                }

                // Dodaj nove veze (ako ih ima)
                if (Intolerancije.length > 0) {
                    const insertQuery = `
                        INSERT INTO PI_korinsika (ID_pi, ID_korisnika)
                        VALUES ?
                    `;
                    const values = Intolerancije.map(pid => [pid, id]);
                    db.query(insertQuery, [values], (insErr) => {
                        if (insErr) {
                            console.error("Greška pri dodavanju novih veza:", insErr);
                            return res.status(500).send("Greška pri dodavanju veza");
                        }

                        res.send("Korisnik i intolerancije uspješno ažurirane");
                    });
                } else {
                    res.send("Korisnik ažuriran (bez novih intolerancija)");
                }
            });
        } else {
            res.send("Korisnik uspješno ažuriran");
        }
    });
})


/*                                                      
▀████▀  ███▄   ▀███▀ ▄█▀▀▀█▄█ ███▀▀▀███ ▀███▀▀▀██▄  ███▀▀██▀▀███
  ██     ███▄    █  ▄██    ▀█  ██    ▀█   ██   ▀██▄ █▀   ██   ▀█
  ██     █ ███   █  ▀███▄      ██   █     ██   ▄██       ██     
  ██     █  ▀██▄ █    ▀█████▄  ██████     ███████        ██     
  ██     █   ▀██▄█  ▄     ▀██  ██   █  ▄  ██  ██▄        ██     
  ██     █     ███  ██     ██  ██     ▄█  ██   ▀██▄      ██     
▄████▄ ▄███▄    ██  █▀█████▀  ██████████ ████▄ ▄███▄   ▄████▄   
*/

// unos prehrambenih intolerancija

app.post("/pi", (req, res) => { 

    // povlaci json koji salje aplikacija
    const unos=req.body;

    // provjerava ako su uneseni podaci u jsonu
    if (!unos.Naziv_pi || !unos.ID_admin) {
        return res.status(400).send("Missing required fields.");
    }

    console.log(req.body);

    // stvara sql query, upitnici se zamjenjuju sa podacima iz varijable (2 reda ispod unutar uglatih zagrada)
    const sqlQuery = 'INSERT INTO Prehrambena_intolerancija VALUES (NULL, ?, ?)';

    // salje query, zamjenjuje upitnike sa podacima
    db.query(sqlQuery, [unos.Naziv_pi, unos.ID_admin], (err, result) => {
        if (err) {
            console.error('Greška pri dohvatu podataka:', err);
            return res.status(500).send("Greška na serveru");
        }

        // vraca rezultat ako je uspjesno upisano
        res.json(result);
    })

})


// unos stavke u jelovniku

app.post("/jelovnici", (req, res) => { 

    // povlaci json koji salje aplikacija i odvaja ga u zasebne varijable
    const {
        Naziv_stavke,
        Cijena_stavke,
        ID_vlasnika,
        ID_objekta,
        Sastav_stavke,
        Intolerancije
    } = req.body;


    // provjerava ako su uneseni potrebni podaci u jsonu

    if (!Naziv_stavke || !Cijena_stavke || !ID_vlasnika || !ID_objekta) {
        return res.status(400).json({ message: "Missing required fields." });
    }

    // stvara sql query, upitnici se zamjenjuju sa podacima iz varijable (2 reda ispod unutar uglatih zagrada)
    const sqlInsertStavka = `
        INSERT INTO Stavka_jelovnika 
        (Naziv_stavke, Cijena_stavke, ID_vlasnika, ID_objekta, Sastav_stavke)
        VALUES (?, ?, ?, ?, ?)
    `;

    // salje query, zamjenjuje upitnike sa podacima
    db.query(sqlInsertStavka, [Naziv_stavke, Cijena_stavke, ID_vlasnika, ID_objekta, Sastav_stavke], (err, result) => {
        if (err) {
            console.error("Insert error (menu item):", err);
            return res.status(500).json({ message: "Error inserting menu item." });
        }

        // povlaci id zadnje unesene stavke
        const insertStavkaID = result.insertId;

        // provjerava ako su unesene intolerancije, ako nisu vraca da nema intolerancija
        if (!Intolerancije || Intolerancije.length === 0) {
            return res.json({ message: "Stavka u jelovniku uspješno unesena (nema intolerancija)." });
        }

        // priprema grupni insert
        const intolerancijeZaUnos = Intolerancije.map(id_pi => [insertStavkaID, id_pi]);

        // stavara sql query
        const sqlInsertIntolerancije = `
            INSERT INTO PI_u_stavci_jelovnika (ID_stavke, ID_pi)
            VALUES ?
        `;

        // salje query sa svim intolerancijama (npr. id stavke je 2 pa ce bit VALUES (2, 1), (2, 2)...)
        db.query(sqlInsertIntolerancije, [intolerancijeZaUnos], (err2, result2) => {
            if (err2) {
                console.error("Insert error (intolerances):", err2);
                return res.status(500).json({ message: "Error inserting intolerances." });
            }

            res.json({ message: "Stavka u jelovniku i intolerancije uspješno unesene." });
        });
    });

})


// unos poslovnog objekta

app.post("/objekti", (req, res) => { 

    // povlaci json koji salje aplikacija
    const unos=req.body;

    // provjerava ako su uneseni podaci u jsonu
    if (!unos.Ime_objekta || !unos.Adresa_objekta || !unos.Opis_objekta || !unos.ID_admina || !unos.ID_vlasnika || !unos.Postanski_broj || !unos.Tip_objekta || !unos.Email_objekta || !unos.OIB_objekta) {
        return res.status(400).send("Missing required fields.");
    }

    console.log(req.body);

    // stvara sql query, upitnici se zamjenjuju sa podacima iz varijable (2 reda ispod unutar uglatih zagrada)
    const sqlQuery = 'INSERT INTO Poslovni_objekt VALUES (NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

    // salje query, zamjenjuje upitnike sa podacima
    db.query(sqlQuery, [unos.Ime_objekta, unos.Adresa_objekta, unos.Opis_objekta, unos.ID_admina, unos.ID_vlasnika, unos.Postanski_broj, unos.Tip_objekta, unos.Email_objekta, unos.OIB_objekta], (err, result) => {
        if (err) {
            console.error('Greška pri dohvatu podataka:', err);
            return res.status(500).send("Greška na serveru");
        }

        // vraca rezultat ako je uspjesno upisano
        res.json(result);
    })

})


// unos vlasnika poslovnog objekta

app.post("/vlasnik", (req, res) => { 

    // povlaci json koji salje aplikacija
    const unos=req.body;

    // provjerava ako su uneseni podaci u jsonu
    if (!unos.Ime_vlasnika || !unos.Lozinka_vlasnika || !unos.Prezime_vlasnika || !unos.Email_vlasnika) {
        return res.status(400).send("Missing required fields.");
    }

    console.log(req.body);

    // stvara sql query, upitnici se zamjenjuju sa podacima iz varijable (2 reda ispod unutar uglatih zagrada)
    const sqlQuery = 'INSERT INTO Vlasnik_objekta VALUES (NULL, ?, ?, ?, ?)';

    // salje query, zamjenjuje upitnike sa podacima
    db.query(sqlQuery, [unos.Ime_vlasnika, unos.Lozinka_vlasnika, unos.Prezime_vlasnika, unos.Email_vlasnika], (err, result) => {
        if (err) {
            console.error('Greška pri dohvatu podataka:', err);
            return res.status(500).send("Greška na serveru");
        }

        // vraca rezultat ako je uspjesno upisano
        res.json(result);
    })

})


// unos gradova

app.post("/gradovi", (req, res) => { 

    // povlaci json koji salje aplikacija
    const unos=req.body;

    // provjerava ako su uneseni podaci u jsonu
    if (!unos.Postanski_broj || !unos.Naziv_grada) {
        return res.status(400).send("Missing required fields.");
    }

    console.log(req.body);

    // stvara sql query, upitnici se zamjenjuju sa podacima iz varijable (2 reda ispod unutar uglatih zagrada)
    const sqlQuery = 'INSERT INTO Grad VALUES (NULL, ?, ?)';

    // salje query, zamjenjuje upitnike sa podacima
    db.query(sqlQuery, [unos.Postanski_broj, unos.Naziv_grada], (err, result) => {
        if (err) {
            console.error('Greška pri dohvatu podataka:', err);
            return res.status(500).send("Greška na serveru");
        }

        // vraca rezultat ako je uspjesno upisano
        res.json(result);
    })

})


// unos komentara

app.post("/komentari", (req, res) => { 

    // povlaci json koji salje aplikacija
    const unos=req.body;

    // provjerava ako su uneseni podaci u jsonu
    if (!unos.Sadrzaj_komentara || !unos.ID_korisnika || !unos.ID_objekta || !unos.Ocjena) {
        return res.status(400).send("Missing required fields.");
    }

    console.log(req.body);

    // stvara sql query, upitnici se zamjenjuju sa podacima iz varijable (2 reda ispod unutar uglatih zagrada)
    const sqlQuery = 'INSERT INTO Komentar VALUES (NULL, ?, ?, ?, ?)';

    // salje query, zamjenjuje upitnike sa podacima
    db.query(sqlQuery, [unos.Sadrzaj_komentara, unos.ID_korisnika, unos.ID_objekta, unos.Ocjena], (err, result) => {
        if (err) {
            console.error('Greška pri dohvatu podataka:', err);
            return res.status(500).send("Greška na serveru");
        }

        // vraca rezultat ako je uspjesno upisano
        res.json(result);
    })

})


// unos korisnika

app.post("/korisnik", (req, res) => { 

    // povlaci json koji salje aplikacija i odvaja ga u zasebne varijable
    const {
        Korisnicko_ime,
        Lozinka_korisnika,
        Ime_korisnika,
        Prezime_korisnika,
        Email_korisnika,
        Intolerancije
    } = req.body;


    // provjerava ako su uneseni potrebni podaci u jsonu

    if (!Korisnicko_ime || !Lozinka_korisnika || !Ime_korisnika || !Prezime_korisnika || !Email_korisnika) {
        return res.status(400).json({ message: "Missing required fields." });
    }

    // stvara sql query, upitnici se zamjenjuju sa podacima iz varijable (2 reda ispod unutar uglatih zagrada)
    const sqlInsertStavka = `
        INSERT INTO Korisnik 
        (Korisnicko_ime, Lozinka_korisnika, Ime_korisnika, Prezime_korisnika, Email_korisnika)
        VALUES (?, ?, ?, ?, ?)
    `;

    // salje query, zamjenjuje upitnike sa podacima
    db.query(sqlInsertStavka, [Korisnicko_ime, Lozinka_korisnika, Ime_korisnika, Prezime_korisnika, Email_korisnika], (err, result) => {
        if (err) {
            console.error("Insert error (menu item):", err);
            return res.status(500).json({ message: "Error inserting menu item." });
        }

        // povlaci id zadnje unesene stavke
        const insertKorisnikID = result.insertId;

        // provjerava ako su unesene intolerancije, ako nisu vraca da nema intolerancija
        if (!Intolerancije || Intolerancije.length === 0) {
            return res.json({ message: "Korisnik uspješno unesen (nema intolerancija)." });
        }

        // priprema grupni insert
        const intolerancijeZaUnos = Intolerancije.map(id_pi => [insertKorisnikID, id_pi]);

        // stavara sql query
        const sqlInsertIntolerancije = `
            INSERT INTO PI_korisnika (ID_korisnika, ID_pi)
            VALUES ?
        `;

        // salje query sa svim intolerancijama (npr. id stavke je 2 pa ce bit VALUES (2, 1), (2, 2)...)
        db.query(sqlInsertIntolerancije, [intolerancijeZaUnos], (err2, result2) => {
            if (err2) {
                console.error("Insert error (intolerances):", err2);
                return res.status(500).json({ message: "Error inserting intolerances." });
            }

            res.json({ message: "Korisnik i njegove intolerancije uspješno unesene" });
        });
    });

})

/*
 ▄█▀▀▀█▄█ ███▀▀▀███ ▀████▀     ███▀▀▀███    ▄▄█▀▀▀█▄  ███▀▀██▀▀███
▄██    ▀█  ██    ▀█   ██        ██    ▀█  ▄██▀     ▀█ █▀   ██   ▀█
▀███▄      ██   █     ██        ██   █    ██▀       ▀      ██     
  ▀█████▄  ██████     ██        ██████    ██               ██     
▄     ▀██  ██   █  ▄  ██     ▄  ██   █  ▄ ▀█▄              ██     
██     ██  ██     ▄█  ██    ▄█  ██     ▄█  ██▄     ▄▀      ██     
█▀█████▀  ██████████ █████████ ██████████   ▀▀█████▀     ▄████▄   
*/

// ispis jelovnika po restoranima

app.get("/jelovnici", (req, res) => {

    // povlaci query ako je unesen ( /jelovnici?id=2 )
    const {id} = req.query; // id restorana

    console.log(Number(id));

    // stvara sql query, upitnici se zamjenjuju sa podacima iz varijable (2 reda ispod unutar uglatih zagrada)
    const sqlQuery = 'SELECT Naziv_stavke, Cijena_stavke, Sastav_stavke FROM Stavka_jelovnika WHERE ID_objekta = ?;';

    // salje query, zamjenjuje upitnike sa podacima
    db.query(sqlQuery, [Number(id)], (err, result) => {
        if (err) {
            console.error('Greška pri dohvatu podataka:', err);
            return res.status(500).send("Greška na serveru");
        }

        res.json(result);
    })

})


// ispis stavke u jelovniku

app.get("/jelovnici/:id", (req, res) => { 

    // povlaci query ako je unesen ( /jelovnici/2 )
    const {id} = req.params;

    console.log(id);

    // stvara sql query, upitnik se zamjenje sa podacima iz varijable (2 reda ispod unutar uglatih zagrada)
    const sqlQuery = `SELECT Naziv_stavke, Cijena_stavke, Sastav_stavke, ID_pi
                    FROM Stavka_jelovnika
                    JOIN PI_u_stavci_jelovnika ON Stavka_jelovnika.ID_stavke = PI_u_stavci_jelovnika.ID_stavke
                    WHERE Stavka_jelovnika.ID_stavke = ?;`;

    // salje query, zamjenjuje upitnik sa podacima
    db.query(sqlQuery, [id], (err, result) => {

        if (err) {
            console.error('Greška pri dohvatu podataka:', err);
            return res.status(500).send("Greška na serveru");
        }

        const jelo = {
            Naziv_stavke: result[0].Naziv_stavke,
            Cijena_stavke: result[0].Cijena_stavke,
            Sastav_stavke: result[0].Sastav_stavke,
            Intolerancije: result.map(row => row.ID_pi)
        };

        res.json(jelo);
    })

})


// ispis prehrambenih intolerancija

app.get("/pi", (req, res) => { 

    // povlaci query ako je unesen ( /pi?id=2 )
    const {id} = req.query;

    console.log(id);

    // provjerava ukoliko je unesen req.query
    // ako nije sql query nema WHERE
    if (isNaN(id)){
        const sqlQuery = 'SELECT * FROM Prehrambena_intolerancija;';

        db.query(sqlQuery, (err, result) => {
            if (err) {
                console.error('Greška pri dohvatu podataka:', err);
                return res.status(500).send("Greška na serveru");
            }
    
            res.json(result);
        })
    }
    // ako je sql query ima WHERE
    else {
        // stvara sql query, upitnici se zamjenjuju sa podacima iz varijable (2 reda ispod unutar uglatih zagrada)
        const sqlQuery = 'SELECT * FROM Prehrambena_intolerancija WHERE ID_admina = ?;';

        db.query(sqlQuery, [Number(id)], (err, result) => {
            if (err) {
                console.error('Greška pri dohvatu podataka:', err);
                return res.status(500).send("Greška na serveru");
            }
    
            res.json(result);
        })
    }   

})


// ispis admina

app.get("/admin", (req, res) => { 

    // povlaci query ako je unesen ( /admin?id=2 )
    const {id} = req.query;

    console.log(id);

    // provjerava ukoliko je unesen req.query
    // ako nije sql query nema WHERE
    if (isNaN(id)){
        const sqlQuery = 'SELECT * FROM Administrator;';

        db.query(sqlQuery, (err, result) => {
            if (err) {
                console.error('Greška pri dohvatu podataka:', err);
                return res.status(500).send("Greška na serveru");
            }
    
            res.json(result);
        })
    }
    // ako je sql query ima WHERE
    else {
        // stvara sql query, upitnici se zamjenjuju sa podacima iz varijable (2 reda ispod unutar uglatih zagrada)
        const sqlQuery = 'SELECT * FROM Administrator WHERE ID_admina = ?;';

        db.query(sqlQuery, [Number(id)], (err, result) => {
            if (err) {
                console.error('Greška pri dohvatu podataka:', err);
                return res.status(500).send("Greška na serveru");
            }
    
            res.json(result);
        })
    }   

})


// ispis objekata

app.get("/objekti", (req, res) => { 

    // povlaci query ako je unesen ( /objekti?vlasnikID=2&objektID=2 )
    const {vlasnikID, objektID} = req.query;

    console.log(vlasnikID, objektID);

    // provjerava ukoliko je unesen req.query
    // ako nije sql query nema WHERE
    if (isNaN(vlasnikID) && isNaN(objektID)){
        const sqlQuery = 'SELECT * FROM Poslovni_objekt;';

        db.query(sqlQuery, (err, result) => {
            if (err) {
                console.error('Greška pri dohvatu podataka:', err);
                return res.status(500).send("Greška na serveru");
            }
    
            res.json(result);
        })
    }
    // ako je unesen samo vlasnikID sql query ima WHERE ID_vlasnika = ?
    else if (isNaN(objektID)) {
        // stvara sql query, upitnici se zamjenjuju sa podacima iz varijable (2 reda ispod unutar uglatih zagrada)
        const sqlQuery = 'SELECT * FROM Poslovni_objekt WHERE ID_vlasnika = ?;';

        db.query(sqlQuery, [Number(vlasnikID)], (err, result) => {
            if (err) {
                console.error('Greška pri dohvatu podataka:', err);
                return res.status(500).send("Greška na serveru");
            }
    
            res.json(result);
        })
    }
    // ako je unesen samo objektID sql query ima WHERE ID_objekta = ?
    else if (isNaN(vlasnikID)) {
        // stvara sql query, upitnici se zamjenjuju sa podacima iz varijable (2 reda ispod unutar uglatih zagrada)
        const sqlQuery = 'SELECT * FROM Poslovni_objekt WHERE ID_objekta = ?;';

        db.query(sqlQuery, [Number(objektID)], (err, result) => {
            if (err) {
                console.error('Greška pri dohvatu podataka:', err);
                return res.status(500).send("Greška na serveru");
            }
    
            res.json(result);
        })
    }

})


// ispis vlasnika objekta

app.get("/vlasnik", (req, res) => { 

    // povlaci query ako je unesen ( /vlasnik?id=2 )
    const {id} = req.query;

    console.log(id);

    // provjerava ukoliko je unesen req.query
    // ako nije sql query nema WHERE
    if (isNaN(id)){
        const sqlQuery = 'SELECT * FROM Vlasnik_objekta;';

        db.query(sqlQuery, (err, result) => {
            if (err) {
                console.error('Greška pri dohvatu podataka:', err);
                return res.status(500).send("Greška na serveru");
            }
    
            res.json(result);
        })
    }
    // ako je sql query ima WHERE
    else {
        // stvara sql query, upitnici se zamjenjuju sa podacima iz varijable (2 reda ispod unutar uglatih zagrada)
        const sqlQuery = 'SELECT * FROM Vlasnik_objekta WHERE ID_vlasnika = ?;';

        db.query(sqlQuery, [Number(id)], (err, result) => {
            if (err) {
                console.error('Greška pri dohvatu podataka:', err);
                return res.status(500).send("Greška na serveru");
            }
    
            res.json(result);
        })
    }

})


// ispis gradova

app.get("/gradovi", (req, res) => { 

    // stvara sql query
    const sqlQuery = 'SELECT * FROM Grad;';

    // sql query se salje
    db.query(sqlQuery, (err, result) => {
        if (err) {
            console.error('Greška pri dohvatu podataka:', err);
            return res.status(500).send("Greška na serveru");
        }
    
        res.json(result);
    })
    

})


// ispis komentara

app.get("/komentari", (req, res) => { 

    // povlaci query ako je unesen ( /komentari?korisnikID=2&objektID=2 )
    const {korisnikID, objektID} = req.query;

    console.log(korisnikID, objektID);

    // provjerava ukoliko je unesen req.query
    // ako nije sql query nema WHERE
    if (isNaN(korisnikID) && isNaN(objektID)){
        const sqlQuery = 'SELECT * FROM Komentar;';

        db.query(sqlQuery, (err, result) => {
            if (err) {
                console.error('Greška pri dohvatu podataka:', err);
                return res.status(500).send("Greška na serveru");
            }
    
            res.json(result);
        })
    }
    // ako je unesen samo korisnikID sql query ima WHERE ID_korisnika = ?
    else if (isNaN(objektID)) {
        // stvara sql query, upitnici se zamjenjuju sa podacima iz varijable (2 reda ispod unutar uglatih zagrada)
        const sqlQuery = 'SELECT * FROM Komentar WHERE ID_korisnika = ?;';

        db.query(sqlQuery, [Number(korisnikID)], (err, result) => {
            if (err) {
                console.error('Greška pri dohvatu podataka:', err);
                return res.status(500).send("Greška na serveru");
            }
    
            res.json(result);
        })
    }
    // ako je unesen samo objektID sql query ima WHERE ID_objekta = ?
    else if (isNaN(korisnikID)) {
        // stvara sql query, upitnici se zamjenjuju sa podacima iz varijable (2 reda ispod unutar uglatih zagrada)
        const sqlQuery = 'SELECT * FROM Komentar WHERE ID_objekta = ?;';

        db.query(sqlQuery, [Number(objektID)], (err, result) => {
            if (err) {
                console.error('Greška pri dohvatu podataka:', err);
                return res.status(500).send("Greška na serveru");
            }
    
            res.json(result);
        })
    }

})


// ispis svih komentara određenog objekta

app.get("/komentari/:id", (req, res) => { 

    // povlaci query ako je unesen ( /korisnik/2 )
    const {id} = req.params;

    console.log(id);

    let komentari = [];

    // stvara sql query, upitnik se zamjenje sa podacima iz varijable (2 reda ispod unutar uglatih zagrada)
    const sqlQuery = `SELECT Sadrzaj_komentara, Ocjena, Korisnik.Korisnicko_ime
                    FROM Komentar
                    JOIN Korisnik ON Komentar.ID_korisnika = Korisnik.ID_korisnika
                    WHERE Komentar.ID_objekta = ?
                    ORDER BY Komentar.Ocjena DESC;`;


    // salje query, zamjenjuje upitnik sa podacima
    db.query(sqlQuery, [id], (err, result) => {

        if (err) {
            console.error('Greška pri dohvatu podataka:', err);
            return res.status(500).send("Greška na serveru");
        }

        result.forEach(korisnik => {
            const zasebniKomentar = {
                Sadrzaj_komentara: korisnik.Sadrzaj_komentara,
                Ocjena: korisnik.Ocjena,
                Korisnicko_ime: korisnik.Korisnicko_ime,
            };

            komentari.push(zasebniKomentar);
        })
        

        res.json(komentari);
    })

})


// ispis korisnika

app.get("/korisnik", (req, res) => { 

    // povlaci query ako je unesen ( /korisnik?ime=2 )
    const {ime} = req.query;

    console.log(ime);

    // provjerava ukoliko je unesen req.query
    // ako nije sql query nema WHERE
    if (!ime){
        const sqlQuery = 'SELECT * FROM Korisnik;';
        db.query(sqlQuery, (err, result) => {
            if (err) {
                console.error('Greška pri dohvatu podataka:', err);
                return res.status(500).send("Greška na serveru");
            }
    
            res.json(result);
        })
    }
    // ako je sql query ima WHERE
    else {
        // stvara sql query, upitnici se zamjenjuju sa podacima iz varijable (2 reda ispod unutar uglatih zagrada)
        const sqlQuery = 'SELECT * FROM Korisnik WHERE Korisnicko_ime = ?;';
        db.query(sqlQuery, [ime], (err, result) => {
            if (err) {
                console.error('Greška pri dohvatu podataka:', err);
                return res.status(500).send("Greška na serveru");
            }
    
            res.json(result);
        })
    }

})


// ispis zasebnog korisnika i njegovih intolerancija

app.get("/korisnik/:id", (req, res) => { 

    // povlaci query ako je unesen ( /korisnik/2 )
    const {id} = req.params;

    console.log(id);

    // stvara sql query, upitnik se zamjenje sa podacima iz varijable (2 reda ispod unutar uglatih zagrada)
    const sqlQuery = `SELECT Ime_korisnika, Prezime_korisnika, Email_korisnika, ID_pi
                    FROM Korisnik
                    JOIN PI_korisnika ON Korisnik.ID_korisnika = PI_korisnika.ID_korisnika
                    WHERE Korisnik.ID_korisnika = ?;`;


    // salje query, zamjenjuje upitnik sa podacima
    db.query(sqlQuery, [id], (err, result) => {

        if (err) {
            console.error('Greška pri dohvatu podataka:', err);
            return res.status(500).send("Greška na serveru");
        }

        // dobivena tablica se sastoji od 4 stupca, prva 3 se ponavljaju pa se uzima samo prvi redak
        // 4. stupac se sastoji od svih intolerancija koje korisnik ima pa se spremaju
        // pod Intolerancije (npr. Intolerancije:[2, 5, 7, 8])
        const korisnik = {
            Ime_korisnika: result[0].Ime_korisnika,
            Prezime_korisnika: result[0].Prezime_korisnika,
            Email_korisnika: result[0].Email_korisnika,
            Intolerancije: result.map(row => row.ID_pi)
        };

        res.json(korisnik);
    })

})

app.listen(port, () => {
    console.log(`Server radi na portu ${port}`); //poruka da se server pokrece
});