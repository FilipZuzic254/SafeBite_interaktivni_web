const express = require("express");
const fs = require("fs");
const cors = require("cors");
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const multer = require('multer')

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


/**
 * THIS IS THE IMPORTANT PART
 * It exposes the "uploads" folder as a public URL
 */
app.use("/uploads", express.static("uploads"));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const { id } = req.body;

    if (!id) {
      return cb(new Error("Missing restoran ID"));
    }

    let uploadPath = `./uploads/${id}`;

    // If gallery → put in /gallery
    if (file.fieldname === "galerija") {
      uploadPath = uploadPath+'/galerija'
    }
    else if (file.filename === "jelovnik") {
        uploadPath = uploadPath+'/jelovnik'
    }

    // Ensure directory exists
    fs.mkdirSync(uploadPath, { recursive: true });

    cb(null, uploadPath);
  },

  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);

    cb(null, `${uniqueName}${file.originalname}`);
  },
});

const upload = multer({ storage });


/* NEDOVRSENO */
app.post("/img/create/galerija", upload.single("image"), (req, res) => {
    const { id } = req.body;

    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
    }

    const imagePath = `/uploads/${id}/galerija/${req.file.filename}`;

    console.log("Saved image:", imagePath);

    const sql = 'INSERT INTO Galerija_objekta (Putanja_slike, ID_objekta) VALUES (?, ?)';

    db.query(sql, [imagePath, id], (err, result) => {
    if (err) {
      console.error('Greška pri upisu u bazu:', err);
      return res.status(500).json({ message: 'Greška na serveru.' });
    }

    res.json({ message: 'Slika uspješno unesena!', id: result.insertId });
  });
});


/* NEDOVRSENO */
app.put("/img/create/objekt", upload.fields([{ name: "thumbnail", maxCount: 1 }, { name: "gallery", maxCount: 10 }]), (req, res) => {
    const { id } = req.body;

    if (!req.files?.thumbnail) {
      return res.status(400).json({ message: "Thumbnail is required" });
    }

    // Thumbnail path
    const thumbnailPath = `/uploads/${id}/${req.files.thumbnail[0].filename}`;

    // Gallery paths
    const galleryPaths = (req.files.gallery || []).map(
      file => `/uploads/${id}/gallery/${file.filename}`
    );

    res.json({
      message: "Images uploaded successfully",
      thumbnail: thumbnailPath,
      gallery: galleryPaths,
    });
  }
);


/* NEDOVRSENO */

app.put("/img/add/objekt", upload.single("image"), (req, res) => {
    const { id } = req.body;

    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
    }

    const newImagePath = `/uploads/${id}/${req.file.filename}`;

    // 1️⃣ Get old image path
    db.query(
        "SELECT Slika_objekta FROM Poslovni_objekt WHERE ID_objekta = ?", [id], (err, result) => {
            if (err) {
                console.error("Greška pri dohvatu podataka:", err);
                return res.status(500).json({ message: "Greška na serveru" });
            }

            const oldImage = result?.[0]?.Slika_objekta;

            // 2️⃣ Delete old image ONLY if it exists
            if (oldImage) {
                const filePath = `.${oldImage}`;

                fs.access(filePath, fs.constants.F_OK, (accessErr) => {
                    if (!accessErr) {
                        fs.rm(filePath, { force: true }, (rmErr) => {
                            if (rmErr) {
                                console.error("Greška pri brisanju slike:", rmErr);
                            }
                        });
                    }
                });
            }

            // 3️⃣ Update DB with new image
            db.query(
                "UPDATE Poslovni_objekt SET Slika_objekta = ? WHERE ID_objekta = ?", [newImagePath, id], (updateErr) => {
                    if (updateErr) {
                        console.error("Greška pri upisu u bazu:", updateErr);
                        return res.status(500).json({ message: "Greška na serveru" });
                    }

                    res.json({
                        message: "Slika uspješno unesena!",
                        image: newImagePath
                    });
                }
            );
        }
    );
});

/* NEDOVRSENO */

app.put("/img/create/stavka", upload.single("image"), (req, res) => {
    const { id } = req.body;

    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
    }

    const imagePath = `/uploads/${id}/stavke/${req.file.filename}`;

    console.log("Saved image:", imagePath);

    const sql = 'INSERT INTO Galerija_objekta (Putanja_slike, ID_objekta) VALUES (?, ?)';

    db.query(sql, [imagePath, id], (err, result) => {
    if (err) {
      console.error('Greška pri upisu u bazu:', err);
      return res.status(500).json({ message: 'Greška na serveru.' });
    }

    res.json({ message: 'Slika uspješno unesena!', id: result.insertId });
  });
});



