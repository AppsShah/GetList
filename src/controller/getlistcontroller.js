const { getlist } = require("../db/query");

const getlistcontroller = async (ctx) => {
  const vaccinecode = parseInt(ctx.query.vaccinecode);
  const hospitalCode = parseInt(ctx.query.hospitalcode);
  const { gender, search, size, page } = ctx.query;
  const newrange = ctx.state.agerange;
  let pages = parseInt(page);
  let sizes = parseInt(size);
  if (!pages || isNaN(pages)) pages = 1;
  if (!sizes || isNaN(sizes)) sizes = 10;
  const skip = (pages - 1) * sizes;
  // console.log(newrange)

  const query = [
    {
      $unwind: {
        path: "$vaccinations",
      },
    },
  ];
  if (!vaccinecode || isNaN(vaccinecode)) {
    query.push({
      $lookup: {
        from: "vaccinationsData",
        let: { vcode: "$vaccinations.code" },
        pipeline: [
          { $match: { $expr: { $eq: ["$code", "$$vcode"] } } },
          { $project: { _id: 0, name: 1, code: 1 } },
        ],
        as: "vaccinedata",
      },
    });
  } else {
    query.push({
      $lookup: {
        from: "vaccinationsData",
        let: { vcode: "$vaccinations.code" },
        pipeline: [
          { $match: { $expr: { $eq: ["$code", vaccinecode] } } },
          { $project: { _id: 0, name: 1, code: 1 } },
        ],
        as: "vaccinedata",
      },
    });
  }
  if (!hospitalCode || isNaN(hospitalCode)) {
    query.push({
      $lookup: {
        from: "hospital",
        let: { hscode: "$lastHospitalCode" },
        pipeline: [
          { $match: { $expr: { $eq: ["$hospitalCode", "$$hscode"] } } },
          { $project: { _id: 0, hospitalCode: 1, name: 1 } },
        ],
        as: "hospitaldata",
      },
    });
  } else {
    query.push({
      $lookup: {
        from: "hospital",
        let: { hscode: "$lastHospitalCode" },
        pipeline: [
          { $match: { $expr: { $eq: ["$hospitalCode", hospitalCode] } } },
          { $project: { _id: 0, hospitalCode: 1, name: 1 } },
        ],
        as: "hospitaldata",
      },
    });
  }
  if (newrange || gender) {
    if (gender) {
      query.push({ $match: { gender: gender } });
    }
    if (newrange) {
      query.push({ $match: { age: { $in: newrange } } });
    }
  }
  query.push(
    {
      $unwind: {
        path: "$vaccinedata",
        path: "$hospitaldata",
      },
    },
    {
      $sort: {
        age: 1,
      },
    },
    {
      $project: {
        _id: 0,
        fullname: { $concat: ["$firstName", " ", "$lastName"] },
        mobileNumber: "$phoneNo",
        hospitalName: "$hospitaldata.name",
        hospitalcode: "$hospitaldata.hospitalCode",
        age: "$age",
        gender: {
          $cond: { if: { $eq: ["$gender", ")"] }, then: "O", else: "$gender" },
        },
        ageGroup: {
          $cond: {
            if: { $and: [{ $lt: ["$age", 45] }, { $gte: ["$age", 9] }] },
            then: "adult",
            else: {
              $cond: {
                if: { $and: [{ $gte: ["$age", 45] }, { $lt: ["$age", 61] }] },
                then: "middle-age",
                else: "Senior-Citizen",
              },
            },
          },
        },
        vaccineCode: "$vaccinedata.code",
        vaccineName: "$vaccinedata.name",
      },
    }
  );
  if (search) {
    query.push({
      $match: {
        $or: [
          { fullname: { $regex: search } },
          { hospitalName: { $regex: search } },
          { mobileNumber: { $regex: search } },
        ],
      },
    });
  }
  return (ctx.body = { message: await getlist(query, skip, sizes) });
};
module.exports = { getlistcontroller };
