import { Handler } from "@netlify/functions";
import { stock } from "../../server.json";

const handler: Handler = async (event, context) => {
  const urlParts = event.path.split("/");
  const id = Number(urlParts[urlParts.length - 1]);
  let response = stock;
  if (!isNaN(id)) {
    response = stock.filter((stock) => stock.id === id);
  }
  return {
    statusCode: 200,
    body: JSON.stringify(response),
  };
};

export { handler };
