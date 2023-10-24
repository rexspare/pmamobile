import * as React from "react";
import Svg, { Path } from "react-native-svg";

const UserGroupIcon = (props) => (
    <Svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        width={props.style?.width || "25"}
        height={props.style?.height || "24"}
        viewBox="0 0 25 24"
        {...props}>
        <Path
            stroke="#00B3C7"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M17 19.4h4.5v-1.8a2.7 2.7 0 0 0-4.82-1.671M17 19.4H8m9 0v-1.8c0-.59-.114-1.155-.32-1.671M8 19.4H3.5v-1.8a2.7 2.7 0 0 1 4.82-1.671M8 19.4v-1.8c0-.59.114-1.155.32-1.671m0 0a4.501 4.501 0 0 1 8.36 0M15.2 7.7a2.7 2.7 0 1 1-5.4 0 2.7 2.7 0 0 1 5.4 0Zm5.4 2.7a1.8 1.8 0 1 1-3.6 0 1.8 1.8 0 0 1 3.6 0ZM8 10.4a1.8 1.8 0 1 1-3.6 0 1.8 1.8 0 0 1 3.6 0Z"
        />
    </Svg>
);
export default UserGroupIcon;
