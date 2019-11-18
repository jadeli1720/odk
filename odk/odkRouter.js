const router = require("express").Router();
const odk = require("./odkHelper");
const xml2hs = require("xml2js");
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
router.post('/', (req, res) => {
    const driver = req.body;
    console.log('body ', req.body);
    console.log('hello heroku ', req.body);
    if (driver) {
        db.addDriver(driver)
            .then(([driver]) => res.status(201).json(driver))
            .catch(err => res.status(500).json({error: "There was an error while saving the driver to the database"}))
    }
});

router.post('/odk/', upload.single('xml_submission_file'), (req, res) => {
    console.log('BODY ', req.body);
    console.log('FILE ', req.file);
    const path = req.file.path;
    fs.readFile(path, {encoding: 'utf8'}, (err, data) => {
        if (err) throw err;
        console.log('Data XML ', data);
        parser.parseString(data, function (err, result) {
            console.log('FROM XML TO JSON ', result);
            const {"data": data} = result;
            const {username, password} = data;
            const user = {
              username: username[0],
              password: password[0],
            };
            console.log("USER ", user);
           /* if (username.length && password.length) {
                db.add(user)
                    .then(([user]) => {
                        fs.unlinkSync(path);
                        res.status(201).json(user);
                    })
                    .catch(err => res.status(500).json({error: "There was an error while saving the user to the database"}))
            }*/
            fs.unlinkSync(path);
            res.status(201).json(user);
        });
    });
});

module.exports = router