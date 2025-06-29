const { Schema, model, models } = require('mongoose');

const apiKeySchema = new Schema(
  {
    key: { type: String, required: true, unique: true },
    marchenId: { type: Schema.ObjectId, ref:"Account",required:true },
    marcentName: { type: String, required: true },
    expiresAt: { type: Date,  default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)},
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

const ApiKeyModel = models.ApiKey || model('ApiKey', apiKeySchema);
module.exports = {
  ApiKeyModel,
};
