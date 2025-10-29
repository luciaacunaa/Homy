import { render, screen } from "@testing-library/react";
import HelloWorld from "../example/example.jsx";

test("renders HelloWorld with name", () => {
  render(<HelloWorld name="Joaquin" />);
  expect(screen.getByText("Hello, Joaquin!")).toBeInTheDocument();
});