/* NEDOVRSENO */
app.get("/img/delete/objekt/:id", (req, res) => {
    const {id} = req.params;

    const folderPath = "./uploads/restorani/";

    fs.rm(folderPath+id, { recursive: true, force: true }, err => {
        if (err) {
            throw err;
        }

        res.json({message: `${folderPath+id} is deleted!`});
    });
})


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


// Petra Grgić
// brisanje objekata
app.delete("/objekti/:id", (req, res) => { 

  const { id } = req.params

  const sql = 'DELETE FROM Poslovni_objekt WHERE ID_objekta = ?'

  db.query(sql, [id], (err) => {
    if (err) {
      console.error(err)
      return res.status(500).json({ message: 'Greška pri brisanju objekta' })
    }

    res.json({ message: 'Objekt uspješno obrisan' })
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
// --- Dohvati sve postojeće intolerancije
app.get('/pi', (req, res) => {
  db.query('SELECT ID_pi, Naziv_pi FROM Prehrambena_intolerancija', (err, rows) => {
    if (err) {
      console.error('Greška pri dohvaćanju intolerancija:', err);
      return res.status(500).json({ message: 'Greška pri dohvaćanju intolerancija.' });
    }
    res.json(rows);
  });
});

// --- Unos nove intolerancije
app.post('/pi', (req, res) => {
  const { Naziv_pi, ID_admina } = req.body;

  if (!Naziv_pi || !ID_admina) {
    return res.status(400).json({ message: 'Nedostaju obavezna polja.' });
  }

  const sql = 'INSERT INTO Prehrambena_intolerancija (Naziv_pi, ID_admina) VALUES (?, ?)';
  db.query(sql, [Naziv_pi, ID_admina], (err, result) => {
    if (err) {
      console.error('Greška pri upisu u bazu:', err);
      return res.status(500).json({ message: 'Greška na serveru.' });
    }

    res.json({ message: 'Intolerancija uspješno unesena!', id: result.insertId });
  });
});

// --- Unos stavke u jelovniku s odabranim intolerancijama
app.post('/jelovnici', (req, res) => {
  const { Naziv_stavke, Cijena_stavke, ID_admina, ID_objekta, Sastav_stavke, Intolerancije } = req.body;

  if (!Naziv_stavke || !Cijena_stavke || !ID_admina || !ID_objekta) {
    return res.status(400).json({ message: 'Nedostaju obavezna polja.' });
  }

  db.query(
    'INSERT INTO Stavka_jelovnika (Naziv_stavke, Cijena_stavke, ID_admina, ID_objekta, Sastav_stavke) VALUES (?, ?, ?, ?, ?)',
    [Naziv_stavke, Cijena_stavke, ID_admina, ID_objekta, Sastav_stavke],
    (err, result) => {
      if (err) return res.status(500).json({ message: 'Greška pri unosu stavke.' });

      const stavkaID = result.insertId;

      if (!Intolerancije || Intolerancije.length === 0)
        return res.json({ message: 'Stavka unesena bez intolerancija.' });

      // Provjeri da li su odabrane intolerancije valjane
      db.query('SELECT ID_pi FROM Prehrambena_intolerancija WHERE ID_pi IN (?)', [Intolerancije], (errCheck, rows) => {
        if (errCheck) return res.status(500).json({ message: 'Greška pri provjeri intolerancija.' });

        const validIDs = rows.map(r => r.ID_pi);
        if (validIDs.length === 0)
          return res.json({ message: 'Stavka unesena, ali nijedna od navedenih intolerancija ne postoji.' });

        const intolerancesData = validIDs.map(id => [stavkaID, id]);
        db.query('INSERT INTO PI_u_stavci_jelovnika (ID_stavke, ID_pi) VALUES ?', [intolerancesData], (err2) => {
          if (err2) return res.status(500).json({ message: 'Greška pri unosu intolerancija.' });
          res.json({ message: 'Stavka i intolerancije uspješno unesene.' });
        });
      });
    }
  );
});


app.get('/korisnik/intolerancije/:id', (req, res) => {
  const { id } = req.params;

  const sql = `SELECT ID_pi FROM PI_korisnika WHERE ID_korisnika = ?`;
  db.query(sql, [id], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Greška pri dohvatu intolerancija.' });
    }
    // vrati niz ID_pi
    res.json(rows.map(r => r.ID_pi));
  });
});


app.use(express.json());

app.post("/komentari", (req, res) => {
  const { Sadrzaj_komentara, Ocjena, ID_korisnika, ID_objekta } = req.body;

  if (!Sadrzaj_komentara || !Ocjena || !ID_korisnika || !ID_objekta) {
    return res.status(400).send("Nedostaju podaci");
  }

  const sql = `
    INSERT INTO Komentar
    (Sadrzaj_komentara, Ocjena, ID_korisnika, ID_objekta)
    VALUES (?, ?, ?, ?)
  `;

  db.query(sql, [Sadrzaj_komentara, Ocjena, ID_korisnika, ID_objekta], (err) => {
    if (err) {
      console.error("Greška pri unosu komentara:", err);
      return res.status(500).send("Greška na serveru");
    }
    res.status(201).send("Komentar spremljen");
  });
});

app.get("/komentari", (req, res) => {
  const { ID_objekta } = req.query;

  if (!ID_objekta) return res.status(400).send("Nedostaje ID objekta");

  const sql = `
    SELECT k.ID_komentara, k.Sadrzaj_komentara, k.Ocjena,
           u.Ime_korisnika, u.Prezime_korisnika
    FROM Komentar k
    JOIN Korisnik u ON k.ID_korisnika = u.ID_korisnika
    WHERE k.ID_objekta = ?
    ORDER BY k.ID_komentara DESC
  `;

  db.query(sql, [ID_objekta], (err, result) => {
    if (err) {
      console.error("Greška pri dohvaćanju komentara:", err);
      return res.status(500).send("Greška na serveru");
    }
    res.json(result);
  });
});

// unos vlasnika poslovnog objekta
app.post("/vlasnik", async (req, res) => { 
    const { Ime_vlasnika, Lozinka_vlasnika, Prezime_vlasnika, Email_vlasnika } = req.body;

    // provjera obaveznih polja
    if (!Ime_vlasnika || !Lozinka_vlasnika || !Prezime_vlasnika || !Email_vlasnika) {
        return res.status(400).send("Missing required fields.");
    }

    try {
        //hashiranje lozinke
        const hashedPassword = await bcrypt.hash(Lozinka_vlasnika, 10);

        // SQL upit, pretpostavljam da je prvi ID auto-increment
        const sqlQuery = 'INSERT INTO Vlasnik_objekta VALUES (NULL, ?, ?, ?, ?)';

        // šalje hash u bazu
        db.query(sqlQuery, [Ime_vlasnika, hashedPassword, Prezime_vlasnika, Email_vlasnika], (err, result) => {
            if (err) {
                console.error('Greška pri unosu vlasnika:', err);
                return res.status(500).send("Greška na serveru");
            }

            res.json({ message: "Vlasnik uspješno registriran", vlasnikId: result.insertId });
        });

    } catch (err) {
        console.error("Greška pri hashiranju lozinke:", err);
        res.status(500).send("Greška na serveru");
    }
});



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

//Petra Grgić
// registracija korisnika
app.post("/korisnik", async (req, res) => { 

    const {
        Korisnicko_ime,
        Lozinka_korisnika,
        Ime_korisnika,
        Prezime_korisnika,
        Email_korisnika,
        Intolerancije
    } = req.body;

    if (!Korisnicko_ime || !Lozinka_korisnika || !Ime_korisnika || !Prezime_korisnika || !Email_korisnika) {
        return res.status(400).json({ message: "Missing required fields." });
    }

    try {
        // HASHIRANJE LOZINKE
        const hashedPassword = await bcrypt.hash(Lozinka_korisnika, 10);

        const sqlInsertStavka = `
            INSERT INTO Korisnik 
            (Korisnicko_ime, Lozinka_korisnika, Ime_korisnika, Prezime_korisnika, Email_korisnika)
            VALUES (?, ?, ?, ?, ?)
        `;

        // sada šaljemo hashedPassword u bazu umjesto plain text lozinke
        db.query(sqlInsertStavka, [Korisnicko_ime, hashedPassword, Ime_korisnika, Prezime_korisnika, Email_korisnika], (err, result) => {
            if (err) {
                console.error("Insert error (menu item):", err);
                return res.status(500).json({ message: "Error inserting menu item." });
            }

            const insertKorisnikID = result.insertId;

            if (!Intolerancije || Intolerancije.length === 0) {
                return res.json({ message: "Korisnik uspješno unesen (nema intolerancija)." });
            }

            const intolerancijeZaUnos = Intolerancije.map(id_pi => [insertKorisnikID, id_pi]);

            const sqlInsertIntolerancije = `
                INSERT INTO PI_korisnika (ID_korisnika, ID_pi)
                VALUES ?
            `;

            db.query(sqlInsertIntolerancije, [intolerancijeZaUnos], (err2, result2) => {
                if (err2) {
                    console.error("Insert error (intolerances):", err2);
                    return res.status(500).json({ message: "Error inserting intolerances." });
                }

                res.json({ message: "Korisnik i njegove intolerancije uspješno unesene" });
            });
        });

    } catch (err) {
        console.error("Hashing error:", err);
        res.status(500).json({ message: "Greška pri hashiranju lozinke." });
    }

});


//registracija admina
app.post("/admin", async (req, res) => {
    const { ime, prezime, Ime_admina, Lozinka_admina } = req.body;

    if (!ime || !prezime || !Ime_admina || !Lozinka_admina) {
        return res.status(400).send("Missing required fields.");
    }

    try {
        // ✅ Hashiranje lozinke
        const hashedPassword = await bcrypt.hash(Lozinka_admina, 10);

        const sqlQuery = `
            INSERT INTO Administrator (ime, prezime, Ime_admina, Lozinka_admina)
            VALUES (?, ?, ?, ?)
        `;

        db.query(sqlQuery, [ime, prezime, Ime_admina, hashedPassword], (err, result) => {
            if (err) {
                console.error("Greška pri unosu admina:", err);
                return res.status(500).send("Greška na serveru");
            }

            res.json({ message: "Admin uspješno registriran", adminId: result.insertId });
        });

    } catch (err) {
        console.error("Greška pri hashiranju lozinke:", err);
        res.status(500).send("Greška na serveru");
    }
});




// login admina
app.post("/admin/login", (req, res) => {
    const { Ime_admina, Lozinka_admina } = req.body;

    if (!Ime_admina || !Lozinka_admina) {
        return res.status(400).json({ message: "Nedostaju podaci za login." });
    }

    // Dohvati admina po korisničkom imenu
    const sqlQuery = 'SELECT * FROM Administrator WHERE Ime_admina = ?';
    db.query(sqlQuery, [Ime_admina], async (err, result) => {
        if (err) {
            console.error("Greška pri provjeri admina:", err);
            return res.status(500).json({ message: "Greška na serveru." });
        }

        if (result.length === 0) {
            return res.status(401).json({ message: "Neispravno korisničko ime ili lozinka." });
        }

        const admin = result[0];

        try {
            // Provjera lozinke s bcrypt
            const isPasswordValid = await bcrypt.compare(Lozinka_admina, admin.Lozinka_admina);

            if (!isPasswordValid) {
                return res.status(401).json({ message: "Neispravno korisničko ime ili lozinka." });
            }

            // Login uspješan
            res.json({ message: "Uspješan login!", admin });

        } catch (bcryptErr) {
            console.error("Greška pri provjeri lozinke:", bcryptErr);
            return res.status(500).json({ message: "Greška na serveru." });
        }
    });
});

// spremanje prehrambenih intolerancija korisnika i vraćanje korisnika ANA KRIŠTO
app.post('/korisnik/intolerancije', (req, res) => {
  const { ID_korisnika, intolerancije } = req.body;

  if (!ID_korisnika) {
    return res.status(400).json({ message: 'Nedostaje ID korisnika' });
  }

  // Funkcija za dohvat korisnika s intolerancijama
  function fetchUserWithPI() {
    const sqlQuery = `
      SELECT Korisnik.Ime_korisnika, Korisnik.Prezime_korisnika, Korisnik.Email_korisnika, PI_korisnika.ID_pi
      FROM Korisnik
      LEFT JOIN PI_korisnika ON Korisnik.ID_korisnika = PI_korisnika.ID_korisnika
      WHERE Korisnik.ID_korisnika = ?;
    `;
    db.query(sqlQuery, [ID_korisnika], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Greška pri dohvaćanju korisnika' });
      }

      if (result.length === 0) {
        return res.status(404).json({ message: 'Korisnik ne postoji' });
      }

      const korisnik = {
        Ime_korisnika: result[0].Ime_korisnika,
        Prezime_korisnika: result[0].Prezime_korisnika,
        Email_korisnika: result[0].Email_korisnika,
        Intolerancije: result.map(row => row.ID_pi).filter(id => id !== null)
      };

      res.json(korisnik);
    });
  }

  // ako korisnik nije odabrao ništa → samo vrati korisnika
  if (!Array.isArray(intolerancije) || intolerancije.length === 0) {
    return fetchUserWithPI();
  }

  // prvo brišemo stare intolerancije korisnika
  const deleteQuery = 'DELETE FROM PI_korisnika WHERE ID_korisnika = ?';
  db.query(deleteQuery, [ID_korisnika], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Greška pri brisanju starih podataka' });
    }

    // priprema vrijednosti za INSERT
    const values = intolerancije.map(idPi => [ID_korisnika, idPi]);
    const insertQuery = `INSERT INTO PI_korisnika (ID_korisnika, ID_pi) VALUES ?`;

    db.query(insertQuery, [values], (err2) => {
      if (err2) {
        console.error(err2);
        return res.status(500).json({ message: 'Greška pri spremanju intolerancija' });
      }

      // vrati korisnika s novim intolerancijama
      fetchUserWithPI();
    });
  });
});




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
    const sqlQuery = `SELECT Naziv_stavke, Cijena_stavke, Sastav_stavke, ID_objekta, ID_admina, ID_vlasnika, ID_pi
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
            ID_objekta: result[0].ID_objekta,
            ID_admina: result[0].ID_admina,
            ID_vlasnika: result[0].ID_vlasnika,
            Intolerancije: result.map(row => row.ID_pi)
        };

        res.json(jelo);
    })

})


// ispis prehrambenih intolerancija

app.get("/pi", (req, res) => { 

    // povlaci query ako je unesen ( /pi?id=2 )
    const {id} = req.query;

    console.log("test");

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

//app.get("/objekti", (req, res) => { 

    // povlaci query ako je unesen ( /objekti?vlasnikID=2&objektID=2 )
   // const {vlasnikID, objektID} = req.query;

   // console.log(vlasnikID, objektID);

    // provjerava ukoliko je unesen req.query
    // ako nije sql query nema WHERE
    //if (isNaN(vlasnikID) && isNaN(objektID)){
       // const sqlQuery = 'SELECT * FROM Poslovni_objekt;';

        //db.query(sqlQuery, (err, result) => {
            //if (err) {
             //   console.error('Greška pri dohvatu podataka:', err);
               // return res.status(500).send("Greška na serveru");
            //}
    
            //res.json(result);
        //})
    //}
    // ako je unesen samo vlasnikID sql query ima WHERE ID_vlasnika = ?
    //else if (isNaN(objektID)) {
        // stvara sql query, upitnici se zamjenjuju sa podacima iz varijable (2 reda ispod unutar uglatih zagrada)
      //  const sqlQuery = 'SELECT * FROM Poslovni_objekt WHERE ID_vlasnika = ?;';

        //db.query(sqlQuery, [Number(vlasnikID)], (err, result) => {
          //  if (err) {
            //    console.error('Greška pri dohvatu podataka:', err);
              //  return res.status(500).send("Greška na serveru");
            //}
    
            //res.json(result);
      //  })
    //}
    // ako je unesen samo objektID sql query ima WHERE ID_objekta = ?
    //else if (isNaN(vlasnikID)) {
        // stvara sql query, upitnici se zamjenjuju sa podacima iz varijable (2 reda ispod unutar uglatih zagrada)
      //  const sqlQuery = 'SELECT * FROM Poslovni_objekt WHERE ID_objekta = ?;';

        //db.query(sqlQuery, [Number(objektID)], (err, result) => {
          //  if (err) {
            //    console.error('Greška pri dohvatu podataka:', err);
              //  return res.status(500).send("Greška na serveru");
            //}
    
            //res.json(result);
        //})
    //}

//})

app.get("/objekti", (req, res) => { 
    const { vlasnikID, objektID, tip } = req.query;

    let sqlQuery = `
        SELECT p.*, ROUND(AVG(k.ocjena),1) AS prosjecna_ocjena
        FROM Poslovni_objekt p
        LEFT JOIN Komentar k ON p.ID_objekta = k.ID_objekta
        WHERE 1=1
    `;

    const params = [];

    if (!isNaN(vlasnikID)) {
        sqlQuery += ' AND p.ID_vlasnika = ?';
        params.push(Number(vlasnikID));
    }

    if (!isNaN(objektID)) {
        sqlQuery += ' AND p.ID_objekta = ?';
        params.push(Number(objektID));
    }

    if (tip) {
        sqlQuery += ' AND p.Tip_objekta = ?';
        params.push(tip); // tip = "Kafić"
    }

    sqlQuery += ' GROUP BY p.ID_objekta;';

    db.query(sqlQuery, params, (err, result) => {
        if (err) {
            console.error('Greška pri dohvatu objekata:', err);
            return res.status(500).send("Greška na serveru");
        }
        res.json(result);
    });
});

//jelovnik
// Dohvat jelovnika za određeni objekt/kafić
//app.get("/jelovnik", (req, res) => {
  //  const { objektID } = req.query; // ID od kafića
//
  //  if (!objektID) {
    //    return res.status(400).send("Nedostaje ID objekta");
    //}

    //const sqlQuery = `
      //  SELECT *
        //FROM Stavka_jelovnika
        //WHERE ID_objekta = ?
    //`;

    //db.query(sqlQuery, [Number(objektID)], (err, result) => {
     //   if (err) {
       //     console.error("Greška pri dohvatu jelovnika:", err);
         //   return res.status(500).send("Greška na serveru");
        //}
        //res.json(result);
   // });
