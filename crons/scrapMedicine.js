const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const cron = require('node-cron');
const Medicine = require('../models/Medicine');
const { getMedicinePrice } = require('../utils/utilsFunction');

exports.scrapMedicine = cron.schedule('*/10 * * * * *', async () => {
  try {
    const baseUrl = 'https://medex.com.bd/brands?page=';
    let allMedicinesCollection = [];
    let allMedicines = [];
    let page = 1;
    var start = new Date().getTime();
    const totalOldMedicines = await Medicine.find({});
    while (true) {
      await axios
        .get(`${baseUrl}${page}`)
        // .get('https://medex.com.bd/brands?page=425')
        .then((res) => {
          const $ = cheerio.load(res.data);
          let singleMedicine = {};
          $('.hoverable-block').each((index, element) => {
            let medicineFullName = '';
            const medicineTitle = $(element).find('.dosage-icon').attr('title');
            const medicineName = $(element)
              .find('.data-row-top')
              .text()
              .replace(/\s\s+/g, '');
            const medicineStrength = $(element)
              .find('.data-row-strength')
              .text()
              .replace(/\s\s+/g, '');
            const medicineCompany = $(element)
              .find('.data-row-company')
              .text()
              .replace(/\s\s+/g, '');
            const medicineApproxPrice = $(element)
              .find('.package-pricing')
              .text()
              .replace(/\s\s+/g, '');
            //format --> Unit Price : ৳ 5.00 (Needs to split by ":")
            const hasMultipleStrength = medicineStrength.includes('+');
            if (hasMultipleStrength) {
              const strengths = medicineStrength.split('+');
              strengths.map((strength) => {
                medicineFullName =
                  medicineTitle + ' ' + medicineName + strength;

                singleMedicine = {
                  name: medicineFullName.toLowerCase(),
                  company: medicineCompany.toLowerCase(),
                  bdtPrice: parseInt(
                    getMedicinePrice(medicineApproxPrice).replaceAll(',', '')
                  ),
                };
                allMedicines.push(singleMedicine);
              });
            } else {
              medicineFullName =
                medicineTitle + ' ' + medicineName + medicineStrength;
              singleMedicine = {
                name: medicineFullName,
                company: medicineCompany,
                bdtPrice: parseInt(
                  getMedicinePrice(medicineApproxPrice).replaceAll(',', '')
                ),
              };
              allMedicines.push(singleMedicine);
              // allMedicines.push(singleMedicine);
            }
          });
        })
        .catch((err) => console.error(err));
      allMedicinesCollection = [...allMedicinesCollection, ...allMedicines];
      //for test purpose
      if (page === 5) {
        break;
      }
      if (allMedicines.length === 0) {
        break;
      } else {
        console.log(allMedicines.length, 'page -> ', page);
        allMedicines = [];
        page = page + 1;
      }
    }
    var end = new Date().getTime();
    var time = end - start;
    /* console.log('start time: ', start);
    console.log('end time: ', end);
    console.log('Total time taken: ', time);*/
    // response.send({ allMedicines: allMedicinesCollection });
    if (totalOldMedicines.length < allMedicinesCollection.length) {
      try {
        await Medicine.deleteMany({});
        await Medicine.insertMany(allMedicinesCollection);
        console.log('total item inserted ->', allMedicinesCollection.length);
      } catch (e) {
        console.log(e, 'error 96');
      }
    } else {
      console.log('something went wrong');
    }
  } catch (e) {
    console.log(e);
  }
});
