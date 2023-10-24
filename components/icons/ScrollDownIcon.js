import * as React from "react";
import Svg, { Path, Circle } from "react-native-svg";

const ScrollDownIcon = (props) => (
    <Svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        width={props.style?.width || 24}
        height={props.style?.height || 24}
        {...props}>
        <Path
            fill={props.style?.color || "#00B3C7"}
            d="M7.264 10.261a.91.91 0 0 1 1.275 0L12 13.681l3.46-3.42a.91.91 0 0 1 1.276 0 .884.884 0 0 1 0 1.26l-4.098 4.051a.91.91 0 0 1-1.276 0l-4.098-4.05a.884.884 0 0 1 0-1.261Z"
        />
        <Circle cx={12} cy={12} r={11.5} stroke={props.style?.color || "#00B3C7"} />
    </Svg>
);
export default ScrollDownIcon;
