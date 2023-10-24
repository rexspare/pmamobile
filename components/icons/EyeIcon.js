import * as React from "react";
import Svg, { Path } from "react-native-svg";

const EyeIcon = (props) => (
    <Svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        width={props.style?.width || "20"}
        height={props.style?.height || "20"}
        viewBox="0 0 20 20"
        {...props}>
        <Path
            fill={props.style?.color || "#00B3C7"}
            d="M18.27 9.667c-1.684-3.909-4.85-6.334-8.267-6.334S3.42 5.758 1.736 9.667a.833.833 0 0 0 0 .666c1.684 3.909 4.85 6.334 8.267 6.334s6.583-2.425 8.267-6.334a.835.835 0 0 0 0-.666ZM10.003 15c-2.642 0-5.142-1.908-6.583-5C4.86 6.908 7.36 5 10.003 5c2.642 0 5.142 1.908 6.583 5-1.441 3.092-3.941 5-6.583 5Zm0-8.333a3.333 3.333 0 1 0 0 6.666 3.333 3.333 0 0 0 0-6.666Zm0 5a1.666 1.666 0 1 1 0-3.333 1.666 1.666 0 0 1 0 3.333Z"
        />
    </Svg>
);
export default EyeIcon;
