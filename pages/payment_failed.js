import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { cleanCartAction } from "../src/actions/OrderingCartAction";

const PaymentSuccess = () => {
  const qrInfo = useSelector((state) => state.QrReducer);
  const dispatch = useDispatch();
  const router = useRouter();

  return (
    <>
      <div className="mb-2">
        <div className="text-center text-white table_strip">
          TABLE {qrInfo.tableName}
        </div>
      </div>
      <div className="thankyou_cart text-center">
        <div className="top_thank">
          {/* <img src="/thankyou.png" className="mb30" /> */}
          <h1 className="font-bold">Payment Failed</h1>
          <p className="title-font font-bold mb20">Please Try Again</p>
          {/* <p className="medium_para bg-green text-center">
            Your order is now being processed.
          </p> */}
        </div>

        <button
          className="btn red-btn w100 big_btn"
          onClick={() => {
            router.replace("/cart");
          }}
        >
          CART
        </button>
        <Link href="/">
          <p className="item_title mt15 font-bold">Back To Home</p>
        </Link>
      </div>
    </>
  );
};

export default PaymentSuccess;
