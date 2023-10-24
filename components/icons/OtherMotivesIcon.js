import * as React from "react";
import Svg, { Path } from "react-native-svg";

const OtherMotivesIcon = (props) => (
    <Svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 11 17"
        height={props.style?.height || "18px"}
        width={props.style?.width || "12px"}
        {...props}>
        <Path
            fill={props.style?.color || "#FF5A79"}
            fillRule="evenodd"
            d="M5 .018C1.811.215.143 2.023 0 5.288h3.218c.041-1.13.671-1.976 1.846-2.1 1.152-.124 2.247.153 2.58.942.36.853-.445 1.843-.827 2.256-.706.77-1.855 1.334-2.454 2.165-.582.815-.687 1.887-.732 3.198h2.836c.038-.84.096-1.642.478-2.164.62-.846 1.546-1.244 2.326-1.913.742-.64 1.525-1.41 1.655-2.603C11.324 1.498 8.41-.195 5 .018ZM5.073 12.914c.99 0 1.792.79 1.792 1.763 0 .974-.802 1.764-1.792 1.764s-1.789-.79-1.789-1.764c0-.973.802-1.763 1.79-1.763Z"
            clipRule="evenodd"
        />
    </Svg>
);

export default OtherMotivesIcon;
