
exports.up = function (knex) {
    return (
        knex.schema
            .createTable('users', (users) => {
                users.increments();
                users.string('username', 128)
                    .notNullable()
                    .unique();
                users.string('password', 128)
                    .notNullable()
            })
            //villages
            .createTable("village", village => {
                //pk
                village
                    .integer("id")
                    .primary()
                    .unique();
                //name
                village.string("name", 255);

                //latitude
                village.string("latitude", 255).notNullable();
                //longitude
                village.string("longitude", 255).notNullable();
            })

            //drivers--> village_id may need to be put as obsolete. The drivers that I have plotted (only two) seem to be at crossroads that are not connected to a village
            .createTable("drivers", drivers => {
                //primary key
                drivers.increments();
                //name
                drivers.string("driver_name", 255);
                //phone_number
                drivers.string("phone", 255);
                //carrier
                drivers.integer("carrier");
                //another phone question
                drivers.integer("another_phone");
                //second phone number
                drivers.string("phone_2", 255);
                //second carrier
                drivers.integer("carrier_2");
                //latitude
                drivers.string("latitude", 255).notNullable();
                //longitude
                drivers.string("longitude", 255).notNullable();
                //district
                drivers.integer("district");
                //district-other input field
                drivers.string("district_other", 255);
                //subcounty
                drivers.integer("subcounty");
                //subcounty-other input field
                drivers.string("subcounty_other", 255);
                //stage(Parish)
                drivers.integer("stage");
                //(stage)parish-other input field
                drivers.string("parish_other", 255);
                //availability
                drivers.boolean("availability");
                //reliability
                drivers.integer("reliability");
                //online ---> driver is clocked in for a shift
                drivers.boolean("online").defaultTo(false);
                //timestamp
                drivers.timestamps(true, true)
                //own a motorcycle?
                drivers.integer("own_boda");
                //keep boda-boda with you how many nights?
                drivers.integer("boda_night");
                //# of transfers mothers to health facility
                drivers.integer("transfers");
                //Story of transfer of pregnant mother
                drivers.string("story");
                //motivation
                drivers.string("motivation");
                //background - question 8
                drivers.string("background");
                //married
                drivers.integer("married");
                //children
                drivers.integer("children");
                //how many children
                drivers.integer("number_kids");
                //Children info
                drivers.string("kid_info");
                //future dream
                drivers.string("dream");
                //Picture - how do we handle this. In the form you can take a picture 
                drivers.string("picture");

            })

            //mothers
            .createTable("mothers", mothers => {
                // primary key
                mothers.increments();
                //**identification
                mothers.integer("interviewer");
                mothers.string("interviewer_other");
                //introduction
                mothers.integer("current_pg");
                mothers.integer("due_now");
                mothers.integer("deliver_elsewhere");
                mothers.integer("hx_cesarean");
                mothers.integer("hx_complication");
                mothers.integer("current_multip");
                //registration
                mothers.string("name");
                //data type Date-time?
                mothers.string("edd");
                mothers.integer("age");
                //FK---> cannot make the name village_id. Will not match data sent from odk
                mothers
                    .integer("village")
                    .unsigned()
                    // .notNullable()
                    .references("id")
                    .inTable("village")
                    .onDelete("CASCADE")
                    .onUpdate("CASCADE");
                //Does this need to be changed to home_village_other. In excel it is: village_other
                mothers.string("village_other");//
                mothers.integer("own_phone");
                mothers.string("other_phone");
                mothers.string("phone_number");
                mothers.integer("carrier");
                mothers.integer("owner_phone");
                mothers.string("owner_phone_other");
                mothers.string("carrier_other");
                mothers.integer("want_education");
                //complications
                mothers.integer("anemia");
                mothers.integer("malaria");
                mothers.integer("obstructed_labor");
                mothers.integer("malpresent");
                mothers.integer("aph");
                mothers.integer("pph");
                mothers.integer("ret_placenta");
                mothers.integer("placenta_previa");
                mothers.integer("hx_stillbirth");
                mothers.integer("no_stillbirths");
                mothers.integer("other_complication");
                mothers.string("complication_specify");
                //Birth_Preparedness
                mothers.integer("no_anc");
                mothers.integer("deliver_place");
                mothers.string("deliver_place_other");
                mothers.string("deliver_specific");
                mothers.integer("plan_transport");
                mothers.string("plan_transport_other");
                mothers.integer("purchase_supplies");
                mothers.string("name_supplies");
                mothers.string("supplies_other");
                mothers.integer("mama_kit");
                mothers.integer("mackintosh");
                mothers.integer("razor");
                mothers.integer("pad");
                mothers.integer("cotton");
                mothers.integer("soap");
                mothers.integer("gloves");
                mothers.integer("medication");
                mothers.integer("baby_clothes");
                mothers.integer("blanket");
                mothers.integer("sheets");
                mothers.integer("other_supply");
                mothers.integer("saving_money");
                mothers.integer("amt_saved");
                mothers.integer("amt_saved_range");
                //Pregnancy_History
                mothers.integer("no_pg");
                mothers.integer("no_birth");
                mothers.integer("no_children");
                mothers.integer("no_under5");
                mothers.integer("hx_childdeath");
                mothers.integer("no_childdeath");
                //Demographics
                mothers.integer("attend_school");
                mothers.integer("education");
                mothers.integer("money_control");
                mothers.integer("total_house");
                mothers.integer("marital_status");
                mothers.string("marital_status_other");
                mothers.integer("spouse_school");
                mothers.integer("spouse_education");
                mothers.integer("polygamy");
                mothers.integer("no_wives");
                mothers.string("no_wives_other");
                mothers.integer("wife_order");
                mothers.string("wife_order_other");
                mothers.integer("insurance");
                mothers.string("insurance_type");
                mothers.string("insurance_type_other");
                mothers.integer("insurance_CBO");
                mothers.integer("insurance_private");
                mothers.integer("insurance_other");
                mothers.integer("sell_asset");
            })
    )

};

exports.down = function (knex) {
    return knex.schema
        .dropTableIfExists("mothers")
        .dropTableIfExists("drivers")
        .dropTableIfExists("village")
        .dropTableIfExists("users")
};
