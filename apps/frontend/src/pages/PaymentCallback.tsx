import { useParams } from "react-router-dom";

const PaymentCallback = () => {
    const { orderId } = useParams();
    const { productType } = useParams();
  return (
    <div>PaymentCallback
        <h1>Order ID: {orderId}</h1>
        <h1>Product Type: {productType}</h1>
    </div>
  )
}

export default PaymentCallback