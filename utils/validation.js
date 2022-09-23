exports.isNameValidFunc = (name) => {
  //returns true if matched, validates for a-z and A-Z and white space
  return /^[A-Za-z\s]+$/.test(name) && name.length > 2 && name.length < 51;
};

exports.isEmailValidFunc = (email) => {
  return (
    /^[a-zA-Z0-9.-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email) &&
    email.length >= 5 &&
    email.length <= 50
  );
};

exports.isUserTypeValidFunc = (userType) => {
  return userType === 'consumer' || userType === 'proprietor';
};
