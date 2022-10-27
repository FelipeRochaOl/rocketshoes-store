import { Handler } from "@netlify/functions";
import { products } from "../../server.json";

const handler: Handler = async (event, context) => {
  const urlParts = event.path.split("/");
  const id = Number(urlParts[urlParts.length - 1]);
  if (!isNaN(id)) {
    const response = products.filter((product) => product.id === id);
    return {
      statusCode: 200,
      body: JSON.stringify(response[0]),
    };
  }
  return {
    statusCode: 200,
    body: JSON.stringify(products),
  };
};

export { handler };
