import { redirect } from "next/navigation";

import crypto from "crypto-js";
import axios from "axios";

var partnerCode = "MOMOBKUN20180529";
var accessKey = "klm05TvNBzhg7h7j";
var secretkey = "at67qH6mk8w5Y1nAyMoYKMWACiEi2bsa";
var requestId = partnerCode + new Date().getTime();
var orderId = requestId;
var orderInfo = "pay with MoMo";
var redirectUrl = "https://market-ecru-theta.vercel.app/payment/result";
var ipnUrl = "https://market-ecru-theta.vercel.app/payment/result";
var amount = "50000";
var requestType = "payWithMethod";
var extraData = "";

var rawSignature =
  "accessKey=" +
  accessKey +
  "&amount=" +
  amount +
  "&extraData=" +
  extraData +
  "&ipnUrl=" +
  ipnUrl +
  "&orderId=" +
  orderId +
  "&orderInfo=" +
  orderInfo +
  "&partnerCode=" +
  partnerCode +
  "&redirectUrl=" +
  redirectUrl +
  "&requestId=" +
  requestId +
  "&requestType=" +
  requestType;

const signature = crypto
  .HmacSHA256(rawSignature, secretkey)
  .toString(crypto.enc.Hex);

const requestBody = JSON.stringify({
  partnerCode: partnerCode,
  accessKey: accessKey,
  requestId: requestId,
  amount: amount,
  orderId: orderId,
  orderInfo: orderInfo,
  redirectUrl: redirectUrl,
  ipnUrl: ipnUrl,
  extraData: extraData,
  requestType: requestType,
  signature: signature,
  lang: "en",
});
export async function GET() {
  const response = await axios.post(
    "https://test-payment.momo.vn/v2/gateway/api/create",
    requestBody,
    {
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(requestBody),
      },
    }
  );
  redirect(response.data.payUrl);
}
