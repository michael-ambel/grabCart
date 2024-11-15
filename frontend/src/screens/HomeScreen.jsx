import { Row, Col } from "react-bootstrap";
import Product from "../component/Product";
import Loader from "../component/Loader";
import Paginate from "../component/Paginate";

import { Link, useParams } from "react-router-dom";
import { useGetProductsQuery } from "../slices/productsApiSlice";
import Message from "../component/Message";
import ProductCarousel from "../component/ProductCarousel";

const HomeScreen = () => {
  const { keyword, pageNumber } = useParams();
  const { data, isLoading, error } = useGetProductsQuery({
    keyword,
    pageNumber,
  });
  console.log(data);

  return (
    <>
      {!keyword ? (
        <ProductCarousel />
      ) : (
        <Link to="/" className="btn btn-light">
          Go Back
        </Link>
      )}
      {isLoading && <Loader />}
      {error ? (
        <Message variant="danger">
          {error?.data?.message || error.message}
        </Message>
      ) : null}
      {data ? (
        <>
          <h1>Latest Products</h1>
          <Row>
            {data.products.map((product) => (
              <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                <Product product={product} />
              </Col>
            ))}
          </Row>
          <Paginate
            pages={data.pages}
            page={data.page}
            keyword={keyword ? keyword : ""}
          />
        </>
      ) : (
        <div></div>
      )}
    </>
  );
};

export default HomeScreen;
