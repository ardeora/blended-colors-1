import React, { ReactNode, useCallback, useMemo } from "react";
import "./App.css";

function App() {
  return (
    <BlendedColor>
      <Color r={60} g={20} b={90} />
      <Color r={0} g={30} b={60} />
      <BlendedColor>
        <Color r={120} g={0} b={60} />
        <Color r={0} g={200} b={0} />
      </BlendedColor>
    </BlendedColor>
  );
}

function BlendedColor(props: { children: ReactNode }) {
  const children = React.Children.toArray(props.children);

  const calculateAverageColor = useCallback((children: React.ReactNode[]) => {
    let r = 0;
    let g = 0;
    let b = 0;
    let count = 0;

    React.Children.forEach(children, (child) => {
      if (React.isValidElement(child)) {
        // @ts-expect-error - we know this is a valid element
        if (child.type.name === "BlendedColor") {
          const {
            r: r2,
            g: g2,
            b: b2,
          } = calculateAverageColor(
            React.Children.toArray(child.props.children)
          );
          r += r2;
          g += g2;
          b += b2;
          count++;
        } else {
          r += child.props.r;
          g += child.props.g;
          b += child.props.b;
          count++;
        }
      }
    });

    return {
      r: r / count,
      g: g / count,
      b: b / count,
    };
  }, []);

  const averageColor = useMemo(
    () => calculateAverageColor(children),
    [children, calculateAverageColor]
  );

  return (
    <div
      style={{
        padding: "12px",
        backgroundColor: `rgb(${averageColor.r}, ${averageColor.g}, ${averageColor.b})`,
      }}
    >
      {props.children}
    </div>
  );
}

function Color(props: { r: number; g: number; b: number }) {
  return (
    <div
      style={{
        backgroundColor: `rgb(${props.r}, ${props.g}, ${props.b})`,
        paddingLeft: "12px",
      }}
    >
      Hello
    </div>
  );
}

export default App;
