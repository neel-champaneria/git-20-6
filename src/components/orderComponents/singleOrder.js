import { useSelector } from "react-redux";
import { Money } from "../../utils/money";
import SingleOrderItem from "./singleOrderItem";
import { useEffect, useState } from "react";

const SingleOrder = ({ order }) => {
  const taxConfig = useSelector((state) => state.appReducer?.taxConfig);
  const [sortedOrder, setSortedOrder] = useState([]);

  useEffect(() => {
    if (order.orderItems.length > 0) {
      const tempSortedOrder = [];
      tempSortedOrder = order.orderItems.sort((a, b) => a.id - b.id);
      setSortedOrder(tempSortedOrder);
    }
  }, [order]);

  return (
    <>
      {sortedOrder && sortedOrder.length > 0 && (
        <>
          {order.orderItems.map((item, idx) => {
            return <SingleOrderItem key={idx} item={item} />;
          })}
          <div className="bottom_block mb60">
            <div className="bg-white p_reorder_bottom">
              <div className="d-flex mb4">
                <p className="medium_para mr-auto mb0">Sub Total:</p>
                <p className="medium_para mb0">
                  {Money.moneyFormat(order.subTotal)}
                </p>
              </div>
              {order.tax > 0 && (
                <div className="d-flex mb4">
                  <p className="medium_para mr-auto mb0">Tax:</p>
                  <p className="medium_para mb0">
                    {Money.moneyFormat(order.tax)}
                  </p>
                </div>
              )}
              {order.serviceCharge > 0 && (
                <div className="d-flex mb4">
                  <p className="medium_para mr-auto mb0">
                    {taxConfig.surchargeName}:
                  </p>
                  <p className="medium_para mb0">
                    {Money.moneyFormat(order.serviceCharge)}
                  </p>
                </div>
              )}
              <div className="d-flex">
                <p className="medium_font font-bold mr-auto mb0">Total:</p>
                <p className="medium_font font-bold mb0">
                  {Money.moneyFormat(
                    Money.orderPriceRoundForFetchOrder(order.total)
                  )}
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default SingleOrder;
