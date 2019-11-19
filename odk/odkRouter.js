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
    odk.getUser()
        .then(users => {
            console.log(users)
            res.status(200).json(users);
        })
        .catch(err => {
            console.log("Getting Users", err)
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

router.get("/mothers", (req,res) => {
    odk.getMothers()
        .then(mothers => {
            console.log(mothers)
            res.status(200).json(mothers);
        })
        .catch(err => {
            console.log("Getting Mothers", err)
            res.status(500).json(err)
        })
})

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
            //test for data
            // const {username, password} = data;

            const {
                "_R4L_Mother_EnglishOnly":motherForm
            } = result;
            // const user = {
            //   name: name[0],
            //   password: password[0],
            // };
            

            const {identification,introduction, "$":first, Registration, Complications, Birth_Preparedness, Pregnancy_History,  Demographics } = motherForm
            console.log("MotherForm", introduction, "First Object", first)
           
            const form = {}

            //identification
            const {interviewer} = identification
            form['interviewer'] = interviewer

            function filterObjects(obj) {
                for (let property in obj) {
                    if (typeof obj[property] === 'string' && obj[property].length > 0)
                    form[property] = obj[property]
                    if( typeof obj[property] === 'number')
                    form[property] = obj[property]
                }
            }

            filterObjects(interviewer)
            filterObjects(Registration)
            filterObjects(Complications)
            filterObjects(Birth_Preparedness)
            filterObjects(Pregnancy_History)
            filterObjects(Demographics)

            
            console.log("Intro object" , form)

            //terenary statement and search for name using regex
            odk.addMother(form)
                .then((form) => {
                    fs.unlinkSync(path);
                    res.status(201).json(form);
                })
                .catch(err => console.log("Error posting", err))

            fs.unlinkSync(path);
            res.status(201).json(user);
        });
    })
});

module.exports = router