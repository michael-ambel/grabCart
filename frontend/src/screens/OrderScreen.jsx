import { Link, useParams } from "react-router-dom";
import { Row, Col, ListGroup, Image, Card, Button } from "react-bootstrap";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import Message from "../component/Message";
import Loader from "../component/Loader";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import {
  useGetOrderDetailsQuery,
  usePayOrderMutation,
  useGetPayPalClientIdQuery,
  useDeliverMutation,
} from "../slices/ordersApiSlice";

const OrderScreen = () => {
  // Extract `orderId` from URL parameters
  const { id: orderId } = useParams();

  // Fetch order details using `orderId`
  const {
    data: order,
    refetch,
    isLoading,
    error,
  } = useGetOrderDetailsQuery(orderId);

  // Mutation for handling order payment
  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();

  // Mutation for handling order delivery status
  const [deliver, { isLoading: deliverLoading }] = useDeliverMutation();

  // Get user info from Redux state
  const { userInfo } = useSelector((state) => state.userInfo);

  // Initialize PayPal script reducer and loading state
  const [{ isPending: isPendingPayPalDispatch }, paypalDispatch] =
    usePayPalScriptReducer();

  // Fetch PayPal client ID for payment configuration
  const {
    data: client,
    isLoading: loadingClientId,
    error: errorClientId,
  } = useGetPayPalClientIdQuery();

  // Load PayPal script if required conditions are met
  useEffect(() => {
    // Check if no error occurred, client ID is loaded, and order isn't paid
    if (!errorClientId && !loadingClientId && client.id) {
      const loadPaypalScript = async () => {
        // Dispatch action to reset PayPal options with client ID and currency
        paypalDispatch({
          type: "resetOptions",
          value: {
            "client-id": client.id,
            currency: "USD",
          },
        });
        // Set loading status to pending while PayPal script loads
        paypalDispatch({ type: "setLoadingStatus", value: "pending" });
      };

      // If the order exists and is unpaid, load the PayPal script if not already loaded
      if (order && !order.isPaid) {
        if (!window.client) {
          loadPaypalScript();
        }
      }
    }
  }, [order, client, paypalDispatch, errorClientId, loadingClientId]); // Dependencies for re-running the effect

  const createOrder = (data, actions) => {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: {
              value: order.totalPrice,
            },
          },
        ],
      })
      .then((orderId) => {
        return orderId;
      });
  };
  const onApprove = (data, actions) => {
    return actions.order.capture().then(async function (details) {
      try {
        await payOrder({ orderId, details });
        refetch();
        toast.success("Payment Succussfull");
      } catch (error) {
        toast.error(error?.data?.message || error?.message);
      }
    });
  };
  // const onApproveTest = async () => {
  //   await payOrder({ orderId, details: { payer: {} } });
  //   refetch();
  //   toast.success("Payment Succussfull");
  // };
  const onError = (error) => {
    toast.error(error.message);
  };

  const deliverOrderHandler = async () => {
    try {
      await deliver(orderId);
      refetch();
      toast.success("Order Deliverd");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };
  return isLoading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger" />
  ) : (
    <>
      <h1>Order {order._id}</h1>
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Name: </strong> {order.user.name}
              </p>
              <p>
                <strong>Email: </strong>{" "}
                <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
              </p>
              <p>
                <strong>Address:</strong>
                {order.shippingAddress.address}, {order.shippingAddress.city}{" "}
                {order.shippingAddress.postalCode},{" "}
                {order.shippingAddress.country}
              </p>
              {order.isDelivered ? (
                <Message variant="success">
                  Delivered on {order.deliveredAt.substring(0, 10)}
                </Message>
              ) : (
                <Message variant="danger">Not Delivered</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Payment Method</h2>
              <p>
                <strong>Method: </strong>
                {order.paymentMethod}
              </p>
              {order.isPaid ? (
                <Message variant="success">
                  Paid on {order.paidAt.substring(0, 10)}
                </Message>
              ) : (
                <Message variant="danger">Not Paid</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Order Items</h2>
              {order.orderItems.length === 0 ? (
                <Message>Order is empty</Message>
              ) : (
                <ListGroup variant="flush">
                  {order.orderItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={1}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col>
                        <Col>
                          <Link to={`/product/${item.product}`}>
                            {item.name}
                          </Link>
                        </Col>
                        <Col md={4}>
                          {item.qty} x ${item.price} = ${item.qty * item.price}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Items</Col>
                  <Col>${order.itemsPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping</Col>
                  <Col>${order.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tax</Col>
                  <Col>${order.taxPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col>${order.totalPrice}</Col>
                </Row>
              </ListGroup.Item>
              {/* Pay Order */}

              {!order.isPaid && (
                <ListGroup.Item>
                  {loadingPay && <Loader />}
                  {isPendingPayPalDispatch ? (
                    <Loader />
                  ) : (
                    <div>
                      {/* <Button
                        onClick={onApproveTest}
                        style={{ marginBottom: "10px" }}
                      >
                        Test Pay Order
                      </Button> */}
                      <div>
                        <PayPalButtons
                          createOrder={createOrder}
                          onApprove={onApprove}
                          onError={onError}
                        ></PayPalButtons>
                      </div>
                    </div>
                  )}
                </ListGroup.Item>
              )}
              {/* Mark as Deliverd Placeholder */}
              {deliverLoading && <Loader />}
              {userInfo &&
                userInfo.isAdmin &&
                order.isPaid &&
                !order.isDelivered && (
                  <ListGroup.Item>
                    <Button
                      type="button"
                      className="btn btn-block"
                      onClick={deliverOrderHandler}
                    >
                      Mark As Deliverd
                    </Button>
                  </ListGroup.Item>
                )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default OrderScreen;
