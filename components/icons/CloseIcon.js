import * as React from "react";
import Svg, { Path } from "react-native-svg";

const CloseIcon = (props) => (
    <Svg
        xmlns="http://www.w3.org/2000/svg"
        width={props.style?.width || 24}
        height={props.style?.height || 24}
        viewBox="0 0 24 24"
        fill="none"
        {...props}>
        <Path
            fill={props.style?.color ? props.style.color : "#727C94"}
            d="m12 13.4-4.9 4.9a.948.948 0 0 1-.7.275.948.948 0 0 1-.7-.275.948.948 0 0 1-.275-.7c0-.283.092-.517.275-.7l4.9-4.9-4.9-4.9a.948.948 0 0 1-.275-.7c0-.283.092-.517.275-.7a.948.948 0 0 1 .7-.275c.283 0 .517.092.7.275l4.9 4.9 4.9-4.9a.948.948 0 0 1 .7-.275c.283 0 .517.092.7.275a.948.948 0 0 1 .275.7.948.948 0 0 1-.275.7L13.4 12l4.9 4.9a.948.948 0 0 1 .275.7.948.948 0 0 1-.275.7.948.948 0 0 1-.7.275.949.949 0 0 1-.7-.275L12 13.4Z"
        />
    </Svg>
);
export default CloseIcon;
