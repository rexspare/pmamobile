import * as React from "react";
import Svg, { Path } from "react-native-svg";

const DownIcon = (props) => (
    <Svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 22 22"
        width={props.style?.width || 22}
        height={props.style?.height || 22}
        {...props}>
        <Path
            fill={props.style?.color || "#00B3C7"}
            d="M5.79 8.995a1 1 0 0 1 1.403 0L11 12.758l3.807-3.763a1 1 0 0 1 1.402 0 .972.972 0 0 1 0 1.387l-4.508 4.456a1 1 0 0 1-1.402 0L5.79 10.382a.972.972 0 0 1 0-1.387Z"
        />
    </Svg>
);
export default DownIcon;
