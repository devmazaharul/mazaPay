const {Schema,model,models} =require("mongoose")

const paymentSchema = new Schema({
  amount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
  userId: { type: Schema.ObjectId, ref: 'Account', required: true},
  paymentId: { type: String, unique: true,required:true },
  marchenId: { type:Schema.ObjectId,ref:"ApiKey", required: true }
}, { timestamps: true });


const PaymentModel = models.Payment || model('Payment', paymentSchema);
module.exports = {
  PaymentModel
};