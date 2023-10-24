import * as React from "react";
import Svg, { Path } from "react-native-svg";

const CalendarEventIcon = (props) => (
    <Svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        stroke="#00B3C7"
        viewBox="0 0 24 24"
        width={props.style?.width || 24}
        height={props.style?.height || 24}
        {...props}>
        <Path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z"
        />
    </Svg>
);
export default CalendarEventIcon;
