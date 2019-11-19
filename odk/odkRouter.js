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

function filterObjects(obj) {
    for (let property in obj) {
        if (typeof obj[property] === 'string' && obj[property].length > 0)
        form[property] = obj[property]
        if( typeof obj[property] === 'number')
        form[property] = obj[property]
    }
}

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

            

            filterObjects(interviewer)
            filterObjects(Registration)

            
            console.log("Intro object" , form)


            // let mother = {
            //     due_now: due_now[0],
            //     deliver_elsewhere: deliver_elsewhere[0],
            //     hx_cesarean: hx_cesarean[0],
            //     hx_complication: hx_complication[0],
            //     current_multip: current_multip[0],
            //     name: name[0],
            //     edd: edd[0],
            //     age: age[0],
            //     village: village[0],
            //     own_phone: own_phone[0],
            //     other_phone: other_phone[0],
            //     phone_number: phone_number[0],
            //     carrier: carrier[0],
            //     owner_phone: owner_phone[0],
            //     want_education: want_education[0],
            //     complications_note: complications_note[0],
            //     anemia: anemia[0],
            //     malaria: malaria[0],
            //     obstructed_labor: obstructed_labor[0],
            //     malpresent: malpresent[0],
            //     aph: aph[0],
            //     pph: pph[0],
            //     ret_placenta: ret_placenta[0],
            //     placenta_previa: placenta_previa[0],
            //     hx_stillbirth: hx_stillbirth[0],
            //     no_stillbirths: no_stillbirths[0],
            //     BP_note: BP_note[0],
            //     no_anc: no_anc[0],
            //     deliver_place: deliver_place[0],
            //     plan_transport: plan_transport[0],
            //     purchase_supplies: purchase_supplies[0],
            //     name_supplies: name_supplies[0],
            //     cotton: cotton[0],
            //     saving_money: saving_money[0],
            //     PH_note: PH_note[0],
            //     no_pg: no_pg[0],
            //     no_birth: no_birth[0],
            //     no_children: no_children[0],
            //     no_under5: no_under5[0],
            //     hx_childdeath: hx_childdeath[0],
            //     no_childdeath: no_childdeath[0],
            //     attend_school: attend_school[0],
            //     money_control: money_control[0],
            //     total_house: total_house[0],
            //     marital_status: marital_status[0],
            //     spouse_school: spouse_school[0],
            //     polygamy: polygamy[0],
            //     no_wives: no_wives[0],
            //     wife_order: wife_order[0],
            //     insurance: insurance[0],
            //     sell_asset: sell_asset[0]
            // }

            
            console.log("Mother ", mother);
            //terenary statement and search for name using regex
            odk.addMother(mother)
                .then(([mother]) => {
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