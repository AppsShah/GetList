const gendervalidator = (ctx, next) => {
  const { gender } = ctx.query;
  if (gender) {
    if (gender != "F" && gender != "M" && gender != ")")
      return (ctx.body = {
        status: false,
        message: "gender Enter in M or F or )=`others`",
      });
  }
  return next();
};
const agerangevalidator = (ctx, next) => {
  const { agerange } = ctx.query;
  const newrange = [];
  if (agerange) {
    let agesrange = agerange.split("-");
    const startrange = parseInt(agesrange[0]);
    const endrange = parseInt(agesrange[1]);
    if (isNaN(startrange) || isNaN(endrange))
      return (ctx.body = { status: false, message: "Age range is not proper" });
    for (let i = startrange; i <= endrange; i++) {
      newrange.push(i);
    }
    if (newrange.length == 0) {
      newrange.push(startrange);
    }
    ctx.state.agerange = newrange;
  }
  return next();
};

module.exports = { gendervalidator, agerangevalidator };
