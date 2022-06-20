import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { cleanCartAction } from "../src/actions/OrderingCartAction";

const PaymentSuccess = () => {
  const qrInfo = useSelector((state) => state.QrReducer);
  const qrConfig = useSelector((state) => state.appReducer?.qrConfig);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    dispatch(cleanCartAction());
  }, []);

  return (
    <>
      <div className="mb-2">
        <div className="text-center text-white table_strip">
          TABLE {qrInfo.tableName}
        </div>
      </div>
      <div className="thankyou_cart text-center">
        <div className="mb70">
          <img src="/thankyou.png" className="mb30" />
          <h1 className="font-bold">Payment Successful</h1>
          <p className="title-font mb20">
            Thank you! You have completed your payment.
          </p>
          {!qrConfig.isPAM ? (
            <p className="medium_para bg-green text-center">
              Your order is now being processed.
            </p>
          ) : null}
        </div>

        {!qrConfig.isPAM ? (
          <button
            className="btn red-btn w100 big_btn"
            onClick={() => {
              router.replace("/order");
            }}
          >
            MY ORDERS
          </button>
        ) : null}
        <Link href="/">
          <p className="item_title mt15 font-bold">Back To Home</p>
        </Link>
      </div>
    </>
  );
};

export default PaymentSuccess;
