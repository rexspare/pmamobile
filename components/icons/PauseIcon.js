import * as React from "react";
import Svg, { Circle, Path } from "react-native-svg";
const PauseIcon = (props) => (
    <Svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        width={props.style?.width || 41}
        height={props.style?.height || 41}
        viewBox="0 0 41 41"
        {...props}>
        <Circle cx={20.49} cy={20.5} r={20.417} fill="#00B3C7" />
        <Path fill="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 13h-4v16h4V13ZM26 13h-4v16h4V13Z" />
    </Svg>
);
export default PauseIcon;
