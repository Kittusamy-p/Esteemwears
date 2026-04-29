import men from "./men.json";
import boys from "./boys.json";
import girls from "./girls.json";
import { Product } from "@/types/product";

export const dataMap: Record<string, Product[]> = {
  men: men as Product[],
  boys: boys as Product[],
  girls: girls as Product[],
};
