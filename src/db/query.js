const mongoclient = require("../db/connection");
const getlistwithmatch=(size,skip,search)=>mongoclient.db("drive14").collection("citizen").aggregate([{$lookup: {
    from: 'vaccinationsData',
    localField: 'vaccinations.code',
    foreignField: 'code',
    as: 'vaccinedata'
  }}, {$lookup: {
    from: 'hospital',
    localField: 'lastHospitalCode',
    foreignField: 'hospitalCode',
    as: 'hospitaldata'
  }}, {$unwind: {
    path: "$hospitaldata",
  }}, {$sort: {
    age:1
  }}, {$project: {
    _id:0,
    fullname:{$concat:["$firstName"," ","$lastName"]},
    mobileNumber:"$phoneNo",
    hospitalName:"$hospitaldata.name",
    hospitalcode:"$hospitaldata.hospitalCode",
    gender: {
                   $cond: { if: { $eq:[ "$gender", ")" ] }, then: "O", else:"$gender"}
            },
    ageGroup:{
      $cond: { if: { $and: [{$lt:["$age",45]},{$gte:["$age",9]}] }, then: "adult", else: {
          $cond:{if:{$and:[{$gte:["$age",45,]},{$lt:["$age",61]}]},then:"middle-age",else:"Senior-Citizen"}
      } }
    },
    vaccineCode:"$vaccinedata.code",
    vaccineName:"$vaccinedata.name"
  
    }}, {$match: {
    $or: [
      {fullname:{$regex:search}},
      {hospitalName:{$regex:search}},
      {mobileNumber:{$regex:search}}
    ]
  }}]).skip(skip).limit(size).toArray()
  const getlistwithoutmatch=(size,skip)=>mongoclient.db("drive14").collection("citizen").aggregate([{$lookup: {
    from: 'vaccinationsData',
    localField: 'vaccinations.code',
    foreignField: 'code',
    as: 'vaccinedata'
  }}, {$lookup: {
    from: 'hospital',
    localField: 'lastHospitalCode',
    foreignField: 'hospitalCode',
    as: 'hospitaldata'
  }}, {$unwind: {
    path: "$hospitaldata",
  }}, {$sort: {
    age:1
  }}, {$project: {
    _id:0,
    fullname:{$concat:["$firstName"," ","$lastName"]},
    mobileNumber:"$phoneNo",
    hospitalName:"$hospitaldata.name",
    hospitalcode:"$hospitaldata.hospitalCode",
    gender: {
                   $cond: { if: { $eq:[ "$gender", ")" ] }, then: "O", else:"$gender"}
            },
    ageGroup:{
      $cond: { if: { $and: [{$lt:["$age",45]},{$gte:["$age",9]}] }, then: "adult", else: {
          $cond:{if:{$and:[{$gte:["$age",45,]},{$lt:["$age",61]}]},then:"middle-age",else:"Senior-Citizen"}
      } }
    },
    vaccineCode:"$vaccinedata.code",
    vaccineName:"$vaccinedata.name"
  
    }}]).skip(skip).limit(size).toArray()
module.exports={getlistwithmatch,getlistwithoutmatch}