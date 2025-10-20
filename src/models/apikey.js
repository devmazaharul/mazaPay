const { Schema, model, models } = require('mongoose');

const apiKeySchema = new Schema(
  {
    key: { type: String, required: true, unique: true },
    marchenId: { type: Schema.ObjectId, ref:"Account",required:true },
    marcentName: { type: String, required: true },
    websiteURL:{type:String,required:true},
    callbackURL: { type: String, required: true },
    expiresAt: { type: Date,  default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)}, // 30 days from now
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);



// apiKeySchema.pre("save",function(next){
//   console.log("Before save")
//   console.log(this.marcentName)
//   next()
// })
apiKeySchema.post("save",function(res){
  console.log(res)
  console.log("after save")
})

const ApiKeyModel = models.ApiKey || model('ApiKey', apiKeySchema);
module.exports = {
  ApiKeyModel,
};