//});

app.get("/jelovnik", (req, res) => {
    const { objektID } = req.query; // ID od kafića

    if (!objektID) {
        return res.status(400).send("Nedostaje ID objekta");
    }

    const sqlQuery = `
        SELECT 
            s.ID_stavke,
            s.Naziv_stavke,
            s.Sastav_stavke,
            s.Cijena_stavke,
            GROUP_CONCAT(pi.Naziv_pi SEPARATOR ', ') AS intolerancije
        FROM Stavka_jelovnika s
        LEFT JOIN PI_u_stavci_jelovnika psi 
            ON s.ID_stavke = psi.ID_stavke
        LEFT JOIN Prehrambena_intolerancija pi 
            ON psi.ID_pi = pi.ID_pi
        WHERE s.ID_objekta = ?
        GROUP BY s.ID_stavke
    `;

    db.query(sqlQuery, [Number(objektID)], (err, result) => {
        if (err) {
            console.error("Greška pri dohvatu jelovnika:", err);
            return res.status(500).send("Greška na serveru");
        }
        res.json(result);
    });
});

// Backend (Express) – app.js / server.js

// OBAVEZNO
app.use(express.json());

app.post("/komentari", (req, res) => {
  const { Sadrzaj_komentara, Ocjena, ID_korisnika, ID_objekta } = req.body;

  if (!Sadrzaj_komentara || !Ocjena || !ID_korisnika || !ID_objekta) {
    return res.status(400).send("Nedostaju podaci");
  }

  const sql = `
    INSERT INTO Komentar
    (Sadrzaj_komentara, Ocjena, ID_korisnika, ID_objekta)
    VALUES (?, ?, ?, ?)
  `;

  db.query(sql, [Sadrzaj_komentara, Ocjena, ID_korisnika, ID_objekta], (err) => {
    if (err) {
      console.error("Greška pri unosu komentara:", err);
      return res.status(500).send("Greška na serveru");
    }
    res.status(201).send("Komentar spremljen");
  });
});

