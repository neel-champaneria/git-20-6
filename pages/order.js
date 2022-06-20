import SingleOrderItem from "../src/components/orderComponents/singleOrderItem";
import { Money } from "./../src/utils/money";
import SingleOrder from "./../src/components/orderComponents/singleOrder";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getOrderByQRService,
  stripePaymentProcessService,
} from "../src/services/OrderingService";
import { Spinner } from "react-bootstrap";
import { useRouter } from "next/router";
import { paymentGatewayProviderList } from "../src/constants";
import { loadStripe } from "@stripe/stripe-js";

const OrderPage = () => {
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const qrInfo = useSelector((state) => state.QrReducer);
  const qrConfig = useSelector((state) => state.appReducer?.qrConfig);
  const restaurant = useSelector((state) => state.resReducer);
  let paymentProviderStr = restaurant?.paymentProvider || "{}";
  let paymentProvider = JSON.parse(paymentProviderStr);
  const [responseStatus, setResponseStatus] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [itemsArrayForCalculation, setItemsArrayForCalculation] = useState([]);

  const [lastAPICallComplete, setLastAPICallComplete] = useState(false);

  useEffect(async () => {
    setLoading(true);
    const response = await getOrderByQRService(qrInfo.qrId);
    if (response.status) {
      setOrder(response.jsonData.orders[0]);
      // const itemsFromRes = response.jsonData.orders[0].orderItems;
      setLastAPICallComplete(true);
    } else {
      if (response.error.qrExpire) {
        router.replace("/qr-expired");
      } else {
        router.replace("/something-wrong");
      }
      setErrorMsg("Something Went Wrong");
    }
    setLoading(false);
  }, []);

  function useInterval(callback, delay) {
    const savedCallback = useRef();

    // Remember the latest callback.
    useEffect(() => {
      savedCallback.current = callback;
    }, [callback]);

    // Set up the interval.
    useEffect(() => {
      function tick() {
        savedCallback.current();
      }
      if (delay !== null) {
        let id = setInterval(tick, delay);
        return () => clearInterval(id);
      }
    }, [delay]);
  }

  function IntervalAPICall() {
    useInterval(async () => {
      if (lastAPICallComplete) {
        setLastAPICallComplete(false);
        const response = await getOrderByQRService(qrInfo.qrId);
        if (response.status) {
          setOrder(response.jsonData.orders[0]);
          setLastAPICallComplete(true);
        } else {
          if (response.error.qrExpire) {
            router.replace("/qr-expired");
          } else {
            router.replace("/something-wrong");
          }
        }
      }
    }, 10000);
  }

  const onPayNow = async (orderId) => {
    let publicKey = "";

    paymentGatewayProviderList.map((itm) => {
      if (paymentProvider[itm.value.toUpperCase()]) {
        publicKey = paymentProvider[itm.value.toUpperCase()].publicKey;
      }
    });

    const stripePromise = loadStripe(publicKey);
    const stripe = await stripePromise;
    const transactionId = orderId;
    const stripeSessionRes = await stripePaymentProcessService({
      id: transactionId,
    });
    let stripeResult;

    console.log("stripe ===>", stripe);
    console.log("stripeSessionRes ===>", stripeSessionRes);

    // When the customer clicks on the button, redirect them to Checkout.
    if (stripeSessionRes.status) {
      stripeResult = await stripe.redirectToCheckout({
        sessionId: stripeSessionRes.jsonData.sessionId,
      });
    } else {
    }

    if (stripeResult?.error) {
      // If `redirectToCheckout` fails due to a browser or network
      // error, display the localized error message to your customer
      // using `result.error.message`.
      console.log("stripeResult error ===>", stripeResult);
    }
  };

  return (
    <>
      {IntervalAPICall()}
      {loading ? (
        <>
          <div className="container d-flex justify-content-center align-items-center vh-100">
            <Spinner animation="border" variant="secondary" />
          </div>
        </>
      ) : (
        <>
          <div className="mb-2">
            <div className="text-center text-white table_strip">
              TABLE {qrInfo.tableName}
            </div>
          </div>
          <div className="order_quantity">
            <div className="container p0">
              <div className="d-flex p-cart mt10 mb20">
                <h1 className="cart_title mr-auto">My Orders</h1>
              </div>
            </div>
            <div className="order_quantity">
              {order && (
                <>
                  <SingleOrder order={order} />
                  {qrConfig.isPAM ? (
                    <>
                      <button
                        className="btn red-btn w100 mt15 medium_sizebtn"
                        onClick={() => {
                          onPayNow(order.id);
                        }}
                      >
                        PAY NOW
                      </button>
                    </>
                  ) : null}
                </>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default OrderPage;
