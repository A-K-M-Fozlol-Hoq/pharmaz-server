const getMedicinePrice = (medicineString) => {
  if (medicineString.split(':')[1]) {
    return medicineString.split(':')[1].split(' ')[2];
  } else {
    return medicineString.split(':')[0].split(' ')[1];
  }
};
module.exports = { getMedicinePrice };
