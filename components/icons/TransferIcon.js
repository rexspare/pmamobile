import * as React from "react";
import { Path, Svg } from "react-native-svg";

const TransferIcon = (props) => (
    <Svg
        xmlns="http://www.w3.org/2000/Svg"
        viewBox="0 0 24 24"
        width={props.style?.width || 24}
        height={props.style?.height || 24}
        fill="none"
        {...props}>
        <Path
            fill={props.style?.color ? props.style?.color : "#fff"}
            d="M3.75 19a.728.728 0 0 0 .75-.75v-3.6c0-.9.317-1.667.95-2.3.633-.633 1.4-.95 2.3-.95h10.4l-3.35 3.35c-.133.133-.2.3-.2.5s.075.375.225.525a.72.72 0 0 0 .525.225.72.72 0 0 0 .525-.225l4.6-4.6a.762.762 0 0 0 .175-.25.735.735 0 0 0 .05-.275c0-.1-.017-.192-.05-.275a.764.764 0 0 0-.175-.25L15.85 5.5a.679.679 0 0 0-.5-.2.72.72 0 0 0-.525.225.72.72 0 0 0-.225.525c0 .2.075.375.225.525L18.15 9.9H7.75c-1.3 0-2.417.463-3.35 1.387-.933.925-1.4 2.046-1.4 3.363v3.6a.728.728 0 0 0 .75.75Z"
        />
    </Svg>
);
export default TransferIcon;
