import * as React from "react";
import Svg, { Path } from "react-native-svg";

const ArchivedIcon = (props) => (
    <Svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        width={props.style?.width || "27"}
        height={props.style?.height || "27"}
        viewBox="0 0 27 27"
        {...props}>
        <Path
            stroke={props.style?.color || "#727c94"}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5.625 9h15.75M5.625 9a2.25 2.25 0 0 1 0-4.5h15.75a2.25 2.25 0 0 1 0 4.5M5.625 9v11.25a2.25 2.25 0 0 0 2.25 2.25h11.25a2.25 2.25 0 0 0 2.25-2.25V9M11.25 13.5h4.5"
        />
    </Svg>
);

export default ArchivedIcon;
