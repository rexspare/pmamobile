import * as React from "react";
import Svg, { Circle, Path } from "react-native-svg";

const PlayIcon = (props) => (
    <Svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 41 41"
        width={props.style?.width || 41}
        height={props.style?.height || 41}
        {...props}>
        <Circle cx={20.49} cy={20.5} r={20.417} fill="#00B3C7" />
        <Path fill="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m16 11 14 9-14 9V11Z" />
    </Svg>
);

export default PlayIcon;
