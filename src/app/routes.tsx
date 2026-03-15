import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { MindMap } from "./pages/MindMap";
import { Canvas } from "./pages/Canvas";
import { Search } from "./pages/Search";
import { Recommendations } from "./pages/Recommendations";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: MindMap },
      { path: "canvas", Component: Canvas },
      { path: "search", Component: Search },
      { path: "recommendations", Component: Recommendations },
    ],
  },
]);
