const router = require("express").Router();
const odk = require("./odkHelper");
const fs = require('fs');
const xml2js = require("xml2js");
const parser = new xml2js.Parser({explicitArray : false});
const multer = require("multer")

const storage = {
    //Will the destination need to be changed to the seeds file?
    dest: "./uploads/",
    //Will we need to create a maxCount to allow for multiple files to upload
    /**TEST HOW MANY FILES CAN BE UPLOADED!!! */
    filename: function(req, file, cb) {
        console.log("FIELDNAME", file.fieldname);
        cb(null,file.fieldname + '-' + Date.now() )
    }
};

const upload = multer(storage);

//Testing
router.get("/villages", (req,res) => {
    odk.getVillages()
        .then(villages => {
            console.log(villages)
            res.status(200).json(villages);
        })
        .catch(err => {
            console.log("Getting Villages", err)
            res.status(500).json(err)
        })
})
router.get("/users", (req,res) => {
    odk.getUsers()
        .then(users => {
            console.log(users)
            res.status(200).json(users);
        })
        .catch(err => {
            console.log("Getting Villages", err)
            res.status(500).json(err)
        })
})

router.post('/', (req, res) => {
    const driver = req.body;
    console.log('body ', req.body);
    console.log('hello heroku ', req.body);
    if (driver) {
        odk.addDriver(driver)
            .then(([driver]) => res.status(201).json(driver))
            .catch(err => res.status(500).json({error: "There was an error while saving the driver to the database"}))
    }
});

router.post('/upload', upload.single('xml_submission_file'), (req, res) => {
    console.log('BODY ', req.body);
    console.log('FILE ', req.file);
    const path = req.file.path;
    console.log("path",path)
    fs.readFile(path, {encoding: 'utf8'}, (err, data) => {
        if (err) throw err;
        console.log('Data XML ', data);
        console.log(err)
        parser.parseString(data, function (err, result) {
            console.log('FROM XML TO JSON ', result);
            //look for file name in data id.
            const {"data": data} = result;
            const {username, password} = data;
            const user = {
              username: username[0],
              password: password[0],
            };
            console.log("USER ", user);
            //terenary statement and search for name using regex
            odk.addUser(user)
                .then(([user]) => {
                    fs.unlinkSync(path);
                    res.status(201).json(user);
                })
                .catch(err => console.log("Error posting", err))

            fs.unlinkSync(path);
            res.status(201).json(user);
        });
    })
});

module.exports = router