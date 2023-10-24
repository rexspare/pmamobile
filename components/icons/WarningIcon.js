import * as React from "react";
import Svg, { Path } from "react-native-svg";

const WarningIcon = (props) => (
    <Svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        width={props.style?.width || "41"}
        height={props.style?.height || "40"}
        viewBox="0 0 41 40"
        {...props}>
        <Path
            fill={props.style?.color || "#F3AF40"}
            d="M20.566 26.781a1.667 1.667 0 1 0 0 3.335 1.667 1.667 0 0 0 0-3.335Zm17.783 2.45L24.932 5.898a5 5 0 0 0-8.733 0L2.866 29.23a5 5 0 0 0 4.266 7.55H34a5 5 0 0 0 4.35-7.55Zm-2.883 3.333a1.667 1.667 0 0 1-1.467.85H7.132a1.667 1.667 0 0 1-1.466-.85 1.667 1.667 0 0 1 0-1.666L18.999 7.564a1.667 1.667 0 0 1 2.967 0l13.416 23.334a1.667 1.667 0 0 1 .084 1.7v-.034Zm-14.9-19.116a1.667 1.667 0 0 0-1.667 1.666v6.667a1.666 1.666 0 1 0 3.333 0v-6.667a1.666 1.666 0 0 0-1.666-1.666Z"
        />
    </Svg>
);
export default WarningIcon;
