import "@testing-library/jest-dom";
// tests/setupTests.js
import { TextEncoder, TextDecoder } from "util";

// Arregla errores de react-router en Jest
if (!global.TextEncoder) global.TextEncoder = TextEncoder;
if (!global.TextDecoder) global.TextDecoder = TextDecoder;

// Mock global de fetch (por si tus componentes lo usan)
if (!global.fetch) {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () =>
        Promise.resolve([
          { category_id: "oficina", category_name: "Oficina" },
          { category_id: "baño", category_name: "Baño" },
        ]),
    })
  );
}
