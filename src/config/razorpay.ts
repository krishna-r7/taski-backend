import Razorpay from "razorpay";

// console.log("KEY_ID:", process.env.APP_NAME);
// console.log("KEY_SECRET:", process.env.RAZORPAY_KEY_SECRET);

const razorpay = new Razorpay({
  key_id: "rzp_test_T6gCKGVzlDutaO",
  key_secret: "L6e4JeaRyu7whoIg498pGkpp",
});

export default razorpay;