app.get("/komentari", (req, res) => {
  const { ID_objekta } = req.query;

  if (!ID_objekta) return res.status(400).send("Nedostaje ID objekta");

  const sql = `
    SELECT k.ID_komentara, k.Sadrzaj_komentara, k.Ocjena,
           u.Ime_korisnika, u.Prezime_korisnika
    FROM Komentar k
    JOIN Korisnik u ON k.ID_korisnika = u.ID_korisnika
    WHERE k.ID_objekta = ?
    ORDER BY k.ID_komentara DESC
  `;

  db.query(sql, [ID_objekta], (err, result) => {
    if (err) {
      console.error("Greška pri dohvaćanju komentara:", err);
      return res.status(500).send("Greška na serveru");
    }
    res.json(result);
  });
});



// ispis vlasnika objekta

app.get("/vlasnik", (req, res) => { 

    // povlaci query ako je unesen ( /vlasnik?mail=2 )
    const {mail} = req.query;

    console.log(mail);

    // provjerava ukoliko je unesen req.query
    // ako nije sql query nema WHERE
    if (mail == null){
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
        const sqlQuery = 'SELECT * FROM Vlasnik_objekta WHERE Email_vlasnika = ?;';

        db.query(sqlQuery, [mail], (err, result) => {
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
//app.get("/komentari/:id", (req, res) => { 

    // povlaci query ako je unesen ( /korisnik/2 )
//    const {id} = req.params;

//   console.log(id);

//   let komentari = [];

    // stvara sql query, upitnik se zamjenje sa podacima iz varijable (2 reda ispod unutar uglatih zagrada)
//    const sqlQuery = `SELECT Sadrzaj_komentara, Ocjena, Korisnik.Korisnicko_ime
//                    FROM Komentar
//                  JOIN Korisnik ON Komentar.ID_korisnika = Korisnik.ID_korisnika
//                  WHERE Komentar.ID_objekta = ?
//                  ORDER BY Komentar.Ocjena DESC;`;


    // salje query, zamjenjuje upitnik sa podacima
//    db.query(sqlQuery, [id], (err, result) => {

//        if (err) {
//            console.error('Greška pri dohvatu podataka:', err);
//            return res.status(500).send("Greška na serveru");
//        }

//        result.forEach(korisnik => {
//            const zasebniKomentar = {
//                Sadrzaj_komentara: korisnik.Sadrzaj_komentara,
//                Ocjena: korisnik.Ocjena,
//                Korisnicko_ime: korisnik.Korisnicko_ime,
//            };

//            komentari.push(zasebniKomentar);
//        })
        

//        res.json(komentari);
//    })

//})//



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
                    LEFT JOIN PI_korisnika ON Korisnik.ID_korisnika = PI_korisnika.ID_korisnika
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

// intolerancije korisnika (samo ID-evi)
app.get('/korisnik/intolerancije/:id', (req, res) => {
  const { id } = req.params

  const sql = `
    SELECT ID_pi
    FROM PI_korisnika
    WHERE ID_korisnika = ?
  `

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error(err)
      return res.status(500).send('Greška na serveru')
    }

    // vrati samo niz ID-eva
    res.json(result.map(r => r.ID_pi))
  })
})

// login vlasnika objekta
app.post("/vlasnik/prijava", (req, res) => {
    const { Email_vlasnika, Lozinka_vlasnika } = req.body;

    if (!Email_vlasnika || !Lozinka_vlasnika) {
        return res.status(400).json({ message: "Unesite email i lozinku." });
    }

    // Dohvat vlasnika po emailu
    const sqlQuery = 'SELECT * FROM Vlasnik_objekta WHERE Email_vlasnika = ?';
    db.query(sqlQuery, [Email_vlasnika], async (err, result) => {
        if (err) {
            console.error('Greška pri provjeri login-a vlasnika:', err);
            return res.status(500).json({ message: "Greška na serveru" });
        }

        if (result.length === 0) {
            return res.status(401).json({ message: "Email ili lozinka nisu ispravni" });
        }

        const user = result[0];

        try {
            // Provjera lozinke s bcrypt
            const isPasswordValid = await bcrypt.compare(Lozinka_vlasnika, user.Lozinka_vlasnika);

            if (!isPasswordValid) {
                return res.status(401).json({ message: "Email ili lozinka nisu ispravni" });
            }

            // Login uspješan
            res.json({ message: "Login uspješan", user });

        } catch (bcryptErr) {
            console.error("Greška pri provjeri lozinke:", bcryptErr);
            return res.status(500).json({ message: "Greška na serveru" });
        }
    });
});


//Petra Grgić
app.post("/korisnik/prijava", (req, res) => {
    const { Korisnicko_ime, Lozinka_korisnika } = req.body;

    if (!Korisnicko_ime || !Lozinka_korisnika) {
        return res.status(400).json({ message: "Unesite korisničko ime i lozinku." });
    }

    // Dohvati korisnika po korisničkom imenu
    const sqlQuery = 'SELECT * FROM Korisnik WHERE Korisnicko_ime = ?';
    db.query(sqlQuery, [Korisnicko_ime], async (err, result) => {
        if (err) {
            console.error('Greška pri provjeri login-a korisnika:', err);
            return res.status(500).json({ message: "Greška na serveru" });
        }

        if (result.length === 0) {
            return res.status(401).json({ message: "Korisničko ime ili lozinka nisu ispravni" });
        }

        const user = result[0];

        try {
            // Provjera lozinke s bcrypt
            const isPasswordValid = await bcrypt.compare(Lozinka_korisnika, user.Lozinka_korisnika);

            if (!isPasswordValid) {
                return res.status(401).json({ message: "Korisničko ime ili lozinka nisu ispravni" });
            }

            // Prijava uspješna
            res.json({ message: "Uspješna prijava", user });

        } catch (bcryptErr) {
            console.error("Greška pri provjeri lozinke:", bcryptErr);
            return res.status(500).json({ message: "Greška na serveru" });
        }
    });
});


//Petra Grgić
// api za profil korisnika, njegove intolerancije i komentare
app.get('/korisnik/profil/:id', (req, res) => {
  const korisnikID = req.params.id //dohvacanje id iz url

  // sql upit za podatke o korisniku sa id iz url
  const sqlKorisnik = `
    SELECT 
      Ime_korisnika,
      Prezime_korisnika,
      Email_korisnika,
      Korisnicko_ime
    FROM Korisnik
    WHERE ID_korisnika = ?
  `

  // sql upit za dohvat naziva korisnikovih intolerancija 
  const sqlIntolerancije = `
    SELECT pi.Naziv_pi
    FROM PI_korisnika pik
    JOIN Prehrambena_intolerancija pi 
      ON pik.ID_pi = pi.ID_pi
    WHERE pik.ID_korisnika = ?
  `

  // sql upit za dohvat komentara koje je ostavio korisnik sa id iz url
  const sqlKomentari = `
    SELECT 
      k.ID_komentara,
      k.Sadrzaj_komentara,
      k.Ocjena,
      po.Ime_objekta
    FROM Komentar k
    JOIN Poslovni_objekt po 
      ON k.ID_objekta = po.ID_objekta
    WHERE k.ID_korisnika = ?
  `

  // izvrsavanje upita za podatke o korisniku
  db.query(sqlKorisnik, [korisnikID], (err, korisnikResult) => {
    if (err) {
      console.error('Greška pri dohvatu korisnika:', err) //greska pri dohvacanju podataka
      return res.status(500).json({ message: 'Greška pri dohvatu korisnika', error: err })
    }

    if (korisnikResult.length === 0) {
      return res.status(404).json({ message: 'Korisnik ne postoji' }) //ako korisnik ne postoji
    }

    // izvrsavanje upita za podatke o intolerancijama
    db.query(sqlIntolerancije, [korisnikID], (err2, intolerancijeResult) => {
      if (err2) {
        console.error('Greška pri dohvatu intolerancija:', err2) //greska pri dohvacanju podataka
        return res.status(500).json({ message: 'Greška pri dohvatu intolerancija', error: err2 })
      }

      // izvrsavanje upita za komentare korisnika
      db.query(sqlKomentari, [korisnikID], (err3, komentariResult) => {
        if (err3) {
          console.error('Greška pri dohvatu komentara:', err3) //greska pri dohvacanju komentara
          return res.status(500).json({ message: 'Greška pri dohvatu komentara', error: err3 })
        }

        // json sa podatcia o korisniku, intolerancijama i komentarima
        res.json({
          korisnik: korisnikResult[0],
          intolerancije: intolerancijeResult.map(r => r.Naziv_pi), // samo nazivi
          komentari: komentariResult 
        })
      })
    })
  })
})


//Petra Grgić
// api za profil vlasnika i njegovih objekata
app.get('/vlasnik/profil/:id', (req, res) => {
    const vlasnikID = req.params.id //dohvacanje id iz url

  // sql upit za dohvacanje podataka o vlasniku gdje je id vlasnika iz url
  const sqlVlasnik = `
    SELECT Ime_vlasnika, Prezime_vlasnika, Email_vlasnika
    FROM Vlasnik_objekta
    WHERE ID_vlasnika = ?
  `;

  // sql upit ua dohvacanje objekata i prosjecne ocjene gdje je id vlasnika iz url
  const sqlObjekti = `
    SELECT 
      po.ID_objekta,
      po.Ime_objekta,
      po.Adresa_objekta,
      po.Tip_objekta,
      po.Opis_objekta,
      po.Slika_objekta,
      IFNULL(AVG(k.Ocjena), 0) AS prosjecna_ocjena
    FROM Poslovni_objekt po
    LEFT JOIN Komentar k ON po.ID_objekta = k.ID_objekta
    WHERE po.ID_vlasnika = ?
    GROUP BY po.ID_objekta
  `;

  // upit za vlasnika
  db.query(sqlVlasnik, [vlasnikID], (err, vlasnikResult) => {
    if (err) return res.status(500).json({ message: 'Greška vlasnik', err }) // greska pri dohvacanju
    if (vlasnikResult.length === 0) return res.status(404).json({ message: 'Vlasnik ne postoji' }) // ako nema vlasnika sa tim id

    // nakon sta smo nasli vlasnika trazimo nejgove objekte
    db.query(sqlObjekti, [vlasnikID], (err2, objektiResult) => {
      if (err2) return res.status(500).json({ message: 'Greška objekti', err2 }) //greska pri dohvacanju objekata
    
      // json odgovor sa podatcima o vlasniku i njegovim obhjektima
      res.json({
        vlasnik: vlasnikResult[0],
        objekti: objektiResult
      })
    })
  })
})

// Petra Grgić
// api za profil admina i sve objekte
app.get('/admin/profil/:id', (req, res) => {
  const adminID = req.params.id //duhvacamo id admina iz url

  // sql upit za dohvacanje podataka o adminu gdje je id kao u url
  const adminQuery = `
    SELECT 
      ID_admina,
      ime,
      prezime,
      Ime_admina
    FROM Administrator
    WHERE ID_admina = ?
  `
// upit za admina
  db.query(adminQuery, [adminID], (err, adminResult) => {
    if (err) {
      console.error('Greška pri dohvatu admina:', err) //greska u dohvacanju admina
      return res.status(500).json({ error: 'Greška pri dohvatu admina' })
    }

    if (adminResult.length === 0) {
      return res.status(404).json({ error: 'Admin ne postoji' }) //ako admin sa tim id ne postoji
    }

    const admin = adminResult[0] //spremamo rezultate o pronademon adminu

    // sql upit za dohvatcanje svih objekata i njihovih ocjena
    const objektiQuery = `
      SELECT 
        po.ID_objekta,
        po.Ime_objekta,
        po.Adresa_objekta,
        po.Tip_objekta,
        po.Opis_objekta,
        po.Slika_objekta,
        ROUND(AVG(k.Ocjena), 1) AS prosjecna_ocjena
      FROM Poslovni_objekt po
      LEFT JOIN Komentar k ON po.ID_objekta = k.ID_objekta
      GROUP BY po.ID_objekta
      ORDER BY po.Ime_objekta
    `
//izvrsavanje upita za objekte
    db.query(objektiQuery, (err, objektiResult) => {
      if (err) {
        console.error('Greška pri dohvatu objekata:', err) //greska u dohvacanju objekata
        return res.status(500).json({ error: 'Greška pri dohvatu objekata' })
      }

      // json sa podatcima o adminu i podatcima o svim objetima
      res.json({
        admin,
        objekti: objektiResult
      })
    })
  })
})



app.listen(port, () => {
    console.log(`Server radi na portu ${port}`); //poruka da se server pokrece
});




