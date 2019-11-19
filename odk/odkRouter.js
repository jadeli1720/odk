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

            const filteredForm = {}
            const motherTable = [
                "interviewer",
                "interviewer_other",
                "current_pg",
                "due_now",
                "deliver_elsewhere",
                "hx_cesarean",
                "hx_complication",
                "current_multip",
                "name",
                "edd",
                "age",
                "village",
                "village_other",
                "own_phone",
                "other_phone",
                "phone_number",
                "carrier",
                "owner_phone",
                "owner_phone_other",
                "carrier_other",
                "want_education",
                "anemia",
                "malaria",
                "obstructed_labor",
                "malpresent",
                "aph",
                "pph",
                "ret_placenta",
                "placenta_previa",
                "hx_stillbirth",
                "no_stillbirths",
                "other_complication",
                "complication_specify",
                "no_anc",
                "deliver_place",
                "deliver_place_other",
                "deliver_specific",
                "plan_transport",
                "plan_transport_other",
                "purchase_supplies",
                "name_supplies",
                "supplies_other",
                "mama_kit",
                "mackintosh",
                "razor",
                "pad",
                "cotton",
                "soap",
                "gloves",
                "medication",
                "baby_clothes",
                "blanket",
                "sheets",
                "other_supply",
                "saving_money",
                "amt_saved",
                "amt_saved_range",
                "no_pg",
                "no_birth",
                "no_children",
                "no_under5",
                "hx_childdeath",
                "no_childdeath",
                "attend_school",
                "education",
                "money_control",
                "total_house",
                "marital_status",
                "marital_status_other",
                "spouse_school",
                "spouse_education",
                "polygamy",
                "no_wives",
                "no_wives_other",
                "wife_order",
                "wife_order_other",
                "insurance",
                "insurance_type",
                "insurance_type_other",
                "insurance_CBO",
                "insurance_private",
                "insurance_other",
                "sell_asset"
            ]

            for(let property in form) {
                motherTable.map(item => {
                    if(property === item){
                        filteredForm[property] = form[property]
                    }
                })
            }
            
            console.log("Intro object" , form)
            console.log("Filtered Form", filteredForm)

            //terenary statement and search for name using regex
            odk.addMother(filteredForm)
                .then((form) => {
                    res.status(201).json(form);
                })
                .catch(err => console.log("Error posting", err))

            fs.unlinkSync(path);
        });
    })
});

module.exports = router